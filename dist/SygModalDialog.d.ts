import type { TModalDialogType, TModalDialogOption } from './types';
export type { TModalDialogOption, TModalDialogType };
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
//# sourceMappingURL=SygModalDialog.d.ts.map