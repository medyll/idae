# GridFS — analyse legacy + plan port idae-machine

> Recherche 2026-06-23. Scope initial: **images uniquement**. Autres types fichiers = plus tard.

---

## 1. Legacy PHP (appgem / destinationsreve64) — mécanisme actuel

### Read path — `image.php`

```php
$con = new Mongo();
$db  = $con->sitebase_image;
$grid = $db->getGridFS();
$image = $grid->findOne($_GET['image']);
if(!empty($image)){
    header('Content-type: image/jpeg');
    echo $image->getBytes();
}
```

- Lookup direct par **filename** (`$_GET['image']`), pas par `_id` ni metadata.
- Retour: bytes bruts + `Content-Type: image/jpeg` hardcodé.
- **Aucun cache header** (pas de Cache-Control/ETag/Last-Modified).
- **Pas de resize à la lecture** — tout est pré-resizé à l'upload.

### Write path — `mdl/production/image/actions.php`

1. POST custom headers (`X-File-Size`, `X-File-Name`) → fichier temp `PATHTMP.$time.'.jpg'`.
2. Resize/crop optionnel:
   - Crop: `fonctionsSite::makeCropThumb()` (Imagick: `cropImage` + `thumbnailImage`).
   - Sinon: `createThumbnail()` (GD).
3. Store GridFS:

```php
$db   = skelMongo::connectBase('sitebase_image');
$grid = $db->getGridFS();
$id    = new MongoId($_POST['mongoImg']);           // _id = string coercé, PAS auto
$idsrc = new MongoId('source-'.$_POST['mongoImg']);
$grid->remove(array('filename'=>$_POST['mongoImg']));
$myMeta = array(
    '_id'=>$id, 'filename'=>$_POST['mongoImg'], 'timestamp'=>time(),
    'metadata'=>array(
        'tag'=>$_POST['mongoTag'],         // type entité ('produit','transport',...)
        'name'=>$_POST['mongoName'],
        'size'=>$_POST['mongoSize'],       // 'tiny'/'small'/'large'
        'mysqlid'=>$_POST['mongoId'],       // FK record lié
        'contentType'=>'image/jpeg'
    )
);
$grid->storeFile(PATHTMP.$time.'.jpg', $myMeta);
// + storeFile identique pour 'source-'.$mongoImg (copie source non-resizée)
```

- **`_id` n'est PAS auto-généré** — coercion d'une string `'entity-size-id'` en `MongoId`.
- **2 fichiers stockés par variant**: le variant lui-même + une copie `source-*`.
- Variants supplémentaires (tiny/small/large) générés par appels séparés à `fonctionsSite::makeThumb()`, qui relit le variant 'large' depuis GridFS, resize, et `storeBytes()` un nouveau fichier — **3 fichiers GridFS distincts par image logique**, aucun lien structurel entre eux sinon le naming.

### Query/listing — pas de collection séparée

```php
$grid->find(array(
    'metadata.mysqlid'=>$idproduit,
    'metadata.name'=> new MongoRegex("/.*produit*./i"),
    'metadata.tag'=>'produit'
));
```

- Query **directement sur GridFS metadata** (lent à l'échelle — GridFS n'est pas indexé pour ça par défaut).
- Aucune collection métier légère miroir. Itération via `hasNext()/getNext()`.

### URL builder — `fonctionsSite.php`

```php
function imageProduit($idproduit, $size='small'){
    $grid = skelMongo::connectFs('sitebase_image');
    $image = $grid->findOne('produit-'.$size.'-'.$idproduit);
    if(empty($image)) return HTTPCUSTOMERSITE.'mediatheque-transport-'.$size.'-'.$arr['idtransport'].'.jpg'; // fallback
    return HTTPMEDIA.'mediatheque-produit-'.$size.'-'.$idproduit.'.jpg';
}
```

