<script lang="ts">
  import IconWarning from '@lib/icons/20-warning.svg?raw'
  import IconDropdown from '@lib/icons/14-dropdown.svg?raw'

  type T = $$Generic
  interface SelectItem {
    value: T
    label: string
    disabled?: boolean
  }

  interface Props {
    // Id of the select @type {string}
    id: string
    // Value of the current selected item (can use bind:value) @type {string|undefined}
    value: T | undefined
    // The items of the select @type {SelectItem[]}
    items: SelectItem[]
    // The label of the select @type {string}
    label: string
    // Adds a helper text to the select @type {string|undefined}
    helperText?: string | undefined
    // Marks the select as invalid and adds the error text and icon @type {string|undefined}
    error?: string | undefined
    // Disables the select @type {boolean}
    disabled?: boolean
    // Fills the width of the parent container @type {boolean}
    fillWidth?: boolean
    // Id of the element that describes the select @type {string|undefined}
    ariaDescribedby?: string | undefined
    // HTML element of the select @type {HTMLSelectElement | undefined}
    element?: HTMLSelectElement | undefined
    // Event handler for when the value changes @type {(e: Event) => void|undefined}
    onchange?: (e: Event) => void
    // A space separated list of CSS classes.
    class?: string
  }

  let {
    id,
    value = $bindable(),
    items,
    label,
    helperText = undefined,
    error = undefined,
    disabled = false,
    fillWidth = true,
    ariaDescribedby = undefined,
    element = $bindable(undefined),
    onchange = undefined,
    class: className = '',
  }: Props = $props()

  if (helperText && ariaDescribedby) {
    throw new Error(
      '[tint] You can not use both helperText and ariaDescribedby',
    )
  }

  function noValue(val: T | undefined) {
    return val === undefined || val === ''
  }
</script>

<div class:error class:disabled class:fillWidth>
  <div class="box {className}">
    <select
      {disabled}
      {id}
      aria-describedby={ariaDescribedby || helperText
        ? 'textfield-helpertext'
        : undefined}
      aria-errormessage={error ? 'textfield-helpertext' : undefined}
      aria-invalid={error ? 'true' : undefined}
      bind:this={element}
      bind:value
      {onchange}
      class:filled={!noValue(value)}
      class="input tint--type-input"
    >
      {#if noValue(value)}
        <option value="" disabled selected hidden></option>
      {/if}
      {#each items as item (item.value)}
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
.fillWidth
  width: 100%
.box
  position: relative
  height: tint.$size-48
  line-height: normal
  > .input
    appearance: none
    box-sizing: border-box
    background-color: var(--tint-input-bg)
    color: currentColor
    border-radius: tint.$input-radius
    border: 2px solid transparent
    width: 100%
    height: 100%
    margin: 0
    padding: (tint.$size-12 + 7px) tint.$size-12 (tint.$size-12 - 7px) tint.$size-12
    padding-inline-end: (tint.$size-8 * 3) + tint.$size-32
    @include tint.effect-focus
  > label
    color: var(--tint-text-secondary)
    position: absolute
    left: tint.$size-12
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
  padding: 0 tint.$size-12
  padding-block-start: tint.$size-4

.warning-icon, .dropdown
  pointer-events: none
  position: absolute
  line-height: 0
  right: 0
  top: 0
  margin-block: tint.$size-16
  margin-inline: tint.$size-12
  color: var(--tint-text-secondary)
.warning-icon
  margin: tint.$size-12 + tint.$size-2
  right: tint.$size-16
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


select
  option
    @include tint.type-class(input)
  &, &::picker(select)
    appearance: base-select
</style>
