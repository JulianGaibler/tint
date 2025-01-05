declare const MessageBox: import("svelte").Component<{
    icon?: string | undefined;
    dismissable?: boolean;
    element?: HTMLDivElement | undefined;
    children?: import("svelte").Snippet;
    onclose?: (e: MouseEvent) => void;
}, {}, "element">;
type MessageBox = ReturnType<typeof MessageBox>;
export default MessageBox;
