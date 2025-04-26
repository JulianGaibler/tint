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

<style>dialog {
  --ease-curve: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-time: 200ms;
  position: fixed;
  inset: 0;
  margin: auto;
  opacity: 0.2;
  transform: scale(0.5);
  animation: openDialog var(--ease-time) var(--ease-curve) forwards;
}
dialog::backdrop {
  forced-color-adjust: none;
  background-color: rgba(0, 0, 0, 0);
  animation: openBackdrop var(--ease-time) var(--ease-curve) forwards;
}

@keyframes openDialog {
  from {
    opacity: 0.2;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scaleY(1);
  }
}
@keyframes openBackdrop {
  from {
    background-color: rgba(0, 0, 0, 0);
  }
  to {
    background-color: rgba(0, 0, 0, 0.25);
  }
}</style>
