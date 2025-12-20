declare function $$render<T>(): {
    props: {
        id: string;
        value: T | undefined;
        items: {
            value: T;
            label?: string;
            icon?: string;
            'aria-label'?: string;
            title?: string;
            disabled?: boolean;
            class?: string;
            tooltip?: string;
        }[];
        label?: string | undefined;
        'aria-labelledby'?: string | undefined;
        disabled?: boolean;
        small?: boolean;
        'aria-describedby'?: string | undefined;
        element?: HTMLFieldSetElement | undefined;
        onchange?: (value: T) => void;
        class?: string;
    };
    exports: {};
    bindings: "element" | "value";
    slots: {};
    events: {};
};
declare class __sveltets_Render<T> {
    props(): ReturnType<typeof $$render<T>>['props'];
    events(): ReturnType<typeof $$render<T>>['events'];
    slots(): ReturnType<typeof $$render<T>>['slots'];
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
declare const SegmentedControl: $$IsomorphicComponent;
type SegmentedControl<T> = InstanceType<typeof SegmentedControl<T>>;
export default SegmentedControl;
