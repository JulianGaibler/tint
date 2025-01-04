<script module>export { MENU_SEPARATOR } from "./menu/MenuInternal.svelte";
</script>

<script lang="ts">import { MenuBehavior } from "./menu/MenuInternal.svelte";
import MenuInternal from "./menu/MenuInternal.svelte";
  interface Props {
    variant?: string;
    items?: any;
  }

  let { variant = "button", items = void 0 }: Props = $props();
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
let anchorRef = $state(void 0);
let anchor = $state(void 0);
let show = $state();
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
