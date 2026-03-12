import type { ToastData, ToastPosition } from './types.js';
interface Props {
    toastData: ToastData;
    expanded: boolean;
    position: ToastPosition;
    visibleToasts: number;
    activeHeights: {
        id: number;
        height: number;
    }[];
    setHeight: (id: number, height: number) => void;
    removeHeight: (id: number) => void;
    defaultCloseButton: boolean;
    gap: number;
    defaultDuration: number;
    frontToastHeight: number;
    onSwipeStart?: () => void;
    onSwipeEnd?: () => void;
    onRemoveStart?: () => void;
    onRemoveEnd?: () => void;
}
declare const ToastItem: import("svelte").Component<Props, {}, "">;
type ToastItem = ReturnType<typeof ToastItem>;
export default ToastItem;
