import { describe, it, expect } from 'vitest'
import {
  checkIfInTriangle,
  calculatePosition,
} from '@lib/components/menu/core/positioning'
import { MenuBehavior } from '@lib/components/menu/core/types'

describe('checkIfInTriangle', () => {
  const a = { x: 0, y: 0 }
  const b = { x: 10, y: 0 }
  const c = { x: 0, y: 10 }

  it('returns true for point inside triangle', () => {
    expect(checkIfInTriangle(a, b, c, { x: 2, y: 2 })).toBe(true)
  })

  it('returns false for point outside triangle', () => {
    expect(checkIfInTriangle(a, b, c, { x: 10, y: 10 })).toBe(false)
  })

  it('returns false for point far outside triangle', () => {
    expect(checkIfInTriangle(a, b, c, { x: -5, y: -5 })).toBe(false)
  })

  it('handles degenerate triangle (collinear points)', () => {
    const result = checkIfInTriangle(
      { x: 0, y: 0 },
      { x: 5, y: 0 },
      { x: 10, y: 0 },
      { x: 3, y: 1 },
    )
    expect(typeof result).toBe('boolean')
  })
})

describe('calculatePosition', () => {
  const defaultWindow = {
    innerWidth: 1024,
    innerHeight: 768,
    scrollX: 0,
    scrollY: 0,
  }

  const makeRect = (
    x: number,
    y: number,
    width: number,
    height: number,
  ): DOMRect => new DOMRect(x, y, width, height)

  describe('root menu (depth=0, MENU behavior)', () => {
    it('positions below anchor', () => {
      const parentRect = makeRect(100, 50, 80, 30)
      const menuRect = makeRect(0, 0, 200, 300)
      const result = calculatePosition(
        0,
        parentRect,
        menuRect,
        MenuBehavior.MENU,
        defaultWindow,
      )

      expect(result.x).toBe(100)
      expect(result.y).toBe(80) // 50 + 30
      expect(result.animationOrigin).toBe('top-left')
    })

    it('flips horizontally when overflowing right', () => {
      const parentRect = makeRect(900, 50, 80, 30)
      const menuRect = makeRect(0, 0, 200, 300)
      const result = calculatePosition(
        0,
        parentRect,
        menuRect,
        MenuBehavior.MENU,
        defaultWindow,
      )

      // Should right-align with parent
      expect(result.x).toBe(900 + 80 - 200)
      expect(result.animationOrigin).toBe('top-right')
    })

    it('flips vertically when overflowing bottom', () => {
      const parentRect = makeRect(100, 600, 80, 30)
      const menuRect = makeRect(0, 0, 200, 300)
      const result = calculatePosition(
        0,
        parentRect,
        menuRect,
        MenuBehavior.MENU,
        defaultWindow,
      )

      // Should position above anchor
      expect(result.y).toBe(600 - 300)
      expect(result.animationOrigin).toBe('bottom-left')
    })
  })

  describe('submenu (depth>0)', () => {
    it('positions to the right of parent item', () => {
      const parentRect = makeRect(100, 200, 200, 30)
      const menuRect = makeRect(0, 0, 150, 200)
      const result = calculatePosition(
        1,
        parentRect,
        menuRect,
        MenuBehavior.MENU,
        defaultWindow,
      )

      expect(result.x).toBe(100 + 200 + 4) // parent.x + parent.width + LEFT_MENU_OFFSET
      expect(result.y).toBe(200 - 4) // parent.y - TOP_MENU_OFFSET
      expect(result.endAlign).toBe(true)
    })

    it('flips to left when overflowing right', () => {
      const parentRect = makeRect(800, 200, 200, 30)
      const menuRect = makeRect(0, 0, 150, 200)
      const result = calculatePosition(
        1,
        parentRect,
        menuRect,
        MenuBehavior.MENU,
        defaultWindow,
      )

      expect(result.endAlign).toBe(false)
      expect(result.x).toBe(800 - 150)
      expect(result.animationOrigin).toBe('top-right')
    })
  })

  describe('SELECT mode', () => {
    it('uses relative distance for positioning', () => {
      const parentRect = makeRect(100, 300, 200, 30)
      const menuRect = makeRect(0, 0, 200, 400)
      const result = calculatePosition(
        0,
        parentRect,
        menuRect,
        MenuBehavior.SELECT,
        defaultWindow,
        50,
      )

      expect(result.x).toBe(100 - 16 - 14) // parentItemRect.x - 16 - 14
      expect(result.y).toBe(300 - 50 - 16) // parentItemRect.y - relativeDistance - 16
      expect(result.minWidth).toBe(200)
    })
  })

  describe('AUTOCOMPLETE mode (depth=0)', () => {
    it('positions below when space is available', () => {
      const parentRect = makeRect(100, 100, 200, 30)
      const menuRect = makeRect(0, 0, 200, 200)
      const result = calculatePosition(
        0,
        parentRect,
        menuRect,
        MenuBehavior.AUTOCOMPLETE,
        defaultWindow,
      )

      expect(result.x).toBe(100)
      expect(result.y).toBe(130) // 100 + 30
      expect(result.animationOrigin).toBe('top-left')
      expect(result.minWidth).toBe(200)
    })

    it('positions above when more space above', () => {
      const parentRect = makeRect(100, 700, 200, 30)
      const menuRect = makeRect(0, 0, 200, 100)
      const result = calculatePosition(
        0,
        parentRect,
        menuRect,
        MenuBehavior.AUTOCOMPLETE,
        defaultWindow,
      )

      expect(result.y).toBe(700 - 100) // parentRect.y - menuRect.height
      expect(result.animationOrigin).toBe('bottom-left')
    })

    it('constrains height when neither direction fits', () => {
      const parentRect = makeRect(100, 400, 200, 30)
      const menuRect = makeRect(0, 0, 200, 800)
      const result = calculatePosition(
        0,
        parentRect,
        menuRect,
        MenuBehavior.AUTOCOMPLETE,
        defaultWindow,
      )

      // Should constrain height since menu is taller than available space
      expect(result.height).toBeDefined()
    })
  })

  describe('scroll offset compensation', () => {
    it('adds scroll offset to position', () => {
      const parentRect = makeRect(100, 50, 80, 30)
      const menuRect = makeRect(0, 0, 200, 300)
      const result = calculatePosition(
        0,
        parentRect,
        menuRect,
        MenuBehavior.MENU,
        { ...defaultWindow, scrollX: 50, scrollY: 100 },
      )

      expect(result.x).toBe(100 + 50)
      expect(result.y).toBe(80 + 100) // (50 + 30) + scrollY
    })
  })

  describe('vertical overflow handling', () => {
    it('constrains menu height when too tall', () => {
      const parentRect = makeRect(100, 10, 80, 30)
      const menuRect = makeRect(0, 0, 200, 1000)
      const result = calculatePosition(
        0,
        parentRect,
        menuRect,
        MenuBehavior.MENU,
        defaultWindow,
      )

      expect(result.height).toBeDefined()
    })
  })
})
