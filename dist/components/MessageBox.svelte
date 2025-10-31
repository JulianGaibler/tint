<script lang="ts">
  import Button from './Button.svelte'
  import IconClose from '../icons/20-close.svg?raw'

  interface Props {
    // Icon of the message box @type {string | undefined}
    icon?: string | undefined
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
  {#if onclose}
    <Button small icon aria-label="close" variant="ghost" onclick={onclose}>
      {@html IconClose}
    </Button>
  {/if}
</div>

<style>.box {
  display: flex;
  gap: 4px;
  border: 2px solid var(--tint-text-secondary);
  border-radius: 8px;
  padding: 8px;
}

.icon {
  color: var(--tint-text-secondary);
  line-height: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.content {
  flex: 1;
  margin-block: 5px;
  color: var(--tint-text-primary);
}

@media (forced-colors: active) {
  .box {
    border-color: GrayText;
  }
  .box .icon {
    color: GrayText;
  }
  .box .content {
    color: ButtonText;
  }
}</style>
