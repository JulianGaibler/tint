export type ToastType = 'normal' | 'error' | 'loading'

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

export interface ToastAction {
  label: string
  onClick: () => void
}

export interface ToastData {
  id: number
  type: ToastType
  title: string
  description?: string
  icon?: string
  closeButton?: boolean
  action?: ToastAction
  cancel?: ToastAction
  duration?: number
  dismissible?: boolean
  onDismiss?: (toast: ToastData) => void
  onAutoClose?: (toast: ToastData) => void

  // Internal
  createdAt: number
  updatedAt: number
  height?: number
  delete?: boolean
  position?: ToastPosition
}

export type ExternalToastOptions = Partial<
  Omit<
    ToastData,
    'id' | 'createdAt' | 'updatedAt' | 'height' | 'delete' | 'title'
  >
>

export interface ToastPromiseOptions<T> {
  loading: string
  success: string | ((data: T) => string)
  error: string | ((error: unknown) => string)
  finally?: string | (() => string)
}
