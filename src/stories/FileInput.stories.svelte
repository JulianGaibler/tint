<script module lang="ts">
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf'
  import FileInput from '@lib/components/FileInput.svelte'

  const { Story } = defineMeta({
    title: 'Components/FileInput',
    component: FileInput,
  })
</script>

<script lang="ts">
  setTemplate(child)
</script>

{#snippet child(args: any)}
  <FileInput {...args} />
{/snippet}

<!-- This is the most basic usage of the file input. Accepts any file type.
Files can be dragged and dropped over the input too. -->
<Story name="Basic" args={{ id: 'input', label: 'Label' }} />

<!-- You can also add a helper text to the file input and specify the accepted file types. -->
<Story
  name="Helper text"
  args={{
    id: 'input',
    label: 'Profile picture',
    accept: 'image/*',
    helperText: 'Upload a profile picture',
  }}
/>

<!-- You can also add an error text to the file input,
  which replaces the helper text and adds an error icon. -->
<Story
  name="Error text"
  args={{
    id: 'input',
    label: 'Profile picture',
    error: 'File needs to be an image',
    accept: 'image/*',
  }}
/>
