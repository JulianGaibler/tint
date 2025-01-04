<script lang="ts">
  import { createBubbler } from 'svelte/legacy';

  const bubble = createBubbler();import { createEventDispatcher } from "svelte";
const dispatch = createEventDispatcher();
  interface Props {
    variant?: string;
    small?: boolean;
    icon?: boolean;
    toggled?: any;
    href?: any;
    external?: boolean;
    download?: any;
    disabled?: boolean;
    submit?: boolean;
    title?: any;
    ariaLabel?: any;
    tabindex?: any;
    element?: any;
    children?: import('svelte').Snippet;
  }

  let {
    variant = "secondary",
    small = false,
    icon = false,
    toggled = void 0,
    href = void 0,
    external = false,
    download = void 0,
    disabled = false,
    submit = false,
    title = void 0,
    ariaLabel = void 0,
    tabindex = void 0,
    element = $bindable(void 0),
    children
  }: Props = $props();
if (icon && !title && !ariaLabel) {
  throw new Error("[tint] Icon buttons need at least a title or aria-label");
}
if (variant === "primary" && toggled !== void 0) {
  throw new Error("[tint] Primary buttons cannot be toggled");
}
if (href && toggled !== void 0) {
  throw new Error("[tint] Links cannot be toggled");
}
let role = $derived(toggled !== void 0 ? "switch" : void 0);
let ariaPressed = $derived(toggled !== void 0 ? toggled : void 0);
let _variant = $derived(toggled === void 0 ? variant : toggled ? "primary" : variant);
</script>

{#if href && disabled}
  <span
    {title}
    aria-disabled="true"
    aria-label={ariaLabel}
    bind:this={element}
    class:icon
    class:small
    class={`tint--type-action ${_variant}`}>{@render children?.()}</span
  >
{:else if href}
  <a
    {download}
    {href}
    {tabindex}
    {title}
    aria-label={ariaLabel}
    bind:this={element}
    class:icon
    class:small
    class={`tint--type-action ${_variant}`}
    rel={external ? 'noopener' : undefined}
    target={external ? '_blank' : undefined}>{@render children?.()}</a
  >
{:else}
  <button
    {disabled}
    {role}
    {tabindex}
    {title}
    aria-label={ariaLabel}
    aria-pressed={ariaPressed}
    bind:this={element}
    class:icon
    class:small
    class={`tint--type-action ${_variant}`}
    onclick={bubble('click')}
    onkeypress={bubble('keypress')}
    onkeydown={bubble('keydown')}
    type={submit ? 'submit' : 'button'}>{@render children?.()}</button
  >
{/if}

<style>a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  text-decoration: none;
}

button, a, span {
  vertical-align: top;
  box-sizing: border-box;
  min-height: 48px;
  padding: 8px 24px;
  background-color: transparent;
  border: 2px solid var(--tint-action);
  color: var(--tint-action);
  border-radius: 12px;
  flex-shrink: 0;
}
button:focus-visible, a:focus-visible, span:focus-visible {
  outline: 2px solid var(--tint-action);
  outline-offset: 2px;
}
@media (forced-colors: active) {
  button:focus-visible, a:focus-visible, span:focus-visible {
    outline-color: CanvasText;
  }
}
button.icon, a.icon, span.icon {
  padding: 0px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
}
button.small, a.small, span.small {
  min-height: 32px;
  padding: 2px 16px;
  border-radius: 80px;
}
button.small.icon, a.small.icon, span.small.icon {
  padding: 0px;
  width: 32px;
  height: 32px;
}
@media (forced-colors: none), (prefers-contrast: no-preference) {
  button:global(.ghost), a:global(.ghost), span:global(.ghost) {
    border-color: transparent;
    outline-offset: 0;
  }
}

button:not(:disabled):hover, a:not(:disabled):hover {
  background-color: var(--tint-action-secondary-hover);
}
button:not(:disabled):active, a:not(:disabled):active {
  background-color: var(--tint-action-secondary-active);
}
button:global(.primary), a:global(.primary) {
  background-color: var(--tint-action);
  border-color: transparent;
  color: var(--tint-action-text);
}
button:global(.primary):not(:disabled):hover, a:global(.primary):not(:disabled):hover {
  background-color: var(--tint-action-primary-hover);
}
button:global(.primary):not(:disabled):active, a:global(.primary):not(:disabled):active {
  background-color: var(--tint-action-primary-active);
}

button:disabled, a:disabled, span {
  opacity: 0.5;
}

@media (forced-colors: active) {
  button, a {
    forced-color-adjust: none;
    background-color: ButtonFace;
    border-color: ButtonText;
    color: ButtonText;
  }
  button:not(:disabled):hover, button:not(:disabled):active, a:not(:disabled):hover, a:not(:disabled):active {
    background-color: SelectedItemText;
    border-color: SelectedItem;
    color: SelectedItem;
  }
  button:not(:disabled):active, a:not(:disabled):active {
    border-color: ButtonText;
  }
  button:disabled, a:disabled {
    opacity: 1;
    background-color: ButtonFace;
    border: 2px solid GrayText;
    color: GrayText;
  }
  button:global(.primary), a:global(.primary) {
    background-color: ButtonText;
    border: 2px solid ButtonFace;
    color: ButtonFace;
  }
  button:global(.primary):not(:disabled):hover, button:global(.primary):not(:disabled):active, a:global(.primary):not(:disabled):hover, a:global(.primary):not(:disabled):active {
    background-color: SelectedItem;
    border-color: SelectedItemText;
    color: SelectedItemText;
  }
  button:global(.primary):not(:disabled):active, a:global(.primary):not(:disabled):active {
    border-color: SelectedItem;
  }
  button:global(.primary):disabled, a:global(.primary):disabled {
    background-color: GrayText;
    border: 2px solid ButtonFace;
    color: ButtonFace;
  }
}</style>
