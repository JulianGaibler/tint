<script lang="ts">
  import IconWarning from '../icons/20-warning.svg?raw'
  import type { FullAutoFill } from 'svelte/elements'

  interface Props {
    // Id of the text field @type {string}
    id: string
    // Value of the text field (can use bind:value) @type {string}
    value: string
    // The label of the text field @type {string}
    label: string
    // The autocomplete of the text field @type {string|undefined}
    autocomplete?: FullAutoFill | undefined
    // The type of the text field @type {string|undefined}
    type?: string | undefined
    // Adds a helper text to the text field @type {string|undefined}
    helperText?: string | undefined
    // Marks the text field as invalid and adds the error text and icon @type {string|undefined}
    error?: string | undefined
    // Disables the text field @type {boolean}
    disabled?: boolean
    // Fills the width of the parent container @type {boolean}
    fillWidth?: boolean
    // Id of the element that describes the text field @type {string|undefined}
    ariaDescribedby?: string | undefined
    // HTML element of the text field @type {HTMLInputElement | undefined}
    element?: HTMLInputElement | undefined
  }

  let {
    id,
    value = $bindable(),
    label,
    autocomplete = undefined,
    type = undefined,
    helperText = undefined,
    error = undefined,
    disabled = false,
    fillWidth = true,
    ariaDescribedby = undefined,
    element = $bindable(undefined),
  }: Props = $props()

  if (helperText && ariaDescribedby) {
    throw new Error(
      '[tint] You can not use both helperText and ariaDescribedby',
    )
  }

  function setType(
    type: string | undefined,
    element: HTMLInputElement | undefined,
  ) {
    if (type && element) {
      element.setAttribute('type', type)
    }
    if (!type && element) {
      element.removeAttribute('type')
    }
  }

  $effect(() => {
    setType(type, element)
  })
</script>

<div class:error class:disabled class:fillWidth>
  <div class="box">
    <input
      {disabled}
      {id}
      aria-describedby={ariaDescribedby || helperText
        ? 'textfield-helpertext'
        : undefined}
      aria-errormessage={error ? 'textfield-helpertext' : undefined}
      aria-invalid={error ? 'true' : undefined}
      {autocomplete}
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
  width: 100%;
}
.box > .input {
  box-sizing: border-box;
  background-color: var(--tint-input-bg);
  color: currentColor;
  border-radius: 8px;
  border: 2px solid transparent;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 19px 12px 5px 12px;
}
.box > .input:focus-visible {
  outline: 2px solid var(--tint-action);
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
@media (prefers-reduced-motion: reduce) {
  .box > label {
    transition: none;
  }
}

.error .input {
  padding-inline-end: 48px;
}

.input:focus + label, .input.filled + label, .input:-webkit-autofill + label {
  transform: translateY(-106%) scale(1);
}

.input:autofill + label {
  transform: translateY(-106%) scale(1);
}

.helper-message {
  line-height: normal;
  color: var(--tint-text-secondary);
  padding: 0 12px;
  padding-top: 4px;
}

.warning-icon {
  pointer-events: none;
  position: absolute;
  right: 0;
  top: 0;
  line-height: 0;
  margin: 14px;
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
  .disabled .helper-message, .disabled .warning-icon {
    color: GrayText;
  }
}</style>
