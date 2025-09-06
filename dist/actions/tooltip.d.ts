interface TooltipOptions {
    text: string;
    offset?: number;
}
export declare function tooltip(element: HTMLElement, options: TooltipOptions | string | undefined): {
    update(newOptions: TooltipOptions | string | undefined): void;
    destroy(): void;
};
export {};
