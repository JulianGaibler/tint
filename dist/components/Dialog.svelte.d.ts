export type DialogResult = boolean;
export interface DialogOptions {
    heading?: string;
    actionLabel?: string;
    children?: string | import('svelte').Snippet;
}
export type OpenDialog = (options?: DialogOptions) => Promise<DialogResult>;
interface Props {
    variant?: 'transaction' | 'acknowledge';
    heading?: string;
    actionLabel?: string;
    openDialog?: OpenDialog;
    children?: import('svelte').Snippet;
}
declare const Dialog: import("svelte").Component<Props, {}, "openDialog">;
type Dialog = ReturnType<typeof Dialog>;
export default Dialog;
