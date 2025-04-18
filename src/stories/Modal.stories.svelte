<script module lang="ts">
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf'
  import Modal from '@lib/components/Modal.svelte'
  import Button from '@lib/components/Button.svelte'
  import { fn } from '@storybook/test'

  const { Story } = defineMeta({
    title: 'Components/Modal',
    component: Modal,
    args: {
      onclose: fn(),
    },
  })
</script>

<script lang="ts">
  let modalOpen = $state(false)
  setTemplate(child)
</script>

{#snippet child(args: any)}
  <div>
    <Button onclick={() => (modalOpen = true)}>Open modal</Button>
    <Modal bind:open={modalOpen} {...args}>
      <div class="content">
        <h2 class="tint--type">This is a modal</h2>
        <p>You can also press the Escape key to close it.</p>
        <Button
          variant="secondary"
          onclick={() => {
            modalOpen = false
          }}>Close</Button
        >
      </div>
    </Modal>
  </div>
{/snippet}

<!-- Basic usage of the Modal component -->
<Story name="Basic" />

<style lang="sass">
  .content
    padding: 32px
    h2
      margin-block-end: 4px
    p
      margin-block-end: 16px
</style>
