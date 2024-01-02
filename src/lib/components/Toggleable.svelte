<script lang="ts">
  // Id of the toggleable element @type {string}
  export let id: string
  // Type of the toggleable element @type {'checkbox' | 'radio' | 'switch'}
  export let type: 'checkbox' | 'radio' | 'switch' = 'checkbox'
  // Whether the toggleable element is checked (can use bind:checked) @type {boolean}
  export let checked: boolean
  // Whether the toggleable element is disabled @type {boolean}
  export let disabled = false
  // aria-label of the toggleable element @type {string | undefined}
  export let ariaLabel: string | undefined = undefined
  // aria-describedby of the toggleable element @type {string | undefined}
  export let ariaLabelledby: string | undefined = undefined
  // aria-describedby of the toggleable element @type {string | undefined}
  export let ariaDescribedby: string | undefined = undefined

  function toggle() {
    checked = !checked
  }
</script>

{#if type === 'switch'}
  <button
    {id}
    {disabled}
    role="switch"
    aria-label={ariaLabel}
    aria-checked={checked}
    aria-describedby={ariaDescribedby}
    aria-labelledby={ariaLabelledby}
    on:click={toggle}
  />
{:else}
  <input
    {id}
    {disabled}
    {type}
    {checked}
    aria-label={ariaLabel}
    aria-describedby={ariaDescribedby}
    aria-labelledby={ariaLabelledby}
    on:click={toggle}
  />
{/if}

<style lang="sass">
@use 'sass:math'

input, button
  @include tint.effect-focus
  appearance: none
  background-color: transparent
  margin: 0
  width: tint.$size-small
  height: tint.$size-small
  border: tint.$button-border-width solid var(--tint-action)
  transform: translateY(-0.075em)
  display: flex
  align-items: center
  justify-content: center
  color: var(--tint-action-text)
  &:not(:disabled):hover
    background-color: var(--tint-action-secondary-hover)
  &:not(:disabled):active
    background-color: var(--tint-action-secondary-active)
  &:checked
    border-color: transparent
    background-color: var(--tint-action)
    &:not(:disabled):hover
      background-color: var(--tint-action-primary-hover)
    &:not(:disabled):active
      background-color: var(--tint-action-primary-active)
  &::before
    content: ""
    display: none
    background: currentColor

button[role="switch"]
  width: tint.$size-large
  color: var(--tint-action)
  transform: translateY(-0.075em) // ???
  justify-content: flex-start
  border-radius: tint.$button-radius-small
  &::before
    // prevent weird bug in Chrome
    display: block
    forced-color-adjust: none
    width: tint.$size-xxsmall
    height: tint.$size-xxsmall
    border-radius: 50%
    position: relative
    left: math.div(tint.$size-small - tint.$size-xxsmall, 2) - 1px
    transition: left 0.1s ease-out
    @media (prefers-reduced-motion: reduce)
      transition: none
  &[aria-checked="true"]
    background-color: var(--tint-action)
    color: var(--tint-action-text)
    &::before
      left: tint.$size-large - tint.$size-xxsmall - math.div(tint.$size-small - tint.$size-xxsmall, 2) - 1px

input[type="checkbox"]
  border-radius: tint.$size-xxxxsmall
  &::before
    width: 14px
    height: 14px
    transform: scale(1.0001)
    clip-path: polygon(33% 100%, 27% 98%, 2% 73%, 0% 67%, 2% 61%, 8% 58%, 14% 61%, 32% 79%, 85% 3%, 90% 0%, 96% 2%, 100% 7%, 99% 13%, 40% 96%, 37% 99%, 34% 100%, 33% 100%, 33% 100%)

input[type="radio"]
  border-radius: 50%
  &::before
    width: tint.$size-xxsmall
    height: tint.$size-xxsmall
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
