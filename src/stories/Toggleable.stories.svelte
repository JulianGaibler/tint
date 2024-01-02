<script context="module" lang="ts">
  import Toggleable from '@lib/components/Toggleable.svelte'

  export const meta = {
    title: 'Components/Toggleable',
    component: Toggleable,
    argTypes: {
      type: {
        control: 'inline-radio',
        options: ['checkbox', 'radio', 'switch'],
      },
      id: {
        control: 'text',
      },
      checked: {
        control: 'boolean',
      },
      ariaLabel: {
        control: 'text',
      },
      ariaDescribedby: {
        control: 'text',
      },
      ariaLabelledby: {
        control: 'text',
      },
    },
  }
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf'
</script>

<!-- A standard checkbox that can be toggled on and off. -->
<Story
  name="Checkbox"
  args={{ checked: true, id: 'input', type: 'checkbox' }}
  let:args
>
  <div>
    <label for={args.id}>Label</label>
    <Toggleable {...args} />
  </div>
</Story>

<!--
  The individual radio button can also be toggled on and off.
  A higher level component has to manage the state of multiple
  radio buttons.
-->
<Story
  name="Radio"
  args={{ checked: true, id: 'input', type: 'radio' }}
  let:args
>
  <div>
    <label for={args.id}>Label</label>
    <Toggleable {...args} />
  </div>
</Story>

<!-- A switch that can be toggled on and off. Behaves like a checkbox. -->
<Story
  name="Switch"
  args={{
    checked: true,
    type: 'switch',
    ariaLabelledby: 'switch-label',
  }}
  let:args
>
  <div>
    <p id={args.ariaLabelledby}>Label</p>
    <Toggleable {...args} />
  </div>
</Story>

<style lang="sass">
div
  display: flex
  align-items: center
  margin-bottom: 1rem
  label, p
    margin-right: 1rem
</style>
