import {
  type MenuItem,
  MenuBehavior,
  type Vec2,
  WINDOW_PADDING,
  TOP_MENU_OFFSET,
  type ActiveMenu,
  type ActiveMenuMeta,
  LEFT_MENU_OFFSET,
  type MenuBehaviorType,
} from './MenuInternal.svelte'

// ========================================
// Menu Navigation Utilities
// ========================================

/**
 * Retrieves menu items from nested menu structure using a path Menu items are
 * always fetched from the root props items to prevent data duplication. This
 * helper navigates through nested menu structures.
 *
 * @param propItems Root menu items array from component props
 * @param menuPath Array of indices representing path to nested menu (e.g., [0,
 *   2] means first item's third submenu item)
 * @returns The menu items at the specified path
 */
export function getMenuItems(
  propItems: MenuItem[],
  menuPath: number[],
): MenuItem[] {
  // Root level - return original items
  if (menuPath.length === 0) return propItems

  let items = propItems
  // Navigate through each level of the path
  for (let i = 0; i < menuPath.length; i++) {
    const item = items[menuPath[i]]
    // Validate that this item actually has subitems
    if (!(typeof item === 'object' && 'items' in item)) {
      throw new Error(
        'Invalid menu path: item at path does not contain subitems',
      )
    }
    items = item.items
  }
  return items
}

/**
 * Creates a new active menu and its metadata for rendering This function
 * initializes both the display state and calculation metadata needed for a menu
 * at any level (root or submenu)
 *
 * @param behavior Menu behavior type (MENU, SELECT, or AUTOCOMPLETE)
 * @param parentIndex Index of parent item that triggered this menu (-1 for
 *   root)
 * @param parentItemRect Bounding rectangle of the parent item/anchor
 * @param menuPath Path to this menu in the nested structure
 * @param propItems Root menu items array
 * @returns Tuple of [ActiveMenu, ActiveMenuMeta] for the new menu
 */
export function createActiveMenu(
  behavior: MenuBehaviorType,
  parentIndex: number,
  parentItemRect: DOMRect,
  menuPath: number[],
  propItems: MenuItem[],
): [ActiveMenu, ActiveMenuMeta] {
  // Initialize focus position
  let focus = -1
  if (behavior === MenuBehavior.SELECT) {
    // For select menus, auto-focus the checked item
    focus = propItems.findIndex(
      (item) => typeof item === 'object' && 'checked' in item && item.checked,
    )
  }

  // Create the active menu display state
  const activeMenu: ActiveMenu = {
    focus,
    // Position will be calculated later when DOM ref is available
    position: {
      x: -1000, // Off-screen initially
      y: -1000,
      endAlign: true,
      height: undefined,
      minWidth: undefined,
      animationOrigin: 'top-left',
    },
    scrollPosition: -1, // -1: top, 0: middle, 1: bottom
    menuPath,
  }

  // Create metadata for calculations and DOM management
  const activeMenuMeta: ActiveMenuMeta = {
    parentIndex,
    parentItemRect,
    menuRect: new DOMRect(), // Will be updated when menu renders
    menuRef: null,
    itemRefs: {}, // DOM refs for individual menu items
    // Pre-compute searchable items for character search functionality
    searchItems: getMenuItems(propItems, menuPath).reduce(
      (acc, item, index) => {
        // Only include items with labels in search
        if (typeof item === 'object' && 'label' in item) {
          acc.push({ label: item.label, index })
        }
        return acc
      },
      [] as { label: string; index: number }[],
    ),
    searchTerm: '',
    lastSearchTime: 0,
  }

  return [activeMenu, activeMenuMeta]
}

// ========================================
// Geometric Calculations
// ========================================

/**
 * Determines if a point lies within a triangle using barycentric coordinates
 * Used for safe area detection during mouse navigation to submenus
 *
 * @param a First vertex of triangle
 * @param b Second vertex of triangle
 * @param c Third vertex of triangle
 * @param s Point to test
 * @returns True if point s is inside triangle abc
 */
export function checkIfInTriangle(a: Vec2, b: Vec2, c: Vec2, s: Vec2) {
  const as_x = s.x - a.x
  const as_y = s.y - a.y

  const s_ab = (b.x - a.x) * as_y - (b.y - a.y) * as_x > 0

  if ((c.x - a.x) * as_y - (c.y - a.y) * as_x > 0 == s_ab) return false
  if ((c.x - b.x) * (s.y - b.y) - (c.y - b.y) * (s.x - b.x) > 0 != s_ab)
    return false

  return true
}

