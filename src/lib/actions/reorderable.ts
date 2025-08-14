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
  itemSelector?: string
  /**
   * Optional selector for drag handles within each item. If not provided, the
   * entire item is draggable
   */
  handleSelector?: string
  /** Called when an item is dropped in a new position */
  onreorder?: (detail: ReorderEventDetail) => void
  /** Called when an item starts being dragged */
  ondragstarted?: (detail: DragEventDetail) => void
  /** Called when an item finishes being dragged */
  ondragended?: (detail: DragEventDetail) => void
}

export interface ReorderEventDetail {
  /** The element that was dragged */
  draggedElement: Element
  /** The element over which the dragged element was dropped */
  targetElement: Element
  /**
   * The position of the drop relative to the target element. -1 means before, 0
   * means after
   */
  position: -1 | 0
  /** Index of the dragged element */
  draggedIndex: number
  /** Index of the target element */
  targetIndex: number
}

export interface DragEventDetail {
  /** The element being dragged */
  draggedElement: Element
}

const REORDER_PROP = '__reorderableIndex'
const DRAG_DATA_TYPE_PREFIX = 'text/reorderable-item/'

interface ElementWithIndex extends Element {
  [REORDER_PROP]?: number
}

interface DropTargetInfo {
  targetElement: Element
  targetIndex: number
  position: -1 | 0
}

class ReorderableHandler {
  private element: HTMLElement
  private options: ReorderableOptions
  private draggedElement: Element | null = null
  private dropTargetInfo: DropTargetInfo | null = null
  private mutationObserver: MutationObserver | null = null
  private items: Element[] = []
  private indicator: HTMLElement | null = null

  constructor(element: HTMLElement, options: ReorderableOptions) {
    this.element = element
    this.options = { itemSelector: 'li', ...options }
    this.setup()
  }

  private setup() {
    // Add container class to the element
    this.element.classList.add('tint--reorderable-container')

    // Add handle class if handleSelector is provided
    if (this.options.handleSelector) {
      this.element.classList.add('tint--handle')
    }

    // Create visual drop indicator
    this.indicator = document.createElement('div')
    this.indicator.className = 'tint--reorderable-indicator'
    this.indicator.hidden = true
    this.indicator.setAttribute('aria-hidden', 'true')
    this.element.style.position = 'relative'
    this.element.appendChild(this.indicator)

    // Get initial items and make them draggable
    this.getItems()
    this.addDraggableAttribute()

    // Set up event listeners
    this.element.addEventListener('dragstart', this.onDragStart)
    this.element.addEventListener('dragover', this.onDragOver)
    this.element.addEventListener('dragleave', this.onDragLeave)
    this.element.addEventListener('dragend', this.onDragEnd)
    this.element.addEventListener('drop', this.onDrop)

    // Watch for DOM changes
    this.mutationObserver = new MutationObserver(this.onMutation)
    this.mutationObserver.observe(this.element, {
      childList: true,
      subtree: true,
    })
  }

  private getItems() {
    this.items = Array.from(
      this.element.querySelectorAll(this.options.itemSelector!),
    )
    this.items.forEach((item, i) => {
      ;(item as ElementWithIndex)[REORDER_PROP] = i
    })
  }

  private addDraggableAttribute(root?: Element) {
    const items = root
      ? this.getElementsBySelector(this.options.itemSelector!, root)
      : this.items

    for (const item of items) {
      if (item instanceof HTMLElement) {
        if (this.options.handleSelector) {
          // When handleSelector is provided, only the handles are draggable
          item.draggable = false
          const handles = item.querySelectorAll(this.options.handleSelector)
          handles.forEach((handle) => {
            if (handle instanceof HTMLElement) {
              handle.draggable = true
            }
          })
        } else {
          // When no handleSelector, the entire item is draggable
          item.draggable = true
        }
      }
    }
  }

  private getElementsBySelector(selector: string, root: Element): Element[] {
    const elements: Element[] = []
    if (root.matches(selector)) {
      elements.push(root)
    }
    elements.push(...Array.from(root.querySelectorAll(selector)))
    return elements
  }

  private getBounds(element: Element): DOMRect {
    return element.getBoundingClientRect()
  }

  private onMutation = (mutationList: MutationRecord[]) => {
    let needsUpdate = false

    for (const mutation of mutationList) {
      if (mutation.addedNodes.length || mutation.removedNodes.length) {
        needsUpdate = true
      }

      for (const addedNode of Array.from(mutation.addedNodes)) {
        if (addedNode.nodeType === Node.ELEMENT_NODE) {
          this.addDraggableAttribute(addedNode as Element)
        }
      }
    }

    if (needsUpdate) {
      this.getItems()
    }
  }

  private onDragStart = (event: DragEvent) => {
    const target = event.target as Element
    let draggedElement: Element | null = null

    if (this.options.handleSelector) {
      // If handleSelector is provided, check if the target is a handle
      const handle = target.closest(this.options.handleSelector)
      if (handle) {
        // Find the item that contains this handle
        draggedElement = handle.closest(this.options.itemSelector!)
      }
    } else {
      // If no handleSelector, find the draggable item
      draggedElement = target.closest(this.options.itemSelector!)
    }

    if (!draggedElement) {
      return
    }

    const dragIndex = this.getItemIndex(draggedElement)
    if (dragIndex === -1) {
      return
    }

    event.stopPropagation()

    this.options.ondragstarted?.({
      draggedElement,
    })

    // Set data transfer for drag operation
    if (event.dataTransfer) {
      const documentId =
        draggedElement.ownerDocument.documentElement.id || 'reorderable'
      event.dataTransfer.setData(
        `${DRAG_DATA_TYPE_PREFIX}${documentId}`,
        dragIndex.toString(),
      )
      event.dataTransfer.effectAllowed = 'move'
    }

    this.draggedElement = draggedElement
  }

