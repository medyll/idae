export function field(type, opts) {
    if (type === 'image') {
        const o = opts;
        if (o?.preset && o?.presets)
            throw new Error('Use preset OR presets, not both');
        const hasPresets = !!(o?.presets ?? o?.preset);
        return { type: 'image', ...o, free: o?.free ?? (hasPresets ? false : true) };
    }
    return { type, ...opts };
}
//# sourceMappingURL=fieldBuilder.js.map