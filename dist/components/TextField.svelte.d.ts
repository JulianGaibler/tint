import type { FullAutoFill } from 'svelte/elements';
interface Props {
    id: string;
    value: string;
    label: string;
    autocomplete?: FullAutoFill | undefined;
    variant?: 'input' | 'textarea';
    type?: string | undefined;
    rows?: number;
    maxHeight?: number;
    helperText?: string | undefined;
    error?: string | undefined;
    disabled?: boolean;
    fillWidth?: boolean;
    ariaDescribedby?: string | undefined;
    element?: HTMLInputElement | HTMLTextAreaElement | undefined;
    oninput?: (e: Event) => void;
    onfocus?: (e: Event) => void;
    onblur?: (e: Event) => void;
    class?: string;
}
declare const TextField: import("svelte").Component<Props, {}, "element" | "value">;
type TextField = ReturnType<typeof TextField>;
export default TextField;
