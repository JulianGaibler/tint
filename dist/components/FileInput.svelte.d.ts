interface Props {
    id: string;
    value?: File | undefined;
    label: string;
    accept?: string | string[] | undefined;
    helperText?: string | undefined;
    error?: string | undefined;
    disabled?: boolean;
    fillWidth?: boolean;
    ariaDescribedby?: string | undefined;
    element?: HTMLInputElement | undefined;
    class?: string;
}
declare const FileInput: import("svelte").Component<Props, {}, "element" | "value">;
type FileInput = ReturnType<typeof FileInput>;
export default FileInput;
