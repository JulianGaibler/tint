import type { Snippet } from 'svelte';
interface Props {
    for: string;
    id: string;
    label?: string | undefined;
    icon?: string | undefined;
    description?: string | undefined;
    descriptionId?: string | undefined;
    labelSlot?: Snippet;
    descriptionSlot?: Snippet;
    children?: Snippet;
    disabled?: boolean;
    class?: string;
}
declare const Label: import("svelte").Component<Props, {}, "">;
type Label = ReturnType<typeof Label>;
export default Label;
