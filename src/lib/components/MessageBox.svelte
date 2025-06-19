<script lang="ts">
  import Button from '@lib/components/Button.svelte'
  import IconClose from '@lib/icons/20-close.svg?raw'

  interface Props {
    // Icon of the message box @type {string | undefined}
    icon?: string | undefined
    // Dismissable @type {boolean}
    dismissable?: boolean
    // HTML element of the container @type {HTMLDivElement | undefined}
    element?: HTMLDivElement | undefined
    // Content of the message box @type {Snippet | undefined}
    children?: import('svelte').Snippet
    // Event handler for when closing the message box @type {(e: MouseEvent) => void | undefined}
    onclose?: (e: MouseEvent) => void
    // A space separated list of CSS classes.
    class?: string
  }

  let {
    icon = undefined,
    dismissable = true,
    element = $bindable(undefined),
    onclose = undefined,
    children,
    class: className = '',
  }: Props = $props()
</script>

<div class="box {className}" bind:this={element}>
  {#if icon}
    <div class="icon" aria-hidden="true">{@html icon}</div>
  {/if}
  <div class="content">{@render children?.()}</div>
  {#if dismissable}
    <Button small icon ariaLabel="close" variant="ghost" onclick={onclose}>
      {@html IconClose}
    </Button>
  {/if}
</div>

<style lang="sass">
.box
  display: flex
  gap: tint.$size-8
  border: 2px solid var(--tint-text-secondary)
  border-radius: tint.$size-8
  padding: tint.$size-12

.icon
  color: var(--tint-text-secondary)
  line-height: 0
  width: tint.$size-32
  height: tint.$size-32
  display: flex
  align-items: center
  justify-content: center
  flex-shrink: 0

.content
  flex: 1
  color: var(--tint-text-primary)

@media (forced-colors: active)
  .box
    border-color: GrayText
    .icon
      color: GrayText
    .content
      color: ButtonText
</style>
