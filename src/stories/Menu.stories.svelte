<script module lang="ts">
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf'
  import Menu, {
    MENU_SEPARATOR,
    type MenuItem,
  } from '@lib/components/Menu.svelte'
  import Btn from '@src/lib/components/Button.svelte'
  import StarIcon from '@lib/icons/20-crown.svg?raw'
  import InfoIcon from '@lib/icons/20-info.svg?raw'

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

  const itemsWithIcons: MenuItem[] = [
    {
      label: 'Starred',
      icon: StarIcon,
      onClick: noop,
    },
    {
      label: 'Information',
      icon: InfoIcon,
      checked: true,
      onClick: () => noop,
    },
    {
      label: 'Disabled Item',
      icon: StarIcon,
      disabled: true,
      onClick: () => noop,
    },
    MENU_SEPARATOR,
    {
      label: 'More Options',
      icon: InfoIcon,
      items: [
        {
          label: 'Sub Item 1',
          icon: StarIcon,
          onClick: () => noop,
        },
        {
          label: 'Sub Item 2',
          icon: InfoIcon,
          onClick: () => noop,
        },
      ],
    },
  ]

  const itemsHiddenGutter: MenuItem[] = [
    {
      label: 'Home',
      icon: StarIcon,
      onClick: noop,
    },
    {
      label: 'Settings',
      icon: InfoIcon,
      onClick: () => noop,
    },
    {
      label: 'Profile',
      onClick: () => noop,
    },
    MENU_SEPARATOR,
    {
      label: 'Help',
      icon: InfoIcon,
      onClick: () => noop,
    },
    {
      label: 'About',
      icon: StarIcon,
      disabled: true,
      onClick: () => noop,
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

<!-- A menu with animation enabled (default behavior) -->
<Story name="Animated" args={{ variant: 'button', items, animated: true }} />

<!-- A menu with large size for more spacing -->
<Story name="Large size" args={{ variant: 'button', items, size: 'large' }} />

<!-- A menu with icons in menu items -->
<Story name="With icons" args={{ variant: 'button', items: itemsWithIcons }} />

<!-- A menu with hidden gutter (no checkboxes or submenu indicators) -->
<Story
  name="Hidden gutter"
  args={{
    variant: 'button',
    items: itemsHiddenGutter,
    hideGutter: true,
    size: 'large',
    animated: true,
  }}
/>

<style lang="sass">
  .ctx-area
    padding: 2rem
    background: #eee
    border: 2px dashed #ccc
    user-select: none
</style>
