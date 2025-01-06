<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import Select from '$lib/components/Select.svelte'
  import { fn } from '@storybook/test'

  const { Story } = defineMeta({
    title: 'Components/Select',
    component: Select,
    args: {
      onchange: fn(),
    },
  })
</script>

<script lang="ts">
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
>
  {#snippet children(args: any)}
    <Select {...args} />
  {/snippet}
</Story>
