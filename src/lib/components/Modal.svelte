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
    untrack(() => {
      if (open && dialogElement && !dialogElement.open) {
        dialogElement.showModal()
        isOpen = true
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
    --ease-curve: cubic-bezier(0.25, 0.46, 0.45, 0.94)
    --ease-time: 200ms
    position: fixed
    inset: 0
    margin: auto
    opacity: 0
    transform: scale(0.5)
    @media (prefers-reduced-motion: no-preference)
      transition: opacity var(--ease-time) var(--ease-curve), transform var(--ease-time) var(--ease-curve)
    &:open
      opacity: 1
      transform: scaleY(1)
    &::backdrop
      forced-color-adjust: none
      background-color: rgb(0 0 0 / 0%)
      @media (prefers-reduced-motion: no-preference)
        transition: display var(--ease-time) allow-discrete, overlay var(--ease-time) allow-discrete, background-color var(--ease-time)
    &:open::backdrop
      background-color: rgb(0 0 0 / 25%)

  @starting-style
    dialog:open
      opacity: 0
      transform: scale(0.5)
    dialog:open::backdrop
      background-color: rgb(0 0 0 / 0%)
</style>
