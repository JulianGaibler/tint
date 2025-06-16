import { writable } from 'svelte/store';
/**
 * Creates a store for managing radio button groups
 *
 * @param initialValue - The initially selected value (optional)
 */
export function createRadioGroup(initialValue) {
    const { subscribe, set, update } = writable(initialValue);
    return {
        subscribe,
        set: (value) => set(value),
        update: (updater) => update(updater),
        type: 'radio',
        toggle: (value) => {
            update((current) => {
                const currentValue = current;
                return currentValue === value
                    ? undefined
                    : value;
            });
        },
        isSelected: (value) => {
            let current = undefined;
            const unsubscribe = subscribe((val) => (current = val));
            unsubscribe();
            return current === value;
        },
        select: (value) => {
            set(value);
        },
        deselect: () => {
            set(undefined);
        },
    };
}
/**
 * Creates a store for managing checkbox groups
 *
 * @param initialValues - Array of initially selected values
 */
export function createCheckboxGroup(initialValues = []) {
    const { subscribe, set, update } = writable(initialValues);
    return {
        subscribe,
        set: (value) => set(value),
        update: (updater) => update(updater),
        type: 'checkbox',
        toggle: (value) => {
            update((current) => {
                const currentArr = current;
                const index = currentArr.indexOf(value);
                if (index >= 0) {
                    return currentArr.filter((_, i) => i !== index);
                }
                else {
                    return [...currentArr, value];
                }
            });
        },
        isSelected: (value) => {
            let current = [];
            const unsubscribe = subscribe((val) => (current = val));
            unsubscribe();
            return current.includes(value);
        },
        select: (value) => {
            update((current) => {
                const arr = current;
                if (!arr.includes(value)) {
                    return [...arr, value];
                }
                return current;
            });
        },
        deselect: (value) => {
            update((current) => {
                const arr = current;
                return arr.filter((item) => item !== value);
            });
        },
    };
}
