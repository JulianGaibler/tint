<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
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

<style lang="sass">
  .reorderable-list
    list-style: none
    padding: 0
    margin: 20px 0

  .list-item:not(:last-of-type)
    border-bottom: 1px solid var(--tint-card-border)

  .item-content
    width: 100%
    padding: 12px 16px
    background: transparent
    border: none
    text-align: left

  .controls
    display: flex
    gap: 12px
    margin: 20px 0
</style>
