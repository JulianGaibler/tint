<script lang="ts">
  import { untrack } from 'svelte'

  interface Props {
    // If true, the modal will be open @type {boolean | undefined}
    open?: boolean
    // Event handler for when the modal is closed @type {() => void | undefined}
    onclose?: () => void
    // Content of the modal @type {Snippet | undefined}
    children: import('svelte').Snippet
  }

  let { open = $bindable(false), onclose, children }: Props = $props()

  let dialogElement: HTMLDialogElement | undefined = $state(undefined)
  let isOpen = $state(false)

  function onCancelEvent(e: Event) {
    e.preventDefault()
    open = false
    onclose?.()
  }

  function onCloseEvent() {
    open = false
    isOpen = false
    onclose?.()
  }

  $effect(() => {
    if (open == isOpen) return
    console.log('open', open, isOpen)
    untrack(() => {
      if (open && dialogElement && !dialogElement.open) {
        dialogElement.showModal()
        isOpen = true
        console.log('opened', dialogElement)
      } else if (!open && dialogElement && dialogElement.open) {
        dialogElement.close()
        isOpen = false
        onclose?.()
      }
    })
  })
</script>

<dialog
  bind:this={dialogElement}
  oncancel={onCancelEvent}
  onclose={onCloseEvent}
  class="tint--card tint--plain"
>
  {@render children()}
</dialog>

<style lang="sass">
  dialog
    --ease-curve: cubic-bezier(0.42, 1.67, 0.21, 0.90)
    --ease-time: 350ms
    position: fixed
    inset: 0
    margin: auto
    opacity: 0.2
    transform: scale(0.5)
    animation: openDialog var(--ease-time) var(--ease-curve) forwards
    @media (prefers-reduced-motion: reduce)
      animation-name: openDialog-noMotion
    &::backdrop
      forced-color-adjust: none
      background-color: rgb(0 0 0 / 0%)
      animation: openBackdrop var(--ease-time) var(--ease-curve) forwards

  @keyframes openDialog
    from
      opacity: 0.2
      transform: scale(0.5)
    to
      opacity: 1
      transform: scaleY(1)

  @keyframes openDialog-noMotion
    from
      opacity: 0
      transform: scale(1)
    to
      opacity: 1
      transform: scaleY(1)

  @keyframes openBackdrop
    from
      background-color: rgb(0 0 0 / 0%)
    to
      background-color: rgb(0 0 0 / 25%)

</style>
