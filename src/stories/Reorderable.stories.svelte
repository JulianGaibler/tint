<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import IconDragHandle from '@lib/icons/14-drag-handle.svg?raw'
  import { fn } from 'storybook/test'

  const { Story } = defineMeta({
    title: 'Actions/Reorderable',
    parameters: {
      actions: {
        handles: ['reorder', 'dragstarted', 'dragended'],
      },
    },
  })
</script>

<script lang="ts">
  import {
    reorderable,
    type ReorderableOptions,
  } from '@src/lib/actions/reorderable'
  import Button from '@lib/components/Button.svelte'

  let items = $state(['Item 1', 'Item 2', 'Item 3', 'Item 4'])

  function handleReorder(detail: any) {
    const { draggedIndex, targetIndex, position } = detail

    // Update the items array to reflect the new order
    const newItems = [...items]
    const [draggedItem] = newItems.splice(draggedIndex, 1)

    let insertIndex = targetIndex
    if (draggedIndex < targetIndex) {
      insertIndex--
    }

    if (position === -1) {
      newItems.splice(insertIndex, 0, draggedItem)
    } else {
      newItems.splice(insertIndex + 1, 0, draggedItem)
    }

    items = newItems
  }

  function addItem() {
    items = [...items, `Item ${items.length + 1}`]
  }

  function resetItems() {
    items = ['Item 1', 'Item 2', 'Item 3', 'Item 4']
  }

  const reorderableOptions: ReorderableOptions = {
    itemSelector: 'li',
    onreorder: handleReorder,
    ondragstarted: fn().mockName('ondragstarted'),
    ondragended: fn().mockName('ondragended'),
  }

  const reorderableWithHandlesOptions: ReorderableOptions = {
    itemSelector: 'li',
    handleSelector: '.drag-handle',
    onreorder: handleReorder,
    ondragstarted: fn().mockName('ondragstarted'),
    ondragended: fn().mockName('ondragended'),
  }

  const reorderableWithKeyboardOptions: ReorderableOptions = {
    itemSelector: 'li',
    enableKeyboardReorder: true,
    onreorder: handleReorder,
    ondragstarted: fn().mockName('ondragstarted'),
    ondragended: fn().mockName('ondragended'),
  }
</script>

<!-- A list where items can be reorderable by dragging and dropping -->
<Story name="Basic List">
  <div>
    <h3 class="tint--type">Reorderable List Demo</h3>
    <p>Drag and drop items to reorder them:</p>

    <ul
      class="reorderable-list tint--card"
      use:reorderable={reorderableOptions}
    >
      {#each items as item (item)}
        <li class="list-item">
          <button class="item-content tint--type-input">
            {item}
          </button>
        </li>
      {/each}
    </ul>

    <div class="controls">
      <Button onclick={addItem}>Add Item</Button>
      <Button variant="secondary" onclick={resetItems}>Reset Order</Button>
    </div>
  </div>
</Story>

<!-- A list with drag handles where only the handles are draggable -->
<Story name="With Drag Handles">
  <div>
    <h3 class="tint--type">Reorderable List with Drag Handles</h3>
    <p>Only the ⋮⋮ handle is draggable:</p>

    <ul
      class="reorderable-list tint--card"
      use:reorderable={reorderableWithHandlesOptions}
    >
      {#each items as item (item)}
        <li class="list-item">
          <span class="drag-handle" aria-label="Drag to reorder"
            >{@html IconDragHandle}</span
          >
          <button class="item-content tint--type-input">
            {item}
          </button>
        </li>
      {/each}
    </ul>

    <div class="controls">
      <Button onclick={addItem}>Add Item</Button>
      <Button variant="secondary" onclick={resetItems}>Reset Order</Button>
    </div>
  </div>
</Story>

<!-- A list with keyboard support for reordering -->
<Story name="With Keyboard Support">
  <div>
    <h3 class="tint--type">Reorderable List with Keyboard Support</h3>
    <p>Focus an item and use Ctrl+Shift+Arrow Up/Down to reorder:</p>

    <ul
      class="reorderable-list tint--card"
      use:reorderable={reorderableWithKeyboardOptions}
    >
      {#each items as item (item)}
        <li class="list-item">
          <button class="item-content tint--type-input" tabindex="0">
            {item}
          </button>
        </li>
      {/each}
    </ul>

    <div class="controls">
      <Button onclick={addItem}>Add Item</Button>
      <Button variant="secondary" onclick={resetItems}>Reset Order</Button>
    </div>
  </div>
</Story>

<style lang="sass">
  .reorderable-list
    list-style: none
    padding: 0
    margin: 20px 0

  .list-item:not(:last-of-type)
    border-bottom: 1px solid var(--tint-card-border)

  .list-item
    display: flex
    align-items: center

  .item-content
    flex: 1
    padding: 12px 16px
    background: transparent
    border: none
    text-align: start

  .drag-handle
    padding: 12px 8px
    padding-inline-end: 0
    color: var(--tint-text-secondary)
    font-weight: bold
    user-select: none
    line-height: 1

  .controls
    display: flex
    gap: 12px
    margin: 20px 0
</style>
