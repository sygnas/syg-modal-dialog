export declare class SygModalDialog {
    private static currentModalUI;
    private static boundSelectors;
    private static delegateListener;
    private static imageDragListeners;
    static bind(selector: string, options?: TModalDialogOption): void;
    static showModal(options: TModalDialogOption): void;
    private static detectType;
    private static cleanupImageDragListeners;
    private static loadContent;
    private static updateContent;
}

export declare type TModalDialogOption = {
    src?: string;
    type?: TModalDialogType;
    html?: string;
    closeButtonContent?: string;
    loadingContent?: string;
    modalClass?: string;
    containerClass?: string;
    contentClass?: string;
    closeBtnClass?: string;
    loadingClass?: string;
    onOpen?: () => void;
    onClose?: () => void;
};

export declare type TModalDialogType = 'youtube' | 'image' | 'ajax' | 'selector' | 'html';

export { }
