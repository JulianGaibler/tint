export { WINDOW_PADDING, TOP_MENU_OFFSET, LEFT_MENU_OFFSET, MENU_SEPARATOR, MenuBehavior, type MenuBehaviorType, type MenuItem, type Vec2, type ActiveMenu, type ActiveMenuMeta, } from './core/types';
import { type Vec2, type MenuBehaviorType, type MenuItem } from './core/types';
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
