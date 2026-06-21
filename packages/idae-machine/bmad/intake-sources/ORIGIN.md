# CRISIS.md — Fonctionnement du legacy idae

> Modélisation du legacy `D:/development/idae-legacy` tel qu'il fonctionne
> réellement. Document de référence sur la mécanique d'origine.
>
> Stack : PHP 5.6→8.2, MongoDB v1→v2, Node socket server, JS Prototype.js.
> Org de référence : `destinationsreve` (CMS metier).
> Écrit : 2026-06-18.

---

## 0. L'idée centrale, en une phrase

> **Tout est un `module` : un fragment d'UI identifié par un nom de fichier,
> dont l'état vit dans des attributs DOM (`vars`, `value`, `scope`), et qui se
> recharge en re-exécutant son fichier serveur avec ces attributs comme entrée.**

Le legacy n'a pas de "composants" au sens framework. Il a des **modules**
récursifs. Une page = un arbre de modules qui s'incluent les uns les autres.
La réactivité = re-fetch d'un module par sélecteur DOM. Tout le reste
(schéma, FK, RBAC, socket) gravite autour de ce noyau.

---

## 1. Le noyau : `skelMdl::cf_module`

Fichier : `idae/web/appskel/skelMdl.php`

```php
static function cf_module($module, $array = [], $value = '', $attributes = '') {
    $APP = new App();
    // $array = vars du module (scope, table, table_value, className, defer, cacheOn…)
    $arrQuery  = $array;                       // les "vars"
    $theQuery  = http_build_query($arrQuery);  // sérialisées dans l'attribut vars=''

    // état encodé en attributs DOM sur un tag custom :
    $start = "<$moduleTag $data_string $act_defer $attributes $data_scope
              class='cf_module $className'
              mdl='$module' vars='$theQuery' value='$value' id='$moduleId'>";
    $end   = "</$moduleTag>";

    ob_start();
    $final = $start;
    if (file_exists(APPMDL.'/'.$module.'.php')) {
        if (empty($array['defer'])) {          // defer => coquille vide, chargée + tard
            $tempPost = $_POST;
            $_POST    = $arrQuery;             // <<< LES VARS DEVIENNENT $_POST
            include(APPMDL.'/'.$module.'.php'); // <<< le module s'exécute
            $_POST    = $tempPost;             // restaure
        }
    }
    $final .= $end;
    ob_end_clean();
    return trim($final);
}
```

### Ce qu'il faut retenir (mécanique exacte)

1. **Un module = un fichier PHP** sous `idae/web/mdl/...` (ex : `app/app_gui/app_gui_main`).
2. **Les `vars` passées deviennent `$_POST`** le temps de l'include. Le module lit
   son entrée dans `$_POST`. C'est l'injection de props.
3. **Le rendu est emballé dans un tag custom** portant l'état comme attributs :
   - `mdl='app/app_gui/app_gui_desktop'` → quel fichier recharger
   - `vars='scope=...&table=...'` → ses props courantes
   - `value='...'` → discriminant d'instance (plusieurs modules même `mdl`, `value` différent)
   - `scope='...'` → clé de groupe pour rechargement collectif
4. **`defer`** → on émet la coquille (le tag) sans exécuter le fichier ; le contenu
   est chargé plus tard par AJAX. C'est le lazy-load natif.
5. **Récursivité** : à l'intérieur d'un `app_gui_main.php`, on rappelle
   `cf_module('app/app_gui/app_gui_desktop', [...])`. Un module compose ses enfants
   en les incluant. **L'arbre de modules = l'arbre de l'UI.**

### Variantes
- `skelTpl::cf_template($tpl, $datas, $block)` — `idae/web/appskel/skelTpl.php` —
  rendu d'un template pur (pas un module rechargeable), data passées explicitement.
  → **module = unité rechargeable/stateful ; template = rendu pur sans état DOM.**
- `skelMdl::reloadModule($module, $value, $vars, $room)` — version **serveur** :
  pousse un `act_reload_module` via socket vers le client (cf. §6).

---

## 2. Le moteur client : DOM-as-state + reload par sélecteur

Fichiers : `idae/web/javascript/engine/module.js`, `engine.js`, `methods.js`

L'état n'est **pas** dans un store JS. Il est **dans les attributs du tag**.
Recharger un module = retrouver le tag par sélecteur, lire ses attributs,
re-fetcher son fichier serveur.

### Les trois opérations fondamentales

