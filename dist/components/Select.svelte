<script lang="ts">
  import IconWarning from '../icons/20-warning.svg?raw'
  import IconDropdown from '../icons/14-dropdown.svg?raw'

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
  <div class="box">
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

<style>.disabled {
  opacity: 0.5;
}

.fillWidth {
  width: 100%;
}

.box {
  position: relative;
  height: 48px;
  line-height: normal;
}
.box > .input {
  appearance: none;
  box-sizing: border-box;
  background-color: var(--tint-input-bg);
  color: currentColor;
  border-radius: 8px;
  border: 2px solid transparent;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 19px 12px 5px 12px;
  padding-inline-end: 56px;
}
.box > .input:focus-visible {
  outline: 2px solid var(--tint-action-primary);
  outline-offset: 2px;
}
@media (forced-colors: active) {
  .box > .input:focus-visible {
    outline-color: CanvasText;
  }
}
.box > label {
  color: var(--tint-text-secondary);
  position: absolute;
  left: 12px;
  right: initial;
  top: 50%;
  transform: translateY(-55%) scale(1.166);
  transform-origin: left top;
  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms;
  pointer-events: none;
}

.input.filled + label, .input:-webkit-autofill + label {
  transform: translateY(-106%) scale(1);
}

.input:autofill + label {
  transform: translateY(-106%) scale(1);
}

.helper-message {
  line-height: normal;
  color: var(--tint-text-secondary);
  padding: 0 12px;
  padding-block-start: 4px;
}

.warning-icon, .dropdown {
  pointer-events: none;
  position: absolute;
  line-height: 0;
  right: 0;
  top: 0;
  margin-block: 16px;
  margin-inline: 12px;
  color: var(--tint-text-secondary);
}

.warning-icon {
  margin: 14px;
  right: 16px;
  color: var(--tint-text-accent);
}

@media (forced-colors: active) {
  .box > .input {
    border-color: ButtonText;
  }
  .disabled {
    opacity: 1;
    color: GrayText;
  }
  .disabled .box > .input, .disabled .box > label {
    background-color: ButtonFace;
    color: GrayText;
    border-color: GrayText;
  }
  .disabled .helper-message, .disabled .warning-icon, .disabled .dropdown {
    color: GrayText;
  }
}
select option {
  font-size: 0.875rem;
  font-family: "HK Grotesk", -apple-system, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  font-weight: 500;
}
select, select::picker(select) {
  appearance: base-select;
}</style>
