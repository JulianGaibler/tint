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
        {#if !args.notClosable}
          <p>You can press the Escape key to close it.</p>
        {/if}
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

<!--
  When `notClosable` is not set or set to `false`, the modal can be closed by user interaction,
  The component then uses the `showModal` method to open the dialog. Using `showModal` is the preferred, web-native way to open dialogs, as it automatically handles focus management and accessibility concerns.
-->
<Story name="Basic" />

<!--
  When the `notClosable` prop is set, the modal is guaranteed to stay open and cannot be forced to close by user interaction.

  This implementation uses the `show()` method instead of `showModal()`, which means the modal might not always appear at the very top of the render layer. Focus management within the modal is handled using the `focus-trap` library to ensure accessibility and keyboard navigation.

  The reason for this is, that in Chromium-based browsers, there is a limitation where you cannot force a modal to stay open. Specifically, if the user presses the Escape key a second time, the dialog will close even if you call `preventDefault` on the event.
-->
<Story name="Not closable" args={{ notClosable: true }} />

<style lang="sass">
  .content
    padding: 32px
    h2
      margin-block-end: 4px
    p
      margin-block-end: 16px
</style>
