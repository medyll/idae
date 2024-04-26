import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        component?: string;
        cite?: string;
        children?: import('svelte').Snippet;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export type ComponentDemoProps = typeof __propDef.props;
export type ComponentDemoEvents = typeof __propDef.events;
export type ComponentDemoSlots = typeof __propDef.slots;
export default class ComponentDemo extends SvelteComponent<ComponentDemoProps, ComponentDemoEvents, ComponentDemoSlots> {
}
export {};
