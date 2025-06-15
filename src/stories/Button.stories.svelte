<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import Button from '@lib/components/Button.svelte'
  import { fn } from 'storybook/test'
  import IconHome from '@lib/icons/20-home.svg?raw'

  const { Story } = defineMeta({
    title: 'Components/Button',
    component: Button,
    render: child,
    argTypes: {
      toggled: {
        control: 'boolean',
        defaultValue: undefined,
      },
      href: {
        control: 'text',
      },
      external: {
        control: 'boolean',
        if: { arg: 'href' },
      },
      download: {
        control: 'text',
        if: { arg: 'href' },
      },
    },
    args: {
      onclick: fn(),
      onkeypress: fn(),
      onkeydown: fn(),
    },
  })
</script>

{#snippet child(args: any)}
  <Button {...args}>
    {#if args.icon}
      {@html IconHome}
    {:else}
      Hello!
    {/if}
  </Button>
{/snippet}

<!-- Default button with text -->
<Story
  name="Primary"
  args={{ variant: 'primary', small: false, disabled: false, icon: false }}
/>

<!-- Secondary button with text -->
<Story
  name="Secondary"
  args={{ variant: 'secondary', small: false, disabled: false, icon: false }}
/>

<!-- Ghost button with text, has no border -->
<Story
  name="Ghost"
  args={{ variant: 'ghost', small: false, disabled: false, icon: false }}
/>

<!-- Button with an icon -->
<Story
  name="Icon"
  args={{
    variant: 'secondary',
    small: false,
    disabled: false,
    icon: true,
    ariaLabel: 'Home',
  }}
/>

<!-- Small button with text -->
<Story
  name="Small"
  args={{ variant: 'secondary', small: true, disabled: false, icon: false }}
/>

<!-- Button in a loading state, where it is disabled and shows a loading indicator -->
<Story name="Loading" args={{ variant: 'secondary', loading: true }} />
