import { IndexGenerator } from './make-export.js';
import { COMPONENT_ROOTS, EXCLUDE_GLOBS } from './make-export.js';

await new IndexGenerator(COMPONENT_ROOTS, EXCLUDE_GLOBS).generate();

