export type DialogResult = boolean;
export type OpenDialog = () => Promise<DialogResult>;
interface Props {
    variant?: 'transaction' | 'acknowledge';
    heading: string;
    actionLabel: string;
    openDialog?: OpenDialog;
    children: import('svelte').Snippet;
}
declare const Dialog: import("svelte").Component<Props, {}, "openDialog">;
type Dialog = ReturnType<typeof Dialog>;
export default Dialog;
