<script lang="ts">
  import IconWarning from '@lib/icons/20-warning.svg?raw'
  import IconDropdown from '@lib/icons/14-dropdown.svg?raw'

  type T = $$Generic
  interface SelectItem {
    value: T
    label: string
    disabled?: boolean
  }

  // Id of the select @type {string}
  export let id: string
  // Value of the current selected item (can use bind:value) @type {string|undefined}
  export let value: T | undefined
  // The items of the select @type {SelectItem[]}
  export let items: SelectItem[]
  // The label of the select @type {string}
  export let label: string
  // Adds a helper text to the select @type {string|undefined}
  export let helperText: string | undefined = undefined
  // Marks the select as invalid and adds the error text and icon @type {string|undefined}
  export let error: string | undefined = undefined
  // Disables the select @type {boolean}
  export let disabled = false

  function noValue(val: T | undefined) {
    return val === undefined || val === ''
  }
</script>

<div class:error class:disabled>
  <div class="box">
    <select
      {id}
      {disabled}
      bind:value
      aria-invalid={error ? 'true' : undefined}
      aria-describedby={helperText ? 'textfield-helpertext' : undefined}
      aria-errormessage={error ? 'textfield-helpertext' : undefined}
      class="input tint--type-input"
      class:filled={!noValue(value)}
    >
      {#if noValue(value)}
        <option value="" disabled selected hidden></option>
      {/if}
      {#each items as item}
        <option value={item.value} disabled={item.disabled}>{item.label}</option
        >
      {/each}
    </select>
    <label class="tint--type-input-small" for={id}>{label}</label>
    {#if error}
      <span aria-hidden="true" class="warning-icon">{@html IconWarning}</span>
    {/if}
    <span aria-hidden="true" class="dropdown">{@html IconDropdown}</span>
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
  height: tint.$size-xlarge
  line-height: normal
  > .input
    @include tint.effect-focus
    appearance: none
    box-sizing: border-box
    background-color: var(--tint-input-bg)
    color: currentColor
    border-radius: tint.$input-radius
    border: 2px solid transparent
    width: 100%
    height: 100%
    margin: 0
    padding: (tint.$size-xxsmall + 7px) tint.$size-xxsmall (tint.$size-xxsmall - 7px) tint.$size-xxsmall
    padding-inline-end: (tint.$size-xxxsmall * 3) + tint.$size-medium
  > label
    color: var(--tint-text-secondary)
    position: absolute
    left: tint.$size-xxsmall
    right: initial
    top: 50%
    transform: translateY(-55%) scale(1.166)
    transform-origin: left top
    transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1),color 150ms
    pointer-events: none

.input.filled + label, .input:-webkit-autofill + label
  transform: translateY(-106%) scale(1.0)
// has to be seperate as chrome doesn't apply the rule when using :autofill
.input:autofill + label
  transform: translateY(-106%) scale(1.0)

.helper-message
  line-height: normal
  color: var(--tint-text-secondary)
  padding: 0 tint.$size-xxsmall
  padding-top: tint.$size-xxxxsmall

.warning-icon, .dropdown
  pointer-events: none
  position: absolute
  line-height: 0
  right: 0
  top: 0
  margin-block: tint.$size-xsmall
  margin-inline: tint.$size-xxsmall
  color: var(--tint-text-secondary)
.warning-icon
  margin: tint.$size-xxsmall
  right: tint.$size-xsmall
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
    .helper-message, .warning-icon, .dropdown
      color: GrayText
</style>
