<script lang="ts" module>
  // --------
  // Constants
  // ----

  /** Padding of menus to each side of the window */
  export const WINDOW_PADDING = 8
  /** Distance between menus */
  export const TOP_MENU_OFFSET = 4
  export const LEFT_MENU_OFFSET = 4

  // --------
  // Public types
  // ----
  export const MENU_SEPARATOR = Symbol('seperator')

  export const MenuBehavior = {
    MENU: 0,
    SELECT: 1,
    AUTOCOMPLETE: 2,
  } as const

  export type MenuBehaviorType =
    (typeof MenuBehavior)[keyof typeof MenuBehavior]

  export type MenuItem<T = unknown> =
    | {
        label: string
        checked?: boolean | (() => boolean)
        onClick: () => void
        data?: T
        disabled?: boolean
      }
    | {
        label: string
        items: MenuItem<T>[]
        disabled?: boolean
      }
    | typeof MENU_SEPARATOR

  // --------
  // Local types
  // ----

  export type Vec2 = {
    x: number
    y: number
  }

  /** Describes information that is important for rendering the context menu */
  export type ActiveMenu = {
    focus: number
    position: {
      x: number
      y: number
      endAlign: boolean
      height: number | undefined
      minWidth: number | undefined
    }
    scrollPosition: number
    menuPath: number[]
  }

  /**
   * Describes information that is not used during rendering but is used for
   * calculations
   */
  export type ActiveMenuMeta = {
    parentIndex: number
    parentItemRect: DOMRect
    menuRect: DOMRect
    menuRef: HTMLElement | null
    itemRefs: { [key: number]: HTMLElement | null }
    searchItems: { label: string; index: number }[]
    searchTerm: string
    lastSearchTime: number
  }
</script>

