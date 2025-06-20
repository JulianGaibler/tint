interface Props {
    icon?: string | undefined;
    element?: HTMLDivElement | undefined;
    children?: import('svelte').Snippet;
    onclose?: (e: MouseEvent) => void;
    class?: string;
}
declare const MessageBox: import("svelte").Component<Props, {}, "element">;
type MessageBox = ReturnType<typeof MessageBox>;
export default MessageBox;
