// Stub for server-only packages — CJS so Vite creates synthetic named exports
const stub = new Proxy(function(){}, {
    get: (_, key) => stub,
    apply: () => stub,
    construct: () => ({})
});
module.exports = stub;
