<script context="module" lang="ts">
  import Button from '@lib/components/Button.svelte'
  import IconHome from '@lib/icons/20-home.svg?raw'

  export const meta = {
    title: 'Components/Button',
    component: Button,
    argTypes: {
      variant: {
        control: 'inline-radio',
        options: ['primary', 'secondary', 'ghost'],
      },
      toggled: {
        control: 'boolean',
        defaultValue: undefined,
      },
      href: {
        control: 'text',
      },
      external: {
        control: 'boolean',
        if: { arg: 'href', value: true },
      },
      download: {
        control: 'text',
        if: { arg: 'href', value: true },
      },
      title: {
        control: 'text',
      },
      ariaLabel: {
        control: 'text',
      },
    },
  }
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf'

  let count = 0
  function handleClick() {
    count += 1
  }
</script>

<Template let:args>
  <!--👇 'on:click' allows to forward event to addon-actions  -->
  <Button
    ariaLabel={args.icon ? 'home' : undefined}
    {...args}
    on:click
    on:click={handleClick}
  >
    {#if args.icon}
      {@html IconHome}
    {:else}
      You clicked: {count}
    {/if}
  </Button>
</Template>

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
  args={{ variant: 'secondary', small: false, disabled: false, icon: true }}
/>

<Story
  name="Small"
  args={{ variant: 'secondary', small: true, disabled: false, icon: false }}
/>
