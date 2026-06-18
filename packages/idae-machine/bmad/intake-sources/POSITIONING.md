# idae-machine — Positionnement

> Quel logiciel idae-machine ressemble le plus, et où il se situe dans le paysage.
> Reconstruit le 2026-06-10 (analyse d'origine perdue : deux `.md` minuscules à la racine, non versionnés, supprimés).

## Ce qu'est idae-machine

Framework CRUD/contenu schema-driven : on déclare collections / champs / FKs (`field()`) → UI auto-générée (listes, formulaires, fiche, RBAC). Offline-first via IndexedDB (`@medyll/qoolie`), SvelteKit + Svelte 5 runes, serveur Express/Mongo self-hosted.

## Comparaison par axe

| Axe | Logiciels connus | Rapport à idae-machine |
|-----|------------------|------------------------|
| **Analog produit** | **Shopify** | Le plus proche. Shopify = storefront schema-driven : products/collections/metafields → admin UI + storefront auto + theme. idae-machine = même modèle mais générique (tout domaine), offline-first, self-hosted. metafields ≈ `field()` ; admin ≈ Explorer/Fiche ; thèmes Liquid ≈ couche frame/zone. |
| **Headless CMS** | **Directus** (le plus proche), Strapi, Contentful, Sanity, WordPress+ACF | Content model → admin + API auto. idae-machine ajoute : client réactif runes, IndexedDB offline, matrice RBAC. |
| **Low-code internal tools** | Budibase, Appsmith, Retool, NocoDB, Baserow | Schema → apps CRUD. Mais GUI builders, pas code-first. |
| **Framework dev** | **Refine** (refine.dev), RedwoodJS, Amplify Admin | CRUD headless code-first. idae-machine relève plus de cette famille que des GUI no-code. |
| **Couche offline/sync** (qoolie) | RxDB, WatermelonDB, ElectricSQL, PouchDB/CouchDB | Sync DB local-first réactif. |

## Positionnement

> Le modèle **schema → admin → theme de Shopify**, généralisé à tout domaine comme un **CMS headless type Directus**, livré **code-first en framework Svelte (à la Refine)**, avec une **sync offline-first type RxDB**. Self-hosted.

Niche unique = data modeling headless-CMS + auto-UI low-code + local-first offline + Svelte 5 runes. Aucun concurrent direct ne couvre les 4 axes ensemble.

Voir aussi : roadmap rendu public / CMS complet.
