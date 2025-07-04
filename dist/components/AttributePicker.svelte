<script lang="ts">
  import IconWarning from '../icons/20-warning.svg?raw'
  import IconClose from '../icons/14-close.svg?raw'
  import type { FullAutoFill } from 'svelte/elements'
  import { debounce } from 'lodash-es'
  import MenuInternal, {
    MENU_SEPARATOR,
    MenuBehavior,
    type MenuItem,
  } from './menu/MenuInternal.svelte'
  import { untrack } from 'svelte'
  import { cubicOut } from 'svelte/easing'

  function animateIn(_node: Element, { duration = 150 } = {}) {
    return {
      duration,
      easing: cubicOut,
      css: (t: number) => {
        const percent = 100 - t * 100
        const scale = 0.8 + 0.2 * t
        return `
          clip-path: inset(0 ${percent}% 0 0 round 9999px);
          transform: scale(${scale}, ${scale});
          transform-origin: left center;
        `
      },
    }
  }

  type T = $$Generic
  interface AttributePickerItem {
    value: T
    label: string
  }
  interface DynamicResult {
    items: AttributePickerItem[]
    allowAdd?: boolean
  }

  interface Props {
    // Id of the text field in the attribute picker @type {string}
    id: string
    // Array of values that have been selected @type {T[]}
    value: T[]
    // Available items to select from @type {AttributePickerItem[]}
    items: AttributePickerItem[]
    // When set, allows to customize search results. Results need to be present in items. @type {(search: string) => DynamicResult | Promise<DynamicResult>}
    dynamicItems?: (search: string) => DynamicResult | Promise<DynamicResult>
    // Gets called when a new item is supposed to be added.
    onitemadded?: (label: string) => void
    // The label of the text field @type {string}
    label: string
    // The placeholder of the text field @type {string|undefined}
    placeholder?: string
    // The autocomplete of the text field @type {string|undefined}
    autocomplete?: FullAutoFill | undefined
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
    // A space separated list of CSS classes.
    class?: string
  }

  let {
    id,
    value = $bindable(),
    items,
    onitemadded = undefined,
    dynamicItems = undefined,
    label,
    placeholder = 'Add an attribute...',
    autocomplete = undefined,
    helperText = undefined,
    error = undefined,
    disabled = false,
    fillWidth = true,
    ariaDescribedby = undefined,
    element = $bindable(undefined),
    class: className = '',
  }: Props = $props()

  let fieldValue = $state('')
  let showMenu = $state(false)
  let boxElement = $state<HTMLElement | undefined>(undefined)
  let isUserTyping = $state(false) // Track when user is actively typing
  let menuId = $derived(`${id}-menu`)
  let debouncedDynamicItems = $derived(
    dynamicItems
      ? debounce((search: string) => {
          const result = dynamicItems(search)

          if (result instanceof Promise) {
            result
              .then((promiseResult) => {
                // Only update if this search is still relevant
                untrack(() => {
                  if (search === fieldValue) {
                    updateMenuItems(
                      promiseResult.items,
                      promiseResult.allowAdd || false,
                      true,
                    )
                  }
                })
              })
              .catch((error) => {
                console.error('Search failed:', error)
              })
          } else {
            // Synchronous results
            untrack(() => {
              if (search === fieldValue) {
                updateMenuItems(result.items, result.allowAdd || false, true)
              }
            })
          }

          return result
        }, 300)
      : undefined,
  )

  // ---- Menu items

  let menuItems = $state<MenuItem<T | undefined>[]>([])

  function updateMenuItems(
    items: AttributePickerItem[],
    allowAdd = false,
    open = false,
  ) {
    if (items.length === 0 && !allowAdd) {
      menuItems = []
      return
    }

    const updatedMenuItems: MenuItem<T | undefined>[] = items.map((item) => ({
      label: item.label,
      checked: value.includes(item.value),
      data: item.value,
      onClick: () => {
        toggleTag(item.value)
      },
    }))

    if (allowAdd) {
      if (items.length) {
        updatedMenuItems.push(MENU_SEPARATOR)
      }
      updatedMenuItems.push({
        label: `Add "${fieldValue}"`,
        data: undefined,
        onClick: () => {
          showMenu = false
          isUserTyping = false // User added an item, not typing anymore
          onitemadded?.(fieldValue)
          fieldValue = ''
        },
      })
    }

    menuItems = updatedMenuItems
    if (open) {
      showMenu = true
    }
  }

  let lastProcessedFieldValue = $state('')

  $effect(() => {
    // Only process field value changes if it's actually different to prevent loops
    if (fieldValue !== lastProcessedFieldValue) {
      lastProcessedFieldValue = fieldValue
      fieldValueChanged(fieldValue)
    }
  })
  function fieldValueChanged(_value: string) {
    if (debouncedDynamicItems === undefined) {
      const filteredItems = items.filter((item) =>
        item.label.toLowerCase().includes(fieldValue.toLowerCase()),
      )
      updateMenuItems(filteredItems)
      return
    }

    if (fieldValue.length === 0) return
    untrack(() => {
      debouncedDynamicItems(fieldValue)

      // Clear menu immediately to show loading state
      menuItems = []

      // The debounced function will handle the result when it executes
    })
  }

  $effect(() => {
    if (value === undefined) return
    untrack(() => {
      if (menuItems.length === 0) return
      menuItems = menuItems.map((item) => {
        if (item === MENU_SEPARATOR || !('data' in item)) {
          return item
        }
        return {
          ...item,
          checked: item.data ? value.includes(item.data) : undefined,
        }
      })
    })
  })

  // ---- Attribute validation

  if (helperText && ariaDescribedby) {
    throw new Error(
      '[tint] You can not use both helperText and ariaDescribedby',
    )
  }

  // ---- Event handlers

  function fieldOnInput() {
    isUserTyping = true // Mark that user is actively typing
    if (menuItems.length > 0 && fieldValue.length > 0) {
      showMenu = true
    } else {
      showMenu = false
    }
  }

  function onBoxClick(e: MouseEvent) {
    // focus the text field but only if the box has been clicked directly
    // and not a child element
    if (e.target === boxElement) {
      element?.focus()
    }
  }

  function toggleTag(id: T) {
    if (disabled) return
    // Don't reset typing state or clear field when toggling tags
    // Let the user continue searching after selecting items
    if (value.includes(id)) {
      value = value.filter((item) => item !== id)
    } else {
      value = [...value, id]
    }
  }
  function closeMenu() {
    showMenu = false
    // Don't automatically clear the field or reset typing state when menu closes
    // Let the user continue typing if they want to search more
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      isUserTyping = false // User pressed escape, not typing anymore
      fieldValue = ''
      showMenu = false
    }
  }

  function onBlur() {
    if (!showMenu) {
      isUserTyping = false // User stopped typing when field loses focus
      fieldValue = ''
    }
  }

  // Protect fieldValue from being reset while user is typing
  // This prevents external items updates from interfering with user input
  $effect(() => {
    const fieldHasFocus = element === document.activeElement

    // Only interfere with field value if user isn't typing and field doesn't have focus
    // and they're not actively searching (field empty when they started)
    if (!isUserTyping && !fieldHasFocus) {
      // For AttributePicker, we're now more permissive - let users keep their search terms
      // unless they explicitly clear it via blur/escape
    }
  })