- Naming convention fixe: `mediatheque-{entity}-{size}-{id}.jpg`.
- Vérif existence côté serveur avant retour URL (1 query GridFS supplémentaire par image affichée).
- Fallback en dur si variant absent.

### Deletion — pas de cascade

```php
$file = $grid->findOne($_POST['src']);
$id = $file->file['_id'];
$grid->delete($id);
```

- Suppression **unitaire par `_id`**. Aucune cascade entre variants (tiny/small/large/source) — orphelins fréquents si pas nettoyé manuellement (legacy le fait via `remove()` avant chaque `storeFile()` au upload, mais pas au delete final).

---

## 2. Problèmes identifiés (à ne pas reproduire)

| Problème legacy | Impact |
|---|---|
| Query directe GridFS metadata | Lent, pas indexable proprement |
| `_id` string-coercé | Pas de vraie sémantique ObjectId, collision possible |
| Pas de lien structurel entre variants | Cascade delete impossible sans convention de naming |
| Pas de cache headers | Chaque affichage = hit serveur+Mongo complet |
| URL builder hardcodé par fonction PHP par entité | Pas générique, 1 fonction par type (`imageProduit`, `imageVille`, `imageSite`...) |
| Resize à l'upload, plusieurs storeFile séparés | Pas de pipeline réutilisable, duplication logique resize partout |

---

## 3. Plan port idae-machine

Objectif: images lisibles/queryables via **collection + store réactif** (comme tout le reste du framework), pas de query GridFS brute exposée au-dessus.

### Architecture proposée

1. **Collection métier `media`** (ou `appscheme_media`), schema-driven via `field()` comme n'importe quelle collection idae-machine:
   - `id` (PK auto), `code` (semantic string)
   - FK structurée vers le record lié (`fks` bloc, **pas** magic-string `fk-X.code` — cf. [[project_fk_naming_convention]])
   - `tag` (type entité), `variant` (`original`/`tiny`/`small`/`large`)
   - `variantOf` (FK vers le record média parent — lien structurel explicite, absent du legacy)
   - `contentType`, `gridfsId` (pointeur vers le blob GridFS réel)
   - `width`/`height` (évite de rouvrir le blob pour dimensionner côté UI)

2. **GridFS = storage brut uniquement**. Jamais de query directe dessus depuis le code applicatif. Toute lecture/liste passe par `machine.store('media', { mysqlid })` → reactive, RBAC inclus, Explorer/Fiche gratuits.

3. **Cascade delete**: supprimer un record média = hook supprime tous les records `variantOf = id` (et leurs blobs GridFS associés) + le blob propre. Pas de nettoyage manuel comme legacy.

4. **Lecture**: endpoint Express stream bytes + vrais headers cache (`ETag`/`Cache-Control`) — gain immédiat vs legacy qui n'en a aucun.

5. **`_id` GridFS**: vrai `ObjectId` auto-généré. Le `code` métier lisible (`produit-large-42`) vit dans la collection `media`, pas comme coercion d'`_id`.

6. **Resize — décision ouverte**:
   - Option A (legacy-like): resize à l'upload, stocke N variants (tiny/small/large) immédiatement.
   - Option B: stocke seulement l'original, génère variants à la demande (sharp + cache disque/Mongo).
   - **Trade-off**: A = lecture rapide, écriture lourde + espace dupliqué. B = écriture légère, 1er accès par variant plus lent (mitigé par cache).

### Question ouverte à trancher avant code

Resize au upload (legacy) ou à la demande (cache) ? Décide l'archi du write path et du champ `variant`.

---

## 4. Refs

- Memory: `project_legacy_idae_php_cms.md`, `project_fk_naming_convention.md`
- Legacy source: `d:/archives/save boulot/app_site_old/z_old_app/appgem/` (+ `destinationsreve64/` identique)
  - `image.php`, `mdl/production/image/actions.php`, `fonctions/fonctionsSite.php`, `mdl/production/produit/mdlProduitImage.php`
