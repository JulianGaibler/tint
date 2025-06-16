import { type Writable } from 'svelte/store';
export type GroupValue<T = unknown> = T | T[];
export interface GroupStore<T = unknown> extends Writable<GroupValue<T>> {
    /**
     * For radio groups: Sets the single selected value For checkbox groups:
     * Toggles the value in the array
     */
    toggle: (value: T) => void;
    /**
     * For radio groups: Checks if the value is selected For checkbox groups:
     * Checks if the value is in the array
     */
    isSelected: (value: T) => boolean;
    /**
     * For checkbox groups: Adds a value to the array if not present For radio
     * groups: Sets the value
     */
    select: (value: T) => void;
    /**
     * For checkbox groups: Removes a value from the array For radio groups:
     * Clears the selection (sets to undefined)
     */
    deselect: (value: T) => void;
    /** The type of group ('radio' or 'checkbox') */
    readonly type: 'radio' | 'checkbox';
}
/**
 * Creates a store for managing radio button groups
 *
 * @param initialValue - The initially selected value (optional)
 */
export declare function createRadioGroup<T = unknown>(initialValue?: T): GroupStore<T>;
/**
 * Creates a store for managing checkbox groups
 *
 * @param initialValues - Array of initially selected values
 */
export declare function createCheckboxGroup<T = unknown>(initialValues?: T[]): GroupStore<T>;
