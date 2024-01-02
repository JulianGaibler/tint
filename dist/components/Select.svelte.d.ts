import { SvelteComponent } from "svelte";
declare class __sveltets_Render<T> {
    props(): {
        id: string;
        value: T | undefined;
        items: {
            value: T;
            label: string;
            disabled?: boolean | undefined;
        }[];
        label: string;
        helperText?: string | undefined;
        error?: string | undefined;
        disabled?: boolean | undefined;
    };
    events(): {} & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {};
}
export type SelectProps<T> = ReturnType<__sveltets_Render<T>['props']>;
export type SelectEvents<T> = ReturnType<__sveltets_Render<T>['events']>;
export type SelectSlots<T> = ReturnType<__sveltets_Render<T>['slots']>;
export default class Select<T> extends SvelteComponent<SelectProps<T>, SelectEvents<T>, SelectSlots<T>> {
}
export {};
