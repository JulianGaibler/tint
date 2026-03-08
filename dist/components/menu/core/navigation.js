import { MenuBehavior, } from './types';
/** Retrieves menu items from nested menu structure using a path */
export function getMenuItems(propItems, menuPath) {
    if (menuPath.length === 0)
        return propItems;
    let items = propItems;
    for (let i = 0; i < menuPath.length; i++) {
        const item = items[menuPath[i]];
        if (!(typeof item === 'object' && 'items' in item)) {
            throw new Error('Invalid menu path: item at path does not contain subitems');
        }
        items = item.items;
    }
    return items;
}
/** Creates a new active menu and its metadata for rendering */
export function createActiveMenu(behavior, parentIndex, parentItemRect, menuPath, propItems) {
    let focus = -1;
    if (behavior === MenuBehavior.SELECT) {
        focus = propItems.findIndex((item) => typeof item === 'object' && 'checked' in item && item.checked);
    }
    const activeMenu = {
        focus,
        position: {
            x: -1000,
            y: -1000,
            endAlign: true,
            height: undefined,
            minWidth: undefined,
            animationOrigin: 'top-left',
        },
        scrollPosition: -1,
        menuPath,
    };
    const activeMenuMeta = {
        parentIndex,
        parentItemRect,
        menuRect: new DOMRect(),
        menuRef: null,
        itemRefs: {},
        searchItems: getMenuItems(propItems, menuPath).reduce((acc, item, index) => {
            if (typeof item === 'object' && 'label' in item) {
                acc.push({ label: item.label, index });
            }
            return acc;
        }, []),
        searchTerm: '',
        lastSearchTime: 0,
    };
    return [activeMenu, activeMenuMeta];
}
/** Creates and adds a new submenu to the active menu hierarchy */
export function addSubMenu(behavior, propItems, activeMenus, activeMenusMeta, menu, index) {
    var _a;
    const currentMenu = activeMenus[menu];
    const currentItem = getMenuItems(propItems, currentMenu.menuPath)[index];
    if (!(typeof currentItem === 'object' && 'items' in currentItem))
        return null;
    const parentItemRect = ((_a = activeMenusMeta[menu].itemRefs[index]) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect()) ||
        new DOMRect();
    const [activeMenu, activeMenuMeta] = createActiveMenu(behavior, index, parentItemRect, [...currentMenu.menuPath, index], propItems);
    const [newActiveMenus, newActiveMenusMeta] = removeSubMenu(activeMenus, activeMenusMeta, menu);
    newActiveMenus.push(activeMenu);
    newActiveMenusMeta.push(activeMenuMeta);
    return [newActiveMenus, newActiveMenusMeta];
}
/** Removes all submenus after a specified menu index */
export function removeSubMenu(activeMenus, activeMenusMeta, menu) {
    const newActiveMenus = activeMenus.slice(0, menu + 1);
    const newActiveMenusMeta = activeMenusMeta.slice(0, menu + 1);
    return [newActiveMenus, newActiveMenusMeta];
}
