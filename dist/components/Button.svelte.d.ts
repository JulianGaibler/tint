import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        variant?: "primary" | "secondary" | "ghost" | undefined;
        small?: boolean | undefined;
        icon?: boolean | undefined;
        toggled?: boolean | undefined;
        href?: string | undefined;
        external?: boolean | undefined;
        download?: string | undefined;
        disabled?: boolean | undefined;
        submit?: boolean | undefined;
        title?: string | undefined;
        ariaLabel?: string | undefined;
        tabindex?: number | undefined;
        element?: HTMLButtonElement | HTMLAnchorElement | HTMLSpanElement | undefined;
    };
    events: {
        click: MouseEvent;
        keypress: KeyboardEvent;
        keydown: KeyboardEvent;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export type ButtonProps = typeof __propDef.props;
export type ButtonEvents = typeof __propDef.events;
export type ButtonSlots = typeof __propDef.slots;
export default class Button extends SvelteComponent<ButtonProps, ButtonEvents, ButtonSlots> {
}
export {};
