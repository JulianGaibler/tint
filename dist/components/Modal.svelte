<script lang="ts">
  import { untrack } from 'svelte'
  import * as focusTrap from 'focus-trap'

  interface Props {
    // If true, the modal will be open @type {boolean | undefined}
    open?: boolean
    // If true, the modal cannot be closed by user actions @type {boolean | undefined}
    notClosable?: boolean
    // Event handler for when the modal is closed @type {() => void | undefined}
    onclose?: () => void
    // Content of the modal @type {Snippet | undefined}
    children: import('svelte').Snippet
  }

  let {
    open = $bindable(false),
    notClosable = false,
    onclose,
    children,
  }: Props = $props()

  let dialogElement: HTMLDialogElement | undefined = $state(undefined)
  let isOpen = $state(false)
  let trap: focusTrap.FocusTrap | undefined = $state(undefined)

  function onCancelEvent(e: Event) {
    if (notClosable) {
      e.preventDefault()
      return
    }
    e.preventDefault()
    open = false
    onclose?.()
  }

  function onCloseEvent() {
    if (notClosable) return
    open = false
    isOpen = false
    onclose?.()
  }

  function onBackdropClick(e: MouseEvent) {
    if (notClosable) return
    if (e.target === dialogElement) {
      open = false
      onclose?.()
    }
  }

  $effect(() => {
    if (open == isOpen) return
    untrack(() => {
      if (open && dialogElement) {
        if (notClosable) {
          // Use show() for non-closable modals to maintain control
          if (!dialogElement.open) {
            dialogElement.show()
            isOpen = true

            // Create and activate focus trap for manual modals
            if (!trap) {
              trap = focusTrap.createFocusTrap(dialogElement, {
                escapeDeactivates: false, // Don't allow escape to close
                clickOutsideDeactivates: false, // Don't allow click outside to close
                returnFocusOnDeactivate: true,
                allowOutsideClick: true,
              })
            }
            trap.activate()
          }
        } else {
          // Use showModal() for closable modals (has built-in focus management)
          if (!dialogElement.open) {
            dialogElement.showModal()
            isOpen = true
          }
        }
      } else if (!open && dialogElement && dialogElement.open) {
        // Deactivate focus trap before closing
        if (trap && notClosable) {
          trap.deactivate()
        }

        dialogElement.close()
        isOpen = false
        if (!notClosable) {
          onclose?.()
        }
      }
    })
  })

  // Cleanup focus trap on component destroy
  $effect(() => {
    return () => {
      if (trap) {
        trap.deactivate()
      }
    }
  })
</script>

<dialog
  bind:this={dialogElement}
  oncancel={onCancelEvent}
  onclose={onCloseEvent}
  class="tint--card tint--plain"
  class:manual-modal={notClosable}
>
  {@render children()}
</dialog>
{#if notClosable}
  <div
    role="presentation"
    class="manual-backdrop"
    onclick={onBackdropClick}
    class:visible={open}
  ></div>
{/if}

<style>dialog, .manual-backdrop {
  --ease-curve: cubic-bezier(0.42, 1.67, 0.21, 0.90);
  --ease-time: 350ms;
}

dialog {
  position: fixed;
  inset: 0;
  margin: auto;
  opacity: 0.2;
  transform: scale(0.5);
  animation: openDialog var(--ease-time) var(--ease-curve) forwards;
}
@media (prefers-reduced-motion: reduce) {
  dialog {
    animation-name: openDialog-noMotion;
  }
}
dialog::backdrop {
  forced-color-adjust: none;
  background-color: rgba(0, 0, 0, 0);
  animation: openBackdrop var(--ease-time) var(--ease-curve) forwards;
}
dialog.manual-modal {
  z-index: 9999;
}

.manual-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0);
  z-index: 9998;
  display: none;
}
.manual-backdrop.visible {
  display: block;
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
@keyframes openDialog-noMotion {
  from {
    opacity: 0;
    transform: scale(1);
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
