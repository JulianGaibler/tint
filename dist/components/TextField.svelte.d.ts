import type { FullAutoFill } from 'svelte/elements';
interface Props {
    id: string;
    value: string;
    label: string;
    autocomplete?: FullAutoFill | undefined;
    type?: string | undefined;
    helperText?: string | undefined;
    error?: string | undefined;
    disabled?: boolean;
    fillWidth?: boolean;
    ariaDescribedby?: string | undefined;
    element?: HTMLInputElement | undefined;
}
declare const TextField: import("svelte").Component<Props, {}, "element" | "value">;
type TextField = ReturnType<typeof TextField>;
export default TextField;
