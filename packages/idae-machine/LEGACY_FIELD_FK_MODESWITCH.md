# Legacy "mode switch" — affichage unifié field / fk.field

> Reverse-eng de `D:/development/idae-legacy`. Objet : comprendre comment le legacy
> rendait **champs normaux** et **champs FK** via *une seule* mécanique, alors que
> la règle de résolution (surtout le **label/valeur**) change selon le cas.
> Date: 2026-05-31.

---

## TL;DR

Il n'y a pas de "fonction mode switch" unique au sens d'un gros `switch`.
Le mécanisme est en **2 étages** :

1. **Build du modèle de colonnes** (PHP, `json_scheme.php`) : construit des entrées
   `{ field_name, field_name_raw, title, className }` **homogènes**, que la colonne
   soit un champ normal OU une FK. La différence de règle est **encodée à la
   construction**, pas au rendu.
2. **Rendu** (JS, `app_datatable.js`) : **une seule** fonction
   `tag_elem_table_field()` consomme n'importe quelle entrée du modèle sans savoir
   si c'est un champ ou une FK. Elle lit juste `row[field_name]`.

Donc le "mode switch" = **règle de nommage différente injectée dans `field_name`**,
le reste du pipeline est identique.

---

## La divergence clé (ce que tu décrivais)

Fichier : `idae/web/services/json_scheme.php`

### Champ normal (codification / identification) — lignes 145-161
```php
foreach ($RS_HAS_FIELD as $ARR_HAS_FIELD):
    $ARR_FIELD = $APP_FIELD->findOne(['idappscheme_field' => (int)$ARR_HAS_FIELD['idappscheme_field']]);
    if (group == 'codification' || group == 'identification') {
        $columnModel[] = [
            'field_name'     => $ARR_FIELD['codeAppscheme_field'] . $Table,  // ← codeField + Table
            'field_name_raw' => $ARR_FIELD['codeAppscheme_field'],           // ← le code brut
            'title'          => idioma($ARR_FIELD['nomAppscheme_field']),    // ← label = nom du field
        ];
    }
endforeach;
```

### Champ FK — lignes 163-165
```php
foreach ($GRILLE_FK as $fk):
    $columnModel[] = [
        'field_name'     => 'nom' . ucfirst($fk['table_fk']),  // ← nom{Collection}, PAS un codeField
        'field_name_raw' => $fk['table_fk'],                   // ← le nom de la collection cible
        'title'          => $fk['table_fk'],                   // ← label = nom de la collection
        'className'      => 'fk',
    ];
endforeach;
```

**Règle qui change :**

| | `field_name` (clé valeur dans row) | `field_name_raw` | `title` (label) |
|---|---|---|---|
| **field normal** | `code{Field}{Table}` | `code{Field}` | `nomAppscheme_field` (libellé du champ) |
| **field FK** | `nom{Collection}` | `{collection}` | nom de la collection cible |

C'est exactement ton souvenir : **pour une FK, le label/valeur n'est plus le
`codeField` — c'est `nom{Collection}` de la table pointée.**

---

## D'où vient `nom{Collection}` — `get_grille_fk()`

Fichier : `idae/web/appclasses/appcommon/ClassApp.php:287-328`

```php
function get_grille_fk($table = '', $vars = []) {
    ...
    foreach ($grille_fk as $arr_fk):
        $table_fk = $arr_fk['table'];
        $db_fk    = $this->app_conn->findOne(['codeAppscheme' => $table_fk]);
        $out[$table_fk] = [
            'base_fk'     => $db_fk['codeAppscheme_base'],
            'table_fk'    => $table_fk,
            'idtable_fk'  => 'id' . $table_fk,           // FK technique : id{Collection}
            'nomtable_fk' => 'nom' . ucfirst($table_fk), // FK display : nom{Collection}
            ...
        ];
    endforeach;
}
```

→ convention dure : **toute FK a 2 colonnes implicites côté row** :
- `id{Collection}` = la clé étrangère réelle
- `nom{Collection}` = le label dénormalisé (joint au moment de la requête data)

Le join qui peuple `nom{Collection}` dans chaque ligne se fait côté `json_data.php`
(service data), pas au rendu. Le front reçoit donc déjà `row['nom{Collection}']`.

---

## L'étage rendu unique — `app_datatable.js`

Fichier : `idae/web/javascript/app/app_datatable.js:39-45`

