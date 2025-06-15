/**
 * A Svelte action that makes items inside an element reorderable via drag and
 * drop. Based on Mozilla's moz-reorderable-list implementation.
 *
 * @param element - The container element that will have reorderable children
 * @param options - Configuration options for the reorderable behavior
 * @returns Action object with update and destroy methods
 */
const REORDER_PROP = '__reorderableIndex';
const DRAG_DATA_TYPE_PREFIX = 'text/reorderable-item/';
class ReorderableHandler {
    constructor(element, options) {
        this.draggedElement = null;
        this.dropTargetInfo = null;
        this.mutationObserver = null;
        this.items = [];
        this.indicator = null;
        this.onMutation = (mutationList) => {
            let needsUpdate = false;
            for (const mutation of mutationList) {
                if (mutation.addedNodes.length || mutation.removedNodes.length) {
                    needsUpdate = true;
                }
                for (const addedNode of Array.from(mutation.addedNodes)) {
                    if (addedNode.nodeType === Node.ELEMENT_NODE) {
                        this.addDraggableAttribute(addedNode);
                    }
                }
            }
            if (needsUpdate) {
                this.getItems();
            }
        };
        this.onDragStart = (event) => {
            var _a, _b;
            const target = event.target;
            const draggedElement = target.closest(this.options.itemSelector);
            if (!draggedElement) {
                return;
            }
            const dragIndex = this.getItemIndex(draggedElement);
            if (dragIndex === -1) {
                return;
            }
            event.stopPropagation();
            (_b = (_a = this.options).ondragstarted) === null || _b === void 0 ? void 0 : _b.call(_a, {
                draggedElement,
            });
            // Set data transfer for drag operation
            if (event.dataTransfer) {
                const documentId = draggedElement.ownerDocument.documentElement.id || 'reorderable';
                event.dataTransfer.setData(`${DRAG_DATA_TYPE_PREFIX}${documentId}`, dragIndex.toString());
                event.dataTransfer.effectAllowed = 'move';
            }
            this.draggedElement = draggedElement;
        };
        this.onDragOver = (event) => {
            this.dropTargetInfo = this.getDropTargetInfo(event);
            if (!this.dropTargetInfo || !this.indicator) {
                if (this.indicator) {
                    this.indicator.hidden = true;
                }
                return;
            }
            event.preventDefault();
            event.stopPropagation();
            const { targetIndex, position } = this.dropTargetInfo;
            const item = this.items[targetIndex];
            if (!item) {
                this.indicator.hidden = true;
                return;
            }
            const containerRect = this.getBounds(this.element);
            const itemRect = this.getBounds(item);
            this.indicator.hidden = false;
            if (position < 0) {
                this.indicator.style.top = `${itemRect.top - containerRect.top}px`;
            }
            else {
                this.indicator.style.top = `${itemRect.bottom - containerRect.top}px`;
            }
        };
        this.onDragLeave = (event) => {
            const target = event.target;
            if (!target.matches(this.options.itemSelector)) {
                return;
            }
            let relatedTarget = event.relatedTarget;
            while (relatedTarget && relatedTarget !== this.element) {
                relatedTarget = relatedTarget.parentElement;
            }
            if (relatedTarget !== this.element && this.indicator) {
                this.indicator.hidden = true;
            }
        };
        this.onDrop = (event) => {
            var _a, _b;
            this.dropTargetInfo = this.getDropTargetInfo(event);
            if (!this.draggedElement || !this.dropTargetInfo) {
                return;
            }
            // Don't emit the reorder event if the dragged element is dropped on itself
            if (this.draggedElement === this.dropTargetInfo.targetElement) {
                this.onDragEnd();
                return;
            }
            // Don't emit the reorder event if inserting after the previous element
            // or before the next element (no actual reordering needed)
            const draggedIndex = this.getItemIndex(this.draggedElement);
            const targetIndex = this.dropTargetInfo.targetIndex;
            const position = this.dropTargetInfo.position;
            if ((position === 0 && targetIndex === draggedIndex - 1) || // Inserting after previous element
                (position === -1 && targetIndex === draggedIndex + 1) // Inserting before next element
            ) {
                this.onDragEnd();
                return;
            }
            event.preventDefault();
            event.stopPropagation();
            (_b = (_a = this.options).onreorder) === null || _b === void 0 ? void 0 : _b.call(_a, {
                draggedElement: this.draggedElement,
                targetElement: this.dropTargetInfo.targetElement,
                position: this.dropTargetInfo.position,
                draggedIndex,
                targetIndex,
            });
            this.onDragEnd();
        };
        this.onDragEnd = () => {
            var _a, _b;
            // Sometimes dragend is not fired when the element is dropped. To ensure that
            // we clean up, onDragEnd is also called from onDrop; so it might be called
            // multiple times.
            if (this.draggedElement == null) {
                return;
            }
            (_b = (_a = this.options).ondragended) === null || _b === void 0 ? void 0 : _b.call(_a, {
                draggedElement: this.draggedElement,
            });
            if (this.indicator) {
                this.indicator.hidden = true;
            }
            this.draggedElement = null;
        };
        this.element = element;
        this.options = Object.assign({ itemSelector: 'li' }, options);
        this.setup();
    }
    setup() {
        // Add container class to the element
        this.element.classList.add('tint--reorderable-container');
        // Create visual drop indicator
        this.indicator = document.createElement('div');
        this.indicator.className = 'tint--reorderable-indicator';
        this.indicator.hidden = true;
        this.indicator.setAttribute('aria-hidden', 'true');
        this.element.style.position = 'relative';
        this.element.appendChild(this.indicator);
        // Get initial items and make them draggable
        this.getItems();
        this.addDraggableAttribute();
        // Set up event listeners
        this.element.addEventListener('dragstart', this.onDragStart);
        this.element.addEventListener('dragover', this.onDragOver);
        this.element.addEventListener('dragleave', this.onDragLeave);
        this.element.addEventListener('dragend', this.onDragEnd);
        this.element.addEventListener('drop', this.onDrop);
        // Watch for DOM changes
        this.mutationObserver = new MutationObserver(this.onMutation);
        this.mutationObserver.observe(this.element, {
            childList: true,
            subtree: true,
        });
    }
    getItems() {
        this.items = Array.from(this.element.querySelectorAll(this.options.itemSelector));
        this.items.forEach((item, i) => {
            ;
            item[REORDER_PROP] = i;
        });
    }
    addDraggableAttribute(root) {
        const items = root
            ? this.getElementsBySelector(this.options.itemSelector, root)
            : this.items;
        for (const item of items) {
            if (item instanceof HTMLElement) {
                item.draggable = true;
            }
        }
    }
    getElementsBySelector(selector, root) {
        const elements = [];
        if (root.matches(selector)) {
            elements.push(root);
        }
        elements.push(...Array.from(root.querySelectorAll(selector)));
        return elements;
    }
    getBounds(element) {
        return element.getBoundingClientRect();
    }
    getDropTargetInfo(event) {
        const targetItem = this.getTargetItemFromEvent(event);
        if (!targetItem) {
            return null;
        }
        const targetIndex = this.getItemIndex(targetItem);
        if (targetIndex === -1) {
            return null;
        }
        const rect = targetItem.getBoundingClientRect();
        const threshold = rect.height * 0.5;
        const position = event.clientY < rect.top + threshold ? -1 : 0;
        return {
            targetElement: targetItem,
            targetIndex,
            position,
        };
    }
    getItemIndex(item) {
        var _a;
        return (_a = item[REORDER_PROP]) !== null && _a !== void 0 ? _a : -1;
    }
    getTargetItemFromEvent(event) {
        const target = event.target;
        return target.closest(this.options.itemSelector);
    }
    update(newOptions) {
        this.options = Object.assign({ itemSelector: 'li' }, newOptions);
        this.getItems();
        this.addDraggableAttribute();
    }
    destroy() {
        // Remove container class from the element
        this.element.classList.remove('tint--reorderable-container');
        // Clean up event listeners
        this.element.removeEventListener('dragstart', this.onDragStart);
        this.element.removeEventListener('dragover', this.onDragOver);
        this.element.removeEventListener('dragleave', this.onDragLeave);
        this.element.removeEventListener('dragend', this.onDragEnd);
        this.element.removeEventListener('drop', this.onDrop);
        // Disconnect mutation observer
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
        }
        // Remove indicator
        if (this.indicator && this.indicator.parentNode) {
            this.indicator.parentNode.removeChild(this.indicator);
        }
        // Clean up draggable attributes
        this.items.forEach((item) => {
            if (item instanceof HTMLElement) {
                item.draggable = false;
            }
        });
    }
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
export function reorderable(element, options = {}) {
    const handler = new ReorderableHandler(element, options);
    return {
        update(newOptions) {
            handler.update(newOptions);
        },
        destroy() {
            handler.destroy();
        },
    };
}
