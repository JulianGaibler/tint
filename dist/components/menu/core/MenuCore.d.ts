import { type MenuItem, type MenuDOMAdapter, type MenuCoreConfig, type MenuDisplayState, type ItemRenderMeta } from './types';
export declare class MenuCore {
    private config;
    private adapter;
    private activeMenus;
    private activeMenusMeta;
    private _clickedItem;
    private unixTimeout;
    private queuedSafeArea;
    private safeArea;
    private setMousePosition;
    private submenuTimeout;
    constructor(config: MenuCoreConfig, adapter: MenuDOMAdapter);
    init(): void;
    destroy(): void;
    updateItems(items: MenuItem[]): void;
    updateAnchorRect(rect: DOMRect): void;
    onMenuMount(menuIndex: number, element: HTMLElement | null): void;
    onItemMount(menuIndex: number, itemIndex: number, element: HTMLElement | null): void;
    handleKeydown(key: string): {
        preventDefault?: boolean;
        stopPropagation?: boolean;
    };
    handleMouseMove(clientX: number, clientY: number, menuIndex: number | null, itemIndex: number | null): void;
    handleMouseUp(): void;
    handleMenuMouseLeave(menuIndex: number): void;
    handleScroll(menuIndex: number, scrollTop: number, scrollHeight: number, clientHeight: number): void;
    handleItemClick(menuIndex: number, itemIndex: number): void;
    handleResize(): void;
    handleAnchorMove(anchorRef?: HTMLElement, anchor?: {
        x: number;
        y: number;
    }): void;
    handleAnimationEnd(_menu: number, _item: number): void;
    getMenuItemMeta(menuPath: number[], menuIndex: number): ItemRenderMeta[];
    getGutterVisibility(menuPath: number[]): {
        showLeftGutter: boolean;
        showRightGutter: boolean;
    };
    getMenuRole(): string;
    getMenuElements(): HTMLElement[];
    getItemRef(menu: number, item: number): HTMLElement | null;
    get displayState(): MenuDisplayState;
    private emitState;
    private calcPosition;
    private recalculateAllPositions;
    private handleItemActivation;
    private changeCurrentMenuFocus;
    private setSafeZoneMenu;
}