  private onDragOver = (event: DragEvent) => {
    this.dropTargetInfo = this.getDropTargetInfo(event)
    if (!this.dropTargetInfo || !this.indicator) {
      if (this.indicator) {
        this.indicator.hidden = true
      }
      return
    }

    event.preventDefault()
    event.stopPropagation()

    const { targetIndex, position } = this.dropTargetInfo
    const item = this.items[targetIndex]

    if (!item) {
      this.indicator.hidden = true
      return
    }

    const containerRect = this.getBounds(this.element)
    const itemRect = this.getBounds(item)

    this.indicator.hidden = false
    if (position < 0) {
      this.indicator.style.top = `${itemRect.top - containerRect.top}px`
    } else {
      this.indicator.style.top = `${itemRect.bottom - containerRect.top}px`
    }
  }

  private onDragLeave = (event: DragEvent) => {
    const target = event.target as Element
    if (!target.matches(this.options.itemSelector!)) {
      return
    }

    let relatedTarget = event.relatedTarget as Element | null
    while (relatedTarget && relatedTarget !== this.element) {
      relatedTarget = relatedTarget.parentElement
    }

    if (relatedTarget !== this.element && this.indicator) {
      this.indicator.hidden = true
    }
  }

  private onDrop = (event: DragEvent) => {
    this.dropTargetInfo = this.getDropTargetInfo(event)
    if (!this.draggedElement || !this.dropTargetInfo) {
      return
    }

    // Don't emit the reorder event if the dragged element is dropped on itself
    if (this.draggedElement === this.dropTargetInfo.targetElement) {
      this.onDragEnd()
      return
    }

    // Don't emit the reorder event if inserting after the previous element
    // or before the next element (no actual reordering needed)
    const draggedIndex = this.getItemIndex(this.draggedElement)
    const targetIndex = this.dropTargetInfo.targetIndex
    const position = this.dropTargetInfo.position

    if (
      (position === 0 && targetIndex === draggedIndex - 1) || // Inserting after previous element
      (position === -1 && targetIndex === draggedIndex + 1) // Inserting before next element
    ) {
      this.onDragEnd()
      return
    }

    event.preventDefault()
    event.stopPropagation()

    this.options.onreorder?.({
      draggedElement: this.draggedElement,
      targetElement: this.dropTargetInfo.targetElement,
      position: this.dropTargetInfo.position,
      draggedIndex,
      targetIndex,
    })

    this.onDragEnd()
  }

  private onDragEnd = () => {
    // Sometimes dragend is not fired when the element is dropped. To ensure that
    // we clean up, onDragEnd is also called from onDrop; so it might be called
    // multiple times.
    if (this.draggedElement == null) {
      return
    }

    this.options.ondragended?.({
      draggedElement: this.draggedElement,
    })

    if (this.indicator) {
      this.indicator.hidden = true
    }
    this.draggedElement = null
  }

  private getDropTargetInfo(event: DragEvent): DropTargetInfo | null {
    const targetItem = this.getTargetItemFromEvent(event)
    if (!targetItem) {
      return null
    }

    const targetIndex = this.getItemIndex(targetItem)
    if (targetIndex === -1) {
      return null
    }

    const rect = targetItem.getBoundingClientRect()
    const threshold = rect.height * 0.5
    const position: -1 | 0 = event.clientY < rect.top + threshold ? -1 : 0

    return {
      targetElement: targetItem,
      targetIndex,
      position,
    }
  }

  private getItemIndex(item: Element): number {
    return (item as ElementWithIndex)[REORDER_PROP] ?? -1
  }

  private getTargetItemFromEvent(event: DragEvent): Element | null {
    const target = event.target as Element
    return target.closest(this.options.itemSelector!)
  }

  update(newOptions: ReorderableOptions) {
    const hadHandles = !!this.options.handleSelector
    const hasHandles = !!newOptions.handleSelector

    this.options = { itemSelector: 'li', ...newOptions }

    // Update CSS class based on handleSelector
    if (hadHandles !== hasHandles) {
      if (hasHandles) {
        this.element.classList.add('tint--handle')
      } else {
        this.element.classList.remove('tint--handle')
      }
    }

    this.getItems()
    this.addDraggableAttribute()
  }

  destroy() {
    // Remove container classes from the element
    this.element.classList.remove('tint--reorderable-container')
    this.element.classList.remove('tint--handle')

    // Clean up event listeners
    this.element.removeEventListener('dragstart', this.onDragStart)
    this.element.removeEventListener('dragover', this.onDragOver)
    this.element.removeEventListener('dragleave', this.onDragLeave)
    this.element.removeEventListener('dragend', this.onDragEnd)
    this.element.removeEventListener('drop', this.onDrop)

    // Disconnect mutation observer
    if (this.mutationObserver) {
      this.mutationObserver.disconnect()
    }

    // Remove indicator
    if (this.indicator && this.indicator.parentNode) {
      this.indicator.parentNode.removeChild(this.indicator)
    }

    // Clean up draggable attributes
    this.items.forEach((item) => {
      if (item instanceof HTMLElement) {
        item.draggable = false
        if (this.options.handleSelector) {
          const handles = item.querySelectorAll(this.options.handleSelector)
          handles.forEach((handle) => {
            if (handle instanceof HTMLElement) {
              handle.draggable = false
            }
          })
        }
      }
    })
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
export function reorderable(
  element: HTMLElement,
  options: ReorderableOptions = {},
) {
  const handler = new ReorderableHandler(element, options)

  return {
    update(newOptions: ReorderableOptions) {
      handler.update(newOptions)
    },
    destroy() {
      handler.destroy()
    },
  }
}
