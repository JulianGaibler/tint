<script context="module">export const WINDOW_PADDING = 8;
export const TOP_MENU_OFFSET = 4;
export const LEFT_MENU_OFFSET = 4;
export const MENU_SEPARATOR = Symbol("seperator");
export var MenuBehavior = /* @__PURE__ */ ((MenuBehavior2) => {
  MenuBehavior2[MenuBehavior2["MENU"] = 0] = "MENU";
  MenuBehavior2[MenuBehavior2["SELECT"] = 1] = "SELECT";
  MenuBehavior2[MenuBehavior2["AUTOCOMPLETE"] = 2] = "AUTOCOMPLETE";
  return MenuBehavior2;
})(MenuBehavior || {});
</script>

<script>import {
  createActiveMenu,
  addSubMenu,
  getMenuItems,
  calculatePosition,
  checkIfInTriangle,
  removeSubMenu
} from "./utils";
import ArrowIcon from "../../icons/14-chevron-menu-right.svg?raw";
import ArrowUp from "../../icons/14-chevron-menu-up.svg?raw";
import ArrowDown from "../../icons/14-chevron-menu-down.svg?raw";
import CheckIcon from "../../icons/14-check.svg?raw";
import throttle from "lodash/throttle";
import { matchSorter } from "match-sorter";
import { onMount, onDestroy } from "svelte";
export let anchorRef = void 0;
export let anchor = void 0;
export let items;
export let behavior;
export let hide;
export let onItemFocus = void 0;
export let lastActiveElement = void 0;
let displayActiveMenus = [];
let clickedItem = null;
let anchorRect = null;
const ws = {
  activeMenusRef: [],
  activeMenusMeta: [],
  unixTimeout: { unix: true, timeout: null },
  queuedSafeArea: null,
  safeArea: [null, null, null]
};
const setMenuRefHandler = {
  set: function(_target, prop, value) {
    if (value === void 0)
      return true;
    const menu = parseInt(prop, 10);
    setMenuRef(menu, value);
    return true;
  }
};
const setMenuRefProxy = new Proxy(ws.activeMenusMeta, setMenuRefHandler);
const setItemRefHandler = {
  set: function(obj, prop, value) {
    if (value === void 0)
      return true;
    const [i, j] = prop.split("-");
    const menu = parseInt(i, 10);
    const item = parseInt(j, 10);
    setItemRef(menu, item, value);
    return true;
  }
};
const setItemRefProxy = new Proxy(ws.activeMenusMeta, setItemRefHandler);
function commitActiveMenus() {
  displayActiveMenus = [...ws.activeMenusRef];
}
function setMenuRef(menu, menuRef) {
  const activeMenu = ws.activeMenusRef[menu];
  const activeMenuMeta = ws.activeMenusMeta[menu];
  if (!menuRef || activeMenuMeta.menuRef === menuRef)
    return;
  activeMenuMeta.menuRef = menuRef;
  activeMenuMeta.menuRect = menuRef.getBoundingClientRect();
  if (behavior !== MenuBehavior.SELECT) {
    if (menuRef.childNodes[0] && menuRef.childNodes[0].nodeType === 1) {
      ;
      menuRef.childNodes[0]?.focus();
    }
    activeMenu.position = calculatePosition(
      menu,
      activeMenuMeta.parentItemRect,
      activeMenuMeta.menuRect,
      behavior
    );
  } else {
    const i = getMenuItems(items, activeMenu.menuPath);
    const focus = i.findIndex(
      (item) => typeof item === "object" && "checked" in item && item.checked
    );
    const itemRef = activeMenuMeta.itemRefs[focus];
    activeMenu.position = calculatePosition(
      menu,
      activeMenuMeta.parentItemRect,
      activeMenuMeta.menuRect,
      behavior,
      itemRef ? itemRef.getBoundingClientRect().y - activeMenuMeta.menuRect.y : void 0
    );
  }
  if (ws.queuedSafeArea != null && ws.queuedSafeArea === menu) {
    const height = activeMenu.position.height || activeMenuMeta.menuRect.height;
    if (ws.safeArea[1] === null) {
      ws.safeArea[1] = { x: 0, y: 0 };
    }
    if (ws.safeArea[2] === null) {
      ws.safeArea[2] = { x: 0, y: 0 };
    }
    ws.safeArea[1].x = activeMenu.position.x;
    ws.safeArea[1].y = activeMenu.position.y;
    ws.safeArea[2].x = activeMenu.position.x;
    ws.safeArea[2].y = activeMenu.position.y + height;
    ws.queuedSafeArea = null;
  }
  commitActiveMenus();
}
onMount(() => {
  if (anchorRef) {
    anchorRect = anchorRef.getBoundingClientRect();
  } else if (anchor) {
    const rect = new DOMRect();
    rect.x = anchor.x;
    rect.y = anchor.y;
    anchorRect = rect;
  }
  if (!anchorRect)
    return;
  ws.unixTimeout.timeout = setTimeout(() => {
    ws.unixTimeout.timeout = null;
  }, 300);
  const [activeMenu, activeMenuMeta] = createActiveMenu(
    behavior,
    -1,
    anchorRect,
    [],
    items
  );
  ws.activeMenusRef = [activeMenu];
  ws.activeMenusMeta = [activeMenuMeta];
  commitActiveMenus();
  lastActiveElement = document.activeElement;
});
onDestroy(() => {
  lastActiveElement?.focus();
});
function handleItemActivation(menu, index) {
  if (clickedItem)
    return;
  const item = getMenuItems(items, ws.activeMenusRef[menu].menuPath)[index];
  if (!(typeof item === "object"))
    return;
  if ("disabled" in item && item.disabled)
    return;
  if ("onClick" in item) {
    const itemRef = ws.activeMenusMeta[menu].itemRefs[index];
    itemRef?.addEventListener("animationend", () => {
      item.onClick();
      hide();
    });
    clickedItem = [menu, index];
    return;
  }
  if ("items" in item) {
    const newMenuArrays = addSubMenu(
      behavior,
      items,
      ws.activeMenusRef,
      ws.activeMenusMeta,
      menu,
      index
    );
    if (newMenuArrays) {
      ws.activeMenusRef = newMenuArrays[0];
      ws.activeMenusMeta = newMenuArrays[1];
      commitActiveMenus();
    }
    return;
  }
}
function setSafeZoneMenu(menu) {
  if (!ws.activeMenusMeta[menu]) {
    ws.queuedSafeArea = menu;
    return;
  }
  const nextMenu = ws.activeMenusRef[menu];
  const nextMenuMeta = ws.activeMenusMeta[menu];
  const flipWidth = nextMenu.position.endAlign ? 0 : nextMenuMeta.menuRect.width;
  if (ws.safeArea[1] === null) {
    ws.safeArea[1] = { x: 0, y: 0 };
  }
  if (ws.safeArea[2] === null) {
    ws.safeArea[2] = { x: 0, y: 0 };
  }
  ws.safeArea[1].x = nextMenu.position.x + flipWidth;
  ws.safeArea[1].y = nextMenu.position.y;
  ws.safeArea[2].x = nextMenu.position.x + flipWidth;
  ws.safeArea[2].y = nextMenu.position.y + nextMenuMeta.menuRect.height;
}
function handleMenuMouseLeave(menu) {
  if (behavior === MenuBehavior.SELECT || behavior === MenuBehavior.AUTOCOMPLETE)
    return;
  if (menu !== ws.activeMenusRef.length - 1)
    return;
  const activeMenu = ws.activeMenusRef[menu];
  if (activeMenu.focus === -1)
    return;
  activeMenu.focus = -1;
  commitActiveMenus();
}
function checkOverflow(menu, event) {
  const menuRef = event.target;
  if (!menuRef)
    return;
  let scrollPosition = 0;
  if (menuRef.scrollTop === 0) {
    scrollPosition = -1;
  } else if (menuRef.scrollHeight - menuRef.scrollTop === menuRef.clientHeight) {
    scrollPosition = 1;
  }
  if (scrollPosition !== ws.activeMenusRef[menu].scrollPosition) {
    ws.activeMenusRef[menu].scrollPosition = scrollPosition;
    commitActiveMenus();
  }
}
function setItemRef(menu, item, itemRef) {
  const activeMenuMeta = ws.activeMenusMeta[menu];
  if (!itemRef || activeMenuMeta.itemRefs[item] === itemRef)
    return;
  if (behavior) {
    const i = getMenuItems(items, ws.activeMenusRef[menu].menuPath)[item];
    if (typeof i === "object" && "checked" in i && i.checked) {
      itemRef.focus();
    }
  }
  activeMenuMeta.itemRefs[item] = itemRef;
}
const handleMouseUp = () => {
  if (ws.unixTimeout.timeout !== null) {
    clearTimeout(ws.unixTimeout.timeout);
    ws.unixTimeout.timeout = null;
    ws.unixTimeout.unix = false;
    return;
  }
  if (!ws.unixTimeout.unix)
    return;
  const activeMenu = ws.activeMenusRef[ws.activeMenusRef.length - 1];
  if (activeMenu.focus === -1) {
    hide();
    return;
  }
  const item = getMenuItems(
    items,
    ws.activeMenusRef[ws.activeMenusRef.length - 1].menuPath
  )[activeMenu.focus];
  if (!(typeof item === "object" && "items" in item)) {
    handleItemActivation(ws.activeMenusRef.length - 1, activeMenu.focus);
  } else {
    clickedItem = [ws.activeMenusRef.length - 1, activeMenu.focus];
  }
};
const handleKeydown = (event) => {
  if (event.key === "Escape") {
    hide();
    return;
  }
  const currentMenu = ws.activeMenusRef[ws.activeMenusRef.length - 1];
  const menuLength = getMenuItems(items, currentMenu.menuPath).length;
  const changeCurrentMenuFocus = (index) => {
    const direction = index > currentMenu.focus ? 1 : -1;
    if (index < 0 || index >= menuLength)
      return;
    let newItem = getMenuItems(items, currentMenu.menuPath)[index];
    while (newItem === MENU_SEPARATOR || newItem.disabled) {
      index += direction;
      if (index < 0 || index >= menuLength)
        return;
      newItem = getMenuItems(items, currentMenu.menuPath)[index];
    }
    currentMenu.focus = index;
    const itemRef = ws.activeMenusMeta[ws.activeMenusRef.length - 1].itemRefs[index];
    itemRef?.scrollIntoView({
      block: "nearest"
    });
    if (onItemFocus) {
      const item = getMenuItems(items, currentMenu.menuPath)[index];
      onItemFocus(item);
    }
    if (behavior === MenuBehavior.AUTOCOMPLETE)
      return;
    itemRef?.focus();
  };
  if (event.key === "ArrowDown") {
    if (currentMenu.focus < menuLength - 1) {
      changeCurrentMenuFocus(currentMenu.focus + 1);
    }
    commitActiveMenus();
    return;
  } else if (event.key === "ArrowUp") {
    if (currentMenu.focus === -1) {
      changeCurrentMenuFocus(menuLength - 1);
    } else if (currentMenu.focus > 0) {
      changeCurrentMenuFocus(currentMenu.focus - 1);
    }
    commitActiveMenus();
    return;
  } else if (event.key === "ArrowRight") {
    if (currentMenu.focus === -1) {
      changeCurrentMenuFocus(0);
      commitActiveMenus();
      return;
    }
    const newMenuArrays = addSubMenu(
      behavior,
      items,
      ws.activeMenusRef,
      ws.activeMenusMeta,
      ws.activeMenusRef.length - 1,
      currentMenu.focus
    );
    if (newMenuArrays) {
      ws.activeMenusRef = newMenuArrays[0];
      ws.activeMenusMeta = newMenuArrays[1];
      commitActiveMenus();
      return;
    }
    commitActiveMenus();
    return;
  } else if (event.key === "ArrowLeft") {
    if (ws.activeMenusRef.length === 1) {
      if (currentMenu.focus === -1) {
        changeCurrentMenuFocus(0);
      }
      commitActiveMenus();
      return;
    }
    const newMenuArrays = removeSubMenu(
      ws.activeMenusRef,
      ws.activeMenusMeta,
      ws.activeMenusRef.length - 2
    );
    if (newMenuArrays) {
      ws.activeMenusRef = newMenuArrays[0];
      ws.activeMenusMeta = newMenuArrays[1];
      commitActiveMenus();
      return;
    }
    return;
  } else if (event.key === "Enter" || event.key === " ") {
    if (currentMenu.focus === -1) {
      commitActiveMenus();
      return;
    }
    const currentItem = getMenuItems(items, currentMenu.menuPath)[currentMenu.focus];
    if (typeof currentItem === "object" && "onClick" in currentItem) {
      handleItemActivation(ws.activeMenusRef.length - 1, currentMenu.focus);
    } else if (typeof currentItem === "object" && "items" in currentItem) {
      const newMenuArrays = addSubMenu(
        behavior,
        items,
        ws.activeMenusRef,
        ws.activeMenusMeta,
        ws.activeMenusRef.length - 1,
        currentMenu.focus
      );
      if (newMenuArrays) {
        ws.activeMenusMeta = newMenuArrays[1];
        ws.activeMenusRef = newMenuArrays[0];
        commitActiveMenus();
        return;
      }
    }
  } else if (event.key.length === 1 && behavior !== MenuBehavior.AUTOCOMPLETE) {
    const activeMenuMeta = ws.activeMenusMeta[ws.activeMenusRef.length - 1];
    const currentTime = (/* @__PURE__ */ new Date()).getTime();
    const lastKeyTime = activeMenuMeta.lastSearchTime;
    if (currentTime - lastKeyTime > 200) {
      activeMenuMeta.searchTerm = event.key;
    } else {
      activeMenuMeta.searchTerm += event.key;
    }
    activeMenuMeta.lastSearchTime = currentTime;
    const result = matchSorter(
      activeMenuMeta.searchItems,
      activeMenuMeta.searchTerm,
      {
        keys: ["label"]
      }
    );
    if (result.length > 0) {
      changeCurrentMenuFocus(result[0].index);
      commitActiveMenus();
      return;
    }
  }
  commitActiveMenus();
  return;
};
const setMousePosition = throttle((x, y) => {
  if (ws.safeArea[0] === null) {
    ws.safeArea[0] = { x: 0, y: 0 };
  }
  ws.safeArea[0].x = x;
  ws.safeArea[0].y = y;
}, 200);
const updateMousePosition = (ev) => {
  if (clickedItem != null)
    return;
  if (!ev.target)
    return;
  const dataset = ev.target.dataset;
  if (!dataset.menu || !dataset.item)
    return;
  const menu = parseInt(dataset.menu, 10);
  const index = parseInt(dataset.item, 10);
  if (ws.activeMenusMeta[menu + 1]?.parentIndex === index) {
    const item2 = getMenuItems(items, ws.activeMenusRef[menu].menuPath)[index];
    if (typeof item2 === "object" && "items" in item2) {
      setSafeZoneMenu(menu + 1);
      setMousePosition(ev.clientX, ev.clientY);
    }
    return;
  }
  const activeItem = getMenuItems(items, ws.activeMenusRef[menu].menuPath)[ws.activeMenusRef[menu].focus];
  if (ws.activeMenusRef.length > menu + 1 && typeof activeItem === "object" && activeItem && "items" in activeItem) {
    const mouse = {
      x: ev.clientX,
      y: ev.clientY
    };
    if (ws.safeArea[0] !== null && ws.safeArea[1] !== null && ws.safeArea[2] !== null) {
      const inTriangle = checkIfInTriangle(
        ws.safeArea[0],
        ws.safeArea[1],
        ws.safeArea[2],
        mouse
      );
      if (inTriangle) {
        return;
      }
    }
  }
  let newActiveMenusMeta = null;
  if (menu < ws.activeMenusRef.length - 1) {
    const [newMenus, newMenusMeta] = removeSubMenu(
      ws.activeMenusRef,
      ws.activeMenusMeta,
      menu
    );
    ws.activeMenusRef = newMenus;
    newActiveMenusMeta = newMenusMeta;
  }
  ws.activeMenusRef[menu].focus = index;
  commitActiveMenus();
  if (newActiveMenusMeta) {
    ws.activeMenusMeta = newActiveMenusMeta;
  }
  const item = getMenuItems(items, ws.activeMenusRef[menu].menuPath)[index];
  if (!(typeof item === "object" && "items" in item))
    return;
  setTimeout(() => {
    if (menu < ws.activeMenusRef.length - 1)
      return;
    if (ws.activeMenusRef[menu]?.focus !== index)
      return;
    const newMenuArrays = addSubMenu(
      behavior,
      items,
      ws.activeMenusRef,
      ws.activeMenusMeta,
      menu,
      index
    );
    if (!newMenuArrays)
      return;
    setSafeZoneMenu(menu + 1);
    setMousePosition(ev.clientX, ev.clientY);
    ws.activeMenusMeta = newMenuArrays[1];
    ws.activeMenusRef = newMenuArrays[0];
    commitActiveMenus();
  }, 100);
};
const handleResize = () => {
  ws.activeMenusRef.map((activeMenu, i) => {
    const meta = ws.activeMenusMeta[i];
    if (i > 0) {
      const prevMenu = ws.activeMenusMeta[i - 1];
      const k = prevMenu.itemRefs[ws.activeMenusRef[i - 1].focus]?.getBoundingClientRect();
      if (k) {
        meta.parentItemRect = k;
      }
    }
    if (meta.menuRef) {
      meta.menuRect = meta.menuRef.getBoundingClientRect();
    }
    activeMenu.position = calculatePosition(
      i,
      meta.parentItemRect,
      meta.menuRect,
      behavior
    );
  });
  commitActiveMenus();
};
function getMenuItemMeta(propItems, menuPath, i) {
  return getMenuItems(propItems, menuPath).map((item, j) => {
    const selected = j === displayActiveMenus[i].focus;
    const hasSubMenu = typeof item === "object" && "items" in item;
    const subMenuOpen = hasSubMenu && ws.activeMenusMeta[i + 1]?.parentIndex === j;
    const isDisabled = typeof item === "object" && "disabled" in item && item.disabled;
    const isChecked = typeof item === "object" && "checked" in item ? typeof item.checked === "function" ? item.checked() : item.checked : void 0;
    return {
      item,
      selected,
      hasSubMenu,
      subMenuOpen,
      isDisabled,
      isChecked
    };
  });
}
</script>

