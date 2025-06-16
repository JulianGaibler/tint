/** Padding of menus to each side of the window */
export declare const WINDOW_PADDING = 8;
/** Distance between menus */
export declare const TOP_MENU_OFFSET = 4;
export declare const LEFT_MENU_OFFSET = 4;
export declare const MENU_SEPARATOR: unique symbol;
export declare const MenuBehavior: {
    readonly MENU: 0;
    readonly SELECT: 1;
    readonly AUTOCOMPLETE: 2;
};
export type MenuBehaviorType = (typeof MenuBehavior)[keyof typeof MenuBehavior];
export type MenuItem<T = unknown> = {
    label: string;
    icon?: string;
    checked?: boolean | (() => boolean);
    onClick: () => void;
    data?: T;
    disabled?: boolean;
} | {
    label: string;
    icon?: string;
    items: MenuItem<T>[];
    disabled?: boolean;
} | typeof MENU_SEPARATOR;
export type Vec2 = {
    x: number;
    y: number;
};
/** Describes information that is important for rendering the context menu */
export type ActiveMenu = {
    focus: number;
    position: {
        x: number;
        y: number;
        endAlign: boolean;
        height: number | undefined;
        minWidth: number | undefined;
        animationOrigin?: string;
    };
    scrollPosition: number;
    menuPath: number[];
};
/**
 * Describes information that is not used during rendering but is used for
 * calculations
 */
export type ActiveMenuMeta = {
    parentIndex: number;
    parentItemRect: DOMRect;
    menuRect: DOMRect;
    menuRef: HTMLElement | null;
    itemRefs: {
        [key: number]: HTMLElement | null;
    };
    searchItems: {
        label: string;
        index: number;
    }[];
    searchTerm: string;
    lastSearchTime: number;
};
interface Props {
    id?: string;
    anchorRef?: HTMLElement;
    anchor?: Vec2 | undefined;
    items: MenuItem[];
    behavior: MenuBehaviorType;
    size?: 'tight' | 'large';
    animated?: boolean;
    closeOnClick?: boolean;
    hide: () => void;
    onItemFocus?: (item: MenuItem) => void;
    recalculatePosition?: () => void;
    lastActiveElement?: HTMLElement;
}
declare const MenuInternal: import("svelte").Component<Props, {}, "recalculatePosition" | "lastActiveElement">;
type MenuInternal = ReturnType<typeof MenuInternal>;
export default MenuInternal;
