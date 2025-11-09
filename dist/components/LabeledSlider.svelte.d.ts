import type { Snippet } from 'svelte';
interface Props {
    id: string;
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    showSteps?: boolean;
    small?: boolean;
    label?: string | undefined;
    icon?: string | undefined;
    description?: string | undefined;
    element?: HTMLInputElement | undefined;
    onchange?: (event: {
        value: number;
    }) => void;
    oninput?: (event: {
        value: number;
    }) => void;
    labelSlot?: Snippet;
    descriptionSlot?: Snippet;
    children?: Snippet;
    class?: string;
}
declare const LabeledSlider: import("svelte").Component<Props, {}, "element" | "value">;
type LabeledSlider = ReturnType<typeof LabeledSlider>;
export default LabeledSlider;
