export type TModalDialogType = 'youtube' | 'image' | 'ajax' | 'selector' | 'html';
export type TModalDialogOption = {
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
export type TModalHistoryState = {
    sygModal: boolean;
    src: string;
    type: TModalDialogType;
    options?: Partial<TModalDialogOption>;
};
export type TModalUIOption = {
    modalClass?: string;
    containerClass?: string;
    contentClass?: string;
    closeBtnClass?: string;
    closeButtonContent?: string;
    loadingClass?: string;
    loadingContent?: string;
    onOpen?: () => void;
    onClose?: () => void;
};
export type TModalLoadingState = 'init' | 'loading' | 'complete';
//# sourceMappingURL=types.d.ts.map