<script lang="ts">
  import {
    createActiveMenu,
    addSubMenu,
    getMenuItems,
    calculatePosition,
    checkIfInTriangle,
    removeSubMenu,
  } from './utils'
  import ArrowIcon from '../../icons/14-chevron-menu-right.svg?raw'
  import ArrowUp from '../../icons/14-chevron-menu-up.svg?raw'
  import ArrowDown from '../../icons/14-chevron-menu-down.svg?raw'
  import CheckIcon from '../../icons/14-check.svg?raw'
  import { throttle } from 'lodash-es'
  import { matchSorter } from 'match-sorter'
  import { onMount, onDestroy, tick } from 'svelte'
  import * as focusTrap from 'focus-trap'

  interface Props {
    id?: string
    anchorRef?: HTMLElement
    anchor?: Vec2 | undefined
    items: MenuItem[]
    behavior: MenuBehaviorType
    closeOnClick?: boolean
    hide: () => void
    onItemFocus?: (item: MenuItem) => void
    recalculatePosition?: () => void
    lastActiveElement?: HTMLElement
  }

  let {
    id = undefined,
    anchorRef = undefined,
    anchor = undefined,
    items,
    behavior,
    closeOnClick = true,
    hide,
    onItemFocus = undefined,
    recalculatePosition = $bindable(undefined),
    lastActiveElement = $bindable(undefined),
  }: Props = $props()

  // React.useState
  let displayActiveMenus: ActiveMenu[] = $state([])
  let clickedItem: [number, number] | null = $state(null)
  let anchorRect: DOMRect | null = null
  let overlayRef: HTMLElement | null = null
  let menuRole = $derived(
    behavior === MenuBehavior.AUTOCOMPLETE ? 'listbox' : 'menu',
  )
  const ws: {
    activeMenusRef: ActiveMenu[]
    activeMenusMeta: ActiveMenuMeta[]
    unixTimeout: {
      unix: boolean
      timeout: null | ReturnType<typeof setTimeout>
    }
    queuedSafeArea: null | number
    safeArea: (Vec2 | null)[]
  } = {
    activeMenusRef: [],
    activeMenusMeta: [],
    unixTimeout: { unix: true, timeout: null },
    queuedSafeArea: null,
    safeArea: [null, null, null],
  }
  let trap: focusTrap.FocusTrap | null = null

  const setMenuRefHandler = {
    set: function (_target: unknown, prop: string, value: HTMLElement | null) {
      // ignore if value === undefined
      if (value === undefined) return true
      const menu = parseInt(prop, 10)
      value?.showPopover()
      setMenuRef(menu, value)
      return true
    },
  }
  const setMenuRefProxy = new Proxy(ws.activeMenusMeta, setMenuRefHandler) as {
    [key: number]: HTMLElement | null
  }

  const setItemRefHandler = {
    set: function (obj: unknown, prop: string, value: HTMLElement | null) {
      if (value === undefined) return true
      const [i, j] = prop.split('-')
      const menu = parseInt(i, 10)
      const item = parseInt(j, 10)
      setItemRef(menu, item, value)
      return true
    },
  }
  const setItemRefProxy = new Proxy(ws.activeMenusMeta, setItemRefHandler) as {
    [key: string]: HTMLElement | null
  }

  function commitActiveMenus() {
    displayActiveMenus = [...ws.activeMenusRef]
    tick().then(() => {
      trap?.updateContainerElements(getTrapElements())
    })
  }

  function setMenuRef(menu: number, menuRef: HTMLElement | null) {
    const activeMenu = ws.activeMenusRef[menu]
    const activeMenuMeta = ws.activeMenusMeta[menu]

    if (!menuRef || activeMenuMeta.menuRef === menuRef) return

    activeMenuMeta.menuRef = menuRef
    activeMenuMeta.menuRect = menuRef.getBoundingClientRect()

    if (behavior !== MenuBehavior.SELECT) {
      if (menuRef.childNodes[0] && menuRef.childNodes[0].nodeType === 1) {
        ;(menuRef.childNodes[0] as HTMLElement)?.focus({ preventScroll: true })
      }
      activeMenu.position = calculatePosition(
        menu,
        activeMenuMeta.parentItemRect,
        activeMenuMeta.menuRect,
        behavior,
      )
    } else {
      const i = getMenuItems(items, activeMenu.menuPath)
      const focus = i.findIndex(
        (item) => typeof item === 'object' && 'checked' in item && item.checked,
      )
      const itemRef = activeMenuMeta.itemRefs[focus]

      activeMenu.position = calculatePosition(
        menu,
        activeMenuMeta.parentItemRect,
        activeMenuMeta.menuRect,
        behavior,
        itemRef
          ? itemRef.getBoundingClientRect().y - activeMenuMeta.menuRect.y
          : undefined,
      )
    }

    if (ws.queuedSafeArea != null && ws.queuedSafeArea === menu) {
      const height =
        activeMenu.position.height || activeMenuMeta.menuRect.height

      if (ws.safeArea[1] === null) {
        ws.safeArea[1] = { x: 0, y: 0 }
      }
      if (ws.safeArea[2] === null) {
        ws.safeArea[2] = { x: 0, y: 0 }
      }

      ws.safeArea[1].x = activeMenu.position.x
      ws.safeArea[1].y = activeMenu.position.y
      ws.safeArea[2].x = activeMenu.position.x
      ws.safeArea[2].y = activeMenu.position.y + height

      ws.queuedSafeArea = null
    }
    commitActiveMenus()
  }

  onMount(() => {
    recalculatePosition = handleAnchorMove

    if (anchorRef) {
      anchorRect = anchorRef.getBoundingClientRect()
    } else if (anchor) {
      const rect = new DOMRect()
      rect.x = anchor.x
      rect.y = anchor.y
      anchorRect = rect
    }

    if (!anchorRect) return

    ws.unixTimeout.timeout = setTimeout(() => {
      ws.unixTimeout.timeout = null
    }, 300)

    const [activeMenu, activeMenuMeta] = createActiveMenu(
      behavior,
      -1,
      anchorRect,
      [],
      items,
    )
    ws.activeMenusRef = [activeMenu]
    ws.activeMenusMeta = [activeMenuMeta]
    commitActiveMenus()

    tick().then(() => {
      lastActiveElement = document.activeElement as HTMLElement
      if (behavior === MenuBehavior.AUTOCOMPLETE) {
        return
      }
      trap = focusTrap.createFocusTrap(getTrapElements(), {
        clickOutsideDeactivates: false,
        escapeDeactivates: false,
        allowOutsideClick: false,
        returnFocusOnDeactivate: false,
        fallbackFocus: '.context_menu ul',
        onPostDeactivate: () => {
          lastActiveElement?.focus()
        },
      })
      trap?.activate()
    })
  })

  onDestroy(() => {
    trap?.deactivate()
    if (behavior === MenuBehavior.AUTOCOMPLETE) {
      lastActiveElement?.focus()
    }
  })

  function getTrapElements(): HTMLElement[] {
    return [
      ...(overlayRef ? [overlayRef] : []),
      ...ws.activeMenusMeta
        .map((m) => m.menuRef)
        .filter((m): m is HTMLElement => m !== null),
    ]
  }

  /**
   * Call on item that has been clicked.
   *
   * @param menu Menu index
   * @param index Item index
   */
  function handleItemActivation(menu: number, index: number) {
    if (clickedItem) return
    const item = getMenuItems(items, ws.activeMenusRef[menu].menuPath)[index]
    if (!(typeof item === 'object')) return
    if ('disabled' in item && item.disabled) return

    if ('onClick' in item) {
      if (closeOnClick) {
        const itemRef = ws.activeMenusMeta[menu].itemRefs[index]
        itemRef?.addEventListener('animationend', () => {
          item.onClick()
          hide()
          itemRef?.removeEventListener('animationend', () => {})
          clickedItem = null
        })
      } else {
        item.onClick()
        setTimeout(() => {
          clickedItem = null
        }, 100)
      }
      clickedItem = [menu, index]
      return
    }
    if ('items' in item) {
      const newMenuArrays = addSubMenu(
        behavior,
        items,
        ws.activeMenusRef,
        ws.activeMenusMeta,
        menu,
        index,
      )
      if (newMenuArrays) {
        ws.activeMenusRef = newMenuArrays[0]
        ws.activeMenusMeta = newMenuArrays[1]
        commitActiveMenus()
      }
      return
    }
  }

  /**
   * Sets the safe area to given menu. If the menu is not rendered yet, the safe
   * area is queued and set once the menu is rendered.
   *
   * @param menu Menu index
   */
  function setSafeZoneMenu(menu: number) {
    // check if there is a submenu after the current menu.
    // if there isn't it hasn't been rendered yet and we need to queue it
    if (!ws.activeMenusMeta[menu]) {
      ws.queuedSafeArea = menu
      return
    }

    const nextMenu = ws.activeMenusRef[menu]
    const nextMenuMeta = ws.activeMenusMeta[menu]

    const flipWidth = nextMenu.position.endAlign
      ? 0
      : nextMenuMeta.menuRect.width

    if (ws.safeArea[1] === null) {
      ws.safeArea[1] = { x: 0, y: 0 }
    }
    if (ws.safeArea[2] === null) {
      ws.safeArea[2] = { x: 0, y: 0 }
    }

    ws.safeArea[1].x = nextMenu.position.x + flipWidth
    ws.safeArea[1].y = nextMenu.position.y

    ws.safeArea[2].x = nextMenu.position.x + flipWidth
    ws.safeArea[2].y = nextMenu.position.y + nextMenuMeta.menuRect.height
  }

  /**
   * Handle event if mouse leaves a given menu.
   *
   * @param menu Menu index
   */
  function handleMenuMouseLeave(menu: number) {
    if (
      behavior === MenuBehavior.SELECT ||
      behavior === MenuBehavior.AUTOCOMPLETE
    )
      return
    if (menu !== ws.activeMenusRef.length - 1) return
    const activeMenu = ws.activeMenusRef[menu]
    if (activeMenu.focus === -1) return
    activeMenu.focus = -1
    commitActiveMenus()
  }

  /**
   * Checks if the content of a menu is cropped at the top or bottom.
   *
   * @param menu Menu index
   * @param event OnScroll Event
   */
  function checkOverflow(menu: number, event: Event) {
    // get ref to the menu
    const menuRef = event.target as HTMLElement
    if (!menuRef) return

    let scrollPosition = 0
    if (menuRef.scrollTop === 0) {
      scrollPosition = -1
    } else if (
      menuRef.scrollHeight - menuRef.scrollTop ===
      menuRef.clientHeight
    ) {
      scrollPosition = 1
    }
    if (scrollPosition !== ws.activeMenusRef[menu].scrollPosition) {
      ws.activeMenusRef[menu].scrollPosition = scrollPosition
      commitActiveMenus()
    }
  }

  function setItemRef(menu: number, item: number, itemRef: HTMLElement | null) {
    const activeMenuMeta = ws.activeMenusMeta[menu]
    if (!itemRef || activeMenuMeta.itemRefs[item] === itemRef) return

    if (behavior !== MenuBehavior.AUTOCOMPLETE) {
      const i = getMenuItems(items, ws.activeMenusRef[menu].menuPath)[item]
      if (typeof i === 'object' && 'checked' in i && i.checked) {
        itemRef.focus({ preventScroll: true })
      }
    }
    activeMenuMeta.itemRefs[item] = itemRef
  }

  /**
   * Event handler for when the user releases the mouse button. Handles unix
   * style clicks.
   */
  const handleMouseUp = () => {
    if (behavior !== MenuBehavior.MENU) return
    if (ws.unixTimeout.timeout !== null) {
      clearTimeout(ws.unixTimeout.timeout)
      ws.unixTimeout.timeout = null
      ws.unixTimeout.unix = false
      return
    }
    if (!ws.unixTimeout.unix) return
    const activeMenu = ws.activeMenusRef[ws.activeMenusRef.length - 1]
    if (activeMenu.focus === -1) {
      hide()
      return
    }
    const item = getMenuItems(
      items,
      ws.activeMenusRef[ws.activeMenusRef.length - 1].menuPath,
    )[activeMenu.focus]
    if (!(typeof item === 'object' && 'items' in item)) {
      handleItemActivation(ws.activeMenusRef.length - 1, activeMenu.focus)
    } else {
      clickedItem = [ws.activeMenusRef.length - 1, activeMenu.focus]
    }
  }

  /**
   * Handles keyboard navigation of menu
   *
   * @param event KeyboardEvent
   */
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      hide()
      return
    }
    const currentMenu = ws.activeMenusRef[ws.activeMenusRef.length - 1]
    const menuLength = getMenuItems(items, currentMenu.menuPath).length

    const changeCurrentMenuFocus = (index: number, fromUserInput = false) => {
      // Direction where the focus is changed
      const direction = index > currentMenu.focus ? 1 : -1
      // If the new focus is out of bounds already, do nothing
      if (index < 0 || index >= menuLength) return

      // Loop until a selectable item is found.
      // If bounds are reached, do nothing.
      let newItem = getMenuItems(items, currentMenu.menuPath)[index]
      while (newItem === MENU_SEPARATOR || newItem.disabled) {
        index += direction
        if (index < 0 || index >= menuLength) return
        newItem = getMenuItems(items, currentMenu.menuPath)[index]
      }

      currentMenu.focus = index
      const itemRef =
        ws.activeMenusMeta[ws.activeMenusRef.length - 1].itemRefs[index]
      itemRef?.scrollIntoView({
        block: 'nearest',
      })

      if (onItemFocus) {
        const item = getMenuItems(items, currentMenu.menuPath)[index]
        onItemFocus(item)
      }

      if (!fromUserInput && behavior === MenuBehavior.AUTOCOMPLETE) return

      itemRef?.focus({ preventScroll: true })
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      event.stopPropagation()
      if (currentMenu.focus < menuLength - 1) {
        changeCurrentMenuFocus(currentMenu.focus + 1, true)
      }
      commitActiveMenus()
      return
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      event.stopPropagation()
      if (currentMenu.focus === -1) {
        changeCurrentMenuFocus(menuLength - 1, true)
      } else if (currentMenu.focus > 0) {
        changeCurrentMenuFocus(currentMenu.focus - 1, true)
      }
      commitActiveMenus()
      return
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      event.stopPropagation()
      if (currentMenu.focus === -1) {
        changeCurrentMenuFocus(0, true)
        commitActiveMenus()
        return
      }
      const newMenuArrays = addSubMenu(
        behavior,
        items,
        ws.activeMenusRef,
        ws.activeMenusMeta,
        ws.activeMenusRef.length - 1,
        currentMenu.focus,
      )
      if (newMenuArrays) {
        ws.activeMenusRef = newMenuArrays[0]
        ws.activeMenusMeta = newMenuArrays[1]
        commitActiveMenus()
        return
      }
      commitActiveMenus()
      return
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      event.stopPropagation()
      if (ws.activeMenusRef.length === 1) {
        if (currentMenu.focus === -1) {
          changeCurrentMenuFocus(0, true)
        }
        commitActiveMenus()
        return
      }
      const newMenuArrays = removeSubMenu(
        ws.activeMenusRef,
        ws.activeMenusMeta,
        ws.activeMenusRef.length - 2,
      )
      if (newMenuArrays) {
        ws.activeMenusRef = newMenuArrays[0]
        ws.activeMenusMeta = newMenuArrays[1]
        commitActiveMenus()
        return
      }
      return
    } else if (event.key === 'Enter' || event.key === ' ') {
      if (currentMenu.focus === -1) {
        commitActiveMenus()
        return
      }
      const currentItem = getMenuItems(items, currentMenu.menuPath)[
        currentMenu.focus
      ]
      if (typeof currentItem === 'object' && 'onClick' in currentItem) {
        handleItemActivation(ws.activeMenusRef.length - 1, currentMenu.focus)
      } else if (typeof currentItem === 'object' && 'items' in currentItem) {
        const newMenuArrays = addSubMenu(
          behavior,
          items,
          ws.activeMenusRef,
          ws.activeMenusMeta,
          ws.activeMenusRef.length - 1,
          currentMenu.focus,
        )
        if (newMenuArrays) {
          ws.activeMenusMeta = newMenuArrays[1]
          ws.activeMenusRef = newMenuArrays[0]
          commitActiveMenus()
          return
        }
      }
    } else if (
      event.key.length === 1 &&
      behavior !== MenuBehavior.AUTOCOMPLETE
    ) {
      const activeMenuMeta = ws.activeMenusMeta[ws.activeMenusRef.length - 1]
      const currentTime = new Date().getTime()
      const lastKeyTime = activeMenuMeta.lastSearchTime
      if (currentTime - lastKeyTime > 200) {
        activeMenuMeta.searchTerm = event.key
      } else {
        activeMenuMeta.searchTerm += event.key
      }
      activeMenuMeta.lastSearchTime = currentTime
      const result = matchSorter(
        activeMenuMeta.searchItems,
        activeMenuMeta.searchTerm,
        {
          keys: ['label'],
        },
      )

      if (result.length > 0) {
        changeCurrentMenuFocus(result[0].index)
        commitActiveMenus()
        return
      }
    }
    commitActiveMenus()
    return
  }

  /**
   * Updates mouse position of safe area.
   *
   * Throttled to give user a bit more space around the mouse-edge of the safe
   * area.
   */
  const setMousePosition = throttle((x: number, y: number) => {
    if (ws.safeArea[0] === null) {
      ws.safeArea[0] = { x: 0, y: 0 }
    }
    ws.safeArea[0].x = x
    ws.safeArea[0].y = y
  }, 200)

  /**
   * Handles mouse movement. This includes updating the safe area and opening or
   * closing menus based on their position.
   *
   * @param ev MouseEvent
   */
  const updateMousePosition = (ev: MouseEvent) => {
    // if something has been clicked, disregard mousemove
    if (clickedItem != null) return

    if (!ev.target) return
    const dataset = (ev.target as HTMLElement).dataset
    if (!dataset.menu || !dataset.item) return

    const menu = parseInt(dataset.menu, 10)
    const index = parseInt(dataset.item, 10)

    // check if the mouse is over the current item
    if (ws.activeMenusMeta[menu + 1]?.parentIndex === index) {
      // check if current item has subitems
      const item = getMenuItems(items, ws.activeMenusRef[menu].menuPath)[index]
      if (typeof item === 'object' && 'items' in item) {
        // update mouse coordinates
        setSafeZoneMenu(menu + 1)
        setMousePosition(ev.clientX, ev.clientY)
      }
      return
    }

    // check if currently active item has subitems
    const activeItem = getMenuItems(items, ws.activeMenusRef[menu].menuPath)[
      ws.activeMenusRef[menu].focus
    ]
    if (
      ws.activeMenusRef.length > menu + 1 &&
      typeof activeItem === 'object' &&
      activeItem &&
      'items' in activeItem
    ) {
      // check if mouse is in safe zone
      const mouse = {
        x: ev.clientX,
        y: ev.clientY,
      }
      if (
        ws.safeArea[0] !== null &&
        ws.safeArea[1] !== null &&
        ws.safeArea[2] !== null
      ) {
        const inTriangle = checkIfInTriangle(
          ws.safeArea[0],
          ws.safeArea[1],
          ws.safeArea[2],
          mouse,
        )
        if (inTriangle) {
          return
        }
      }
    }

    let newActiveMenusMeta = null

    if (menu < ws.activeMenusRef.length - 1) {
      const [newMenus, newMenusMeta] = removeSubMenu(
        ws.activeMenusRef,
        ws.activeMenusMeta,
        menu,
      )
      ws.activeMenusRef = newMenus
      newActiveMenusMeta = newMenusMeta
    }
    ws.activeMenusRef[menu].focus = index

    commitActiveMenus()
    if (newActiveMenusMeta) {
      ws.activeMenusMeta = newActiveMenusMeta
    }

    const item = getMenuItems(items, ws.activeMenusRef[menu].menuPath)[index]
    if (!(typeof item === 'object' && 'items' in item)) return

    setTimeout(() => {
      // check if there is a submenu
      if (menu < ws.activeMenusRef.length - 1) return
      if (ws.activeMenusRef[menu]?.focus !== index) return
      const newMenuArrays = addSubMenu(
        behavior,
        items,
        ws.activeMenusRef,
        ws.activeMenusMeta,
        menu,
        index,
      )
      if (!newMenuArrays) return
      setSafeZoneMenu(menu + 1)
      setMousePosition(ev.clientX, ev.clientY)
      ws.activeMenusMeta = newMenuArrays[1]
      ws.activeMenusRef = newMenuArrays[0]
      commitActiveMenus()
    }, 100)
  }

  const handleResize = () => {
    ws.activeMenusRef.map((activeMenu, i) => {
      const meta = ws.activeMenusMeta[i]
      if (i > 0) {
        const prevMenu = ws.activeMenusMeta[i - 1]
        const k =
          prevMenu.itemRefs[
            ws.activeMenusRef[i - 1].focus
          ]?.getBoundingClientRect()
        if (k) {
          meta.parentItemRect = k
        }
      }

      if (meta.menuRef) {
        meta.menuRect = meta.menuRef.getBoundingClientRect()
      }

      activeMenu.position = calculatePosition(
        i,
        meta.parentItemRect,
        meta.menuRect,
        behavior,
      )
    })
    commitActiveMenus()
  }

  const handleAnchorMove = async () => {
    await tick()
    ws.activeMenusRef.map((activeMenu, i) => {
      const meta = ws.activeMenusMeta[i]
      if (i > 0) {
        const k =
          meta.itemRefs[ws.activeMenusRef[i - 1].focus]?.getBoundingClientRect()
        if (k) {
          meta.parentItemRect = k
        }
      } else {
        if (anchorRef) {
          anchorRect = anchorRef.getBoundingClientRect()
        } else if (anchor) {
          const rect = new DOMRect()
          rect.x = anchor.x
          rect.y = anchor.y
          anchorRect = rect
        }
        if (!anchorRect) return
        meta.parentItemRect = anchorRect
      }
      activeMenu.position = calculatePosition(
        i,
        meta.parentItemRect,
        meta.menuRect,
        behavior,
      )
    })
    commitActiveMenus()
  }

  function getMenuItemMeta(
    propItems: MenuItem[],
    menuPath: number[],
    i: number,
  ) {
    return getMenuItems(propItems, menuPath).map((item, j) => {
      const selected = j === displayActiveMenus[i].focus
      const hasSubMenu = typeof item === 'object' && 'items' in item
      const subMenuOpen =
        hasSubMenu && ws.activeMenusMeta[i + 1]?.parentIndex === j
      const isDisabled =
        typeof item === 'object' && 'disabled' in item && item.disabled
      const isChecked =
        typeof item === 'object' && 'checked' in item
          ? typeof item.checked === 'function'
            ? item.checked()
            : item.checked
          : undefined
      return {
        item,
        selected,
        hasSubMenu,
        subMenuOpen,
        isDisabled,
        isChecked,
      }
    })
  }
