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

/**
 * Menu items are always fetched from the props items to prevent data
 * duplication. This helper method is used to get the nested items.
 *
 * @param propItems Props.items value
 * @param menuPath Path to the menu item
 * @returns Nested menu items
 */
export function getMenuItems(
  propItems: MenuItem[],
  menuPath: number[],
): MenuItem[] {
  if (menuPath.length === 0) return propItems
  let items = propItems
  for (let i = 0; i < menuPath.length; i++) {
    const item = items[menuPath[i]]
    // We know that these items are menus because they have submenus
    if (!(typeof item === 'object' && 'items' in item)) {
      throw new Error('Invalid menu path')
    }
    items = item.items
  }
  return items
}

/**
 * Creates a new menu and menu meta object.
 *
 * @param parentIndex Menu index from the parent menu
 * @param parentItemRect Dimensions of the parent menu item
 * @param menuPath Path to the menu item
 * @param propItems Props.items value
 * @returns ActiveMenus and ActiveMenusMeta object
 */
export function createActiveMenu(
  behavior: MenuBehaviorType,
  parentIndex: number,
  parentItemRect: DOMRect,
  menuPath: number[],
  propItems: MenuItem[],
): [ActiveMenu, ActiveMenuMeta] {
  let focus = -1
  if (behavior === MenuBehavior.SELECT) {
    focus = propItems.findIndex(
      (item) => typeof item === 'object' && 'checked' in item && item.checked,
    )
  }
  return [
    {
      focus,
      position: {
        x: -1000,
        y: -1000,
        endAlign: true,
        height: undefined,
        minWidth: undefined,
      },
      scrollPosition: -1,
      menuPath,
    },
    {
      parentIndex,
      parentItemRect,
      menuRect: new DOMRect(),
      menuRef: null,
      itemRefs: {},
      searchItems: getMenuItems(propItems, menuPath).reduce(
        (acc, item, index) => {
          // check if item is object and if it has a label
          if (typeof item === 'object' && 'label' in item) {
            acc.push({ label: item.label, index })
          }
          return acc
        },
        [] as { label: string; index: number }[],
      ),
      searchTerm: '',
      lastSearchTime: 0,
    },
  ]
}

/**
 * Quick check to see if s is in a triangle defined by a, b and c
 *
 * @param a Point a of the triangle
 * @param b Point b of the triangle
 * @param c Point c of the triangle
 * @param s Point s to check
 * @returns True if s is in the triangle
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
 * Calculates the position of a given menu
 *
 * @param depth Depth of the menu (0 is the first menu)
 * @param parentItemRect Dimensions of the parent menu item
 * @param menuRect Dimensions of the menu
 * @param selectBehavior If placemenus should behave like select menus
 * @param relativeDistance Distance between menu and item
 * @returns Position information for the menu
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
  } = {
    x: 0,
    y: 0,
    endAlign: true,
    height: undefined,
    minWidth: undefined,
  }
  // There are different approaches to calculate the position of the menu
  // depending on whether the menu is a select menu and if not, if the menu
  // is a submenu.
  if (
    behavior === MenuBehavior.SELECT ||
    behavior === MenuBehavior.AUTOCOMPLETE
  ) {
    coords.minWidth = parentItemRect.width
  }

  if (behavior === MenuBehavior.SELECT && relativeDistance) {
    // -- Select Menu --
    coords.x = parentItemRect.x - 16 - 14
    coords.y = parentItemRect.y - relativeDistance - 16
    if (coords.x + menuRect.width > window.innerWidth - WINDOW_PADDING) {
      coords.x = window.innerWidth - menuRect.width - WINDOW_PADDING
    }
  } else if (depth === 0) {
    // -- Menu --
    coords.x = parentItemRect.x
    coords.y = parentItemRect.y + parentItemRect.height
    // Check for overflow to the right
    if (coords.x + menuRect.width > window.innerWidth - WINDOW_PADDING) {
      // If we have the width of the parent item, we can align the menu to the right
      if (parentItemRect.width) {
        coords.x = parentItemRect.x + parentItemRect.width - menuRect.width
      } else {
        // Otherwise we just align it to the right side of the window
        coords.x = window.innerWidth - menuRect.width - WINDOW_PADDING
      }
    }
    // Check if we overflow the bottom of the window
    if (coords.y + menuRect.height > window.innerHeight - WINDOW_PADDING) {
      // If we do, we align the menu from the bottom of the parent item
      coords.y = parentItemRect.y - menuRect.height
    }
  } else {
    // -- Submenu --
    coords.x = parentItemRect.x + parentItemRect.width + LEFT_MENU_OFFSET
    coords.y = parentItemRect.y - TOP_MENU_OFFSET
    if (coords.x + menuRect.width > window.innerWidth - WINDOW_PADDING) {
      coords.endAlign = false
      coords.x = parentItemRect.x - menuRect.width
    }
    if (coords.x < WINDOW_PADDING) {
      coords.x = WINDOW_PADDING
    }
  }

  // Check if window overflows at the bottom
  if (coords.y + menuRect.height > window.innerHeight - WINDOW_PADDING) {
    if (behavior === MenuBehavior.AUTOCOMPLETE) {
      coords.height = window.innerHeight - coords.y - WINDOW_PADDING * 2
    } else {
      coords.y = window.innerHeight - menuRect.height - WINDOW_PADDING
    }
    // Check if window overflows at the top
    if (coords.y < WINDOW_PADDING) {
      coords.height = window.innerHeight - coords.y - WINDOW_PADDING * 2
    }
  }

  // Check if window overflows at the top
  // This happens for select menus because they can have offsets
  if (coords.y < WINDOW_PADDING) {
    coords.y = WINDOW_PADDING
    // Check if window overflows at the bottom
    if (coords.y + menuRect.height > window.innerHeight - WINDOW_PADDING) {
      coords.height = window.innerHeight - coords.y - WINDOW_PADDING * 2
    }
  }

  // add scroll offset
  coords.y += window.scrollY
  coords.x += window.scrollX

  return coords
}

/**
 * Creates a new submenu
 *
 * @param propItems Props.items value
 * @param activeMenus ActiveMenus object
 * @param activeMenusMeta ActiveMenusMeta object
 * @param menu Menu from which to create a submenu
 * @param index Index of the item from which to create a submenu
 * @returns ActiveMenus and ActiveMenusMeta object
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

  if (!(typeof currentItem === 'object' && 'items' in currentItem)) return null

  const parentItemRect =
    activeMenusMeta[menu].itemRefs[index]?.getBoundingClientRect() ||
    new DOMRect()

  const [activeMenu, activeMenuMeta] = createActiveMenu(
    behavior,
    index,
    parentItemRect,
    [...currentMenu.menuPath, index],
    propItems,
  )

  // create new array where all active menus after menu are removed and add the new one
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
 * Removes a menu from the active menus
 *
 * @param activeMenus ActiveMenus object
 * @param activeMenusMeta ActiveMenusMeta object
 * @param menu Index of the menu to remove
 * @returns ActiveMenus and ActiveMenusMeta object
 */
export function removeSubMenu(
  activeMenus: ActiveMenu[],
  activeMenusMeta: ActiveMenuMeta[],
  menu: number,
): [ActiveMenu[], ActiveMenuMeta[]] {
  const newActiveMenus = activeMenus.slice(0, menu + 1)
  const newActiveMenusMeta = activeMenusMeta.slice(0, menu + 1)

  return [newActiveMenus, newActiveMenusMeta]
}
