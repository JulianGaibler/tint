<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import TextField from '@lib/components/TextField.svelte'

  const { Story } = defineMeta({
    title: 'Components/TextField',
    component: TextField,
    render: child,
    argTypes: {
      autocomplete: { control: 'select' },
    },
  })
</script>

{#snippet child(args: any)}
  <TextField {...args} />
{/snippet}

<!-- This is the most basic usage of the text field. -->
<Story name="Basic" args={{ id: 'input', label: 'Label' }} />

<!-- You can also add a helper text to the text field. -->
<Story
  name="Helper text"
  args={{
    id: 'input',
    label: 'New password',
    helperText: 'Should contain a special character',
  }}
/>

<!-- You can also add an error text to the text field,
  which replaces the helper text and adds an error icon. -->
<Story
  name="Error text"
  args={{
    id: 'input',
    label: 'New password',
    error: 'Password must be at least 8 characters long',
  }}
/>
