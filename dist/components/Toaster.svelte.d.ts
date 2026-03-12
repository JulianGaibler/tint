import type { ToastPosition } from './toast/types.js';
interface Props {
    /** Toast position on screen */
    position?: ToastPosition;
    /** Whether toasts are expanded by default */
    expand?: boolean;
    /** Show close button on all toasts */
    closeButton?: boolean;
    /** Default toast duration in ms */
    duration?: number;
    /** Maximum visible toasts in the stack */
    visibleToasts?: number;
    /** Gap between toasts in px */
    gap?: number;
    /** Offset from viewport edge */
    offset?: string;
    /** A space separated list of CSS classes */
    class?: string;
}
declare const Toaster: import("svelte").Component<Props, {}, "">;
type Toaster = ReturnType<typeof Toaster>;
export default Toaster;
