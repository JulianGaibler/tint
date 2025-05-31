<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import LoadingIndicator from '@lib/components/LoadingIndicator.svelte'

  const { Story } = defineMeta({
    title: 'Components/LoadingIndicator',
    component: LoadingIndicator,
  })
</script>

<!-- A indefinite loading indicator. -->
<Story name="Default">
  {#snippet children(args: any)}
    <LoadingIndicator {...args} />
  {/snippet}
</Story>
