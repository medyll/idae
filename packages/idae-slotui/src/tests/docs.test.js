import { describe, it, expect } from 'vitest';
import { DocsProcessor } from '../docs/docs.js';
import path from 'path';

const avatarPath = path.resolve(__dirname, '../../src/lib/base/avatar');
const alertPath = path.resolve(__dirname, '../../src/lib/base/alert');

describe('DocsProcessor', () => {

    it('should extract properties from Alert.svelte', async () => {
        const processor = new DocsProcessor(alertPath);
        await processor.init();
        const results = await processor.process();
   
        expect(results.Alert).toBeDefined();
        expect(results.Alert.level).toEqual({
            name: 'level',
            type: 'levels | keyof typeof levels',
            optional: true,
            jsDoc: 'alert level'
        });
    });

    it('should extract properties from Avatar.svelte', async () => {
        const processor = new DocsProcessor(avatarPath);
        await processor.init();
        const results = await processor.process();

        expect(results.Avatar).toBeDefined();
        expect(results.Avatar.icon).toEqual({
            name: 'icon',
            type: 'string',
            optional: true,
            jsDoc: ''
        });
    });
});