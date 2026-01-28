interface CrudZoneProps {
    collection: string;
    data?: Record<string, any>;
    style?: ElementCSSInlineStyle;
}
declare function $$render<T = Record<string, any>>(): {
    props: CrudZoneProps;
    exports: {};
    bindings: "";
    slots: {};
    events: {};
};
declare class __sveltets_Render<T = Record<string, any>> {
    props(): ReturnType<typeof $$render<T>>['props'];
    events(): ReturnType<typeof $$render<T>>['events'];
    slots(): ReturnType<typeof $$render<T>>['slots'];
    bindings(): "";
    exports(): {};
}
interface $$IsomorphicComponent {
    new <T = Record<string, any>>(options: import('svelte').ComponentConstructorOptions<ReturnType<__sveltets_Render<T>['props']>>): import('svelte').SvelteComponent<ReturnType<__sveltets_Render<T>['props']>, ReturnType<__sveltets_Render<T>['events']>, ReturnType<__sveltets_Render<T>['slots']>> & {
        $$bindings?: ReturnType<__sveltets_Render<T>['bindings']>;
    } & ReturnType<__sveltets_Render<T>['exports']>;
    <T = Record<string, any>>(internal: unknown, props: ReturnType<__sveltets_Render<T>['props']> & {}): ReturnType<__sveltets_Render<T>['exports']>;
    z_$$bindings?: ReturnType<__sveltets_Render<any>['bindings']>;
}
declare const CrudZone: $$IsomorphicComponent;
type CrudZone<T = Record<string, any>> = InstanceType<typeof CrudZone<T>>;
export default CrudZone;
