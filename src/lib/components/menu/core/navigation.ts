import {
  type MenuItem,
  MenuBehavior,
  type ActiveMenu,
  type ActiveMenuMeta,
  type MenuBehaviorType,
} from './types'

/** Retrieves menu items from nested menu structure using a path */
export function getMenuItems(
  propItems: MenuItem[],
  menuPath: number[],
): MenuItem[] {
  if (menuPath.length === 0) return propItems

  let items = propItems
  for (let i = 0; i < menuPath.length; i++) {
    const item = items[menuPath[i]]
    if (!(typeof item === 'object' && 'items' in item)) {
      throw new Error(
        'Invalid menu path: item at path does not contain subitems',
      )
    }
    items = item.items
  }
  return items
}

/** Creates a new active menu and its metadata for rendering */
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

  const activeMenu: ActiveMenu = {
    focus,
    position: {
      x: -1000,
      y: -1000,
      endAlign: true,
      height: undefined,
      minWidth: undefined,
      animationOrigin: 'top-left',
    },
    scrollPosition: -1,
    menuPath,
  }

  const activeMenuMeta: ActiveMenuMeta = {
    parentIndex,
    parentItemRect,
    menuRect: new DOMRect(),
    menuRef: null,
    itemRefs: {},
    searchItems: getMenuItems(propItems, menuPath).reduce(
      (acc, item, index) => {
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

/** Creates and adds a new submenu to the active menu hierarchy */
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

  const [newActiveMenus, newActiveMenusMeta] = removeSubMenu(
    activeMenus,
    activeMenusMeta,
    menu,
  )
  newActiveMenus.push(activeMenu)
  newActiveMenusMeta.push(activeMenuMeta)

  return [newActiveMenus, newActiveMenusMeta]
}

/** Removes all submenus after a specified menu index */
export function removeSubMenu(
  activeMenus: ActiveMenu[],
  activeMenusMeta: ActiveMenuMeta[],
  menu: number,
): [ActiveMenu[], ActiveMenuMeta[]] {
  const newActiveMenus = activeMenus.slice(0, menu + 1)
  const newActiveMenusMeta = activeMenusMeta.slice(0, menu + 1)

  return [newActiveMenus, newActiveMenusMeta]
}
