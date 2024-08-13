import { SCSSConverter } from './release-css.js';
import { MakeLibIndex } from '../../shared/scripts/indexIfy.js';

const converter = new SCSSConverter('./src/lib', './src/lib/slotui-css');

converter.processAllFiles();

new MakeLibIndex().makeIndexFile();