<svelte:window
  on:keydown={handleKeydown}
  on:resize={handleResize}
  on:mouseup={handleMouseUp}
  on:mousemove={updateMousePosition}
/>

<div
  role="presentation"
  on:click={() => hide()}
  class="fullscreen_overlay"
  on:contextmenu={(e) => {
    e.preventDefault()
    hide()
  }}
/>
{#each displayActiveMenus as { menuPath, position, scrollPosition }, i}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    bind:this={setMenuRefProxy[i]}
    on:mouseleave={() => handleMenuMouseLeave(i)}
    class="context_menu tint--card tint--type-ui"
    class:select={behavior}
    style:left={`${position.x}px`}
    style:top={`${position.y}px`}
    style:height={position.height ? `${position.height}px` : 'auto'}
    style:minWidth={position.minWidth ? `${position.minWidth}px` : 'auto'}
  >
    {#if position.height && scrollPosition > -1}
      <div class="overflow_top" aria-hidden="true">
        {@html ArrowUp}
      </div>
    {/if}
    {#if position.height && scrollPosition < 1}
      <div class="overflow_bottom" aria-hidden="true">
        {@html ArrowDown}
      </div>
    {/if}
    <ul on:scroll={(e) => checkOverflow(i, e)} role="menu" tabIndex={-1}>
      {#each getMenuItemMeta(items, menuPath, i) as info, j}
        {#if typeof info.item === 'object' && 'label' in info.item}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <li
            class={`item item_default ${
              clickedItem && clickedItem[0] === i && clickedItem[1] === j
                ? 'clicked'
                : ''
            }`}
            role={info.isChecked === undefined
              ? 'menuitem'
              : 'menuitemcheckbox'}
            aria-disabled={info.isDisabled}
            aria-haspopup={info.hasSubMenu || undefined}
            aria-expanded={info.hasSubMenu ? info.subMenuOpen : undefined}
            aria-checked={info.isChecked}
            tabIndex={info.selected && !info.isDisabled ? 0 : -1}
            data-selected={info.selected}
            on:click={() => handleItemActivation(i, j)}
            bind:this={setItemRefProxy[`${i}-${j}`]}
            data-menu={i}
            data-item={j}
          >
            {#if info.isChecked}{@html CheckIcon}{/if}
            <span>{info.item.label}</span>
            {#if info.hasSubMenu}{@html ArrowIcon}{/if}
          </li>
        {:else}
          <hr />
        {/if}
      {/each}
    </ul>
  </div>
{/each}

<style>.fullscreen_overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 99;
}
@media print {
  .fullscreen_overlay {
    display: none;
  }
}

.context_menu {
  z-index: 100;
  position: absolute;
  display: flex;
  flex-direction: column;
  min-width: 172px;
  border-radius: 8px;
  padding: 4px;
  overflow: hidden;
}
.context_menu:global(.select) {
  min-width: auto;
}
.context_menu :global(> ul) {
  margin: 0;
  padding: 0;
  list-style: none;
  outline: none;
  overflow-y: scroll;
  overflow-x: hidden;
  overscroll-behavior: contain;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.context_menu :global(> ul)::-webkit-scrollbar {
  display: none;
}
.context_menu :global(hr) {
  margin: 4px;
  border: 0;
  border-top: 1px solid var(--tint-card-border);
}
.context_menu li {
  text-indent: 0;
  list-style-type: none;
}
@media print {
  .context_menu {
    display: none;
  }
}

.overflow_top, .overflow_bottom {
  position: absolute;
  left: 0;
  right: 0;
  pointer-events: none;
  border-width: 1px;
  border-color: rgba(0, 0, 0, 0.05);
  opacity: 0.8;
  font-size: 6px;
  text-align: center;
  padding-inline: 4px;
  color: grey;
  background: var(--tint-bg);
  height: 12px;
  display: flex;
  justify-content: center;
}

.overflow_top {
  top: 0;
  border-bottom-style: solid;
  padding-block-start: 4px;
  align-items: flex-start;
}

.overflow_bottom {
  bottom: 0;
  border-top-style: solid;
  padding-block-end: 4px;
  align-items: flex-end;
}

.item {
  padding: 6px;
  padding-right: 8px;
  outline: none;
  user-select: none;
  border-radius: 4px;
}
.item[data-selected=true] {
  background: var(--tint-action-secondary-hover);
}
@media (forced-colors: active) {
  .item[data-selected=true] {
    background: ButtonText;
    color: ButtonFace;
  }
}
.item:global(.clicked) {
  animation: clicked_animation 200ms linear;
}
.item[aria-disabled=true] {
  opacity: 0.5;
  cursor: default;
  animation: none;
  background: unset;
}
@media (forced-colors: active) {
  .item[aria-disabled=true] {
    color: GrayText;
  }
}

.item_default {
  display: grid;
  grid-template-columns: 14px minmax(0, 1fr) minmax(14px, auto);
  gap: 4px;
  align-items: center;
}
.item_default :global(> span) {
  grid-column: 2/3;
}

@keyframes clicked_animation {
  0%, 40% {
    background: transparent;
  }
  41%, 100% {
    background: var(--tint-action-secondary-hover);
  }
}</style>
