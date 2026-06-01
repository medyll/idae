// Stub for server-only packages imported in client bundle
const handler: ProxyHandler<object> = {
    get: () => stub,
    apply: () => undefined,
    construct: () => ({})
};
const stub: any = new Proxy(function(){}, handler);
export default stub;
export const createConnection = stub;
export const connect = stub;
export const sign = stub;
export const verify = stub;
export const decode = stub;
