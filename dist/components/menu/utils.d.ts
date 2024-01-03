import { type MenuItem, MenuBehavior, type Vec2, type ActiveMenu, type ActiveMenuMeta } from './MenuInternal.svelte';
/**
 * Menu items are always fetched from the props items to prevent data
 * duplication. This helper method is used to get the nested items.
 *
 * @param propItems Props.items value
 * @param menuPath Path to the menu item
 * @returns Nested menu items
 */
export declare function getMenuItems(propItems: MenuItem[], menuPath: number[]): MenuItem[];
/**
 * Creates a new menu and menu meta object.
 *
 * @param parentIndex Menu index from the parent menu
 * @param parentItemRect Dimensions of the parent menu item
 * @param menuPath Path to the menu item
 * @param propItems Props.items value
 * @returns ActiveMenus and ActiveMenusMeta object
 */
export declare function createActiveMenu(behavior: MenuBehavior, parentIndex: number, parentItemRect: DOMRect, menuPath: number[], propItems: MenuItem[]): [ActiveMenu, ActiveMenuMeta];
/**
 * Quick check to see if s is in a triangle defined by a, b and c
 *
 * @param a Point a of the triangle
 * @param b Point b of the triangle
 * @param c Point c of the triangle
 * @param s Point s to check
 * @returns True if s is in the triangle
 */
export declare function checkIfInTriangle(a: Vec2, b: Vec2, c: Vec2, s: Vec2): boolean;
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
export declare function calculatePosition(depth: number, parentItemRect: DOMRect, menuRect: DOMRect, behavior: MenuBehavior, relativeDistance?: number): {
    x: number;
    y: number;
    endAlign: boolean;
    height: number | undefined;
    minWidth: number | undefined;
};
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
export declare function addSubMenu(behavior: MenuBehavior, propItems: MenuItem[], activeMenus: ActiveMenu[], activeMenusMeta: ActiveMenuMeta[], menu: number, index: number): [ActiveMenu[], ActiveMenuMeta[]] | null;
/**
 * Removes a menu from the active menus
 *
 * @param activeMenus ActiveMenus object
 * @param activeMenusMeta ActiveMenusMeta object
 * @param menu Index of the menu to remove
 * @returns ActiveMenus and ActiveMenusMeta object
 */
export declare function removeSubMenu(activeMenus: ActiveMenu[], activeMenusMeta: ActiveMenuMeta[], menu: number): [ActiveMenu[], ActiveMenuMeta[]];
