import { describe, it, expect } from 'vitest'
import {
  getMenuItems,
  createActiveMenu,
  addSubMenu,
  removeSubMenu,
} from '@lib/components/menu/core/navigation'
import {
  MenuBehavior,
  MENU_SEPARATOR,
  type MenuItem,
} from '@lib/components/menu/core/types'

const sampleItems: MenuItem[] = [
  { label: 'Cut', onClick: () => {} },
  { label: 'Copy', onClick: () => {} },
  MENU_SEPARATOR,
  {
    label: 'More',
    items: [
      { label: 'Sub1', onClick: () => {} },
      { label: 'Sub2', onClick: () => {} },
    ],
  },
]

describe('getMenuItems', () => {
  it('returns root items for empty path', () => {
    const result = getMenuItems(sampleItems, [])
    expect(result).toBe(sampleItems)
  })

  it('returns nested items for valid path', () => {
    const result = getMenuItems(sampleItems, [3])
    expect(result).toHaveLength(2)
    expect((result[0] as { label: string }).label).toBe('Sub1')
  })

  it('throws for invalid path (non-submenu item)', () => {
    expect(() => getMenuItems(sampleItems, [0])).toThrow('Invalid menu path')
  })
})

describe('createActiveMenu', () => {
  it('creates menu with focus=-1 for MENU mode', () => {
    const parentRect = new DOMRect(0, 0, 100, 30)
    const [activeMenu, meta] = createActiveMenu(
      MenuBehavior.MENU,
      -1,
      parentRect,
      [],
      sampleItems,
    )

    expect(activeMenu.focus).toBe(-1)
    expect(activeMenu.position.x).toBe(-1000)
    expect(activeMenu.scrollPosition).toBe(-1)
    expect(activeMenu.menuPath).toEqual([])
    expect(meta.parentIndex).toBe(-1)
    expect(meta.menuRef).toBeNull()
  })

  it('auto-focuses checked item for SELECT mode', () => {
    const selectItems: MenuItem[] = [
      { label: 'Option A', onClick: () => {}, checked: false },
      { label: 'Option B', onClick: () => {}, checked: true },
      { label: 'Option C', onClick: () => {}, checked: false },
    ]
    const parentRect = new DOMRect(0, 0, 100, 30)
    const [activeMenu] = createActiveMenu(
      MenuBehavior.SELECT,
      -1,
      parentRect,
      [],
      selectItems,
    )

    expect(activeMenu.focus).toBe(1)
  })

  it('populates searchItems correctly (skips separators)', () => {
    const parentRect = new DOMRect(0, 0, 100, 30)
    const [, meta] = createActiveMenu(
      MenuBehavior.MENU,
      -1,
      parentRect,
      [],
      sampleItems,
    )

    expect(meta.searchItems).toHaveLength(3) // Cut, Copy, More (separator skipped)
    expect(meta.searchItems[0]).toEqual({ label: 'Cut', index: 0 })
    expect(meta.searchItems[1]).toEqual({ label: 'Copy', index: 1 })
    expect(meta.searchItems[2]).toEqual({ label: 'More', index: 3 })
  })
})

describe('addSubMenu', () => {
  it('creates submenu with correct path', () => {
    const parentRect = new DOMRect(0, 0, 100, 30)
    const [activeMenu, meta] = createActiveMenu(
      MenuBehavior.MENU,
      -1,
      parentRect,
      [],
      sampleItems,
    )

    // Need to set up itemRefs for the parent item
    meta.itemRefs[3] = document.createElement('div')

    const result = addSubMenu(
      MenuBehavior.MENU,
      sampleItems,
      [activeMenu],
      [meta],
      0,
      3,
    )

    expect(result).not.toBeNull()
    const [newMenus, newMetas] = result!
    expect(newMenus).toHaveLength(2)
    expect(newMenus[1].menuPath).toEqual([3])
    expect(newMetas).toHaveLength(2)
    expect(newMetas[1].parentIndex).toBe(3)
  })

  it('returns null for non-submenu items', () => {
    const parentRect = new DOMRect(0, 0, 100, 30)
    const [activeMenu, meta] = createActiveMenu(
      MenuBehavior.MENU,
      -1,
      parentRect,
      [],
      sampleItems,
    )

    const result = addSubMenu(
      MenuBehavior.MENU,
      sampleItems,
      [activeMenu],
      [meta],
      0,
      0, // "Cut" - not a submenu
    )

    expect(result).toBeNull()
  })

  it('removes deeper submenus first', () => {
    const parentRect = new DOMRect(0, 0, 100, 30)
    const [menu0, meta0] = createActiveMenu(
      MenuBehavior.MENU,
      -1,
      parentRect,
      [],
      sampleItems,
    )
    meta0.itemRefs[3] = document.createElement('div')

    const [menu1, meta1] = createActiveMenu(
      MenuBehavior.MENU,
      3,
      parentRect,
      [3],
      sampleItems,
    )

    // Now add another submenu at level 0 — should remove menu1
    meta0.itemRefs[3] = document.createElement('div')
    const result = addSubMenu(
      MenuBehavior.MENU,
      sampleItems,
      [menu0, menu1],
      [meta0, meta1],
      0,
      3,
    )

    expect(result).not.toBeNull()
    expect(result![0]).toHaveLength(2)
  })
})

describe('removeSubMenu', () => {
  it('truncates arrays correctly', () => {
    const parentRect = new DOMRect(0, 0, 100, 30)
    const [menu0, meta0] = createActiveMenu(
      MenuBehavior.MENU,
      -1,
      parentRect,
      [],
      sampleItems,
    )
    const [menu1, meta1] = createActiveMenu(
      MenuBehavior.MENU,
      3,
      parentRect,
      [3],
      sampleItems,
    )

    const [newMenus, newMetas] = removeSubMenu(
      [menu0, menu1],
      [meta0, meta1],
      0,
    )

    expect(newMenus).toHaveLength(1)
    expect(newMetas).toHaveLength(1)
    expect(newMenus[0]).toBe(menu0)
  })
})
