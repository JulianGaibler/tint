<script lang="ts">import IconWarning from "../icons/20-warning.svg?raw";
import Button from "./Button.svelte";
  interface Props {
    id: any;
    value?: any;
    label: any;
    accept?: any;
    helperText?: any;
    error?: any;
    disabled?: boolean;
    fillWidth?: boolean;
    ariaDescribedby?: any;
    element?: any;
  }

  let {
    id,
    value = $bindable(void 0),
    label,
    accept = void 0,
    helperText = void 0,
    error = void 0,
    disabled = false,
    fillWidth = true,
    ariaDescribedby = void 0,
    element = $bindable(void 0)
  }: Props = $props();
if (helperText && ariaDescribedby) {
  throw new Error(
    "[tint] You can not use both helperText and ariaDescribedby"
  );
}
let dragging = $state(null);
let draggedOver = $state(false);
function handleDragStart(event) {
  dragging = event.target;
}
function handleDragEnd(event) {
  if (dragging === event.target) {
    dragging = null;
    draggedOver = false;
  }
}
function handleDragEnter() {
  draggedOver = true;
}
function handleDragLeave() {
  draggedOver = false;
}
function updateValue(event) {
  const target = event.target;
  value = target.files?.[0];
}
let acceptString = $derived(typeof accept === "string" ? accept : accept?.join(","));
</script>

<svelte:window
  ondragenter={handleDragStart}
  ondragleave={handleDragEnd}
  ondrop={handleDragEnd}
  ondragend={handleDragEnd}
/>

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
      accept={acceptString}
      bind:this={element}
      type="file"
      class="input tint--type-input"
      class:dragging={!!dragging && !disabled}
      class:draggedOver={!!draggedOver && !disabled}
      onchange={updateValue}
      ondragenter={handleDragEnter}
      ondragover={handleDragEnter}
      ondrop={handleDragEnd}
      ondragleave={handleDragLeave}
    />
    <label class="tint--type-input-small" for={id}>{label}</label>
    {#if error}
      <span aria-hidden="true" class="warning-icon">{@html IconWarning}</span>
    {/if}
    <Button small {disabled} on:click={() => element?.click()}
      >Select file</Button
    >
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
  display: flex;
  gap: 12px;
  align-items: center;
  background-color: var(--tint-input-bg);
  border-radius: 8px;
  color: currentColor;
  box-sizing: border-box;
  border: 2px solid transparent;
  padding-inline-end: 4px;
}
.box > .input {
  border-radius: 8px;
  padding: 19px 12px 5px 12px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  margin: 0;
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
.box > .input::file-selector-button {
  display: none;
}
.box > .input.dragging {
  outline: 2px dashed var(--tint-text-secondary);
  outline-offset: -2px;
}
.box > .input.dragging.draggedOver {
  background-color: var(--tint-action-secondary-hover);
}
.box > label {
  color: var(--tint-text-secondary);
  position: absolute;
  left: 12px;
  right: initial;
  top: 50%;
  transform-origin: left top;
  transform: translateY(-106%) scale(1);
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

.helper-message {
  line-height: normal;
  color: var(--tint-text-secondary);
  padding: 0 12px;
  padding-top: 4px;
}

.warning-icon {
  pointer-events: none;
  line-height: 0;
  margin-block: 14px;
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
