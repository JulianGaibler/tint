import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        id: string;
        value?: File | undefined;
        label: string;
        accept?: string | string[] | undefined;
        helperText?: string | undefined;
        error?: string | undefined;
        disabled?: boolean | undefined;
        fillWidth?: boolean | undefined;
        ariaDescribedby?: string | undefined;
        element?: HTMLInputElement | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type FileInputProps = typeof __propDef.props;
export type FileInputEvents = typeof __propDef.events;
export type FileInputSlots = typeof __propDef.slots;
export default class FileInput extends SvelteComponent<FileInputProps, FileInputEvents, FileInputSlots> {
}
export {};
