<script module lang="ts">
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf'
  import Toggleable from '@lib/components/Toggleable.svelte'
  import { fn } from '@storybook/test'

  const { Story } = defineMeta({
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
    args: {
      onchange: fn(),
    },
  })
</script>

<script lang="ts">
  setTemplate(child)
</script>

{#snippet child(args: any)}
  <div>
    <label for={args.id}>Label</label>
    <Toggleable {...args} />
  </div>
{/snippet}

<!-- A standard checkbox that can be toggled on and off. -->
<Story
  name="Checkbox"
  args={{ checked: true, id: 'input', type: 'checkbox' }}
/>

<!--
  The individual radio button can also be toggled on and off.
  A higher level component has to manage the state of multiple
  radio buttons.
-->
<Story name="Radio" args={{ checked: true, id: 'input', type: 'radio' }} />

<!-- A switch that can be toggled on and off. Behaves like a checkbox. -->
<Story
  name="Switch"
  args={{
    checked: true,
    type: 'switch',
    ariaLabelledby: 'switch-label',
  }}
/>

<style lang="sass">
div
  display: flex
  align-items: center
  margin-bottom: 1rem
  label
    margin-right: 1rem
</style>
