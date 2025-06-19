interface Props {
    open?: boolean;
    notClosable?: boolean;
    onclose?: () => void;
    children: import('svelte').Snippet;
    class?: string;
}
declare const Modal: import("svelte").Component<Props, {}, "open">;
type Modal = ReturnType<typeof Modal>;
export default Modal;
