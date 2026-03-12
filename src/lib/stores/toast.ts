import type {
  ToastData,
  ToastType,
  ExternalToastOptions,
  ToastPromiseOptions,
} from '../components/toast/types.js'

type Subscriber = (toasts: ToastData[]) => void

let id = 0

class ToastState {
  toasts: ToastData[] = []
  subscribers: Set<Subscriber> = new Set()

  subscribe(subscriber: Subscriber): () => void {
    this.subscribers.add(subscriber)
    subscriber(this.toasts)
    return () => this.subscribers.delete(subscriber)
  }

  private notify() {
    for (const subscriber of this.subscribers) {
      subscriber(this.toasts)
    }
  }

  addToast(toast: ToastData) {
    this.toasts = [toast, ...this.toasts]
    this.notify()
  }

  update(id: number, data: Partial<ToastData>) {
    this.toasts = this.toasts.map((t) =>
      t.id === id ? { ...t, ...data, updatedAt: Date.now() } : t,
    )
    this.notify()
  }

  dismiss(id?: number) {
    if (id === undefined) {
      this.toasts = this.toasts.map((t) => ({ ...t, delete: true }))
    } else {
      this.toasts = this.toasts.map((t) =>
        t.id === id ? { ...t, delete: true } : t,
      )
    }
    this.notify()
  }

  removeToast(id: number) {
    this.toasts = this.toasts.filter((t) => t.id !== id)
    this.notify()
  }
}

const state = new ToastState()

function createToast(
  title: string,
  type: ToastType,
  options?: ExternalToastOptions,
): number {
  const toastId = id++
  const now = Date.now()
  state.addToast({
    id: toastId,
    type,
    title,
    createdAt: now,
    updatedAt: now,
    dismissible: true,
    ...options,
  })
  return toastId
}

function toast(title: string, options?: ExternalToastOptions): number {
  return createToast(title, 'normal', options)
}

toast.error = (title: string, options?: ExternalToastOptions) =>
  createToast(title, 'error', options)

toast.loading = (title: string, options?: ExternalToastOptions) =>
  createToast(title, 'loading', options)

toast.promise = <T>(
  promise: Promise<T>,
  options: ToastPromiseOptions<T>,
): Promise<T> => {
  const toastId = createToast(options.loading, 'loading')

  promise.then(
    (data) => {
      const message =
        typeof options.success === 'function'
          ? options.success(data)
          : options.success
      state.update(toastId, { type: 'normal', title: message })
    },
    (error) => {
      const message =
        typeof options.error === 'function'
          ? options.error(error)
          : options.error
      state.update(toastId, { type: 'error', title: message })
    },
  )

  return promise
}

toast.dismiss = (id?: number) => state.dismiss(id)

toast.subscribe = (subscriber: Subscriber) => state.subscribe(subscriber)

toast._removeToast = (id: number) => state.removeToast(id)

export { toast }

export type {
  ToastData,
  ToastType,
  ToastPosition,
  ToastAction,
  ExternalToastOptions,
  ToastPromiseOptions,
} from '../components/toast/types.js'
