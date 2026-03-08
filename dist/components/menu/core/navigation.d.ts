import { type MenuItem, type ActiveMenu, type ActiveMenuMeta, type MenuBehaviorType } from './types';
/** Retrieves menu items from nested menu structure using a path */
export declare function getMenuItems(propItems: MenuItem[], menuPath: number[]): MenuItem[];
/** Creates a new active menu and its metadata for rendering */
export declare function createActiveMenu(behavior: MenuBehaviorType, parentIndex: number, parentItemRect: DOMRect, menuPath: number[], propItems: MenuItem[]): [ActiveMenu, ActiveMenuMeta];
/** Creates and adds a new submenu to the active menu hierarchy */
export declare function addSubMenu(behavior: MenuBehaviorType, propItems: MenuItem[], activeMenus: ActiveMenu[], activeMenusMeta: ActiveMenuMeta[], menu: number, index: number): [ActiveMenu[], ActiveMenuMeta[]] | null;
/** Removes all submenus after a specified menu index */
export declare function removeSubMenu(activeMenus: ActiveMenu[], activeMenusMeta: ActiveMenuMeta[], menu: number): [ActiveMenu[], ActiveMenuMeta[]];
