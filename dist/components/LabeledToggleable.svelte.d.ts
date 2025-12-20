import type { Snippet } from 'svelte';
import type { GroupStore } from '../stores/index.js';
declare function $$render<T>(): {
    props: {
        id: string;
        type?: "checkbox" | "radio" | "switch";
        checked?: boolean;
        disabled?: boolean;
        value?: T;
        groupStore?: GroupStore<T>;
        label?: string | undefined;
        icon?: string | undefined;
        description?: string | undefined;
        element?: HTMLInputElement | HTMLButtonElement | undefined;
        onchange?: (event: {
            checked: boolean;
            value?: T;
            groupValue?: GroupStore<T>;
        }) => void;
        labelSlot?: Snippet;
        descriptionSlot?: Snippet;
        children?: Snippet;
        class?: string;
    };
    exports: {};
    bindings: "element" | "checked";
    slots: {};
    events: {};
};
declare class __sveltets_Render<T> {
    props(): ReturnType<typeof $$render<T>>['props'];
    events(): ReturnType<typeof $$render<T>>['events'];
    slots(): ReturnType<typeof $$render<T>>['slots'];
    bindings(): "element" | "checked";
    exports(): {};
}
interface $$IsomorphicComponent {
    new <T>(options: import('svelte').ComponentConstructorOptions<ReturnType<__sveltets_Render<T>['props']>>): import('svelte').SvelteComponent<ReturnType<__sveltets_Render<T>['props']>, ReturnType<__sveltets_Render<T>['events']>, ReturnType<__sveltets_Render<T>['slots']>> & {
        $$bindings?: ReturnType<__sveltets_Render<T>['bindings']>;
    } & ReturnType<__sveltets_Render<T>['exports']>;
    <T>(internal: unknown, props: ReturnType<__sveltets_Render<T>['props']> & {}): ReturnType<__sveltets_Render<T>['exports']>;
    z_$$bindings?: ReturnType<__sveltets_Render<any>['bindings']>;
}
declare const LabeledToggleable: $$IsomorphicComponent;
type LabeledToggleable<T> = InstanceType<typeof LabeledToggleable<T>>;
export default LabeledToggleable;
