// packages\idae-api\src\lib\example.ts

import { idaeApi } from "$lib/server/IdaeApi";
import { type RouteDefinition } from "$lib/config/routeDefinitions";
import { DbType } from "$lib/@types/types.js";

// Exemple de routes personnalisées
const customRoutes: RouteDefinition[] = [
  {
    method: "get",
    path: "/custom/hello",
    handler: async () => ({ message: "Hello from custom route!" }),
    requiresAuth: false,
  },
  {
    method: "post",
    path: "/custom/echo",
    handler: async (service, params, body) => ({ echo: body }),
    requiresAuth: true,
  },
];

//  server configuration
idaeApi.setOptions({
  port: 3000,
  enableAuth: false,
  // routes: customRoutes,
  idaeDbOptions: {
    dbType: DbType.MONGODB,
    dbScope: "a_idae_db_sitebase",
    dbScopeSeparator: "_",
    idaeModelOptions: {
      autoIncrementFormat: (collection: string) => `id${collection}`,
      autoIncrementDbCollection: "auto_increment",
    },
  },
});

// start server
idaeApi.start();
console.log("IDAE API is running on port 3000");
/* setTimeout(() => {
  fetch("http://localhost:3000/query/a_idae_db_sitebase_app.user/4", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      iduser: 4,
    }),
  });
}, 1000); */

// Exemples d'utilisation des routes par défaut avec Postman

// 1. Créer un nouvel élément dans appscheme
// POST http://localhost:3000/appscheme
// Body (JSON):
// {
//   "name": "Test Scheme",
//   "description": "This is a test scheme"
// }

// 2. Récupérer tous les éléments de appscheme
// GET http://localhost:3000/appscheme

// 3. Récupérer un élément spécifique par ID
// GET http://localhost:3000/appscheme/{id}

// 4. Mettre à jour un élément
// PUT http://localhost:3000/appscheme/{id}
// Body (JSON):
// {
//   "name": "Updated Test Scheme"
// }

// 5. Supprimer un élément
// DELETE http://localhost:3000/appscheme/{id}

// 6. Utiliser une route avec le nom de base de données complet
// GET http://localhost:3000/idaenext_sitebase_app.appscheme

// 7. Utiliser les méthodes spéciales (findAll, create, etc.)
// GET http://localhost:3000/appscheme/findAll

// 8. Exemple avec des paramètres encodés
// GET http://localhost:3000/appscheme/findAll/{encodedParams}
// Encoded Params: encodeURIComponent(JSON.stringify({ name: 'Test Scheme' }))

// 9. Exemple de suppression multiple
// DELETE http://localhost:3000/appscheme
// Body (JSON):
// {
//   "name": "Test Scheme"
// }

console.log("You can now use Postman to test the API endpoints.");

// Exemple d'arrêt du serveur après un certain temps
/* setTimeout(() => {
	idaeApi.stop();
	console.log('IDAE API has been stopped');
}, 60000);   */

// Gestion des erreurs
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
