import type { ToastData, ExternalToastOptions, ToastPromiseOptions } from '../components/toast/types.js';
type Subscriber = (toasts: ToastData[]) => void;
declare function toast(title: string, options?: ExternalToastOptions): number;
declare namespace toast {
    var error: (title: string, options?: ExternalToastOptions) => number;
    var loading: (title: string, options?: ExternalToastOptions) => number;
    var promise: <T>(promise: Promise<T>, options: ToastPromiseOptions<T>) => Promise<T>;
    var dismiss: (id?: number) => void;
    var subscribe: (subscriber: Subscriber) => () => void;
    var _removeToast: (id: number) => void;
}
export { toast };
export type { ToastData, ToastType, ToastPosition, ToastAction, ExternalToastOptions, ToastPromiseOptions, } from '../components/toast/types.js';
