/**
 * A Svelte action that makes items inside an element reorderable via drag and
 * drop. Based on Mozilla's moz-reorderable-list implementation.
 *
 * @param element - The container element that will have reorderable children
 * @param options - Configuration options for the reorderable behavior
 * @returns Action object with update and destroy methods
 */
export interface ReorderableOptions {
    /** Selector for elements that should be reorderable. Defaults to "li" */
    itemSelector?: string;
    /** Called when an item is dropped in a new position */
    onreorder?: (detail: ReorderEventDetail) => void;
    /** Called when an item starts being dragged */
    ondragstarted?: (detail: DragEventDetail) => void;
    /** Called when an item finishes being dragged */
    ondragended?: (detail: DragEventDetail) => void;
}
export interface ReorderEventDetail {
    /** The element that was dragged */
    draggedElement: Element;
    /** The element over which the dragged element was dropped */
    targetElement: Element;
    /**
     * The position of the drop relative to the target element. -1 means before, 0
     * means after
     */
    position: -1 | 0;
    /** Index of the dragged element */
    draggedIndex: number;
    /** Index of the target element */
    targetIndex: number;
}
export interface DragEventDetail {
    /** The element being dragged */
    draggedElement: Element;
}
/**
 * Svelte action to make items inside an element reorderable via drag and drop.
 *
 * Usage:
 *
 * ```svelte
 * ;<ul
 *   use:reorderable={{
 *     itemSelector: 'li',
 *     onreorder: (detail) => {
 *       // Handle reorder event
 *       console.log(
 *         'Moved item from',
 *         detail.draggedIndex,
 *         'to',
 *         detail.targetIndex,
 *       )
 *     },
 *   }}
 * >
 *   <li>Item 1</li>
 *   <li>Item 2</li>
 *   <li>Item 3</li>
 * </ul>
 * ```
 *
 * @param element - The container element
 * @param options - Configuration options
 */
export declare function reorderable(element: HTMLElement, options?: ReorderableOptions): {
    update(newOptions: ReorderableOptions): void;
    destroy(): void;
};
