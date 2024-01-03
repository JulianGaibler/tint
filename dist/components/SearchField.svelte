<script>import Button from "./Button.svelte";
import IconSearch from "../icons/20-search.svg?raw";
import { createEventDispatcher } from "svelte";
const dispatch = createEventDispatcher();
export let id;
export let value;
export let label = "Search";
export let disabled = false;
export let elementInput = void 0;
export let elementButton = void 0;
</script>

<div class="box" class:disabled>
  <input
    {disabled}
    {id}
    aria-label={label}
    bind:this={elementInput}
    bind:value
    class:filled={value?.length > 0}
    class="input tint--type-input"
    on:keydown={(e) => {
      if (e.key === 'Enter') {
        dispatch('search', { value })
      }
    }}
    placeholder={label}
  />
  <Button
    ariaLabel="Search"
    bind:element={elementButton}
    disabled={disabled || !value || value.length === 0}
    icon
    on:click={() => dispatch('search', { value })}
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
  outline: 2px solid var(--tint-action);
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
