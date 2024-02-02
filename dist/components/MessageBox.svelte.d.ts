import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        icon?: string | undefined;
        dismissable?: boolean | undefined;
        element?: HTMLDivElement | undefined;
    };
    events: {
        close: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export type MessageBoxProps = typeof __propDef.props;
export type MessageBoxEvents = typeof __propDef.events;
export type MessageBoxSlots = typeof __propDef.slots;
export default class MessageBox extends SvelteComponent<MessageBoxProps, MessageBoxEvents, MessageBoxSlots> {
}
export {};
