<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import SearchField from '@lib/components/SearchField.svelte'
  import { fn } from 'storybook/test'

  const { Story } = defineMeta({
    title: 'Components/SearchField',
    component: SearchField,
    args: {
      onsearch: fn(),
    },
  })
</script>

<!-- Specialized text field for searches, meant to be used in a toolbar. -->
<Story name="Basic" args={{ id: 'input' }}>
  {#snippet children(args: any)}
    <SearchField {...args} />
  {/snippet}
</Story>
