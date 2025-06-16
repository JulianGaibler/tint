import { writable, type Writable } from 'svelte/store'

export type GroupValue<T = unknown> = T | T[]

export interface GroupStore<T = unknown> extends Writable<GroupValue<T>> {
  /**
   * For radio groups: Sets the single selected value For checkbox groups:
   * Toggles the value in the array
   */
  toggle: (value: T) => void

  /**
   * For radio groups: Checks if the value is selected For checkbox groups:
   * Checks if the value is in the array
   */
  isSelected: (value: T) => boolean

  /**
   * For checkbox groups: Adds a value to the array if not present For radio
   * groups: Sets the value
   */
  select: (value: T) => void

  /**
   * For checkbox groups: Removes a value from the array For radio groups:
   * Clears the selection (sets to undefined)
   */
  deselect: (value: T) => void

  /** The type of group ('radio' or 'checkbox') */
  readonly type: 'radio' | 'checkbox'
}

/**
 * Creates a store for managing radio button groups
 *
 * @param initialValue - The initially selected value (optional)
 */
export function createRadioGroup<T = unknown>(initialValue?: T): GroupStore<T> {
  const { subscribe, set, update } = writable<GroupValue<T>>(
    initialValue as GroupValue<T>,
  )

  return {
    subscribe,
    set: (value: GroupValue<T>) => set(value),
    update: (updater) => update(updater),
    type: 'radio' as const,

    toggle: (value: T) => {
      update((current) => {
        const currentValue = current as T | undefined
        return currentValue === value
          ? (undefined as GroupValue<T>)
          : (value as GroupValue<T>)
      })
    },

    isSelected: (value: T) => {
      let current: GroupValue<T> = undefined as GroupValue<T>
      const unsubscribe = subscribe((val) => (current = val))
      unsubscribe()
      return (current as T) === value
    },

    select: (value: T) => {
      set(value as GroupValue<T>)
    },

    deselect: () => {
      set(undefined as GroupValue<T>)
    },
  }
}

/**
 * Creates a store for managing checkbox groups
 *
 * @param initialValues - Array of initially selected values
 */
export function createCheckboxGroup<T = unknown>(
  initialValues: T[] = [],
): GroupStore<T> {
  const { subscribe, set, update } = writable<GroupValue<T>>(
    initialValues as GroupValue<T>,
  )

  return {
    subscribe,
    set: (value: GroupValue<T>) => set(value),
    update: (updater) => update(updater),
    type: 'checkbox' as const,

    toggle: (value: T) => {
      update((current) => {
        const currentArr = current as T[]
        const index = currentArr.indexOf(value)
        if (index >= 0) {
          return currentArr.filter((_, i) => i !== index) as GroupValue<T>
        } else {
          return [...currentArr, value] as GroupValue<T>
        }
      })
    },

    isSelected: (value: T) => {
      let current: GroupValue<T> = [] as GroupValue<T>
      const unsubscribe = subscribe((val) => (current = val))
      unsubscribe()
      return (current as T[]).includes(value)
    },

    select: (value: T) => {
      update((current) => {
        const arr = current as T[]
        if (!arr.includes(value)) {
          return [...arr, value] as GroupValue<T>
        }
        return current
      })
    },

    deselect: (value: T) => {
      update((current) => {
        const arr = current as T[]
        return arr.filter((item) => item !== value) as GroupValue<T>
      })
    },
  }
}
