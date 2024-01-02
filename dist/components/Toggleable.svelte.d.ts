import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        id: string;
        type?: "switch" | "checkbox" | "radio" | undefined;
        checked: boolean;
        disabled?: boolean | undefined;
        ariaLabel?: string | undefined;
        ariaLabelledby?: string | undefined;
        ariaDescribedby?: string | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type ToggleableProps = typeof __propDef.props;
export type ToggleableEvents = typeof __propDef.events;
export type ToggleableSlots = typeof __propDef.slots;
export default class Toggleable extends SvelteComponent<ToggleableProps, ToggleableEvents, ToggleableSlots> {
}
export {};
