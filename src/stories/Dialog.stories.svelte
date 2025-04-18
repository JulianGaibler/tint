<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import Dialog, { type OpenDialog } from '@lib/components/Dialog.svelte'
  import Button from '@lib/components/Button.svelte'
  import { fn } from '@storybook/test'

  const { Story } = defineMeta({
    title: 'Components/Dialog',
    component: Dialog,
  })
</script>

<script lang="ts">
  let openTransactionalDialog = $state<OpenDialog | undefined>(undefined)
  let openAcknowledgmentDialog = $state<OpenDialog | undefined>(undefined)
</script>

<!-- A transactional dialog requires the user to take action to complete a task. Usually, this is a confirmation dialog. -->
<Story
  name="Transactional"
  args={{
    variant: 'transaction',
    heading: 'Delete selected images?',
    actionLabel: 'Delete',
  }}
>
  {#snippet children(args: any)}
    <Button onclick={() => openTransactionalDialog?.()}>
      Open transactional dialog
    </Button>
    <Dialog bind:openDialog={openTransactionalDialog} {...args}>
      <p>
        Images will be permanently removed from your account and all synced
        devices
      </p>
    </Dialog>{/snippet}</Story
>

<!-- An acknowledgment dialog informs the user that a task has been completed. -->
<Story
  name="Acknowledgment"
  args={{
    heading: 'Images deleted',
    actionLabel: 'Okay',
  }}
>
  {#snippet children(args: any)}
    <Button onclick={() => openAcknowledgmentDialog?.()}>
      Open acknowledgment dialog
    </Button>
    <Dialog bind:openDialog={openAcknowledgmentDialog} {...args}>
      <p>Images have been deleted</p>
    </Dialog>{/snippet}</Story
>

<style lang="sass">
  p
    margin-block-end: 16px
</style>
