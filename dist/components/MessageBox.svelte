<script lang="ts">import Button from "./Button.svelte";
import IconClose from "../icons/20-close.svg?raw";
import { createEventDispatcher } from "svelte";
  interface Props {
    icon?: any;
    dismissable?: boolean;
    element?: any;
    children?: import('svelte').Snippet;
  }

  let {
    icon = void 0,
    dismissable = true,
    element = $bindable(void 0),
    children
  }: Props = $props();
const dispatch = createEventDispatcher();
</script>

<div class="box" bind:this={element}>
  {#if icon}
    <div class="icon" aria-hidden="true">{@html icon}</div>
  {/if}
  <div class="content">{@render children?.()}</div>
  {#if dismissable}
    <Button
      small
      icon
      ariaLabel="close"
      variant="ghost"
      on:click={(e) => dispatch('close', e)}
    >
      {@html IconClose}
    </Button>
  {/if}
</div>

<style>.box {
  display: flex;
  gap: 8px;
  border: 2px solid var(--tint-text-secondary);
  border-radius: 8px;
  padding: 12px;
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
