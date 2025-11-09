interface Props {
    id: string;
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    showSteps?: boolean;
    small?: boolean;
    element?: HTMLInputElement | undefined;
    onchange?: (event: {
        value: number;
    }) => void;
    oninput?: (event: {
        value: number;
    }) => void;
    'aria-label'?: string | undefined;
    'aria-labelledby'?: string | undefined;
    'aria-describedby'?: string | undefined;
    class?: string;
}
declare const Slider: import("svelte").Component<Props, {}, "element" | "value">;
type Slider = ReturnType<typeof Slider>;
export default Slider;
