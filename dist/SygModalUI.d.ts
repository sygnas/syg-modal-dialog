import type { TModalUIOption, TModalDialogType, TModalLoadingState } from './types';
export declare class SygModalUI {
    private dialog;
    private container;
    private content;
    private loading;
    private options;
    static defaultOptions: {
        closeButtonContent: string;
        loadingContent: string;
        modalClass: string;
        containerClass: string;
        contentClass: string;
        closeBtnClass: string;
        loadingClass: string;
    };
    constructor(options?: TModalUIOption);
    private createDialog;
    private setupEventListeners;
    open(): void;
    close(): void;
    setContent(html: string): void;
    setLoadingState(state: TModalLoadingState): void;
    setType(type: TModalDialogType): void;
    getDialog(): HTMLDialogElement;
    getContainer(): HTMLElement;
    getContent(): HTMLElement;
    getLoading(): HTMLElement;
    isOpen(): boolean;
    destroy(): void;
}
//# sourceMappingURL=SygModalUI.d.ts.map