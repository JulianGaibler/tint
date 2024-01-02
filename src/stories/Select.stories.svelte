<script context="module" lang="ts">
  import Select from '@lib/components/Select.svelte'

  export const meta = {
    title: 'Components/Select',
    component: Select,
    argTypes: {
      id: {
        control: 'text',
      },
      value: {
        control: 'number',
      },
      items: {
        control: 'object',
      },
      label: {
        control: 'text',
      },
      helperText: {
        control: 'text',
      },
      error: {
        control: 'text',
      },
      disabled: {
        control: 'boolean',
      },
    },
  }
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf'

  let items = [
    { value: 1, label: 'Apple' },
    { value: 2, label: 'Cherry' },
    { value: 3, label: 'Lemon', disabled: true },
    { value: 4, label: 'Pear' },
  ]
</script>

<!-- Users can select an item from a dropdown list. -->
<Story
  name="Basic"
  args={{ id: 'select', label: 'Fruit', value: undefined, items }}
  let:args
>
  <Select {...args} />
</Story>
