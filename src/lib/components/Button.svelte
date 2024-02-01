<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  // Type of the button. Valid values are @type {'primary' | 'secondary' | 'ghost'}
  export let variant: 'primary' | 'secondary' | 'ghost' = 'secondary'
  // Use small version of the button
  export let small = false
  // Expects an icon to be passed in the slot if true
  export let icon = false
  // If true or false, the button will be a toggle button @type {boolean | undefined}
  export let toggled: boolean | undefined = undefined
  // Button can act as a link if href is provided @type {string | undefined}
  export let href: string | undefined = undefined
  // If href is provided, this will open the link in a new tab
  export let external = false
  // If href is provided, this will download the link @type {string | undefined}
  export let download: string | undefined = undefined
  // Disables the button
  export let disabled = false
  // If true, the button will be of type submit
  export let submit = false
  // title-attribute of the button @type {string | undefined}
  export let title: string | undefined = undefined
  // aria-label of the button @type {string | undefined}
  export let ariaLabel: string | undefined = undefined
  // tabindex of the button @type {number | undefined}
  export let tabindex: number | undefined = undefined
  // HTML element of the button @type {HTMLButtonElement | HTMLAnchorElement | HTMLSpanElement | undefined}
  export let element:
    | HTMLButtonElement
    | HTMLAnchorElement
    | HTMLSpanElement
    | undefined = undefined

  if (icon && !title && !ariaLabel) {
    throw new Error('[tint] Icon buttons need at least a title or aria-label')
  }
  if (variant === 'primary' && toggled !== undefined) {
    throw new Error('[tint] Primary buttons cannot be toggled')
  }
  if (href && toggled !== undefined) {
    throw new Error('[tint] Links cannot be toggled')
  }

  $: role = toggled !== undefined ? 'switch' : undefined
  $: ariaPressed = toggled !== undefined ? toggled : undefined
  $: _variant = toggled === undefined ? variant : toggled ? 'primary' : variant
</script>

{#if href && disabled}
  <span
    {title}
    aria-disabled="true"
    aria-label={ariaLabel}
    bind:this={element}
    class:icon
    class:small
    class={`tint--type-action ${_variant}`}><slot /></span
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
    target={external ? '_blank' : undefined}><slot /></a
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
    on:click
    on:keypress
    on:keydown
    type={submit ? 'submit' : 'button'}><slot /></button
  >
{/if}

<style lang="sass">
a
  display: inline-flex
  align-items: center
  justify-content: center
  color: inherit
  text-decoration: none
button, a, span
  vertical-align: top
  box-sizing: border-box
  min-height: tint.$size-48
  padding: 8px 24px
  background-color: transparent
  border: tint.$button-border-width solid var(--tint-action)
  color: var(--tint-action)
  border-radius: tint.$button-radius-large
  flex-shrink: 0
  @include tint.effect-focus
  &.icon
    padding: 0px
    display: inline-flex
    justify-content: center
    align-items: center
    width: 48px
    height: 48px
  &.small
    min-height: 32px
    padding: 2px 16px
    border-radius: tint.$button-radius-small
    &.icon
      padding: 0px
      width: 32px
      height: 32px
  @media (forced-colors: none), (prefers-contrast: no-preference)
    &:global(.ghost)
      border-color: transparent
      outline-offset: 0
button, a
  &:not(:disabled):hover
    background-color: var(--tint-action-secondary-hover)
  &:not(:disabled):active
    background-color: var(--tint-action-secondary-active)
  &:global(.primary)
    background-color: var(--tint-action)
    border-color: transparent
    color: var(--tint-action-text)
    &:not(:disabled):hover
      background-color: var(--tint-action-primary-hover)
    &:not(:disabled):active
      background-color: var(--tint-action-primary-active)

button:disabled, a:disabled, span
  opacity: 0.5

@media (forced-colors: active)
  button, a
    // this is to prevent a strange backplate issue in chrome
    forced-color-adjust: none
    background-color: ButtonFace
    border-color: ButtonText
    color: ButtonText
    &:not(:disabled):hover, &:not(:disabled):active
      background-color: SelectedItemText
      border-color: SelectedItem
      color: SelectedItem
    &:not(:disabled):active
      border-color: ButtonText
    &:disabled
      opacity: 1
      background-color: ButtonFace
      border: 2px solid GrayText
      color: GrayText
    // Primary
    &:global(.primary)
      background-color: ButtonText
      border: 2px solid ButtonFace
      color: ButtonFace
      &:not(:disabled):hover, &:not(:disabled):active
        background-color: SelectedItem
        border-color: SelectedItemText
        color: SelectedItemText
      &:not(:disabled):active
        border-color: SelectedItem
      &:disabled
        background-color: GrayText
        border: 2px solid ButtonFace
        color: ButtonFace

</style>
