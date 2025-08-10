import type { HTMLInputAttributes } from 'svelte/elements';
interface Props extends Omit<HTMLInputAttributes, 'value' | 'type'> {
    value: string;
    label: string;
    variant?: 'input' | 'textarea';
    rows?: number;
    maxHeight?: number;
    helperText?: string | undefined;
    error?: string | undefined;
    fillWidth?: boolean;
    element?: HTMLInputElement | HTMLTextAreaElement | undefined;
    oninput?: (e: Event) => void;
    onfocus?: (e: Event) => void;
    onblur?: (e: Event) => void;
    type?: string;
    class?: string;
}
declare const TextField: import("svelte").Component<Props, {}, "element" | "value">;
type TextField = ReturnType<typeof TextField>;
export default TextField;
