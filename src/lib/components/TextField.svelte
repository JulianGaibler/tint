<script lang="ts">
  import IconWarning from '@lib/icons/20-warning.svg?raw'

  // Id of the text field @type {string}
  export let id: string
  // Value of the text field (can use bind:value) @type {string}
  export let value: string
  // The label of the text field @type {string}
  export let label: string
  // Adds a helper text to the text field @type {string|undefined}
  export let helperText: string | undefined = undefined
  // Marks the text field as invalid and adds the error text and icon @type {string|undefined}
  export let error: string | undefined = undefined
  // Disables the text field @type {boolean}
  export let disabled = false
  // Id of the element that describes the text field @type {string|undefined}
  export let ariaDescribedby: string | undefined = undefined
  // HTML element of the text field @type {HTMLInputElement | undefined}
  export let element: HTMLInputElement | undefined = undefined

  if (helperText && ariaDescribedby) {
    throw new Error(
      '[tint] You can not use both helperText and ariaDescribedby',
    )
  }
</script>

<div class:error class:disabled>
  <div class="box">
    <input
      {disabled}
      {id}
      aria-describedby={ariaDescribedby || helperText
        ? 'textfield-helpertext'
        : undefined}
      aria-errormessage={error ? 'textfield-helpertext' : undefined}
      aria-invalid={error ? 'true' : undefined}
      bind:this={element}
      bind:value
      class:filled={value?.length > 0}
      class="input tint--type-input"
    />
    <label class="tint--type-input-small" for={id}>{label}</label>
    {#if error}
      <span aria-hidden="true" class="warning-icon">{@html IconWarning}</span>
    {/if}
  </div>
  {#if helperText || error}
    <div
      id="textfield-helpertext"
      class="helper-message tint--type-input-small"
    >
      {error || helperText}
    </div>
  {/if}
</div>

<style lang="sass">
.disabled
  opacity: 0.5
.box
  position: relative
  height: tint.$size-48
  line-height: normal
  > .input
    @include tint.effect-focus
    box-sizing: border-box
    background-color: var(--tint-input-bg)
    color: currentColor
    border-radius: tint.$input-radius
    border: 2px solid transparent
    width: 100%
    height: 100%
    margin: 0
    padding: (tint.$size-12 + 7px) tint.$size-12 (tint.$size-12 - 7px) tint.$size-12
  > label
    color: var(--tint-text-secondary)
    position: absolute
    left: tint.$size-12
    right: initial
    top: 50%
    transform: translateY(-55%) scale(1.166)
    transform-origin: left top
    transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1),color 150ms
    @media (prefers-reduced-motion: reduce)
      transition: none
    pointer-events: none

.error .input
  padding-inline-end: (tint.$size-8 * 2) + tint.$size-32

.input:focus + label, .input.filled + label, .input:-webkit-autofill + label
  transform: translateY(-106%) scale(1.0)
// has to be seperate as chrome doesn't apply the rule when using :autofill
.input:autofill + label
  transform: translateY(-106%) scale(1.0)

.helper-message
  line-height: normal
  color: var(--tint-text-secondary)
  padding: 0 tint.$size-12
  padding-top: tint.$size-4

.warning-icon
  pointer-events: none
  position: absolute
  right: 0
  top: 0
  line-height: 0
  margin: tint.$size-12 + tint.$size-2
  color: var(--tint-text-accent)

@media (forced-colors: active)
  .box > .input
    border-color: ButtonText
  .disabled
    opacity: 1
    color: GrayText
    .box > .input, .box > label
      background-color: ButtonFace
      color: GrayText
      border-color: GrayText
    .helper-message, .warning-icon
      color: GrayText
</style>