```js
tag_elem_table_field = function (elem, field_name, field_name_raw, field_value, field_className = '') {
    $(elem).innerHTML = tag_elem_table_value(field_name, field_name_raw, field_value, field_className);
}
tag_elem_table_value = function (field_name, field_name_raw, field_value = '', field_className = '') {
    return '<div class="' + field_className + '" data-field_name="' + field_name +
           '" data-field_name_raw="' + field_name_raw + '" ...>' + field_value + '</div>';
}
```

La boucle de rendu (≈ lignes 654, 700, 914, 961…) fait toujours :
```js
field_name     = model.field_name,
field_name_raw = model.field_name_raw,
field_value    = tr_data.html[field_name];   // ← lit row[field_name]
tag_elem_table_field(td, field_name, field_name_raw, field_value, className);
```

**Aucun branchement field vs fk au rendu.** Pour une FK, `field_name` vaut
`nom{Collection}`, donc `row['nom{Collection}']` ressort tout seul. Pour un champ,
`row['code{Field}{Table}']`. Même code, données déjà alignées.

---

## Le 2ᵉ "switch" (formatage par type) — à ne pas confondre

`ClassApp::draw_field()` (`ClassApp.php:631-719`) a un vrai `switch` mais sur
**`codeAppscheme_field_type`** (valeur, prix, date, bool, color, icon…) — c'est du
**formatage de présentation de la valeur**, pas la résolution field/fk. Idem
`draw_field_input()` (748-839) côté édition. Ces deux-là sont indépendants de la
distinction FK.

Note : dans `json_scheme.php`, quand `codeAppscheme_field_type` est **vide**, le css
devient `'fk '` (lignes 70-71, 113-114). C'est l'autre signal "ceci est une FK" :
**FK = field sans type scalaire**.

---

## Synthèse architecture legacy

```
                 ┌─────────────────── PHP build (json_scheme.php) ──────────────────┐
 appscheme  ──►  │  field normal  →  field_name = code{Field}{Table}                │
 has_field       │                   title      = nomAppscheme_field                │
 grille_fk   ──► │  field FK      →  field_name = nom{Collection}   (get_grille_fk) │
                 │                   title      = {collection}      className='fk'  │
                 └──────────────────────────┬───────────────────────────────────────┘
                                            │  columnModel[] homogène
                                            ▼
                 ┌─────────── JS render (app_datatable.js) ────────────┐
                 │  tag_elem_table_field(field_name, raw, row[field_name])  │  ← UNIQUE, agnostique
                 └──────────────────────────────────────────────────────────┘
```

---

## Implications pour idae-machine

Le sujet "sérieux" : aujourd'hui `DataRecord` / `DataField` résolvent le label via
le scheme du field (`codeField` → `nomAppscheme_field`). Pour une FK il faut la
règle legacy : **label/valeur = champ `nom`/`code` de la collection cible**, pas le
field local.

Pistes d'alignement :
- `get_grille_fk` legacy ≡ la `grilleFK` / FK config côté model-core. La paire
  `id{Collection}` (clé) + `nom{Collection}` (display) est la convention à
  reproduire — cf. mémoire `[[project_fk_code_convention]]` (canonical = `fk-X.code`).
- Côté machine, l'équivalent du `field_name` FK = `fk-{collection}.code` (ou `.nom`).
  Le composant de rendu doit, **comme le legacy**, recevoir une entrée de modèle
  déjà résolue (`{ field_name, field_name_raw, title }`) et NE PAS rebrancher
  field-vs-fk au render.
- Donc : faire converger `DataField` vers **une entrée de modèle unique** où la
  divergence field/fk est résolue en amont (builder/scheme), pas dans le composant.
  Évite d'empiler un `if (isFk)` dans le render (anti-pattern cf.
  `[[feedback_no_organic_methods]]`).

---

## Fichiers de référence

| Fichier | Rôle |
|---|---|
| `idae/web/services/json_scheme.php:145-169` | build columnModel (divergence field/fk) |
| `idae/web/appclasses/appcommon/ClassApp.php:287-328` | `get_grille_fk` (nom{Collection}, id{Collection}) |
| `idae/web/appclasses/appcommon/ClassApp.php:631-719` | `draw_field` (formatage par type, ≠ fk switch) |
| `idae/web/javascript/app/app_datatable.js:39-45` | `tag_elem_table_field` rendu unique |
| `idae/web/services/json_data.php` | join data → peuple `nom{Collection}` dans row |
