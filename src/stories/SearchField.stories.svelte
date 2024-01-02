<script context="module" lang="ts">
  import SearchField from '@lib/components/SearchField.svelte'

  export const meta = {
    title: 'Components/SearchField',
    component: SearchField,
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
      disabled: {
        control: 'boolean',
      },
    },
  }
</script>

<script lang="ts">
  import { Story } from '@storybook/addon-svelte-csf'
</script>

<!-- Specialized text field for searches, meant to be used in a toolbar. -->
<Story name="Basic" args={{ id: 'input' }} let:args>
  <SearchField {...args} on:search />
</Story>
