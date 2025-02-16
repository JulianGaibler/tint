interface Props {
    id: string;
    value: string;
    label?: string;
    disabled?: boolean;
    elementInput?: HTMLInputElement | undefined;
    elementButton?: HTMLButtonElement | undefined;
    onsearch?: (term: string) => void;
}
declare const SearchField: import("svelte").Component<Props, {}, "value" | "elementInput" | "elementButton">;
type SearchField = ReturnType<typeof SearchField>;
export default SearchField;
