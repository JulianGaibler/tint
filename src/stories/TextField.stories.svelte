<script context="module" lang="ts">
  import TextField from '@lib/components/TextField.svelte'

  export const meta = {
    title: 'Components/TextField',
    component: TextField,
    argTypes: {
      id: {
        control: 'text',
      },
      value: {
        control: 'text',
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
</script>

<!-- This is the most basic usage of the text field. -->
<Story name="Basic" args={{ id: 'input', label: 'Label' }} let:args>
  <TextField {...args} />
</Story>

<!-- You can also add a helper text to the text field. -->
<Story
  name="Helper text"
  args={{
    id: 'input',
    label: 'New password',
    helperText: 'Should contain a special character',
  }}
  let:args
>
  <TextField {...args} />
</Story>

<!-- You can also add an error text to the text field,
  which replaces the helper text and adds an error icon. -->
<Story
  name="Error text"
  args={{
    id: 'input',
    label: 'New password',
    error: 'Password must be at least 8 characters long',
  }}
  let:args
>
  <TextField {...args} />
</Story>
