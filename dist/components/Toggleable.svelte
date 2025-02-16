<script lang="ts">
  interface Props {
    // Id of the toggleable element @type {string}
    id: string
    // Type of the toggleable element @type {'checkbox' | 'radio' | 'switch'}
    type?: 'checkbox' | 'radio' | 'switch'
    // Whether the toggleable element is checked (can use bind:checked) @type {boolean}
    checked: boolean
    // Whether the toggleable element is disabled @type {boolean}
    disabled?: boolean
    // aria-label of the toggleable element @type {string | undefined}
    ariaLabel?: string | undefined
    // aria-describedby of the toggleable element @type {string | undefined}
    ariaLabelledby?: string | undefined
    // aria-describedby of the toggleable element @type {string | undefined}
    ariaDescribedby?: string | undefined
    // HTML element of the toggleable element @type {HTMLInputElement | HTMLButtonElement | undefined}
    element?: HTMLInputElement | HTMLButtonElement | undefined
    // Event handler for when the value changes @type {(checked: boolean) => void | undefined}
    onchange?: (checked: boolean) => void
  }

  let {
    id,
    type = 'checkbox',
    checked = $bindable(),
    disabled = false,
    ariaLabel = undefined,
    ariaLabelledby = undefined,
    ariaDescribedby = undefined,
    element = $bindable(undefined),
    onchange = undefined,
  }: Props = $props()

  function toggle() {
    checked = !checked
    onchange?.(checked)
  }
</script>

{#if type === 'switch'}
  <button
    {disabled}
    {id}
    aria-checked={checked}
    aria-describedby={ariaDescribedby}
    aria-label={ariaLabel}
    aria-labelledby={ariaLabelledby}
    bind:this={element}
    onclick={toggle}
    role="switch"
  ></button>
{:else}
  <input
    {checked}
    {disabled}
    {id}
    {type}
    aria-describedby={ariaDescribedby}
    aria-label={ariaLabel}
    aria-labelledby={ariaLabelledby}
    bind:this={element}
    onclick={toggle}
  />
{/if}

<style>input, button {
  appearance: none;
  background-color: transparent;
  margin: 0;
  width: 24px;
  height: 24px;
  border: 2px solid var(--tint-action-primary);
  transform: translateY(-0.075em);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--tint-action-primary-text);
}
input:focus-visible, button:focus-visible {
  outline: 2px solid var(--tint-action-primary);
  outline-offset: 2px;
}
@media (forced-colors: active) {
  input:focus-visible, button:focus-visible {
    outline-color: CanvasText;
  }
}
input:not(:disabled):hover, button:not(:disabled):hover {
  background-color: var(--tint-action-secondary-hover);
}
input:not(:disabled):active, button:not(:disabled):active {
  background-color: var(--tint-action-secondary-active);
}
input::before, button::before {
  content: "";
  display: none;
  background: currentColor;
}

input:checked, button[aria-checked=true] {
  border-color: transparent;
  background-color: var(--tint-action-primary);
}
input:checked:not(:disabled):hover, button[aria-checked=true]:not(:disabled):hover {
  background-color: var(--tint-action-primary-hover);
}
input:checked:not(:disabled):active, button[aria-checked=true]:not(:disabled):active {
  background-color: var(--tint-action-primary-active);
}

button[role=switch] {
  width: 40px;
  color: var(--tint-action-primary);
  transform: translateY(-0.075em);
  justify-content: flex-start;
  border-radius: 80px;
}
button[role=switch]::before {
  display: block;
  forced-color-adjust: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  position: relative;
  left: 5px;
  transition: left 0.1s ease-out;
}
@media (prefers-reduced-motion: reduce) {
  button[role=switch]::before {
    transition: none;
  }
}
button[role=switch][aria-checked=true] {
  background-color: var(--tint-action-primary);
  color: var(--tint-action-primary-text);
}
button[role=switch][aria-checked=true]::before {
  left: 21px;
}

input[type=checkbox] {
  border-radius: 4px;
}
input[type=checkbox]::before {
  width: 14px;
  height: 14px;
  transform: scale(1.0001);
  clip-path: polygon(33% 100%, 27% 98%, 2% 73%, 0% 67%, 2% 61%, 8% 58%, 14% 61%, 32% 79%, 85% 3%, 90% 0%, 96% 2%, 100% 7%, 99% 13%, 40% 96%, 37% 99%, 34% 100%, 33% 100%, 33% 100%);
}

input[type=radio] {
  border-radius: 50%;
}
input[type=radio]::before {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

input[type=radio]:checked::before, input[type=checkbox]:checked::before {
  display: block;
}

input:disabled, button:disabled {
  opacity: 0.5;
}

@media (forced-colors: active) {
  input, button {
    outline-color: CanvasText;
  }
  input:not(:disabled):hover, input:not(:disabled):active, button:not(:disabled):hover, button:not(:disabled):active {
    color: SelectedItem;
    background-color: SelectedItemText;
  }
  input:not(:disabled):active, button:not(:disabled):active {
    border-color: ButtonText;
  }
  input:disabled, button:disabled {
    opacity: 1;
    background-color: ButtonFace;
    color: GrayText;
  }
  input:checked, button:checked {
    background-color: ButtonText;
    color: ButtonFace;
  }
  input:checked:not(:disabled):hover, input:checked:not(:disabled):active, button:checked:not(:disabled):hover, button:checked:not(:disabled):active {
    color: SelectedItemText;
    background-color: SelectedItem;
  }
  input:checked:not(:disabled):active, button:checked:not(:disabled):active {
    border-color: ButtonText;
  }
  input:checked:disabled, button:checked:disabled {
    background-color: GrayText;
    color: ButtonFace;
  }
  button {
    background-color: ButtonFace;
    color: ButtonText;
  }
  button[aria-checked=true] {
    background-color: ButtonText !important;
    color: ButtonFace !important;
  }
  button[aria-checked=true]:not(:disabled):hover, button[aria-checked=true]:not(:disabled):active {
    color: SelectedItemText !important;
    background-color: SelectedItem !important;
  }
  button[aria-checked=true]:not(:disabled):active {
    border-color: ButtonText !important;
  }
  button[aria-checked=true]:disabled {
    background-color: GrayText !important;
    color: ButtonFace !important;
  }
}</style>
