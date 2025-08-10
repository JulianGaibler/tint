<script lang="ts">
  import Button from './Button.svelte'
  import IconSearch from '../icons/20-search.svg?raw'

  interface Props {
    // Id of the text field @type {string}
    id: string
    // Value of the text field (can use bind:value) @type {string}
    value: string
    // The label of the text field @type {string}
    label?: string
    // Disables the text field @type {boolean}
    disabled?: boolean
    // HTML element of the text field @type {HTMLInputElement | undefined}
    elementInput?: HTMLInputElement | undefined
    // HTML element of the button @type {HTMLButtonElement | undefined}
    elementButton?: HTMLButtonElement | undefined
    // Event handler for when the search button is clicked @type {(value: string) => void}
    onsearch?: (term: string) => void
    // A space separated list of CSS classes.
    class?: string
  }

  let {
    id,
    value = $bindable(),
    label = 'Search',
    disabled = false,
    elementInput = $bindable(undefined),
    elementButton = $bindable(undefined),
    onsearch = undefined,
    class: className = '',
  }: Props = $props()
</script>

<div class="box {className}" class:disabled>
  <input
    {disabled}
    {id}
    aria-label={label}
    bind:this={elementInput}
    bind:value
    class:filled={value?.length > 0}
    class="input tint--type-input"
    onkeydown={(e) => {
      if (e.key === 'Enter') {
        onsearch?.(value)
      }
    }}
    placeholder={label}
  />
  <Button
    aria-label="Search"
    bind:element={elementButton}
    disabled={disabled || !value || value.length === 0}
    icon
    onclick={() => onsearch?.(value)}
    small
    variant="ghost"
  >
    {@html IconSearch}
  </Button>
</div>

<style>.disabled {
  opacity: 0.5;
}

.box {
  position: relative;
  height: 48px;
  width: 100%;
  line-height: normal;
}
.box > :global(button) {
  position: absolute;
  right: 0;
  margin: 8px;
  visibility: hidden;
}
.box > .input {
  color: var(--tint-text);
  position: absolute;
  inset: 0;
  box-sizing: border-box;
  background: transparent;
  border-radius: 8px;
  border: 2px solid transparent;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 12px 24px;
  padding-inline-start: 4px;
  padding-inline-end: 48px;
  transition: padding-inline-start 0.2s ease-in-out, background-color 0.2s ease-in-out;
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
@media (prefers-reduced-motion: reduce) {
  .box > .input {
    transition: none;
  }
}
.box > .input::placeholder {
  color: var(--tint-text-secondary);
}

.input:focus, .input.filled, .input:-webkit-autofill {
  padding-inline-start: 24px;
  background-color: var(--tint-input-bg);
}
.input:focus + :global(button), .input.filled + :global(button), .input:-webkit-autofill + :global(button) {
  visibility: visible;
}

.input:autofill {
  padding-inline-start: 24px;
  background-color: var(--tint-input-bg);
}
.input:autofill + :global(button) {
  visibility: visible;
}

@media (forced-colors: active) {
  .box > .input {
    border-color: ButtonText;
    padding-inline-start: 24px;
  }
  .disabled {
    opacity: 1;
    color: GrayText;
  }
  .disabled > .input {
    background-color: ButtonFace;
    color: GrayText;
    border-color: GrayText;
  }
}</style>