```js
// 1. Recharge par scope (groupe) — tous les modules d'un même scope
reloadScope = function(scope, value, pars, newValue, options) {
    $$('[scope="'+scope+'"]').each(function(node){
        if (node.readAttribute('value')==value || value=='*') {
            qy = URLToArray(node.readAttribute('vars')+'&'+(pars||''));
            node.writeAttribute({vars: $H(qy).toQueryString()});
            module = node.readAttribute('mdl');
            if (typeof socket=='object') node.socketModule(module, ...);   // via socket
            else new Ajax.Updater(node, 'mdl/'+module+'.php', {parameters:qy, ...}); // fallback AJAX
        }
    });
}

// 2. Recharge par mdl (nom de fichier) — toutes les instances du module
reloadModule = function(module, value, pars, newValue, options) {
    $$('[mdl="'+module+'"]').each(function(node){
        if (node.readAttribute('value')==value || value=='*') { /* idem : re-fetch */ }
    });
}

// 3. Fermeture
closeModule = function(module, value) {
    $$('[mdl="'+module+'"]').each(function(node){
        if (node.getAttribute('value')==value) { node.close() || node.remove(); }
    });
}
```

### Chargement d'un module dans une "fenêtre" / zone
`act_chrome_gui(file, vars, options)` (engine.js) :
- calcule un `ident` (clé d'instance = `clean_string(file+vars)`),
- crée une `windowGui`, récupère son `innerDisp` (la zone DOM cible),
- y écrit `mdl`, `vars`, `value`, et — si on cible un enregistrement —
  `table`, `scope='id'+table`, `value=table_value`.
- Le `scope='id'+table` + `value=record_id` permet le **reload ciblé d'une fiche**
  quand cet enregistrement change.

### Le pattern clé à comprendre
- **`scope` = canal de rafraîchissement.** Quand la donnée `produit#42` change,
  le serveur émet `reloadScope('idproduit', 42)` → tous les tags
  `[scope=idproduit][value=42]` se re-fetchent. Réactivité sans état partagé :
  l'état canonique est en base, le DOM n'est qu'une projection rechargeable.
- **`value` = identité d'instance.** Permet plusieurs vues du même module sans collision.
- **`vars` = props.** Round-trip : les props repartent au serveur au reload.

### Système auto (déclaratif, sans JS écrit à la main)
- `data-setting` / `data-setting-*` sur un `<a>` → bascule une préférence agent +
  applique un effet DOM (display/class), persiste via `save_settings()`.
- `data-count` / `data-count_auto` / `data-table` / `data-vars` → badge auto-rafraîchi
  (ex : compteur d'emails non lus) piloté par requête.
- `data-contextual="produit:42"` → menu contextuel (clic droit) construit selon les
  droits R/U/D sur la collection (§5).
- `class="select" select="app/app_skel/skelbuilder_select" populate="true"` → champ
  qui peuple ses options depuis un module distant.

---

## 3. Le système de schéma (méta-collections)

Service d'assemblage : `idae/web/services/json_scheme.php`
ORM : `idae/web/appclasses/appcommon/ClassApp.php`

**L'UI n'est jamais codée en dur.** Toute entité/champ est décrite par des
collections MongoDB méta. Le client charge l'ensemble une fois au boot dans
`window.APP.APPSCHEMES` / `window.APP.APPFIELDS` (via `schemeLoad()` dans
`app_bootstrap.js`), et chaque vue lit ce schéma pour savoir rendre un form/grid.

### Méta-collections
| Collection | Rôle |
|---|---|
| `appscheme` | définition d'entité (= collection metier). Porte `idappscheme`, `codeAppscheme` (code), `nomAppscheme`, `codeAppscheme_base`, `grilleFK` (bloc FK), `type`. |
| `appscheme_field` | catalogue de champs : `codeAppscheme_field` (nom brut), `nomAppscheme_field` (titre), `codeAppscheme_field_type`, `codeAppscheme_field_group`, `iconAppscheme_field`. |
| `appscheme_has_field` | binding entité↔champ (quels champs appartiennent à quelle entité). |
| `appscheme_has_table_field` | colonnes affichées dans la grille, ordonnées (`ordreAppscheme_has_table_field`). |
| `appscheme_field_group` | groupes de champs (codification, identification, date, prix, localisation, valeur, texte, image, heure, divers…). Pilote le regroupement visuel des forms. |
| `appscheme_field_type` | registre des types (date, heure, currency, text, fk…) → drive le widget + la classe CSS. |
| `appscheme_base` | namespace/base mongo (sitebase_app, sitebase_base…). |

### Convention de nommage des champs (CRUCIALE)
```
field_name = codeAppscheme_field + ucfirst(codeAppscheme)
```
Ex : champ `nom` sur entité `produit` → `nomProduit`. Champ `date` sur `commande`
→ `dateCommande`. Chaque champ est **physiquement préfixé par sa collection** dans
les documents Mongo (encodage `field_raw{Collection}`).

### Les modèles assemblés (json_scheme.php)
Pour chaque entité, le service construit :
- **`fieldModel`** — tous les champs déclarés : `{field_name, field_name_raw, field_name_group, icon, title}`.
- **`columnModel`** — colonnes de la grille (via `appscheme_has_table_field`, ordonnées).
- **`miniModel`** — champs de la mini-fiche (`in_mini_fiche=1`), avec mapping type→css
  (`date`→`date_field`, `heure`→`heure_field`, currency→`css_field_prix`…).
- **`defaultModel`** — valeurs/champs par défaut.
- **`hasModel`** — bindings.
- **`grilleFK` / count** — relations FK + comptes (cf. §4).

Réponse → `window.APP.APPSCHEMES[codeAppscheme]`. Le client n'invente rien :
si `nomProduit` existe dans le schéma `produit`, le form rend un input text avec
la bonne validation, automatiquement.

### ClassApp (ORM)
- `new App($table)` — sélectionne la collection + lazy-load des métadonnées via
  `__get()` magique (évite une requête Mongo à chaque instanciation).
- `$APP->plug($base, $collection)` — bascule base+collection (multi-namespace).
- Expose `app_table_one`, `idappscheme`, `codeAppscheme`, `grilleFK`,
  `get_grille_fk()`, `get_grille_count()`, `get_basic_fields_nude()`.

---

## 4. Les relations FK

Bloc structuré `grilleFK` sur le document `appscheme`, + helper
`idae/web/appclasses/appcommon/ClassAppFk.php`.

### FK directe
`grilleFK` est un **bloc structuré** dans la définition d'entité (pas une
convention magic-string). Chaque entrée déclare une table cible. Le `json_scheme`
expose `GRILLE_FK = $APP->get_grille_fk()` et les comptes `get_grille_count()`.

### FK inverse (reverse-FK)
`ClassAppFk::getReverseGrid($app, $table, $table_value)` :
```php
// trouve toutes les entités dont grilleFK.table == $table (= qui référencent $table)
$rs = $app->appscheme->find($vars_type + ['grilleFK.table' => $table]);
while ($arr_det = $rs->getNext()) {
    // pour chaque entité référençante, compte/charge les enregistrements liés
    $rs_fk = $app->plug($arr_det['codeAppscheme_base'], $arr_det['codeAppscheme'])
                 ->find([$id => (int)$table_value]);
    $arr_det['count'] = $rs_fk->count();
    $arr_det['table'] = $arr_det['codeAppscheme'];
}
```
→ "qui pointe vers moi ?" — les listes des fiches référençantes.
Détection FK = bloc `grilleFK` structuré uniquement, jamais de fallback magic-string.

### `get_grille_fk()` — ce que la grille FK contient vraiment
`ClassApp::get_grille_fk($table)` lit `grilleFK` (array d'entrées `{table, uid,
ordreTable, requiredInput}`) sur le doc `appscheme`, et **résout chaque entrée**
en allant chercher le scheme cible. Retour indexé par `table_fk` :
```php
$out[$table_fk] = [
    'base_fk'        => $db_fk['codeAppscheme_base'],   // base mongo de la cible
    'collection_fk'  => $db_fk['codeAppscheme'],
    'table_fk'       => $table_fk,
    'idtable_fk'     => 'id' . $table_fk,               // ex 'idcategorie'
    'nomtable_fk'    => 'nom' . ucfirst($table_fk),     // ex 'nomCategorie'
    'nomAppscheme', 'iconAppscheme', 'colorAppscheme', 'icon_fk' ...
];
```
La clé physique de la FK sur le doc hôte = `id<TableFk>` (l'id) ; le libellé
affiché = `nom<TableFk>` / `code<TableFk>` (dénormalisés, cf. ci-dessous).

### Automaticité avec les tables `has` (statut/type/categorie/group/groupe)
Deux comportements liés, **opposés**, qu'il ne faut pas confondre :
1. **Auto-création de FK** (`consolidate_app_scheme`) : si l'entité porte
   `has{Statut|Type|Categorie|Group|Groupe}Scheme = 1`, le consolidateur
   **crée automatiquement** le sous-scheme `<table>_<value>` (ex `produit_statut`)
   puis l'inscrit dans `grilleFK` via `set_grille_fk(<table>_<value>)`. Les
   tables `has` deviennent donc des FK **sans déclaration manuelle**.
2. **Exclusion du rendu FK** (`get_grille_fk`) : à l'inverse, une cible qui est
   elle-même `is{Statut|Type|…}Scheme` est **filtrée hors** de la grille FK
   (`if ($db_fk['is'.$Value.'Scheme']) continue;`). Raison : un statut/type se
   rend comme widget statut/type, pas comme colonne FK générique.
> Résumé : `has*` ⇒ FK auto-câblée ; `is*Scheme` ⇒ exclue de la grille FK visuelle.

### LE point clé — la FK est marquée AU NIVEAU DE LA VUE (columnModel)
C'est l'info que la rationalisation `_app`↔data a perdue. Dans `json_scheme.php`
(version `idae.api.lan`, `RsColumnModel`), chaque FK est **injectée comme une
colonne synthétique** dont la *clé* ET le *descripteur* encodent la FK-ness :
```php
foreach ($GRILLE_FK as $fk):
    $columnModel['GRILLE_FK.' . $fk['table_fk'] . '.nom' . ucfirst($fk['table_fk'])] = [
        'viewFieldType'    => 'GRILLE_FK',          // <<< LE MARQUEUR
        'field_name'       => 'nom' . ucfirst($fk['table_fk']),  // champ data à lire
        'field_name_raw'   => $fk['table_fk'],
        'field_type'       => 'text',
        'className'        => 'fk',
    ];
// counts FK → viewFieldType 'GRILLE_COUNT', clé 'count_<rel>'
```
Le marqueur legacy par-colonne est donc **`GRILLE_FK.<table_fk>.nom<TableFk>`**
(clé de colonne) + **`viewFieldType: 'GRILLE_FK'`** (descripteur). La version
`idae-legacy` plus ancienne portait un marquage plus faible : `columnModel[] =
['field_name'=>'nom'+Table_fk, 'className'=>'fk', ...]` — seul `className:'fk'`
distinguait la colonne.
Dans les deux cas, **le modèle de vue (columnModel) sait par colonne que c'est
une FK** ; le renderer dispatche dessus. Sans ce flag par-champ-de-vue, le rendu
FK est impossible — d'où le blocage actuel.

### Dénormalisation au save (le « feeding » au post/put)
`ClassApp` (~l.1582, boucle `foreach ($GRILLE_FK as $field)` dans le flux de
sauvegarde) **recopie les champs de la cible FK dans le doc hôte** au moment du
save : pour chaque FK résolue via `id<TableFk>`, il lit `code<TableFk>`,
`nom<TableFk>`, `ordre<TableFk>` (+ `app_default_fields_add`) sur l'enregistrement
lié et les écrit à plat sur l'hôte. C'est ce qui rend `produit.nomCategorie`
directement lisible/queryable côté client et serveur, sans join. Le « tableau
`fk` » de la nouvelle version est la même idée (dénorm au post) avec une autre
forme de stockage — mais la **forme** change le `field_name` que la vue doit
pointer (`nom<TableFk>` à plat ⟶ `fk.<table>.nom` imbriqué), et c'est cette
correspondance vue→data qui doit être reportée dans `viewFieldType:'GRILLE_FK'`.

---

## 5. RBAC

Helpers : `idae/web/appfunc/function.php` — `droit()`, `droit_table()`, `droit_table_multi()`.

- **Niveau app** : `droit('DEV')`, `droit('ADMIN')` → flags globaux sur l'agent/groupe.
- **Niveau collection** : `droit_table(idagent, 'R'|'C'|'U'|'D'|'L', table)`.
  - `L` = list (pilote le menu : une collection n'apparaît au menu que si `L`).
  - `R` = read (fiche), `C` = create, `U` = update, `D` = delete.
- Vérifié côté serveur sur chaque endpoint data ; côté client, les guards
  filtrent menu + menu contextuel (`data-contextual` construit les items selon droits).
- Session : `agent` (loginAgent, passwordAgent bcrypt, idagent_groupe). Permissions
  chargées en session au login.

---

## 6. Réactivité temps réel

Node socket server : `idae/web/app_node/` (modulaire ESM : config/db/services/socket/web).

Boucle de réactivité **server-push → reload par scope** :

1. Une mutation arrive (form save côté PHP).
2. PHP appelle `skelMdl::reloadModule($module,$value,$vars,$room)` →
   `send_cmd_eleph('act_reload_module', {module, value, vars, room})` →
   `doSocket()` ouvre un socket vers le serveur Node et émet la commande.
3. Node diffuse `act_reload_module` aux clients de la room.
4. Client reçoit → `reloadModule(module, value)` / `reloadScope('id'+table, id)`
   → re-fetch AJAX/socket du tag concerné → le fragment se réaffiche à jour.

**Aucun diff, aucun VDOM.** L'état canonique est en Mongo ; le DOM est une
projection ; un événement dit "re-projette ce scope". La lecture doit se faire
dans le cadre qui se re-projette (le tag rechargé), sinon affichage périmé.
Ça scale en collaboratif : plusieurs agents voient la même fiche se rafraîchir.

---

## 7. L'arbre de modules (composition réelle d'une page)

`idae/web/mdl/app/app_gui/` — exemple `app_gui_main.php` (la racine UI) :

```
app_gui_main.php                       ← racine, orchestrateur
├── taskBar (inline)                   ← barre : toggle menu, waffle, badge mail, agent, cache(DEV)
├── gui_pane (defer)
│   └── app_gui_start.php              ← overlay "waffle", 2 panneaux 50/50
│       ├── [gauche] app_gui_start_menu.php   ← boucle appscheme_type → appscheme
│       │     ├── app_gui_start_menu_launch.php       (sous-menu collection)
│       │     └── app_gui_start_menu_launch_all.php   (tout un type)
│       └── [droite] app_gui_today.php         ← dashboard "Aujourd'hui"
│             ├── app_gui_today_create.php     (boutons quick-create)
│             ├── app_gui_today_link.php       (accès rapides)
│             └── app_gui_today_echeancier.php (échéancier)
├── gui_menu (sidebar repliable)
│   └── app_gui_menu.php               ← arbre appscheme_type→appscheme (Espace/Créer/Explorer)
├── desktop (zone principale)
│   └── app_gui_desktop.php
│       ├── zone_agent_table  → agent_table → app_fiche_icone   (widget resizable)
│       ├── zone_agent_tuile  → agent_tuile → app_fiche_mini
│       ├── note_panel        → agent_note  → app_fiche
│       ├── app_gui_calendar (defer)
│       └── app_gui_panel_list.php → app_gui_panel.php (historique récent par collection)
└── app_user_pref_css.php              ← injection CSS perso agent
```

Chaque nœud est un `cf_module`. Chaque zone resizable porte son `mdl`/`scope`/`value`
et se recharge indépendamment.

---

## 8. Génération d'UI pilotée schéma : `app_skel/skelbuilder_*`

`idae/web/mdl/app/app_skel/` — le constructeur d'UI générique. Chaque fragment
rend une partie d'interface à partir du schéma, sans code metier :

| Fichier | Rôle |
|---|---|
| `skelbuilder_liste.php` | liste/grille pilotée par `columnModel` |
| `skelbuilder_liste_group.php` | liste groupée par `field_name_group` |
| `skelbuilder_liste_inner.php` | rendu des lignes |
| `skelbuilder_grille.php` | édition des colonnes de grille (admin schéma) |
| `skelbuilder_input.php` | champs FK/inputs d'une entité |
| `skelbuilder_fk.php` | gestion FK |
| `skelbuilder_select.php` / `_size_select.php` | sélecteurs peuplés à distance |
| `skelbuilder_create.php` / `_update*.php` | create/update entité+schéma |
| `skelbuilder_field_create.php` | déclaration de champ |

Le type de champ (`codeAppscheme_field_type`) dispatche vers le widget + la classe CSS.

---

## Annexe — points d'entrée fichiers (legacy)

| Sujet | Fichier |
|---|---|
| Noyau module | `idae/web/appskel/skelMdl.php` (`cf_module`, `reloadModule`, `send_cmd`) |
| Template pur | `idae/web/appskel/skelTpl.php` (`cf_template`) |
| ORM Mongo | `idae/web/appclasses/appcommon/ClassApp.php` |
| FK | `idae/web/appclasses/appcommon/ClassAppFk.php` |
| Assemblage schéma | `idae/web/services/json_scheme.php` |
| Moteur client | `idae/web/javascript/engine/{module,engine,methods}.js` |
| Bootstrap client | `idae/web/javascript/app/app_bootstrap.js` (`schemeLoad`) |
| RBAC | `idae/web/appfunc/function.php` (`droit`, `droit_table`) |
| Socket server | `idae/web/app_node/src/` |
| Arbre UI racine | `idae/web/mdl/app/app_gui/app_gui_main.php` |
| UI générée schéma | `idae/web/mdl/app/app_skel/skelbuilder_*.php` |
| Docs legacy | `ARCH.md`, `cf_module.md`, `SCHEMA.md`, `MAIN_MENU.md`, `JS_STRUCTURE_LEGACY.md` |