/**
 * Calculates optimal positioning for a menu considering window boundaries
 * Handles different menu types (context, select, autocomplete) and positioning
 * logic
 *
 * @param depth Menu depth (0 for root menu, 1+ for submenus)
 * @param parentItemRect Bounding rectangle of parent item or anchor
 * @param menuRect Current dimensions of the menu
 * @param behavior Menu behavior type affecting positioning strategy
 * @param relativeDistance Optional distance for select menu positioning
 * @returns Position object with coordinates and sizing constraints
 */
export function calculatePosition(
  depth: number,
  parentItemRect: DOMRect,
  menuRect: DOMRect,
  behavior: MenuBehaviorType,
  relativeDistance?: number,
) {
  const coords: {
    x: number
    y: number
    endAlign: boolean
    height: number | undefined
    minWidth: number | undefined
    animationOrigin?: string
  } = {
    x: 0,
    y: 0,
    endAlign: true, // Whether submenu appears to the right (true) or left (false)
    height: undefined, // Constrained height if needed
    minWidth: undefined, // Minimum width constraint
    animationOrigin: undefined, // Animation origin for CSS transforms
  }

  // Set minimum width for select and autocomplete menus to match parent
  if (
    behavior === MenuBehavior.SELECT ||
    behavior === MenuBehavior.AUTOCOMPLETE
  ) {
    coords.minWidth = parentItemRect.width
  }

  if (behavior === MenuBehavior.SELECT && relativeDistance) {
    // > SELECT MENU POSITIONING
    // Position relative to selected item within the menu
    coords.x = parentItemRect.x - 16 - 14 // Account for padding and check icon
    coords.y = parentItemRect.y - relativeDistance - 16 // Align with selected item
    coords.animationOrigin = 'top-left'

    // Prevent overflow to the right
    if (coords.x + menuRect.width > window.innerWidth - WINDOW_PADDING) {
      coords.x = window.innerWidth - menuRect.width - WINDOW_PADDING
      coords.animationOrigin = 'top-right'
    }
  } else if (depth === 0) {
    // > ROOT MENU POSITIONING
    // Position below and aligned with anchor
    coords.x = parentItemRect.x
    coords.y = parentItemRect.y + parentItemRect.height
    coords.animationOrigin = 'top-left'

    // Handle horizontal overflow
    if (coords.x + menuRect.width > window.innerWidth - WINDOW_PADDING) {
      if (parentItemRect.width) {
        // Align to right edge of parent if possible
        coords.x = parentItemRect.x + parentItemRect.width - menuRect.width
        coords.animationOrigin = 'top-right'
      } else {
        // Fallback to window edge alignment
        coords.x = window.innerWidth - menuRect.width - WINDOW_PADDING
        coords.animationOrigin = 'top-right'
      }
    }

    // Handle vertical overflow (flip to above parent if needed)
    if (coords.y + menuRect.height > window.innerHeight - WINDOW_PADDING) {
      coords.y = parentItemRect.y - menuRect.height
      coords.animationOrigin =
        coords.animationOrigin === 'top-right' ? 'bottom-right' : 'bottom-left'
    }
  } else {
    // > SUBMENU POSITIONING
    // Position to the right of parent item with slight offset
    coords.x = parentItemRect.x + parentItemRect.width + LEFT_MENU_OFFSET
    coords.y = parentItemRect.y - TOP_MENU_OFFSET
    coords.animationOrigin = 'top-left'

    // Handle horizontal overflow (flip to left side)
    if (coords.x + menuRect.width > window.innerWidth - WINDOW_PADDING) {
      coords.endAlign = false
      coords.x = parentItemRect.x - menuRect.width
      coords.animationOrigin = 'top-right'
    }

    // Ensure minimum distance from left edge
    if (coords.x < WINDOW_PADDING) {
      coords.x = WINDOW_PADDING
    }
  }

  // > VERTICAL OVERFLOW HANDLING
  if (coords.y + menuRect.height > window.innerHeight - WINDOW_PADDING) {
    if (behavior === MenuBehavior.AUTOCOMPLETE) {
      // For autocomplete, check if there's more space above or below the parent
      const spaceBelow =
        window.innerHeight -
        WINDOW_PADDING -
        (parentItemRect.y + parentItemRect.height)
      const spaceAbove = parentItemRect.y - WINDOW_PADDING

      if (spaceAbove > spaceBelow && spaceAbove >= menuRect.height) {
        // Flip to above parent if there's more space and menu fits
        coords.y = parentItemRect.y - menuRect.height
        coords.animationOrigin =
          coords.animationOrigin === 'top-right'
            ? 'bottom-right'
            : 'bottom-left'
      } else {
        // Stay below but constrain height to avoid overlap
        coords.y = parentItemRect.y + parentItemRect.height
        coords.height = Math.min(
          menuRect.height,
          window.innerHeight - coords.y - WINDOW_PADDING,
        )
        coords.animationOrigin =
          coords.animationOrigin === 'bottom-right' ? 'top-right' : 'top-left'
      }
    } else {
      // Regular menus are repositioned to fit
      coords.y = window.innerHeight - menuRect.height - WINDOW_PADDING
    }

    // Handle case where menu is still too tall after repositioning
    if (coords.y < WINDOW_PADDING) {
      coords.height = window.innerHeight - coords.y - WINDOW_PADDING * 2
    }
  }

  // > TOP OVERFLOW HANDLING
  // This can happen with select menus due to relative positioning
  if (coords.y < WINDOW_PADDING) {
    if (behavior === MenuBehavior.AUTOCOMPLETE) {
      // For autocomplete, ensure we don't overlap parent when repositioning
      const minY = Math.max(
        WINDOW_PADDING,
        parentItemRect.y + parentItemRect.height,
      )
      coords.y = minY
      coords.height = Math.min(
        menuRect.height,
        window.innerHeight - coords.y - WINDOW_PADDING,
      )
    } else {
      coords.y = WINDOW_PADDING
    }

    // Re-check bottom overflow after top correction
    if (coords.y + menuRect.height > window.innerHeight - WINDOW_PADDING) {
      coords.height = window.innerHeight - coords.y - WINDOW_PADDING * 2
    }
  }

  // > SCROLL OFFSET COMPENSATION
  // Account for page scroll position
  coords.y += window.scrollY
  coords.x += window.scrollX

  // Set default animation origin if not set
  if (!coords.animationOrigin) {
    coords.animationOrigin = 'top-left'
  }

  return coords
}

