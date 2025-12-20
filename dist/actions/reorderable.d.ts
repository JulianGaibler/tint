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
    /**
     * Optional selector for drag handles within each item. If not provided, the
     * entire item is draggable
     */
    handleSelector?: string;
    /** Called when an item is dropped in a new position */
    onreorder?: (detail: ReorderEventDetail) => void;
    /** Called when an item starts being dragged */
    ondragstarted?: (detail: DragEventDetail) => void;
    /** Called when an item finishes being dragged */
    ondragended?: (detail: DragEventDetail) => void;
    /** Enable keyboard reordering with Ctrl+Shift+Arrow keys. Defaults to true */
    enableKeyboardReorder?: boolean;
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
 * Checks if the given keyboard event is a reorder keyboard event
 * (ctrl+shift+up/down).
 *
 * Can be used instead of the automatic reorder keyboard event handling by the
 * reorderable action.
 *
 * @param event - The keyboard event to check
 * @returns 0 if the event is not a reorder keyboard event, -1 if the event is a
 *   reorder up event, 1 if the event is a reorder down event
 */
export declare function isReorderKeyboardEvent(event: KeyboardEvent): 0 | -1 | 1;
/**
 * Svelte action to make items inside an element reorderable via drag and drop.
 *
 * Usage:
 *
 * ```tsx
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
