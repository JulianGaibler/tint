// --------
// Constants
// --------
/** Padding of menus to each side of the window */
export const WINDOW_PADDING = 8;
/** Distance between menus */
export const TOP_MENU_OFFSET = 4;
export const LEFT_MENU_OFFSET = 4;
// --------
// Public types
// --------
export const MENU_SEPARATOR = Symbol('seperator');
export const MenuBehavior = {
    MENU: 0,
    SELECT: 1,
    AUTOCOMPLETE: 2,
};
