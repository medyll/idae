// playwright.config.ts
import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	testDir: './src/tests', // Spécifiez le répertoire où se trouvent vos tests.
	timeout: 30000, // Spécifiez le délai d'attente pour chaque test.
	// Utilisez 'chromium', 'firefox' ou 'webkit' pour spécifier le navigateur à utiliser.
	// Vous pouvez également utiliser une combinaison de ces derniers.
	use: {
		browserName: 'chromium',
		headless: true
	}
};

export default config;
