export declare class SygModalDialog {
    private static currentModalUI;
    private static boundSelectors;
    private static delegateListener;
    private static imageDragListeners;
    private static popstateListener;
    private static useHistory;
    private static isRestoringFromHistory;
    private static currentOptions;
    static bind(selector: string, options?: TModalDialogOption): void;
    private static setupPopstateListener;
    static showModal(options: TModalDialogOption): void;
    private static detectType;
    private static cleanupImageDragListeners;
    private static pushHistory;
    private static loadContent;
    private static updateContent;
    private static closeModal;
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
    useHistory?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
};

export declare type TModalDialogType = 'youtube' | 'image' | 'ajax' | 'selector' | 'html';

export { }
