export declare class SygModalDialog {
    private static currentModalUI;
    private static boundSelectors;
    private static delegateListener;
    private static imageDragListeners;
    private static popstateListener;
    private static useHistory;
    private static isRestoringFromHistory;
    private static currentOptions;
    private static bindOptions;
    private static sessionOptions;
    private static currentInfo;
    private static hashActive;
    private static historyDepth;
    private static isClosingByHistory;
    static bind(selector: string, options?: TModalDialogOption): void;
    private static setupEventListeners;
    private static setupPopstateListener;
    static showModal(options: TModalDialogOption): void;
    private static open;
    private static detectType;
    private static applyHash;
    private static clearHash;
    private static cleanupImageDragListeners;
    private static pushHistory;
    private static loadContent;
    private static updateContent;
    private static closeModal;
}

export declare type TModalDialogEventInfo = {
    src: string;
    type: TModalDialogType;
    trigger: HTMLElement | null;
    error?: unknown;
};

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
    hash?: boolean;
    onOpen?: (info: TModalDialogEventInfo) => void;
    onClose?: (info: TModalDialogEventInfo) => void;
    onChange?: (info: TModalDialogEventInfo) => void;
    onLoad?: (info: TModalDialogEventInfo) => void;
};

export declare type TModalDialogType = 'youtube' | 'image' | 'ajax' | 'selector' | 'html';

export { }
