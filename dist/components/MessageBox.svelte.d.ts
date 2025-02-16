interface Props {
    icon?: string | undefined;
    dismissable?: boolean;
    element?: HTMLDivElement | undefined;
    children?: import('svelte').Snippet;
    onclose?: (e: MouseEvent) => void;
}
declare const MessageBox: import("svelte").Component<Props, {}, "element">;
type MessageBox = ReturnType<typeof MessageBox>;
export default MessageBox;
