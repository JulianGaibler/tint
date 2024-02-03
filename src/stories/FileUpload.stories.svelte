<script context="module" lang="ts">
  import FileUpload from '@lib/components/FileUpload.svelte'

  export const meta = {
    title: 'Components/FileUpload',
    component: FileUpload,
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
      accept: {
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
      fillWidth: {
        control: 'boolean',
      },
    },
  }
</script>

<script lang="ts">
  import { Story } from '@storybook/addon-svelte-csf'
</script>

<!-- This is the most basic usage of the file input. Accepts any file type.
Files can be dragged and dropped over the input too. -->
<Story name="Basic" args={{ id: 'input', label: 'Label' }} let:args>
  <FileUpload {...args} />
</Story>

<!-- You can also add a helper text to the file input and specify the accepted file types. -->
<Story
  name="Helper text"
  args={{
    id: 'input',
    label: 'Profile picture',
    accept: 'image/*',
    helperText: 'Upload a profile picture',
  }}
  let:args
>
  <FileUpload {...args} />
</Story>

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
  let:args
>
  <FileUpload {...args} />
</Story>
