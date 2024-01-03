<script>import IconWarning from "../icons/20-warning.svg?raw";
import IconDropdown from "../icons/14-dropdown.svg?raw";
export let id;
export let value;
export let items;
export let label;
export let helperText = void 0;
export let error = void 0;
export let disabled = false;
export let element = void 0;
function noValue(val) {
  return val === void 0 || val === "";
}
</script>

<div class:error class:disabled>
  <div class="box">
    <select
      {disabled}
      {id}
      aria-describedby={helperText ? 'textfield-helpertext' : undefined}
      aria-errormessage={error ? 'textfield-helpertext' : undefined}
      aria-invalid={error ? 'true' : undefined}
      bind:this={element}
      bind:value
      class:filled={!noValue(value)}
      class="input tint--type-input"
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

<style>.disabled {
  opacity: 0.5;
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
  padding-top: 4px;
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
}</style>
