<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import Slider from '@lib/components/Slider.svelte'
  import { fn } from 'storybook/test'

  const { Story } = defineMeta({
    title: 'Components/Slider',
    component: Slider,
    render: template,
    argTypes: {
      id: {
        control: 'text',
      },
      value: {
        control: 'number',
      },
      min: {
        control: 'number',
      },
      max: {
        control: 'number',
      },
      step: {
        control: 'number',
      },
      disabled: {
        control: 'boolean',
      },
      showSteps: {
        control: 'boolean',
      },
    },
    args: {
      onchange: fn(),
      oninput: fn(),
    },
  })
</script>

{#snippet template(args: any)}
  <div style="max-width: 400px;">
    <Slider {...args} />
  </div>
{/snippet}

<!-- Basic slider -->
<Story
  name="Basic"
  args={{
    id: 'slider-basic',
    value: 50,
    min: 0,
    max: 100,
    step: 1,
  }}
/>

<!-- With step markers -->
<Story
  name="With Steps"
  args={{
    id: 'slider-steps',
    value: 50,
    min: 0,
    max: 100,
    step: 10,
    showSteps: true,
  }}
/>

<!-- Disabled -->
<Story
  name="Disabled"
  args={{
    id: 'slider-disabled',
    value: 50,
    min: 0,
    max: 100,
    step: 1,
    disabled: true,
  }}
/>

<!-- Large size -->
<Story
  name="Large"
  args={{
    id: 'slider-large',
    value: 50,
    min: 0,
    max: 100,
    step: 1,
    small: false,
  }}
/>
