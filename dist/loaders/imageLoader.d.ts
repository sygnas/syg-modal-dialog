export type ImageDragListeners = {
    startDrag: (e: MouseEvent) => void;
    doDrag: (e: MouseEvent) => void;
    endDrag: (e: MouseEvent) => void;
    touchStart: (e: TouchEvent) => void;
    touchMove: (e: TouchEvent) => void;
    touchEnd: (e: TouchEvent) => void;
    onResizeHandler: () => void;
    rafId: number | null;
};
export declare function loadImage(src: string, content: HTMLElement, dialog: HTMLDialogElement, container: HTMLElement): Promise<ImageDragListeners>;
//# sourceMappingURL=imageLoader.d.ts.map