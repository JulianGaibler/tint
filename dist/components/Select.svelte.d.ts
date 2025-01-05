declare class __sveltets_Render<T> {
    props(): {
        id: string;
        value: T | undefined;
        items: {
            value: T;
            label: string;
            disabled?: boolean;
        }[];
        label: string;
        helperText?: string | undefined;
        error?: string | undefined;
        disabled?: boolean;
        fillWidth?: boolean;
        ariaDescribedby?: string | undefined;
        element?: HTMLSelectElement | undefined;
        onchange?: ((e: Event) => void) | undefined;
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
declare const Select: $$IsomorphicComponent;
type Select<T> = InstanceType<typeof Select<T>>;
export default Select;
