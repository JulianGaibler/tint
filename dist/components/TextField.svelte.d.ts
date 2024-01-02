import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        id: string;
        value: string;
        label: string;
        helperText?: string | undefined;
        error?: string | undefined;
        disabled?: boolean | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type TextFieldProps = typeof __propDef.props;
export type TextFieldEvents = typeof __propDef.events;
export type TextFieldSlots = typeof __propDef.slots;
export default class TextField extends SvelteComponent<TextFieldProps, TextFieldEvents, TextFieldSlots> {
}
export {};
