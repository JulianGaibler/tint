let id = 0;
class ToastState {
    constructor() {
        this.toasts = [];
        this.subscribers = new Set();
    }
    subscribe(subscriber) {
        this.subscribers.add(subscriber);
        subscriber(this.toasts);
        return () => this.subscribers.delete(subscriber);
    }
    notify() {
        for (const subscriber of this.subscribers) {
            subscriber(this.toasts);
        }
    }
    addToast(toast) {
        this.toasts = [toast, ...this.toasts];
        this.notify();
    }
    update(id, data) {
        this.toasts = this.toasts.map((t) => t.id === id ? Object.assign(Object.assign(Object.assign({}, t), data), { updatedAt: Date.now() }) : t);
        this.notify();
    }
    dismiss(id) {
        if (id === undefined) {
            this.toasts = this.toasts.map((t) => (Object.assign(Object.assign({}, t), { delete: true })));
        }
        else {
            this.toasts = this.toasts.map((t) => t.id === id ? Object.assign(Object.assign({}, t), { delete: true }) : t);
        }
        this.notify();
    }
    removeToast(id) {
        this.toasts = this.toasts.filter((t) => t.id !== id);
        this.notify();
    }
}
const state = new ToastState();
function createToast(title, type, options) {
    const toastId = id++;
    const now = Date.now();
    state.addToast(Object.assign({ id: toastId, type,
        title, createdAt: now, updatedAt: now, dismissible: true }, options));
    return toastId;
}
function toast(title, options) {
    return createToast(title, 'normal', options);
}
toast.error = (title, options) => createToast(title, 'error', options);
toast.loading = (title, options) => createToast(title, 'loading', options);
toast.promise = (promise, options) => {
    const toastId = createToast(options.loading, 'loading');
    promise.then((data) => {
        const message = typeof options.success === 'function'
            ? options.success(data)
            : options.success;
        state.update(toastId, { type: 'normal', title: message });
    }, (error) => {
        const message = typeof options.error === 'function'
            ? options.error(error)
            : options.error;
        state.update(toastId, { type: 'error', title: message });
    });
    return promise;
};
toast.dismiss = (id) => state.dismiss(id);
toast.subscribe = (subscriber) => state.subscribe(subscriber);
toast._removeToast = (id) => state.removeToast(id);
export { toast };
