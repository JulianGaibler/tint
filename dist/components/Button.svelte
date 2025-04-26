<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements'

  interface Props extends HTMLButtonAttributes {
    // Type of the button. Valid values are @type {'primary' | 'secondary' | 'ghost'}
    variant?: 'primary' | 'secondary' | 'ghost'
    // Use small version of the button
    small?: boolean
    // Expects an icon to be passed in the slot if true
    icon?: boolean
    // If true or false, the button will be a toggle button @type {boolean | undefined}
    toggled?: boolean | undefined
    // Button can act as a link if href is provided @type {string | undefined}
    href?: string | undefined
    // If href is provided, this will open the link in a new tab
    external?: boolean
    // If href is provided, this will download the link @type {string | undefined}
    download?: string | undefined
    // Disables the button
    disabled?: boolean
    // If true, the button will be of type submit
    submit?: boolean
    // aria-label of the button @type {string | undefined}
    title?: string | undefined
    // formmethod of the button @type {string | undefined}
    ariaLabel?: string | undefined
    // tabindex of the button @type {number | undefined}
    tabindex?: number | undefined
    // HTML element of the button @type {HTMLButtonElement | HTMLAnchorElement | HTMLSpanElement | undefined}
    element?:
      | HTMLButtonElement
      | HTMLAnchorElement
      | HTMLSpanElement
      | undefined
    // Content of the button @type {Snippet | undefined}
    children?: import('svelte').Snippet
    // Click event handler @type {(e: MouseEvent) => void | undefined}
    onclick?: (e: MouseEvent) => void
    // Keypress event handler @type {(e: KeyboardEvent) => void | undefined}
    onkeypress?: (e: KeyboardEvent) => void
    // Keydown event handler @type {(e: KeyboardEvent) => void | undefined}
    onkeydown?: (e: KeyboardEvent) => void
  }

  let {
    variant = 'secondary',
    small = false,
    icon = false,
    toggled = undefined,
    href = undefined,
    external = false,
    download = undefined,
    disabled = false,
    submit = false,
    formmethod = undefined,
    title = undefined,
    ariaLabel = undefined,
    tabindex = undefined,
    element = $bindable(undefined),
    children,
    onclick = undefined,
    onkeypress = undefined,
    onkeydown = undefined,
    ...elementProps
  }: Props = $props()

  if (icon && !title && !ariaLabel) {
    throw new Error('[tint] Icon buttons need at least a title or aria-label')
  }
  if (variant === 'primary' && toggled !== undefined) {
    throw new Error('[tint] Primary buttons cannot be toggled')
  }
  if (href && toggled !== undefined) {
    throw new Error('[tint] Links cannot be toggled')
  }

  let role = $derived(toggled !== undefined ? 'switch' : undefined)
  let ariaPressed = $derived(toggled !== undefined ? toggled : undefined)
  let _variant = $derived(
    toggled === undefined ? variant : toggled ? 'primary' : variant,
  )
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
    {formmethod}
    aria-label={ariaLabel}
    aria-pressed={ariaPressed}
    bind:this={element}
    class:icon
    class:small
    class={`tint--type-action ${_variant}`}
    {onclick}
    {onkeypress}
    {onkeydown}
    type={submit ? 'submit' : 'button'}
    {...elementProps}>{@render children?.()}</button
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
  border: 2px solid var(--tint-action-secondary);
  color: var(--tint-action-secondary-text);
  border-radius: 12px;
  flex-shrink: 0;
}
button:focus-visible, a:focus-visible, span:focus-visible {
  outline: 2px solid var(--tint-action-primary);
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
  background-color: var(--tint-action-primary);
  border-color: transparent;
  color: var(--tint-action-primary-text);
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
