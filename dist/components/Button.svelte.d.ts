import type { HTMLButtonAttributes } from 'svelte/elements';
interface Props extends HTMLButtonAttributes {
    variant?: 'primary' | 'secondary' | 'ghost';
    small?: boolean;
    icon?: boolean;
    toggled?: boolean | undefined;
    href?: string | undefined;
    external?: boolean;
    download?: string | undefined;
    disabled?: boolean;
    loading?: boolean;
    submit?: boolean;
    title?: string | undefined;
    ariaLabel?: string | undefined;
    tabindex?: number | undefined;
    element?: HTMLButtonElement | HTMLAnchorElement | HTMLSpanElement | undefined;
    children?: import('svelte').Snippet;
    onclick?: (e: MouseEvent) => void;
    class?: string;
}
declare const Button: import("svelte").Component<Props, {}, "element">;
type Button = ReturnType<typeof Button>;
export default Button;
