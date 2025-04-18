<script module lang="ts">
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf'
  import Button from '@lib/components/Button.svelte'
  import { fn } from '@storybook/test'
  import IconHome from '@lib/icons/20-home.svg?raw'

  const { Story } = defineMeta({
    title: 'Components/Button',
    component: Button,
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

<script lang="ts">
  setTemplate(child)
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

<Story
  name="Primary"
  args={{ variant: 'primary', small: false, disabled: false, icon: false }}
/>
<Story
  name="Secondary"
  args={{ variant: 'secondary', small: false, disabled: false, icon: false }}
/>
<Story
  name="Ghost"
  args={{ variant: 'ghost', small: false, disabled: false, icon: false }}
/>

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

<Story
  name="Small"
  args={{ variant: 'secondary', small: true, disabled: false, icon: false }}
/>
