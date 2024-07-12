import { defineConfig, presetTypography } from 'unocss';

import presetUno from '@unocss/preset-uno';
import presetMini from '@unocss/preset-mini';
import presetWind from '@unocss/preset-wind';

export default defineConfig({
	presets: [presetWind(), presetMini(), presetUno(), presetTypography()]
});
