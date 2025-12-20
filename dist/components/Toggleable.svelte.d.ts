import type { GroupStore } from '../stores/index.js';
declare function $$render<T = unknown>(): {
    props: {
        id: string;
        type?: "checkbox" | "radio" | "switch";
        checked?: boolean;
        disabled?: boolean;
        value?: T;
        groupStore?: GroupStore<T>;
        element?: HTMLInputElement | HTMLButtonElement | undefined;
        onchange?: (event: {
            checked: boolean;
            value?: T;
            groupValue?: GroupStore<T>;
        }) => void;
        onclick?: (e: MouseEvent) => void;
        'aria-label'?: string | undefined;
        'aria-labelledby'?: string | undefined;
        'aria-describedby'?: string | undefined;
        class?: string;
    };
    exports: {};
    bindings: "element" | "checked";
    slots: {};
    events: {};
};
declare class __sveltets_Render<T = unknown> {
    props(): ReturnType<typeof $$render<T>>['props'];
    events(): ReturnType<typeof $$render<T>>['events'];
    slots(): ReturnType<typeof $$render<T>>['slots'];
    bindings(): "element" | "checked";
    exports(): {};
}
interface $$IsomorphicComponent {
    new <T = unknown>(options: import('svelte').ComponentConstructorOptions<ReturnType<__sveltets_Render<T>['props']>>): import('svelte').SvelteComponent<ReturnType<__sveltets_Render<T>['props']>, ReturnType<__sveltets_Render<T>['events']>, ReturnType<__sveltets_Render<T>['slots']>> & {
        $$bindings?: ReturnType<__sveltets_Render<T>['bindings']>;
    } & ReturnType<__sveltets_Render<T>['exports']>;
    <T = unknown>(internal: unknown, props: ReturnType<__sveltets_Render<T>['props']> & {}): ReturnType<__sveltets_Render<T>['exports']>;
    z_$$bindings?: ReturnType<__sveltets_Render<any>['bindings']>;
}
declare const Toggleable: $$IsomorphicComponent;
type Toggleable<T = unknown> = InstanceType<typeof Toggleable<T>>;
export default Toggleable;
