import type { HTMLButtonAttributes, HTMLAnchorAttributes } from 'svelte/elements';
interface Props extends HTMLButtonAttributes, HTMLAnchorAttributes {
    variant?: 'primary' | 'secondary' | 'ghost';
    small?: boolean;
    icon?: boolean;
    toggled?: boolean | undefined;
    tooltip?: string | undefined;
    external?: boolean;
    disabled?: boolean;
    loading?: boolean;
    submit?: boolean;
    title?: string | undefined;
    'aria-label'?: string | undefined;
    tabindex?: number | undefined;
    role?: string | undefined;
    'aria-checked'?: boolean | undefined;
    element?: HTMLButtonElement | HTMLAnchorElement | HTMLSpanElement | undefined;
    children?: import('svelte').Snippet;
    onclick?: (e: MouseEvent) => void;
    class?: string;
}
declare const Button: import("svelte").Component<Props, {}, "element">;
type Button = ReturnType<typeof Button>;
export default Button;