// ========================================
// Menu Hierarchy Management
// ========================================

/**
 * Creates and adds a new submenu to the active menu hierarchy Validates that
 * the specified item can have a submenu and creates the new menu state
 *
 * @param behavior Menu behavior type
 * @param propItems Root menu items array
 * @param activeMenus Current active menus array
 * @param activeMenusMeta Current menu metadata array
 * @param menu Parent menu index
 * @param index Item index within parent menu that should open submenu
 * @returns New menu arrays or null if submenu cannot be created
 */
export function addSubMenu(
  behavior: MenuBehaviorType,
  propItems: MenuItem[],
  activeMenus: ActiveMenu[],
  activeMenusMeta: ActiveMenuMeta[],
  menu: number,
  index: number,
): [ActiveMenu[], ActiveMenuMeta[]] | null {
  const currentMenu = activeMenus[menu]
  const currentItem = getMenuItems(propItems, currentMenu.menuPath)[index]

  // Validate that this item actually has subitems
  if (!(typeof currentItem === 'object' && 'items' in currentItem)) return null

  // Get parent item dimensions for positioning
  const parentItemRect =
    activeMenusMeta[menu].itemRefs[index]?.getBoundingClientRect() ||
    new DOMRect()

  // Create the new submenu
  const [activeMenu, activeMenuMeta] = createActiveMenu(
    behavior,
    index,
    parentItemRect,
    [...currentMenu.menuPath, index], // Extend path to include current item
    propItems,
  )

  // Remove any existing submenus after the target menu and add new one
  const [newActiveMenus, newActiveMenusMeta] = removeSubMenu(
    activeMenus,
    activeMenusMeta,
    menu,
  )
  newActiveMenus.push(activeMenu)
  newActiveMenusMeta.push(activeMenuMeta)

  return [newActiveMenus, newActiveMenusMeta]
}

/**
 * Removes all submenus after a specified menu index Used to clean up the menu
 * hierarchy when navigation changes
 *
 * @param activeMenus Current active menus array
 * @param activeMenusMeta Current menu metadata array
 * @param menu Index of last menu to keep (all menus after this are removed)
 * @returns Truncated menu arrays
 */
export function removeSubMenu(
  activeMenus: ActiveMenu[],
  activeMenusMeta: ActiveMenuMeta[],
  menu: number,
): [ActiveMenu[], ActiveMenuMeta[]] {
  // Slice to keep only menus up to and including the specified index
  const newActiveMenus = activeMenus.slice(0, menu + 1)
  const newActiveMenusMeta = activeMenusMeta.slice(0, menu + 1)

  return [newActiveMenus, newActiveMenusMeta]
}
