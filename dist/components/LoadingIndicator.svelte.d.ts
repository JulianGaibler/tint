interface Props {
    size?: 16 | 24 | 32 | 48 | 64;
    outline?: boolean;
    label?: string;
    class?: string;
}
declare const LoadingIndicator: import("svelte").Component<Props, {}, "">;
type LoadingIndicator = ReturnType<typeof LoadingIndicator>;
export default LoadingIndicator;
