import { type MenuItem, type Vec2, type ActiveMenu, type ActiveMenuMeta, type MenuBehaviorType } from './MenuInternal.svelte';
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
export declare function getMenuItems(propItems: MenuItem[], menuPath: number[]): MenuItem[];
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
export declare function createActiveMenu(behavior: MenuBehaviorType, parentIndex: number, parentItemRect: DOMRect, menuPath: number[], propItems: MenuItem[]): [ActiveMenu, ActiveMenuMeta];
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
export declare function checkIfInTriangle(a: Vec2, b: Vec2, c: Vec2, s: Vec2): boolean;
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
export declare function calculatePosition(depth: number, parentItemRect: DOMRect, menuRect: DOMRect, behavior: MenuBehaviorType, relativeDistance?: number): {
    x: number;
    y: number;
    endAlign: boolean;
    height: number | undefined;
    minWidth: number | undefined;
    animationOrigin?: string;
};
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
export declare function addSubMenu(behavior: MenuBehaviorType, propItems: MenuItem[], activeMenus: ActiveMenu[], activeMenusMeta: ActiveMenuMeta[], menu: number, index: number): [ActiveMenu[], ActiveMenuMeta[]] | null;
/**
 * Removes all submenus after a specified menu index Used to clean up the menu
 * hierarchy when navigation changes
 *
 * @param activeMenus Current active menus array
 * @param activeMenusMeta Current menu metadata array
 * @param menu Index of last menu to keep (all menus after this are removed)
 * @returns Truncated menu arrays
 */
export declare function removeSubMenu(activeMenus: ActiveMenu[], activeMenusMeta: ActiveMenuMeta[], menu: number): [ActiveMenu[], ActiveMenuMeta[]];
