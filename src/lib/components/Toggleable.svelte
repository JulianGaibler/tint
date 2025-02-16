<script lang="ts">
  interface Props {
    // Id of the toggleable element @type {string}
    id: string
    // Type of the toggleable element @type {'checkbox' | 'radio' | 'switch'}
    type?: 'checkbox' | 'radio' | 'switch'
    // Whether the toggleable element is checked (can use bind:checked) @type {boolean}
    checked: boolean
    // Whether the toggleable element is disabled @type {boolean}
    disabled?: boolean
    // aria-label of the toggleable element @type {string | undefined}
    ariaLabel?: string | undefined
    // aria-describedby of the toggleable element @type {string | undefined}
    ariaLabelledby?: string | undefined
    // aria-describedby of the toggleable element @type {string | undefined}
    ariaDescribedby?: string | undefined
    // HTML element of the toggleable element @type {HTMLInputElement | HTMLButtonElement | undefined}
    element?: HTMLInputElement | HTMLButtonElement | undefined
    // Event handler for when the value changes @type {(checked: boolean) => void | undefined}
    onchange?: (checked: boolean) => void
  }

  let {
    id,
    type = 'checkbox',
    checked = $bindable(),
    disabled = false,
    ariaLabel = undefined,
    ariaLabelledby = undefined,
    ariaDescribedby = undefined,
    element = $bindable(undefined),
    onchange = undefined,
  }: Props = $props()

  function toggle() {
    checked = !checked
    onchange?.(checked)
  }
</script>

{#if type === 'switch'}
  <button
    {disabled}
    {id}
    aria-checked={checked}
    aria-describedby={ariaDescribedby}
    aria-label={ariaLabel}
    aria-labelledby={ariaLabelledby}
    bind:this={element}
    onclick={toggle}
    role="switch"
  ></button>
{:else}
  <input
    {checked}
    {disabled}
    {id}
    {type}
    aria-describedby={ariaDescribedby}
    aria-label={ariaLabel}
    aria-labelledby={ariaLabelledby}
    bind:this={element}
    onclick={toggle}
  />
{/if}

<style lang="sass">
@use 'sass:math'

input, button
  appearance: none
  background-color: transparent
  margin: 0
  width: tint.$size-24
  height: tint.$size-24
  border: tint.$button-border-width solid var(--tint-action-primary)
  transform: translateY(-0.075em)
  display: flex
  align-items: center
  justify-content: center
  color: var(--tint-action-primary-text)
  @include tint.effect-focus
  &:not(:disabled):hover
    background-color: var(--tint-action-secondary-hover)
  &:not(:disabled):active
    background-color: var(--tint-action-secondary-active)
  &::before
    content: ""
    display: none
    background: currentColor

input:checked, button[aria-checked="true"]
  border-color: transparent
  background-color: var(--tint-action-primary)
  &:not(:disabled):hover
    background-color: var(--tint-action-primary-hover)
  &:not(:disabled):active
    background-color: var(--tint-action-primary-active)

button[role="switch"]
  width: tint.$size-40
  color: var(--tint-action-primary)
  transform: translateY(-0.075em) // ???
  justify-content: flex-start
  border-radius: tint.$button-radius-small
  &::before
    // prevent weird bug in Chrome
    display: block
    forced-color-adjust: none
    width: tint.$size-12
    height: tint.$size-12
    border-radius: 50%
    position: relative
    left: math.div(tint.$size-24 - tint.$size-12, 2) - 1px
    transition: left 0.1s ease-out
    @media (prefers-reduced-motion: reduce)
      transition: none
  &[aria-checked="true"]
    background-color: var(--tint-action-primary)
    color: var(--tint-action-primary-text)
    &::before
      left: tint.$size-40 - tint.$size-12 - math.div(tint.$size-24 - tint.$size-12, 2) - 1px

input[type="checkbox"]
  border-radius: tint.$size-4
  &::before
    width: 14px
    height: 14px
    transform: scale(1.0001)
    clip-path: polygon(33% 100%, 27% 98%, 2% 73%, 0% 67%, 2% 61%, 8% 58%, 14% 61%, 32% 79%, 85% 3%, 90% 0%, 96% 2%, 100% 7%, 99% 13%, 40% 96%, 37% 99%, 34% 100%, 33% 100%, 33% 100%)

input[type="radio"]
  border-radius: 50%
  &::before
    width: tint.$size-12
    height: tint.$size-12
    border-radius: 50%

input[type="radio"], input[type="checkbox"]
  &:checked
    &::before
      display: block

input:disabled, button:disabled
  opacity: 0.5

@media (forced-colors: active)
  input, button
    outline-color: CanvasText
    &:not(:disabled):hover, &:not(:disabled):active
      color: SelectedItem
      background-color: SelectedItemText
    &:not(:disabled):active
      border-color: ButtonText
    &:disabled
      opacity: 1
      background-color: ButtonFace
      color: GrayText
    &:checked
      background-color: ButtonText
      color: ButtonFace
      &:not(:disabled):hover, &:not(:disabled):active
        color: SelectedItemText
        background-color: SelectedItem
      &:not(:disabled):active
        border-color: ButtonText
      &:disabled
        background-color: GrayText
        color: ButtonFace
  button
    background-color: ButtonFace
    color: ButtonText
    &[aria-checked="true"]
      background-color: ButtonText !important
      color: ButtonFace !important
      &:not(:disabled):hover, &:not(:disabled):active
        color: SelectedItemText !important
        background-color: SelectedItem !important
      &:not(:disabled):active
        border-color: ButtonText !important
      &:disabled
        background-color: GrayText !important
        color: ButtonFace !important
</style>
