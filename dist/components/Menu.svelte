<script lang="ts" module>
  import type { MenuItem } from './menu/MenuInternal.svelte'

  // eslint-disable-next-line no-import-assign
  export type { MenuItem }
  export { MENU_SEPARATOR } from './menu/MenuInternal.svelte'

  export type ContextClickHandler = (e: Event | MouseEvent) => void
</script>

<script lang="ts">
  import { MenuBehavior, type Vec2 } from './menu/MenuInternal.svelte'
  import MenuInternal from './menu/MenuInternal.svelte'

  interface Props {
    /**
     * The variant of the menu. If 'context', the menu opens at the location of
     * the mouse event. If 'button', the menu is attached to the element that
     * triggered the event.
     *
     * @type {'context' | 'button'}
     */
    variant?: 'context' | 'button'
    /**
     * The items of the menu. Menu does not open when undefined.
     *
     * @type {MenuItem[] | undefined}
     */
    items?: MenuItem[] | undefined
    /**
     * The function to call when the menu should be opened. Ensure event has a
     * target element for the anchor.
     *
     * @type {ContextClickHandler | undefined}
     */
    contextClick?: ContextClickHandler | undefined
  }

  let {
    variant = 'button',
    items = undefined,
    contextClick = $bindable(undefined),
  }: Props = $props()

  contextClick = openMenu

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

  let anchorRef: HTMLElement | undefined = $state(undefined)
  let anchor: Vec2 | undefined = $state(undefined)
  let show: boolean = $state(false)
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
