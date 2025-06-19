<script lang="ts" generics="T">
  import Toggleable from './Toggleable.svelte'
  import type { Snippet } from 'svelte'
  import type { GroupStore } from '../stores/index.js'

  interface Props {
    // Id of the toggleable element
    id: string
    // Type of the toggleable element
    type?: 'checkbox' | 'radio' | 'switch'
    // Whether the toggleable element is checked (can use bind:checked)
    checked?: boolean
    // Whether the toggleable element is disabled
    disabled?: boolean
    // Value of the toggleable element (for use with group store)
    value?: T
    // Group store for radio/checkbox groups
    groupStore?: GroupStore<T>
    // Label text (used if no label slot provided)
    label?: string | undefined
    // Optional icon HTML for the label (used only with text label)
    icon?: string | undefined
    // Description text (used if no description slot provided)
    description?: string | undefined
    // HTML element of the toggleable element
    element?: HTMLInputElement | HTMLButtonElement | undefined
    // Event handler for when the value changes
    onchange?: (event: {
      checked: boolean
      value?: T
      groupValue?: GroupStore<T>
    }) => void
    // Label slot
    labelSlot?: Snippet
    // Description slot
    descriptionSlot?: Snippet
    // Additional content slot
    children?: Snippet
    // A space separated list of CSS classes.
    class?: string
  }

  let {
    id,
    type = 'checkbox',
    checked = $bindable(),
    disabled = false,
    value = undefined,
    groupStore = undefined,
    label = undefined,
    icon = undefined,
    description = undefined,
    element = $bindable(undefined),
    onchange = undefined,
    labelSlot,
    descriptionSlot,
    children,
    class: className = '',
  }: Props = $props()

  // Generate IDs for accessibility
  const labelId = $derived(`${id}-label`)
  const descriptionId = $derived(
    description || descriptionSlot ? `${id}-description` : undefined,
  )
</script>

<div class="labeled-toggleable {className}">
  <Toggleable
    {id}
    {type}
    bind:checked
    {disabled}
    {value}
    {groupStore}
    ariaLabelledby={labelId}
    ariaDescribedby={descriptionId}
    bind:element
    {onchange}
  />

  <div class="label-content">
    <label for={id} id={labelId} class="label">
      {#if labelSlot}
        <span>{@render labelSlot()}</span>
      {:else if label}
        {#if icon}
          <span class="icon" aria-hidden="true">{@html icon}</span>
        {/if}
        <span class="text">{label}</span>
      {/if}
    </label>

    {#if description || descriptionSlot}
      <div id={descriptionId} class="description">
        {#if descriptionSlot}
          {@render descriptionSlot()}
        {:else if description}
          {description}
        {/if}
      </div>
    {/if}

    {#if children}
      <div class="additional-content">
        {@render children()}
      </div>
    {/if}
  </div>
</div>

<style>.labeled-toggleable {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  align-items: start;
}

.label-content {
  display: grid;
}

.label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: var(--tint-text-primary);
  cursor: pointer;
}
.label .icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.label .icon :global(svg) {
  width: 100%;
  height: 100%;
  fill: currentColor;
}
.label .text {
  line-height: 1.4;
}

.description {
  color: var(--tint-text-secondary);
  line-height: 1.4;
}

.additional-content {
  margin-block-start: 4px;
}

:global(.labeled-toggleable .toggleable) {
  margin-block-start: 0.125em;
}

:global(.labeled-toggleable:has(input:disabled, button:disabled)) .label {
  color: var(--tint-text-disabled);
  cursor: not-allowed;
}
:global(.labeled-toggleable:has(input:disabled, button:disabled)) .description {
  color: var(--tint-text-disabled);
}</style>
