// Created scripts/package-pre.js

import { MakeLibIndex } from '@medyll/idae-shared';
new MakeLibIndex({ignorePatterns: ["*.yaml"]}).makeIndexFile();

