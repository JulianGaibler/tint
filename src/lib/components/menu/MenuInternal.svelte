<!-- eslint-disable svelte/require-each-key -->
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
        icon?: string
        checked?: boolean | (() => boolean)
        onClick: () => void
        data?: T
        disabled?: boolean
      }
    | {
        label: string
        icon?: string
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
      animationOrigin?: string
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
  import ArrowIcon from '@lib/icons/14-chevron-menu-right.svg?raw'
  import ArrowUp from '@lib/icons/14-chevron-menu-up.svg?raw'
  import ArrowDown from '@lib/icons/14-chevron-menu-down.svg?raw'
  import CheckIcon from '@lib/icons/14-check.svg?raw'
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
    size?: 'tight' | 'large'
    animated?: boolean
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
    size = 'tight',
    animated = false,
    closeOnClick = true,
    hide,
    onItemFocus = undefined,
    recalculatePosition = $bindable(undefined),
    lastActiveElement = $bindable(undefined),
  }: Props = $props()

  // --------
  // Component State
  // --------

  // Reactive display state for menu rendering
  let displayActiveMenus: ActiveMenu[] = $state([])
  // Tracks which item was clicked for animation purposes
  let clickedItem: [number, number] | null = $state(null)
  // Rectangle bounds of the anchor element or position where menu should appear
  let anchorRect: DOMRect | null = null
  // Reference to the overlay element that captures clicks outside menus
  let overlayRef: HTMLElement | null = null
  // Focus trap instance to manage keyboard navigation within menus
  let trap: focusTrap.FocusTrap | null = null

  // Derived state for accessibility - determines ARIA role based on menu behavior
  let menuRole = $derived(
    behavior === MenuBehavior.AUTOCOMPLETE ? 'listbox' : 'menu',
  )

  // Central state object managing all menu data and interactions
  const menuState = {
    // Array of currently active/visible menus (main menu + any open submenus)
    activeMenus: [] as ActiveMenu[],

    // Metadata for each active menu (DOM refs, calculations, search state)
    activeMenusMeta: [] as ActiveMenuMeta[],

    // Unix-style click handling (click and drag to select)
    unixTimeout: {
      unix: true,
      timeout: null as null | ReturnType<typeof setTimeout>,
    },

    // When a submenu needs safe area but isn't rendered yet, queue it here
    queuedSafeArea: null as null | number,

    // Triangle safe area for mouse navigation between parent and submenu
    // [mouse position, submenu top-left, submenu bottom-left]
    safeArea: [null, null, null] as (Vec2 | null)[],
  }

  // --------
  // Proxy Handlers for DOM Reference Management
  // --------

  // Proxy handler for setting menu DOM references
  // When a menu element is bound, this automatically calls setMenuRef
  const setMenuRefHandler = {
    set: function (_target: unknown, prop: string, value: HTMLElement | null) {
      // Ignore undefined values during component teardown
      if (value === undefined) return true

      const menu = parseInt(prop, 10)
      // Show the popover for the menu element
      value?.showPopover()
      setMenuRef(menu, value)
      return true
    },
  }
  const setMenuRefProxy = new Proxy(
    menuState.activeMenusMeta,
    setMenuRefHandler,
  ) as {
    [key: number]: HTMLElement | null
  }

  // Proxy handler for setting individual menu item DOM references
  // Handles binding format like "0-3" (menu 0, item 3)
  const setItemRefHandler = {
    set: function (_obj: unknown, prop: string, value: HTMLElement | null) {
      if (value === undefined) return true

      // Parse menu and item indices from prop like "0-3"
      const [i, j] = prop.split('-')
      const menu = parseInt(i, 10)
      const item = parseInt(j, 10)
      setItemRef(menu, item, value)
      return true
    },
  }
  const setItemRefProxy = new Proxy(
    menuState.activeMenusMeta,
    setItemRefHandler,
  ) as {
    [key: string]: HTMLElement | null
  }

  // --------
  // Core Menu Management Functions
  // --------

  /**
   * Commits active menu changes to display state and updates focus trap This is
   * called after any changes to menuState.activeMenus to trigger re-renders
   */
  function commitActiveMenus() {
    displayActiveMenus = [...menuState.activeMenus]
    tick().then(() => {
      trap?.updateContainerElements(getTrapElements())
    })
  }

  /**
   * Sets up a menu DOM reference and calculates its position Called
   * automatically when menu elements are bound to the DOM
   */
  function setMenuRef(menu: number, menuRef: HTMLElement | null) {
    const activeMenu = menuState.activeMenus[menu]
    const activeMenuMeta = menuState.activeMenusMeta[menu]

    if (!menuRef || activeMenuMeta.menuRef === menuRef) return

    // Store the menu reference and get its dimensions
    activeMenuMeta.menuRef = menuRef
    activeMenuMeta.menuRect = menuRef.getBoundingClientRect()

    if (behavior !== MenuBehavior.SELECT) {
      // For regular menus, focus the first child element
      if (menuRef.childNodes[0] && menuRef.childNodes[0].nodeType === 1) {
        ;(menuRef.childNodes[0] as HTMLElement)?.focus({ preventScroll: true })
      }

      // Calculate and set menu position
      activeMenu.position = calculatePosition(
        menu,
        activeMenuMeta.parentItemRect,
        activeMenuMeta.menuRect,
        behavior,
      )
    } else {
      // For select menus, find the checked item and calculate position relative to it
      const menuItems = getMenuItems(items, activeMenu.menuPath)
      const focusIndex = menuItems.findIndex(
        (item) => typeof item === 'object' && 'checked' in item && item.checked,
      )
      const itemRef = activeMenuMeta.itemRefs[focusIndex]

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

    // Handle queued safe area setup for mouse navigation
    if (menuState.queuedSafeArea != null && menuState.queuedSafeArea === menu) {
      const height =
        activeMenu.position.height || activeMenuMeta.menuRect.height

      // Initialize safe area points if needed
      if (menuState.safeArea[1] === null) {
        menuState.safeArea[1] = { x: 0, y: 0 }
      }
      if (menuState.safeArea[2] === null) {
        menuState.safeArea[2] = { x: 0, y: 0 }
      }

      // Set safe area triangle points for submenu
      menuState.safeArea[1].x = activeMenu.position.x
      menuState.safeArea[1].y = activeMenu.position.y
      menuState.safeArea[2].x = activeMenu.position.x
      menuState.safeArea[2].y = activeMenu.position.y + height

      menuState.queuedSafeArea = null
    }

    commitActiveMenus()
  }

  // --------
  // Component Lifecycle
  // --------

  onMount(() => {
    // Allow parent to trigger position recalculation
    recalculatePosition = handleAnchorMove

    // Determine anchor position from either ref or coordinates
    if (anchorRef) {
      anchorRect = anchorRef.getBoundingClientRect()
    } else if (anchor) {
      const rect = new DOMRect()
      rect.x = anchor.x
      rect.y = anchor.y
      anchorRect = rect
    }

    if (!anchorRect) return

    // Set up unix-style click timeout (300ms window for click-and-drag)
    menuState.unixTimeout.timeout = setTimeout(() => {
      menuState.unixTimeout.timeout = null
    }, 300)

    // Create the initial root menu
    const [activeMenu, activeMenuMeta] = createActiveMenu(
      behavior,
      -1,
      anchorRect,
      [],
      items,
    )
    menuState.activeMenus = [activeMenu]
    menuState.activeMenusMeta = [activeMenuMeta]
    commitActiveMenus()

    // Set up focus management after initial render
    tick().then(() => {
      lastActiveElement = document.activeElement as HTMLElement

      // Autocomplete menus don't need focus trapping
      if (behavior === MenuBehavior.AUTOCOMPLETE) {
        return
      }

      // Create focus trap to manage keyboard navigation
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
    // Clean up focus trap
    trap?.deactivate()

    // Return focus for autocomplete menus
    if (behavior === MenuBehavior.AUTOCOMPLETE) {
      lastActiveElement?.focus()
    }
  })

  /** Gets all DOM elements that should be included in the focus trap */
  function getTrapElements(): HTMLElement[] {
    return [
      ...(overlayRef ? [overlayRef] : []),
      ...menuState.activeMenusMeta
        .map((m) => m.menuRef)
        .filter((m): m is HTMLElement => m !== null),
    ]
  }

  // --------
  // Menu Item Interaction Handlers
  // --------

  /**
   * Handles when a menu item is activated (clicked or selected via keyboard)
   * Manages both action items (onClick) and submenu items (items)
   *
   * @param menu Menu index
   * @param index Item index within the menu
   */
  function handleItemActivation(menu: number, index: number) {
    // Prevent multiple simultaneous activations
    if (clickedItem) return

    const item = getMenuItems(items, menuState.activeMenus[menu].menuPath)[
      index
    ]
    if (!(typeof item === 'object')) return
    if ('disabled' in item && item.disabled) return

    // Handle action items (with onClick callbacks)
    if ('onClick' in item) {
      if (closeOnClick) {
        // Show click animation, then execute callback and close menu
        const itemRef = menuState.activeMenusMeta[menu].itemRefs[index]
        itemRef?.addEventListener('animationend', () => {
          item.onClick()
          hide()
          itemRef?.removeEventListener('animationend', () => {})
          clickedItem = null
        })
      } else {
        // Execute callback immediately without closing
        item.onClick()
        setTimeout(() => {
          clickedItem = null
        }, 100)
      }
      clickedItem = [menu, index]
      return
    }

    // Handle submenu items
    if ('items' in item) {
      const newMenuArrays = addSubMenu(
        behavior,
        items,
        menuState.activeMenus,
        menuState.activeMenusMeta,
        menu,
        index,
      )
      if (newMenuArrays) {
        menuState.activeMenus = newMenuArrays[0]
        menuState.activeMenusMeta = newMenuArrays[1]
        commitActiveMenus()
      }
      return
    }
  }

  /**
   * The safe area allows users to move their mouse toward a submenu without
   * accidentally closing it when passing over other menu items
   *
   * @param menu Menu index for which to set up the safe area
   */
  function setSafeZoneMenu(menu: number) {
    // Check if the menu is rendered yet - if not, queue the safe area setup
    if (!menuState.activeMenusMeta[menu]) {
      menuState.queuedSafeArea = menu
      return
    }

    const nextMenu = menuState.activeMenus[menu]
    const nextMenuMeta = menuState.activeMenusMeta[menu]

    // Calculate horizontal offset based on menu alignment
    const flipWidth = nextMenu.position.endAlign
      ? 0
      : nextMenuMeta.menuRect.width

    // Initialize safe area points if they don't exist
    if (menuState.safeArea[1] === null) {
      menuState.safeArea[1] = { x: 0, y: 0 }
    }
    if (menuState.safeArea[2] === null) {
      menuState.safeArea[2] = { x: 0, y: 0 }
    }

    // Set triangle vertices: top-left and bottom-left of submenu
    menuState.safeArea[1].x = nextMenu.position.x + flipWidth
    menuState.safeArea[1].y = nextMenu.position.y

    menuState.safeArea[2].x = nextMenu.position.x + flipWidth
    menuState.safeArea[2].y = nextMenu.position.y + nextMenuMeta.menuRect.height
  }

  /**
   * Handles mouse leave events for menus Clears focus when mouse leaves the
   * last menu (not applicable to select/autocomplete)
   *
   * @param menu Menu index that mouse left
   */
  function handleMenuMouseLeave(menu: number) {
    // Select and autocomplete menus don't use mouse hover focus
    if (
      behavior === MenuBehavior.SELECT ||
      behavior === MenuBehavior.AUTOCOMPLETE
    )
      return

    // Only clear focus when leaving the last (rightmost) menu
    if (menu !== menuState.activeMenus.length - 1) return

    const activeMenu = menuState.activeMenus[menu]
    if (activeMenu.focus === -1) return

    // Clear focus and update display
    activeMenu.focus = -1
    commitActiveMenus()
  }

  /**
   * Monitors menu scrolling and updates overflow indicators Tracks whether
   * content is cropped at top/bottom to show scroll arrows
   *
   * @param menu Menu index being scrolled
   * @param event Scroll event from the menu container
   */
  function checkOverflow(menu: number, event: Event) {
    const menuRef = event.target as HTMLElement
    if (!menuRef) return

    // Determine scroll position state:
    // -1: scrolled to top, 0: middle, 1: scrolled to bottom
    let scrollPosition = 0
    if (menuRef.scrollTop === 0) {
      scrollPosition = -1
    } else if (
      menuRef.scrollHeight - menuRef.scrollTop ===
      menuRef.clientHeight
    ) {
      scrollPosition = 1
    }

    // Update state if scroll position changed
    if (scrollPosition !== menuState.activeMenus[menu].scrollPosition) {
      menuState.activeMenus[menu].scrollPosition = scrollPosition
      commitActiveMenus()
    }
  }

  /**
   * Sets up individual menu item DOM references and handles initial focus
   * Called automatically when menu item elements are bound
   */
  function setItemRef(menu: number, item: number, itemRef: HTMLElement | null) {
    const activeMenuMeta = menuState.activeMenusMeta[menu]
    if (!itemRef || activeMenuMeta.itemRefs[item] === itemRef) return

    // For non-autocomplete menus, focus checked items automatically
    if (behavior !== MenuBehavior.AUTOCOMPLETE) {
      const menuItem = getMenuItems(
        items,
        menuState.activeMenus[menu].menuPath,
      )[item]
      if (
        typeof menuItem === 'object' &&
        'checked' in menuItem &&
        menuItem.checked
      ) {
        itemRef.focus({ preventScroll: true })
      }
    }

    activeMenuMeta.itemRefs[item] = itemRef
  }

  // --------
  // Event Handlers
  // --------

  /**
   * Handles unix-style mouse interactions (click and drag to select) Only
   * applies to regular menu behavior, not select or autocomplete
   */
  const handleMouseUp = () => {
    if (behavior !== MenuBehavior.MENU) return

    // If timeout is still active, this is a quick click - disable unix mode
    if (menuState.unixTimeout.timeout !== null) {
      clearTimeout(menuState.unixTimeout.timeout)
      menuState.unixTimeout.timeout = null
      menuState.unixTimeout.unix = false
      return
    }

    // Only process if unix mode is still enabled
    if (!menuState.unixTimeout.unix) return

    const activeMenu = menuState.activeMenus[menuState.activeMenus.length - 1]

    // If no item is focused, close the menu
    if (activeMenu.focus === -1) {
      hide()
      return
    }

    // Get the focused item
    const item = getMenuItems(
      items,
      menuState.activeMenus[menuState.activeMenus.length - 1].menuPath,
    )[activeMenu.focus]

    // Handle activation based on item type
    if (!(typeof item === 'object' && 'items' in item)) {
      // Regular item - activate it
      handleItemActivation(menuState.activeMenus.length - 1, activeMenu.focus)
    } else {
      // Submenu item - just mark as clicked for visual feedback
      clickedItem = [menuState.activeMenus.length - 1, activeMenu.focus]
    }
  }

  /**
   * Handles all keyboard navigation within menus Supports arrow keys,
   * Enter/Space, Escape, and character search
   *
   * @param event KeyboardEvent from user input
   */
  const handleKeydown = (event: KeyboardEvent) => {
    // Escape always closes the menu
    if (event.key === 'Escape') {
      hide()
      return
    }

    // Get current menu context
    const currentMenu = menuState.activeMenus[menuState.activeMenus.length - 1]
    const menuLength = getMenuItems(items, currentMenu.menuPath).length

    /**
     * Changes focus to a specific item index with validation and accessibility
     * Skips disabled items and separators automatically
     */
    const changeCurrentMenuFocus = (index: number, fromUserInput = false) => {
      // Determine focus movement direction for skipping invalid items
      const direction = index > currentMenu.focus ? 1 : -1

      // Validate bounds
      if (index < 0 || index >= menuLength) return

      // Skip separators and disabled items
      let newItem = getMenuItems(items, currentMenu.menuPath)[index]
      while (
        newItem === MENU_SEPARATOR ||
        (typeof newItem === 'object' && newItem.disabled)
      ) {
        index += direction
        if (index < 0 || index >= menuLength) return
        newItem = getMenuItems(items, currentMenu.menuPath)[index]
      }

      // Update focus and ensure item is visible
      currentMenu.focus = index
      const itemRef =
        menuState.activeMenusMeta[menuState.activeMenus.length - 1].itemRefs[
          index
        ]
      itemRef?.scrollIntoView({ block: 'nearest' })

      // Notify parent of focus change
      if (onItemFocus) {
        const item = getMenuItems(items, currentMenu.menuPath)[index]
        onItemFocus(item)
      }

      // Focus the DOM element (except for autocomplete which manages its own focus)
      if (!fromUserInput && behavior === MenuBehavior.AUTOCOMPLETE) return
      itemRef?.focus({ preventScroll: true })
    }

    // Handle arrow key navigation
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
        // No focus - go to last item
        changeCurrentMenuFocus(menuLength - 1, true)
      } else if (currentMenu.focus > 0) {
        changeCurrentMenuFocus(currentMenu.focus - 1, true)
      }
      commitActiveMenus()
      return
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      event.stopPropagation()

      // If no focus, focus first item
      if (currentMenu.focus === -1) {
        changeCurrentMenuFocus(0, true)
        commitActiveMenus()
        return
      }

      // Try to open submenu for current item
      const newMenuArrays = addSubMenu(
        behavior,
        items,
        menuState.activeMenus,
        menuState.activeMenusMeta,
        menuState.activeMenus.length - 1,
        currentMenu.focus,
      )
      if (newMenuArrays) {
        menuState.activeMenus = newMenuArrays[0]
        menuState.activeMenusMeta = newMenuArrays[1]
        commitActiveMenus()
        return
      }
      commitActiveMenus()
      return
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      event.stopPropagation()

      // If this is the root menu, just ensure something is focused
      if (menuState.activeMenus.length === 1) {
        if (currentMenu.focus === -1) {
          changeCurrentMenuFocus(0, true)
        }
        commitActiveMenus()
        return
      }

      // Close current submenu and return to parent
      const newMenuArrays = removeSubMenu(
        menuState.activeMenus,
        menuState.activeMenusMeta,
        menuState.activeMenus.length - 2,
      )
      if (newMenuArrays) {
        menuState.activeMenus = newMenuArrays[0]
        menuState.activeMenusMeta = newMenuArrays[1]
        commitActiveMenus()
        return
      }
      return
    } else if (event.key === 'Enter' || event.key === ' ') {
      // Activate focused item
      if (currentMenu.focus === -1) {
        commitActiveMenus()
        return
      }

      const currentItem = getMenuItems(items, currentMenu.menuPath)[
        currentMenu.focus
      ]

      if (typeof currentItem === 'object' && 'onClick' in currentItem) {
        // Action item - execute callback
        handleItemActivation(
          menuState.activeMenus.length - 1,
          currentMenu.focus,
        )
      } else if (typeof currentItem === 'object' && 'items' in currentItem) {
        // Submenu item - open submenu
        const newMenuArrays = addSubMenu(
          behavior,
          items,
          menuState.activeMenus,
          menuState.activeMenusMeta,
          menuState.activeMenus.length - 1,
          currentMenu.focus,
        )
        if (newMenuArrays) {
          menuState.activeMenusMeta = newMenuArrays[1]
          menuState.activeMenus = newMenuArrays[0]
          commitActiveMenus()
          return
        }
      }
    } else if (
      event.key.length === 1 &&
      behavior !== MenuBehavior.AUTOCOMPLETE
    ) {
      // Character search functionality
      const activeMenuMeta =
        menuState.activeMenusMeta[menuState.activeMenus.length - 1]
      const currentTime = new Date().getTime()
      const lastKeyTime = activeMenuMeta.lastSearchTime

      // Build search term (reset if too much time passed)
      if (currentTime - lastKeyTime > 200) {
        activeMenuMeta.searchTerm = event.key
      } else {
        activeMenuMeta.searchTerm += event.key
      }
      activeMenuMeta.lastSearchTime = currentTime

      // Search through available items
      const result = matchSorter(
        activeMenuMeta.searchItems,
        activeMenuMeta.searchTerm,
        {
          keys: ['label'],
        },
      )

      // Focus first matching item
      if (result.length > 0) {
        changeCurrentMenuFocus(result[0].index)
        commitActiveMenus()
        return
      }
    }

    commitActiveMenus()
    return
  }

  // --------
  // Mouse Navigation and Safe Area Management
  // --------

  /**
   * Updates the mouse position for safe area triangle calculations Throttled to
   * prevent excessive updates during mouse movement
   */
  const setMousePosition = throttle((x: number, y: number) => {
    // Initialize mouse position point if needed
    if (menuState.safeArea[0] === null) {
      menuState.safeArea[0] = { x: 0, y: 0 }
    }
    menuState.safeArea[0].x = x
    menuState.safeArea[0].y = y
  }, 200)

  /**
   * Handles mouse movement over menu items for hover-based navigation Manages
   * submenu opening/closing and safe area triangle detection
   *
   * @param ev MouseEvent from mouse movement
   */
  const updateMousePosition = (ev: MouseEvent) => {
    // Ignore mouse movement if an item is currently being clicked
    if (clickedItem != null) return

    if (!ev.target) return
    const dataset = (ev.target as HTMLElement).dataset
    if (!dataset.menu || !dataset.item) return

    const menu = parseInt(dataset.menu, 10)
    const index = parseInt(dataset.item, 10)

    // Check if mouse is over an item that already has its submenu open
    if (menuState.activeMenusMeta[menu + 1]?.parentIndex === index) {
      const item = getMenuItems(items, menuState.activeMenus[menu].menuPath)[
        index
      ]
      if (typeof item === 'object' && 'items' in item) {
        // Update safe area and mouse position for existing submenu
        setSafeZoneMenu(menu + 1)
        setMousePosition(ev.clientX, ev.clientY)
      }
      return
    }

    // Check if we need to respect the safe area triangle
    const activeItem = getMenuItems(
      items,
      menuState.activeMenus[menu].menuPath,
    )[menuState.activeMenus[menu].focus]
    if (
      menuState.activeMenus.length > menu + 1 &&
      typeof activeItem === 'object' &&
      activeItem &&
      'items' in activeItem
    ) {
      // Check if mouse is within the safe triangle area
      const mouse = {
        x: ev.clientX,
        y: ev.clientY,
      }
      if (
        menuState.safeArea[0] !== null &&
        menuState.safeArea[1] !== null &&
        menuState.safeArea[2] !== null
      ) {
        const inTriangle = checkIfInTriangle(
          menuState.safeArea[0],
          menuState.safeArea[1],
          menuState.safeArea[2],
          mouse,
        )
        // If mouse is in safe area, don't change anything
        if (inTriangle) {
          return
        }
      }
    }

    let newActiveMenusMeta = null

    // Close any submenus if hovering over a parent menu item
    if (menu < menuState.activeMenus.length - 1) {
      const [newMenus, newMenusMeta] = removeSubMenu(
        menuState.activeMenus,
        menuState.activeMenusMeta,
        menu,
      )
      menuState.activeMenus = newMenus
      newActiveMenusMeta = newMenusMeta
    }

    // Update focus to the hovered item
    menuState.activeMenus[menu].focus = index

    commitActiveMenus()
    if (newActiveMenusMeta) {
      menuState.activeMenusMeta = newActiveMenusMeta
    }

    // Check if hovered item has submenu items
    const item = getMenuItems(items, menuState.activeMenus[menu].menuPath)[
      index
    ]
    if (!(typeof item === 'object' && 'items' in item)) return

    // Delay submenu opening to prevent flickering during mouse movement
    setTimeout(() => {
      // Verify conditions are still valid after delay
      if (menu < menuState.activeMenus.length - 1) return
      if (menuState.activeMenus[menu]?.focus !== index) return

      // Open submenu for hovered item
      const newMenuArrays = addSubMenu(
        behavior,
        items,
        menuState.activeMenus,
        menuState.activeMenusMeta,
        menu,
        index,
      )
      if (!newMenuArrays) return

      // Set up safe area for new submenu
      setSafeZoneMenu(menu + 1)
      setMousePosition(ev.clientX, ev.clientY)
      menuState.activeMenusMeta = newMenuArrays[1]
      menuState.activeMenus = newMenuArrays[0]
      commitActiveMenus()
    }, 100)
  }

  // --------
  // Window Event Handlers
  // --------

  /**
   * Handles window resize events by recalculating all menu positions Updates
   * both menu dimensions and positions to maintain proper layout
   */
  const handleResize = () => {
    menuState.activeMenus.map((activeMenu, i) => {
      const meta = menuState.activeMenusMeta[i]

      // Update parent item rectangle for submenus
      if (i > 0) {
        const prevMenu = menuState.activeMenusMeta[i - 1]
        const parentItemRect =
          prevMenu.itemRefs[
            menuState.activeMenus[i - 1].focus
          ]?.getBoundingClientRect()
        if (parentItemRect) {
          meta.parentItemRect = parentItemRect
        }
      }

      // Update menu dimensions
      if (meta.menuRef) {
        meta.menuRect = meta.menuRef.getBoundingClientRect()
      }

      // Recalculate position based on new dimensions
      activeMenu.position = calculatePosition(
        i,
        meta.parentItemRect,
        meta.menuRect,
        behavior,
      )
    })
    commitActiveMenus()
  }

  /**
   * Handles anchor element movement (like scrolling or element repositioning)
   * Recalculates all menu positions relative to their new anchor positions
   */
  const handleAnchorMove = async () => {
    await tick()
    menuState.activeMenus.map((activeMenu, i) => {
      const meta = menuState.activeMenusMeta[i]

      if (i > 0) {
        // For submenus, update parent item position
        const parentItemRect =
          meta.itemRefs[
            menuState.activeMenus[i - 1].focus
          ]?.getBoundingClientRect()
        if (parentItemRect) {
          meta.parentItemRect = parentItemRect
        }
      } else {
        // For root menu, update anchor position
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

      // Recalculate position
      activeMenu.position = calculatePosition(
        i,
        meta.parentItemRect,
        meta.menuRect,
        behavior,
      )
    })
    commitActiveMenus()
  }

  // --------
  // Utility Functions
  // --------

  /**
   * Prepares menu item metadata for rendering Calculates selection state,
   * submenu state, and accessibility properties
   *
   * @param propItems The root menu items array
   * @param menuPath Path to the current menu (for nested menus)
   * @param i Menu index
   * @returns Array of item metadata for rendering
   */
  function getMenuItemMeta(
    propItems: MenuItem[],
    menuPath: number[],
    i: number,
  ) {
    return getMenuItems(propItems, menuPath).map((item, j) => {
      // Calculate selection and interaction states
      const selected = j === displayActiveMenus[i].focus
      const hasSubMenu = typeof item === 'object' && 'items' in item
      const subMenuOpen =
        hasSubMenu && menuState.activeMenusMeta[i + 1]?.parentIndex === j
      const isDisabled =
        typeof item === 'object' && 'disabled' in item && item.disabled

      // Calculate checked state (supports both boolean and function)
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

  /**
   * Determines gutter visibility for a menu based on its items
   *
   * @param propItems The root menu items array
   * @param menuPath Path to the current menu (for nested menus)
   * @returns Object indicating which gutters should be shown
   */
  function getGutterVisibility(propItems: MenuItem[], menuPath: number[]) {
    const menuItems = getMenuItems(propItems, menuPath)

    let showLeftGutter = false
    let showRightGutter = false

    for (const item of menuItems) {
      if (typeof item === 'object' && 'label' in item) {
        // Show left gutter if any item has a checked state (true, false, or function)
        if ('checked' in item && item.checked !== undefined) {
          showLeftGutter = true
        }

        // Show right gutter if any item has submenu items
        if ('items' in item) {
          showRightGutter = true
        }

        // Early exit if both gutters are needed
        if (showLeftGutter && showRightGutter) {
          break
        }
      }
    }

    return { showLeftGutter, showRightGutter }
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
<!-- eslint-disable-next-line svelte/require-each-key -->
{#each displayActiveMenus as { menuPath, position, scrollPosition }, i}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    bind:this={setMenuRefProxy[i]}
    popover="manual"
    onmouseleave={() => handleMenuMouseLeave(i)}
    class={`context_menu tint--card ${size} ${animated ? `animated ${position.animationOrigin}` : ''}`}
    class:select={behavior}
    style:left={`${position.x}px`}
    style:top={`${position.y}px`}
    style:height={position.height ? `${position.height}px` : 'auto'}
    style:min-width={position.minWidth ? `${position.minWidth}px` : 'auto'}
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
      <!-- eslint-disable-next-line svelte/require-each-key -->
      {#each getMenuItemMeta(items, menuPath, i) as info, j}
        {@const { showLeftGutter, showRightGutter } = getGutterVisibility(
          items,
          menuPath,
        )}
        {#if typeof info.item === 'object' && 'label' in info.item}
          <li
            class={`item item_default ${
              clickedItem && clickedItem[0] === i && clickedItem[1] === j
                ? 'clicked'
                : ''
            }`}
            class:hide-left-gutter={!showLeftGutter}
            class:hide-right-gutter={!showRightGutter}
            class:hide-all-gutters={!showLeftGutter && !showRightGutter}
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
            {#if info.isChecked === true && showLeftGutter}{@html CheckIcon}{/if}
            {#if info.item.icon}<span class="item-icon" aria-hidden="true"
                >{@html info.item.icon}</span
              >{/if}
            <span>{info.item.label}</span>
            {#if info.hasSubMenu && showRightGutter}{@html ArrowIcon}{/if}
          </li>
        {:else}
          <!-- <li aria-hidden=true><hr></li> -->
          <hr />
        {/if}
      {/each}
    </ul>
  </div>
{/each}

<style lang="sass">
.fullscreen_overlay
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  overflow: hidden
  z-index: 99
  @media print
      display: none

.context_menu
  z-index: 100
  position: absolute
  display: flex
  flex-direction: column
  min-width: 172px
  border-radius: tint.$size-8
  padding: tint.$size-4
  overflow: hidden
  inset: unset
  &:global(.select)
    min-width: auto
  &.animated
    animation: menu-appear 350ms cubic-bezier(0.42, 1.67, 0.21, 0.90) forwards
    &.top-left
      transform-origin: top left
    &.top-right
      transform-origin: top right
    &.bottom-left
      transform-origin: bottom left
    &.bottom-right
      transform-origin: bottom right
  :global(> ul)
    margin: 0
    padding: 0
    list-style: none
    outline: none
    overflow-y: scroll
    overflow-x: hidden
    overscroll-behavior: contain
    scrollbar-width: none
    -ms-overflow-style: none
    &::-webkit-scrollbar
      display: none
  :global(hr)
    margin: tint.$size-4
    border: 0
    border-top: 1px solid var(--tint-card-border)
  li
    text-indent: 0
    list-style-type: none
  @media print
      display: none

.overflow_top, .overflow_bottom
  position: absolute
  left: 0
  right: 0
  pointer-events: none
  border-width: 1px
  border-color: rgba(0, 0, 0, 0.05)
  opacity: .8
  font-size: 6px
  text-align: center
  padding-inline: tint.$size-4
  color: grey
  background: var(--tint-bg)
  height: tint.$size-12
  display: flex
  justify-content: center
.overflow_top
  top: 0
  border-bottom-style: solid
  padding-block-start: tint.$size-4
  align-items: flex-start
.overflow_bottom
  bottom: 0
  border-top-style: solid
  padding-block-end: tint.$size-4
  align-items: flex-end

.item
  padding: 6px
  padding-inline-end: tint.$size-8
  outline: none
  user-select: none
  border-radius: tint.$size-4
  white-space: nowrap
  &[data-selected="true"]
    background: var(--tint-action-secondary-hover)
    @media (forced-colors: active)
      background: ButtonText
      color: ButtonFace
  &:global(.clicked)
    animation: clicked_animation 200ms linear
  &[aria-disabled="true"]
    opacity: 0.5
    cursor: default
    animation: none
    background: unset
    @media (forced-colors: active)
      color: GrayText

.item_default
  display: grid
  grid-template-columns: 14px auto minmax(0, 1fr) minmax(14px, auto)
  gap: tint.$size-4
  align-items: center
  :global(> span:not(.item-icon))
    grid-column: 3 / 4
  :global(.item-icon)
    grid-column: 2 / 3
    display: flex
    align-items: center
    justify-content: center
    font-size: 14px

  // Hide left gutter only
  &.hide-left-gutter
    grid-template-columns: auto minmax(0, 1fr) minmax(14px, auto)
    :global(.item-icon)
      grid-column: 1 / 2
    :global(> span:not(.item-icon))
      grid-column: 2 / 3

  // Hide right gutter only
  &.hide-right-gutter
    grid-template-columns: 14px auto minmax(0, 1fr)
    :global(> span:not(.item-icon))
      grid-column: 3 / 4

  // Hide both gutters
  &.hide-all-gutters
    grid-template-columns: auto minmax(0, 1fr)
    :global(> span:not(.item-icon))
      grid-column: 2 / 3
    :global(.item-icon)
      grid-column: 1 / 2

.context_menu.large .item
  padding-block: tint.$size-12
  padding-inline: tint.$size-8
  gap: tint.$size-4
  &.hide-all-gutters
    padding-block: tint.$size-12
    padding-inline: tint.$size-16
    gap: tint.$size-8

@keyframes clicked_animation
  0%, 40%
    background: transparent
  41%, 100%
    background: var(--tint-action-secondary-hover)

@keyframes menu-appear
  0%
    opacity: 0
    transform: scale(1)
  1%
    opacity: 0
    transform: scale(0.75)
  100%
    opacity: 1
    transform: scale(1)

</style>