</script>

<svelte:window
  onkeydown={handleKeydown}
  onresize={handleResize}
  onmouseup={handleMouseUp}
  onmousemove={updateMousePosition}
/>

<div
  role="presentation"
  onclick={() => hide()}
  class="fullscreen_overlay"
  bind:this={overlayRef}
  oncontextmenu={(e) => {
    e.preventDefault()
    hide()
  }}
></div>
{#each displayActiveMenus as { menuPath, position, scrollPosition }, i}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    bind:this={setMenuRefProxy[i]}
    popover="manual"
    onmouseleave={() => handleMenuMouseLeave(i)}
    class="context_menu tint--card"
    class:select={behavior}
    style:left={`${position.x}px`}
    style:top={`${position.y}px`}
    style:height={position.height ? `${position.height}px` : 'auto'}
    style:minWidth={position.minWidth ? `${position.minWidth}px` : 'auto'}
  >
    {#if position.height && scrollPosition > -1}
      <div class="overflow_top" aria-hidden="true">
        {@html ArrowUp}
      </div>
    {/if}
    {#if position.height && scrollPosition < 1}
      <div class="overflow_bottom" aria-hidden="true">
        {@html ArrowDown}
      </div>
    {/if}
    <ul
      onscroll={(e) => checkOverflow(i, e)}
      {id}
      role={menuRole}
      tabIndex={-1}
    >
      {#each getMenuItemMeta(items, menuPath, i) as info, j}
        {#if typeof info.item === 'object' && 'label' in info.item}
          <li
            class={`item item_default ${
              clickedItem && clickedItem[0] === i && clickedItem[1] === j
                ? 'clicked'
                : ''
            }`}
            role={info.isChecked === undefined
              ? 'menuitem'
              : 'menuitemcheckbox'}
            aria-disabled={info.isDisabled}
            aria-haspopup={info.hasSubMenu || undefined}
            aria-expanded={info.hasSubMenu ? info.subMenuOpen : undefined}
            aria-checked={info.isChecked}
            tabIndex={info.selected && !info.isDisabled ? 0 : -1}
            data-selected={info.selected}
            onclick={() => handleItemActivation(i, j)}
            bind:this={setItemRefProxy[`${i}-${j}`]}
            data-menu={i}
            data-item={j}
          >
            {#if info.isChecked}{@html CheckIcon}{/if}
            <span>{info.item.label}</span>
            {#if info.hasSubMenu}{@html ArrowIcon}{/if}
          </li>
        {:else}
          <!-- <li aria-hidden=true><hr></li> -->
          <hr />
        {/if}
      {/each}
    </ul>
  </div>
{/each}

<style>.fullscreen_overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 99;
}
@media print {
  .fullscreen_overlay {
    display: none;
  }
}

.context_menu {
  z-index: 100;
  position: absolute;
  display: flex;
  flex-direction: column;
  min-width: 172px;
  border-radius: 8px;
  padding: 4px;
  overflow: hidden;
  inset: unset;
}
.context_menu:global(.select) {
  min-width: auto;
}
.context_menu :global(> ul) {
  margin: 0;
  padding: 0;
  list-style: none;
  outline: none;
  overflow-y: scroll;
  overflow-x: hidden;
  overscroll-behavior: contain;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.context_menu :global(> ul)::-webkit-scrollbar {
  display: none;
}
.context_menu :global(hr) {
  margin: 4px;
  border: 0;
  border-top: 1px solid var(--tint-card-border);
}
.context_menu li {
  text-indent: 0;
  list-style-type: none;
}
@media print {
  .context_menu {
    display: none;
  }
}

.overflow_top, .overflow_bottom {
  position: absolute;
  left: 0;
  right: 0;
  pointer-events: none;
  border-width: 1px;
  border-color: rgba(0, 0, 0, 0.05);
  opacity: 0.8;
  font-size: 6px;
  text-align: center;
  padding-inline: 4px;
  color: grey;
  background: var(--tint-bg);
  height: 12px;
  display: flex;
  justify-content: center;
}

.overflow_top {
  top: 0;
  border-bottom-style: solid;
  padding-block-start: 4px;
  align-items: flex-start;
}

.overflow_bottom {
  bottom: 0;
  border-top-style: solid;
  padding-block-end: 4px;
  align-items: flex-end;
}

.item {
  padding: 6px;
  padding-right: 8px;
  outline: none;
  user-select: none;
  border-radius: 4px;
}
.item[data-selected=true] {
  background: var(--tint-action-secondary-hover);
}
@media (forced-colors: active) {
  .item[data-selected=true] {
    background: ButtonText;
    color: ButtonFace;
  }
}
.item:global(.clicked) {
  animation: clicked_animation 200ms linear;
}
.item[aria-disabled=true] {
  opacity: 0.5;
  cursor: default;
  animation: none;
  background: unset;
}
@media (forced-colors: active) {
  .item[aria-disabled=true] {
    color: GrayText;
  }
}

.item_default {
  display: grid;
  grid-template-columns: 14px minmax(0, 1fr) minmax(14px, auto);
  gap: 4px;
  align-items: center;
}
.item_default :global(> span) {
  grid-column: 2/3;
}

@keyframes clicked_animation {
  0%, 40% {
    background: transparent;
  }
  41%, 100% {
    background: var(--tint-action-secondary-hover);
  }
}</style>
