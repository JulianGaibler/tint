import type { FullAutoFill } from 'svelte/elements';
declare class __sveltets_Render<T> {
    props(): {
        id: string;
        value: T[];
        items: {
            value: T;
            label: string;
        }[];
        dynamicItems?: ((search: string) => {
            items: {
                value: T;
                label: string;
            }[];
            allowAdd?: boolean;
        } | Promise<{
            items: {
                value: T;
                label: string;
            }[];
            allowAdd?: boolean;
        }>) | undefined;
        onitemadded?: ((label: string) => void) | undefined;
        label: string;
        placeholder?: string;
        autocomplete?: FullAutoFill | undefined;
        helperText?: string | undefined;
        error?: string | undefined;
        disabled?: boolean;
        fillWidth?: boolean;
        ariaDescribedby?: string | undefined;
        element?: HTMLInputElement | undefined;
        class?: string;
    };
    events(): {};
    slots(): {};
    bindings(): "element" | "value";
    exports(): {};
}
interface $$IsomorphicComponent {
    new <T>(options: import('svelte').ComponentConstructorOptions<ReturnType<__sveltets_Render<T>['props']>>): import('svelte').SvelteComponent<ReturnType<__sveltets_Render<T>['props']>, ReturnType<__sveltets_Render<T>['events']>, ReturnType<__sveltets_Render<T>['slots']>> & {
        $$bindings?: ReturnType<__sveltets_Render<T>['bindings']>;
    } & ReturnType<__sveltets_Render<T>['exports']>;
    <T>(internal: unknown, props: ReturnType<__sveltets_Render<T>['props']> & {}): ReturnType<__sveltets_Render<T>['exports']>;
    z_$$bindings?: ReturnType<__sveltets_Render<any>['bindings']>;
}
declare const AttributePicker: $$IsomorphicComponent;
type AttributePicker<T> = InstanceType<typeof AttributePicker<T>>;
export default AttributePicker;
