<script context="module">export { MENU_SEPARATOR } from "./menu/MenuInternal.svelte";
</script>

<script>import { MenuBehavior } from "./menu/MenuInternal.svelte";
import MenuInternal from "./menu/MenuInternal.svelte";
export let variant = "button";
export let items = void 0;
export const contextClick = openMenu;
function openMenu(e) {
  e.preventDefault();
  if (variant === "context") {
    if (!("clientX" in e && "clientY" in e)) {
      throw new Error("[tint] Event must have clientX and clientY");
    }
    anchor = { x: e.clientX, y: e.clientY };
  } else {
    anchorRef = e.target;
  }
  show = true;
}
function closeMenu() {
  show = false;
  anchorRef = void 0;
  anchor = void 0;
}
let anchorRef = void 0;
let anchor = void 0;
let show;
</script>

{#if show && (anchorRef || anchor) && items}
  <MenuInternal
    behavior={MenuBehavior.MENU}
    {anchorRef}
    {anchor}
    {items}
    hide={closeMenu}
  />
{/if}
