<script context="module" lang="ts">
  import Menu, {
    MENU_SEPARATOR,
    type MenuItem,
  } from '@lib/components/Menu.svelte'
  import Btn from '@src/lib/components/Button.svelte'

  export const meta = {
    title: 'Components/Menu',
    component: Menu,
    argTypes: {
      variant: {
        control: 'inline-radio',
        options: ['context', 'button'],
      },
      items: {
        control: 'object',
      },
    },
  }
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf'

  let contextClickHandlers: (e: Event) => void

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
</script>

<Template let:args>
  {#if args.variant === 'button'}
    <Btn on:click={contextClickHandlers}>Open menu</Btn>
  {:else}
    <div
      role="button"
      tabindex="0"
      class="ctx-area"
      on:contextmenu={contextClickHandlers}
    >
      Right click here
    </div>
  {/if}
  <Menu bind:contextClick={contextClickHandlers} {...args} />
</Template>

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
