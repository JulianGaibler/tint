<script module lang="ts">
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf'
  import Menu, {
    MENU_SEPARATOR,
    type MenuItem,
  } from '$lib/components/Menu.svelte'
  import Btn from '@src/lib/components/Button.svelte'

  const { Story } = defineMeta({
    title: 'Components/Menu',
    component: Menu,
  })
</script>

<script lang="ts">
  let contextClickHandlers: ((e: Event) => void) | undefined = $state()

  const noop = () => {}

  const items: MenuItem[] = [
    {
      label: 'Item 1',
      onClick: noop,
    },
    {
      label: 'Item 2',
      checked: true,
      onClick: () => noop,
    },
    {
      label: 'Item 3',
      disabled: true,
      onClick: () => noop,
    },
    MENU_SEPARATOR,
    {
      label: 'Item 4',
      items: [
        {
          label: 'Item 4.1',
          onClick: () => noop,
        },
        {
          label: 'Item 4.2',
          onClick: () => noop,
        },
      ],
    },
    {
      label: 'Item 5',
      onClick: () => console.log('Item 5'),
    },
  ]

  setTemplate(child)
</script>

{#snippet child(args: any)}
  {#if args.variant === 'button'}
    <Btn onclick={contextClickHandlers}>Open menu</Btn>
  {:else}
    <div
      role="button"
      tabindex="0"
      class="ctx-area"
      oncontextmenu={contextClickHandlers}
    >
      Right click here
    </div>
  {/if}
  <Menu bind:contextClick={contextClickHandlers} {...args} />
{/snippet}

<!-- A menu that opens attached to the element that triggered the contextmenu event. -->
<Story name="Button" args={{ variant: 'button', items }} />

<!-- A menu that opens at the location of the mouse event. -->
<Story name="Context" args={{ variant: 'context', items }} />

<style lang="sass">
  .ctx-area
    padding: 2rem
    background: #eee
    border: 2px dashed #ccc
    user-select: none
</style>
