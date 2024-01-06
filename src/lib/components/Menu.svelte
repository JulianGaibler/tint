<script lang="ts" context="module">
  import type { MenuItem } from './menu/MenuInternal.svelte'

  export { MENU_SEPARATOR } from './menu/MenuInternal.svelte'
  export type { MenuItem }

  export type ContextClickHandler = (e: Event | MouseEvent) => void
</script>

<script lang="ts">
  import { type Vec2, MenuBehavior } from './menu/MenuInternal.svelte'
  import MenuInternal from './menu/MenuInternal.svelte'

  /**
   * The variant of the menu. If 'context', the menu opens at the location of
   * the mouse event. If 'button', the menu is attached to the element that
   * triggered the event.
   *
   * @type {'context' | 'button'}
   */
  export let variant: 'context' | 'button' = 'button'
  /**
   * The items of the menu. Menu does not open when undefined.
   *
   * @type {MenuItem[] | undefined}
   */
  export let items: MenuItem[] | undefined = undefined
  /**
   * The function to call when the menu should be opened. Ensure event has a
   * target element for the anchor.
   *
   * @type {ContextClickHandler | undefined}
   */
  export const contextClick: (ContextClickHandler) | undefined =
    openMenu

  function openMenu(e: Event | MouseEvent) {
    e.preventDefault()
    if (variant === 'context') {
      // throw if no clientX/Y
      if (!('clientX' in e && 'clientY' in e)) {
        throw new Error('[tint] Event must have clientX and clientY')
      }
      anchor = { x: e.clientX, y: e.clientY }
    } else {
      anchorRef = e.target as HTMLElement
    }
    show = true
  }

  function closeMenu() {
    show = false
    anchorRef = undefined
    anchor = undefined
  }

  let anchorRef: HTMLElement | undefined = undefined
  let anchor: Vec2 | undefined = undefined
  let show: boolean
</script>

{#if show && (anchorRef || anchor) && items}
  <MenuInternal
    behavior={MenuBehavior.MENU}
    {anchorRef}
    {anchor}
    {items}
    hide={closeMenu}
  />
{/if}
