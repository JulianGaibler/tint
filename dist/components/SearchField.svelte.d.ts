declare const SearchField: import("svelte").Component<{
    id: string;
    value: string;
    label?: string;
    disabled?: boolean;
    elementInput?: HTMLInputElement | undefined;
    elementButton?: HTMLButtonElement | undefined;
    onsearch?: (term: string) => void;
}, {}, "value" | "elementInput" | "elementButton">;
type SearchField = ReturnType<typeof SearchField>;
export default SearchField;
