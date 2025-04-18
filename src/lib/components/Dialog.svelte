<script lang="ts" module>
  export type DialogResult = boolean
  export type OpenDialog = () => Promise<DialogResult>
</script>

<script lang="ts">
  import Button from '@lib/components/Button.svelte'
  import Modal from './Modal.svelte'

  interface Props {
    // Whether the user is presenting a transaction or an acknowledge dialog @type {'transaction' | 'acknowledge'}
    variant?: 'transaction' | 'acknowledge'
    // The heading of the dialog @type {string}
    heading: string
    // The label of the primary action button @type {string}
    actionLabel: string
    // Function to open the dialog. Returns a promise that resolves when the dialog is closed @type {OpenDialog | undefined}
    openDialog?: OpenDialog
    // Content of the dialog between the heading and the action buttons @type {Snippet | undefined}
    children: import('svelte').Snippet
  }

  let {
    variant = 'acknowledge',
    heading,
    actionLabel,
    openDialog = $bindable(undefined),
    children,
  }: Props = $props()

  let open = $state(false)
  let promiseResolve: ((value: DialogResult) => void) | undefined =
    $state(undefined)

  function createDialog() {
    if (open) {
      promiseResolve?.(false)
    }
    open = true
    window.addEventListener('keydown', onKeyDown)
    return new Promise<DialogResult>((resolve) => {
      promiseResolve = resolve
    })
  }

  function onclose() {
    if (!promiseResolve) {
      return
    }
    promiseResolve(false)
    promiseResolve = undefined
    window.removeEventListener('keydown', onKeyDown)
  }

  function resolvePromise(result: DialogResult) {
    promiseResolve?.(result)
    promiseResolve = undefined
    open = false
    window.removeEventListener('keydown', onKeyDown)
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      resolvePromise(true)
    }
  }

  openDialog = createDialog
</script>

<Modal bind:open {onclose}>
  <div class="dialog tint--type-body-sans">
    <div class="content">
      <h2 class="tint--type-title-sans-3">{heading}</h2>
      {@render children()}
    </div>
    <div class="actions">
      {#if variant === 'transaction'}
        <Button onclick={() => resolvePromise(false)}>Cancel</Button>
        <Button onclick={() => resolvePromise(true)} variant="primary"
          >{actionLabel}</Button
        >
      {:else}
        <Button onclick={() => resolvePromise(true)}>{actionLabel}</Button>
      {/if}
    </div>
  </div>
</Modal>

<style lang="sass">
  .dialog
    padding: tint.$size-24
    display: flex
    flex-direction: column
    gap: tint.$size-16
    max-width: 448px
    min-width: min(calc(100vw - 128px), 448px)

  .content
    h2
      margin-block-end: tint.$size-8

  .actions
    display: flex
    flex-wrap: wrap
    justify-content: flex-end
    gap: tint.$size-8
</style>
