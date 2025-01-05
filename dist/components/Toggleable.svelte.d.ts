declare const Toggleable: import("svelte").Component<{
    id: string;
    type?: "checkbox" | "radio" | "switch";
    checked: boolean;
    disabled?: boolean;
    ariaLabel?: string | undefined;
    ariaLabelledby?: string | undefined;
    ariaDescribedby?: string | undefined;
    element?: HTMLInputElement | HTMLButtonElement | undefined;
    onchange?: (checked: boolean) => void;
}, {}, "element" | "checked">;
type Toggleable = ReturnType<typeof Toggleable>;
export default Toggleable;