</script>

<div class:error class:disabled class:fillWidth>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class="box {className}"
    class:fake-focus={showMenu}
    onclick={onBoxClick}
    bind:this={boxElement}
  >
    <div class="tags" role="listbox" aria-label={label}>
      {#each value as tagId (tagId)}
        {@const label =
          items.find((item) => item.value === tagId)?.label || 'Unknown'}
        {@const labelId = `${id}-tag-${tagId}`}
        <div
          class="tag tint--type-input"
          role="option"
          aria-selected="true"
          in:animateIn
        >
          <span id={labelId}>{label}</span>
          <button
            title="Remove"
            {disabled}
            onclick={() => toggleTag(tagId)}
            aria-describedby={labelId}
          >
            {@html IconClose}
          </button>
        </div>
      {/each}
    </div>
    <input
      {disabled}
      {id}
      aria-describedby={ariaDescribedby || helperText
        ? 'textfield-helpertext'
        : undefined}
      aria-errormessage={error ? 'textfield-helpertext' : undefined}
      aria-invalid={error ? 'true' : undefined}
      role="combobox"
      aria-autocomplete="list"
      aria-expanded={showMenu}
      aria-controls={showMenu ? menuId : undefined}
      {autocomplete}
      {placeholder}
      oninput={fieldOnInput}
      onkeydown={onKeyDown}
      onblur={onBlur}
      bind:this={element}
      bind:value={fieldValue}
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
  {#if showMenu && element && menuItems}
    <MenuInternal
      id={menuId}
      behavior={MenuBehavior.AUTOCOMPLETE}
      anchorRef={element}
      closeOnClick={false}
      items={menuItems}
      hide={closeMenu}
    />
  {/if}
</div>

<style>.disabled {
  opacity: 0.5;
}

.fillWidth {
  width: 100%;
}

.box {
  box-sizing: border-box;
  position: relative;
  cursor: text;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  line-height: normal;
  width: 100%;
  line-height: 0;
  background-color: var(--tint-input-bg);
  border: 2px solid transparent;
  border-radius: 8px;
  padding: 23px 12px 5px 12px;
}
.box > * {
  line-height: normal;
}
.box > .input {
  box-sizing: border-box;
  color: currentColor;
  background: unset;
  border: none;
  min-height: 28px;
  flex: 1;
  margin: 0;
}
.box > .input::placeholder {
  color: var(--tint-text-secondary);
  opacity: 1;
}
.box > .input:focus-visible {
  outline: none;
}
.box:has(:global(.input:focus-visible)), .box.fake-focus {
  outline: 2px solid var(--tint-action-primary);
  outline-offset: 2px;
}
@media (forced-colors: active) {
  .box:has(:global(.input:focus-visible)), .box.fake-focus {
    outline-color: CanvasText;
  }
}
.box > label {
  color: var(--tint-text-secondary);
  position: absolute;
  left: 12px;
  right: initial;
  top: 5px;
  transform-origin: left top;
  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms;
  pointer-events: none;
}
@media (prefers-reduced-motion: reduce) {
  .box > label {
    transition: none;
  }
}
.box .tags {
  display: contents;
}
.box .tag {
  background: var(--tint-bg);
  border-radius: 64px;
  display: flex;
  gap: 2px;
  align-items: center;
  padding-inline-end: 2px;
  cursor: initial;
  border: 1px solid transparent;
}
.box .tag > span {
  padding-block: 4px;
  padding-inline-start: 8px;
  flex-grow: 1;
}
.box .tag > button {
  background: none;
  border: none;
  border-radius: 64px;
  height: calc(1lh + 4px);
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  flex: 0;
}
.box .tag > button:focus-visible {
  outline: 2px solid var(--tint-action-primary);
  outline-offset: 2px;
}
@media (forced-colors: active) {
  .box .tag > button:focus-visible {
    outline-color: CanvasText;
  }
}
.box .tag > button:not(:disabled):hover {
  background-color: var(--tint-action-secondary-hover);
}
.box .tag > button:not(:disabled):active {
  background-color: var(--tint-action-secondary-active);
}
@media (forced-colors: active) {
  .box .tag > button:not(:disabled):hover, .box .tag > button:not(:disabled):active {
    background-color: SelectedItem;
    border-color: SelectedItemText;
    color: SelectedItemText;
  }
  .box .tag > button:not(:disabled):active {
    border-color: SelectedItem;
  }
}

.error .input {
  padding-inline-end: 48px;
}

.helper-message {
  line-height: normal;
  color: var(--tint-text-secondary);
  padding: 0 12px;
  padding-block-start: 4px;
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
