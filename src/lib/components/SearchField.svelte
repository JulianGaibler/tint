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
    ariaLabel="Search"
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

<style lang="sass">
.disabled
  opacity: 0.5
.box
  position: relative
  height: tint.$size-48
  width: 100%
  line-height: normal
  > :global(button)
    position: absolute
    right: 0
    margin: tint.$size-8
    visibility: hidden
  > .input
    position: absolute
    inset: 0
    box-sizing: border-box
    background: transparent
    border-radius: tint.$input-radius
    border: 2px solid transparent
    width: 100%
    height: 100%
    margin: 0
    padding: tint.$size-12 tint.$size-24
    padding-inline-start: tint.$size-4
    padding-inline-end: (tint.$size-8 * 2) + tint.$size-32
    transition: padding-inline-start 0.2s ease-in-out, background-color 0.2s ease-in-out
    @include tint.effect-focus
    @media (prefers-reduced-motion: reduce)
      transition: none
    &::placeholder
      color: var(--tint-text-secondary)

.input:focus, .input.filled, .input:-webkit-autofill
  padding-inline-start: tint.$size-24
  background-color: var(--tint-input-bg)
  & + :global(button)
    visibility: visible
// has to be seperate as chrome doesn't apply the rule when using :autofill
.input:autofill
  padding-inline-start: tint.$size-24
  background-color: var(--tint-input-bg)
  & + :global(button)
    visibility: visible

@media (forced-colors: active)
  .box > .input
    border-color: ButtonText
    padding-inline-start: tint.$size-24
  .disabled
    opacity: 1
    color: GrayText
    > .input
      background-color: ButtonFace
      color: GrayText
      border-color: GrayText
</style>
