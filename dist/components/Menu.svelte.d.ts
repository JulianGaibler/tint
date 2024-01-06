import { SvelteComponent } from "svelte";
import type { MenuItem } from './menu/MenuInternal.svelte';
export { MENU_SEPARATOR } from './menu/MenuInternal.svelte';
export type { MenuItem };
export type ContextClickHandler = (e: Event | MouseEvent) => void;
declare const __propDef: {
    props: {
        /**
           * The variant of the menu. If 'context', the menu opens at the location of
           * the mouse event. If 'button', the menu is attached to the element that
           * triggered the event.
           *
           * @type {'context' | 'button'}
           */ variant?: "button" | "context" | undefined;
        /**
           * The items of the menu. Menu does not open when undefined.
           *
           * @type {MenuItem[] | undefined}
           */ items?: MenuItem[] | undefined;
        /**
           * The function to call when the menu should be opened. Ensure event has a
           * target element for the anchor.
           *
           * @type {ContextClickHandler | undefined}
           */ contextClick?: (ContextClickHandler) | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type MenuProps = typeof __propDef.props;
export type MenuEvents = typeof __propDef.events;
export type MenuSlots = typeof __propDef.slots;
export default class Menu extends SvelteComponent<MenuProps, MenuEvents, MenuSlots> {
    get contextClick(): ContextClickHandler;
}
