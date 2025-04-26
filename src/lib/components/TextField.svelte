<script lang="ts">
  import IconWarning from '@lib/icons/20-warning.svg?raw'
  import { onMount } from 'svelte'
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
    // The variant of the text field @type {'input' | 'textarea' | undefined}
    variant?: 'input' | 'textarea'
    // The type of the text field @type {string|undefined}
    type?: string | undefined
    // The number of rows of the text field @type {number|undefined}
    rows?: number
    // The maximum height of the text field @type {number|undefined}
    maxHeight?: number
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
    element?: HTMLInputElement | HTMLTextAreaElement | undefined
    // Function to call when the value of the text field changes @type {function}
    oninput?: (e: Event) => void
    // Function to call when the text field is focused @type {function}
    onfocus?: (e: Event) => void
    // Function to call when the text field is blurred @type {function}
    onblur?: (e: Event) => void
  }

  let {
    id,
    value = $bindable(),
    label,
    autocomplete = undefined,
    variant = 'input',
    type = undefined,
    rows = 3,
    maxHeight = undefined,
    helperText = undefined,
    error = undefined,
    disabled = false,
    fillWidth = true,
    ariaDescribedby = undefined,
    element = $bindable(undefined),
    oninput = undefined,
    onfocus = undefined,
    onblur = undefined,
  }: Props = $props()

  if (helperText && ariaDescribedby) {
    throw new Error(
      '[tint] You can not use both helperText and ariaDescribedby',
    )
  }

  function setType(
    type: string | undefined,
    element: HTMLInputElement | HTMLTextAreaElement | undefined,
  ) {
    // throw if textarea and type is not undefined
    if (variant === 'textarea' && type) {
      throw new Error('[tint] You can not use type with a textarea variant')
    }
    if (type && element) {
      element.setAttribute('type', type)
    }
    if (!type && element) {
      element.removeAttribute('type')
    }
  }

  function onTextAreaInput(e: Event) {
    if (oninput) {
      oninput(e)
    }
    updateTextAreaHeight()
  }

  function updateTextAreaHeight() {
    if (!element) return
    const textarea = element as HTMLTextAreaElement
    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }

  $effect(() => {
    setType(type, element)
  })

  $effect(() => {
    if (value !== undefined && variant === 'textarea') {
      updateTextAreaHeight()
    }
  })

  onMount(() => {
    if (value !== undefined && variant === 'textarea') {
      // On some browsers the textarea height is not set correctly on mount
      // so we need to wait for the next tick to set it
      setTimeout(() => updateTextAreaHeight(), 0)
    }
  })
</script>

<div
  class:error
  class:disabled
  class:fillWidth
  class:textarea={variant === 'textarea'}
>
  <div class="box">
    {#if variant === 'textarea'}
      <textarea
        {disabled}
        {id}
        {autocomplete}
        {rows}
        style:max-height={maxHeight ? `${maxHeight}px` : undefined}
        aria-describedby={ariaDescribedby || helperText
          ? 'textfield-helpertext'
          : undefined}
        aria-errormessage={error ? 'textfield-helpertext' : undefined}
        aria-invalid={error ? 'true' : undefined}
        oninput={onTextAreaInput}
        {onfocus}
        {onblur}
        bind:this={element}
        bind:value
        class:filled={value?.length > 0}
        class="input tint--type-input"
      ></textarea>
    {:else}
      <input
        {disabled}
        {id}
        aria-describedby={ariaDescribedby || helperText
          ? 'textfield-helpertext'
          : undefined}
        aria-errormessage={error ? 'textfield-helpertext' : undefined}
        aria-invalid={error ? 'true' : undefined}
        {autocomplete}
        {oninput}
        {onfocus}
        {onblur}
        bind:this={element}
        bind:value
        class:filled={value?.length > 0}
        class="input tint--type-input"
      />
    {/if}
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
.fillWidth
  width: 100%
.box
  position: relative
  width: 100%
  line-height: 0
  border: 2px solid transparent
  border-radius: tint.$input-radius
  display: flex
  > *
    line-height: normal
  > .input
    box-sizing: border-box
    min-height: tint.$size-48
    border-radius: tint.$input-radius
    border: none
    background-color: var(--tint-input-bg)
    color: currentColor
    width: 100%
    height: 100%
    margin: 0
    padding: (tint.$size-12 + 7px) tint.$size-12 (tint.$size-12 - 7px) tint.$size-12
    @include tint.effect-focus
  > textarea
    resize: none
  > label
    color: var(--tint-text-secondary)
    position: absolute
    left: tint.$size-12
    right: initial
    top: calc(tint.$size-48 * 0.5 - 1lh * 0.60)
    transform: scale(1.166)
    // transform: translateY(-55%) scale(1.166)
    transform-origin: left top
    transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1),color 150ms
    pointer-events: none
    @media (prefers-reduced-motion: reduce)
      transition: none

.textarea .box
  min-height: tint.$size-48

.error .input
  padding-inline-end: (tint.$size-8 * 2) + tint.$size-32

.input:focus + label, .input.filled + label, .input:-webkit-autofill + label
  transform: translateY(-55%) scale(1.0)
// has to be seperate as chrome doesn't apply the rule when using :autofill
.input:autofill + label
  transform: translateY(-55%) scale(1.0)

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
