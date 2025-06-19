import type { GroupStore } from '../stores/index.js';
declare class __sveltets_Render<T = unknown> {
    props(): {
        id: string;
        type?: "checkbox" | "radio" | "switch";
        checked?: boolean;
        disabled?: boolean;
        value?: T | undefined;
        groupStore?: GroupStore<T> | undefined;
        ariaLabel?: string | undefined;
        ariaLabelledby?: string | undefined;
        ariaDescribedby?: string | undefined;
        element?: HTMLInputElement | HTMLButtonElement | undefined;
        onchange?: ((event: {
            checked: boolean;
            value?: T | undefined;
            groupValue?: GroupStore<T> | undefined;
        }) => void) | undefined;
        class?: string;
    };
    events(): {};
    slots(): {};
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
