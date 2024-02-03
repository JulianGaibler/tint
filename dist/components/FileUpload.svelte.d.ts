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
export type FileUploadProps = typeof __propDef.props;
export type FileUploadEvents = typeof __propDef.events;
export type FileUploadSlots = typeof __propDef.slots;
export default class FileUpload extends SvelteComponent<FileUploadProps, FileUploadEvents, FileUploadSlots> {
}
export {};
