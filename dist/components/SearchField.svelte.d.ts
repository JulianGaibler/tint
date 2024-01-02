import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        id: string;
        value: string;
        label?: string | undefined;
        disabled?: boolean | undefined;
    };
    events: {
        search: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type SearchFieldProps = typeof __propDef.props;
export type SearchFieldEvents = typeof __propDef.events;
export type SearchFieldSlots = typeof __propDef.slots;
export default class SearchField extends SvelteComponent<SearchFieldProps, SearchFieldEvents, SearchFieldSlots> {
}
export {};
