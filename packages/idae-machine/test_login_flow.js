// Script de test pour vérifier le flux de connexion
// Ce script simule le processus de connexion et vérifie où cela pourrait bloquer

console.log('Début du test de flux de connexion...');

// Simuler le stockage local
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: function(key) {
      console.log(`[Mock] localStorage.getItem(${key}):`, store[key] || 'null');
      return store[key] || null;
    },
    setItem: function(key, value) {
      console.log(`[Mock] localStorage.setItem(${key}, ${value})`);
      store[key] = value.toString();
    },
    removeItem: function(key) {
      console.log(`[Mock] localStorage.removeItem(${key})`);
      delete store[key];
    }
  };
})();

// Simuler le processus de boot
async function simulateBoot() {
  console.log('\n=== Simulation du processus de boot ===');
  
  // Simuler la récupération de l'organisation et du token
  const org = localStorageMock.getItem('idae_org');
  const token = localStorageMock.getItem('auth_token');
  
  console.log(`Org: ${org}`);
  console.log(`Token: ${token ? 'présent' : 'missing'}`);
  
  if (!org) {
    console.log('Pas d\'organisation, saut du boot');
    return true;
  }
  
  try {
    console.log('Boot de la machine...');
    // Simuler le boot de la machine
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log('Machine bootée avec succès');
    
    console.log('Initialisation du routeur...');
    await new Promise(resolve => setTimeout(resolve, 50));
    console.log('Routeur initialisé');
    
    console.log('Début du warmup...');
    // Simuler le warmup
    await simulateWarmup();
    console.log('Warmup terminé');
    
    console.log('Restauration de la session...');
    simulateRestoreSession();
    console.log('Session restaurée');
    
    return true;
  } catch (err) {
    console.error('Erreur lors du boot:', err);
    return false;
  }
}

// Simuler le warmup
async function simulateWarmup() {
  console.log('  [Warmup] Début');
  
  // Simuler la dérivation des collections à partir du modèle
  const collectionsToWarm = ['appscheme', 'appuser', 'approle'];
  console.log('  [Warmup] Collections à réchauffer:', collectionsToWarm);
  
  // Simuler l'appel à hydrateAll
  console.log('  [Warmup] Appel à hydrateAll...');
  await new Promise(resolve => setTimeout(resolve, 200));
  console.log('  [Warmup] hydrateAll terminé');
}

// Simuler la restauration de la session
function simulateRestoreSession() {
  console.log('  [RestoreSession] Début');
  
  const token = localStorageMock.getItem('auth_token');
  const rawUser = localStorageMock.getItem('auth_user');
  
  console.log('  [RestoreSession] Token:', token ? 'présent' : 'missing');
  console.log('  [RestoreSession] RawUser:', rawUser ? 'présent' : 'missing');
  
  if (!token || !rawUser) {
    console.log('  [RestoreSession] Pas de token ou d\'utilisateur, authed=false');
    return false;
  }
  
  try {
    console.log('  [RestoreSession] Analyse de l\'utilisateur et définition de l\'utilisateur courant');
    const user = JSON.parse(rawUser);
    console.log('  [RestoreSession] Utilisateur:', user.login);
    
    const rawGrants = localStorageMock.getItem('auth_grants');
    const grants = rawGrants ? JSON.parse(rawGrants) : [];
    console.log('  [RestoreSession] Grants:', grants.length);
    
    const rawBaseline = localStorageMock.getItem('auth_menu_baseline');
    const menuBaseline = rawBaseline ? JSON.parse(rawBaseline) : {};
    console.log('  [RestoreSession] Menu baseline:', Object.keys(menuBaseline).length);
    
    console.log('  [RestoreSession] Utilisateur défini, authed=true');
    return true;
  } catch (err) {
    console.error('  [RestoreSession] Erreur:', err);
    return false;
  }
}

// Test avec un scénario de succès
async function testSuccessScenario() {
  console.log('\n=== Test du scénario de succès ===');
  
  // Configurer le stockage local pour un scénario de succès
  localStorageMock.setItem('idae_org', 'demo');
  localStorageMock.setItem('auth_token', 'fake-token-123');
  localStorageMock.setItem('auth_user', JSON.stringify({
    userId: 'user-123',
    login: 'testuser',
    isAdmin: false
  }));
  localStorageMock.setItem('auth_grants', JSON.stringify([
    { collection: 'vehicle', read: true, write: true }
  ]));
  localStorageMock.setItem('auth_menu_baseline', JSON.stringify({
    vehicle: true,
    driver: true
  }));
  
  const success = await simulateBoot();
  console.log('Résultat du boot:', success ? 'SUCCESS' : 'FAILED');
}

// Test avec un scénario d'échec (pas de token)
async function testFailureScenario() {
  console.log('\n=== Test du scénario d\'échec (pas de token) ===');
  
  // Configurer le stockage local pour un scénario d'échec
  localStorageMock.setItem('idae_org', 'demo');
  localStorageMock.removeItem('auth_token');
  localStorageMock.removeItem('auth_user');
  
  const success = await simulateBoot();
  console.log('Résultat du boot:', success ? 'SUCCESS' : 'FAILED');
}

// Exécuter les tests
async function runTests() {
  await testSuccessScenario();
  await testFailureScenario();
  console.log('\n=== Fin des tests ===');
}

runTests();