<script lang="ts">
  import IconWarning from '@lib/icons/20-warning.svg?raw'
  import Button from './Button.svelte'

  interface Props {
    // Id of the text field @type {string}
    id: string
    // Value of the file input @type {File|undefined}
    value?: File | undefined
    // The types of files that the file input can accept @type {string|string[]|undefined}
    label: string
    // The type of the text field @type {string|undefined}
    accept?: string | string[] | undefined
    // The label of the text field @type {string}
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
    // A space separated list of CSS classes.
    class?: string
  }

  let {
    id,
    value = $bindable(undefined),
    label,
    accept = undefined,
    helperText = undefined,
    error = undefined,
    disabled = false,
    fillWidth = true,
    ariaDescribedby = undefined,
    element = $bindable(undefined),
    class: className = '',
  }: Props = $props()

  if (helperText && ariaDescribedby) {
    throw new Error(
      '[tint] You can not use both helperText and ariaDescribedby',
    )
  }

  let dragging: HTMLElement | null = $state(null)
  let draggedOver = $state(false)

  function handleDragStart(event: DragEvent) {
    dragging = event.target as HTMLElement
  }
  function handleDragEnd(event: DragEvent) {
    if (dragging === event.target) {
      dragging = null
      draggedOver = false
    }
  }

  function handleDragEnter() {
    draggedOver = true
  }
  function handleDragLeave() {
    draggedOver = false
  }

  function updateValue(event: Event) {
    const target = event.target as HTMLInputElement
    value = target.files?.[0]
  }

  let acceptString = $derived(
    typeof accept === 'string' ? accept : accept?.join(','),
  )
</script>

<svelte:window
  ondragenter={handleDragStart}
  ondragleave={handleDragEnd}
  ondrop={handleDragEnd}
  ondragend={handleDragEnd}
/>

<div class:error class:disabled class:fillWidth>
  <div class="box {className}">
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
    <Button small {disabled} onclick={() => element?.click()}
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

<style lang="sass">
.disabled
  opacity: 0.5
.fillWidth
  width: 100%
.box
  position: relative
  height: tint.$size-48
  line-height: normal
  display: flex
  gap: tint.$size-12
  align-items: center
  background-color: var(--tint-input-bg)
  border-radius: tint.$input-radius
  color: currentColor
  box-sizing: border-box
  border: 2px solid transparent
  padding-inline-end: tint.$size-4
  > .input
    border-radius: tint.$input-radius
    padding: (tint.$size-12 + 7px) tint.$size-12 (tint.$size-12 - 7px) tint.$size-12
    box-sizing: border-box
    width: 100%
    height: 100%
    margin: 0
    @include tint.effect-focus
    &::file-selector-button
      display: none
    &.dragging
      outline: 2px dashed var(--tint-text-secondary)
      outline-offset: -2px
      &.draggedOver
        background-color: var(--tint-action-secondary-hover)
  > label
    color: var(--tint-text-secondary)
    position: absolute
    left: tint.$size-12
    right: initial
    top: 50%
    transform-origin: left top
    transform: translateY(-106%) scale(1.0)
    pointer-events: none
    @media (prefers-reduced-motion: reduce)
      transition: none

.error .input
  padding-inline-end: (tint.$size-8 * 2) + tint.$size-32

.helper-message
  line-height: normal
  color: var(--tint-text-secondary)
  padding: 0 tint.$size-12
  padding-block-start: tint.$size-4

.warning-icon
  pointer-events: none
  line-height: 0
  margin-block: tint.$size-12 + tint.$size-2
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
