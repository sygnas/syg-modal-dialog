import { SygModalUI } from './SygModalUI';
import { loadYoutube, loadImage, loadAjax, loadSelector, loadHtml } from './loaders';
export class SygModalDialog {
    static bind(selector, options = {}) {
        if (this.boundSelectors.has(selector)) {
            return;
        }
        this.boundSelectors.add(selector);
        if (options.useHistory !== undefined) {
            this.useHistory = options.useHistory;
            this.currentOptions = options;
        }
        this.setupPopstateListener();
        if (!this.delegateListener) {
            this.delegateListener = (e) => {
                const target = e.target;
                for (const sel of this.boundSelectors) {
                    const matchedElement = target.closest(sel);
                    if (matchedElement) {
                        e.preventDefault();
                        let src = matchedElement.getAttribute('data-syg-modal-src');
                        if (!src && matchedElement.tagName === 'A') {
                            const anchor = matchedElement;
                            src = anchor.getAttribute('href') || anchor.href;
                        }
                        const typeAttr = matchedElement.getAttribute('data-syg-modal');
                        const type = typeAttr && typeAttr !== '' ? typeAttr : undefined;
                        if (!src) {
                            console.error('data-syg-modal-src または href が指定されていません');
                            return;
                        }
                        this.isRestoringFromHistory = false;
                        this.showModal({
                            ...options,
                            src,
                            type,
                        });
                        break;
                    }
                }
            };
            document.addEventListener('click', this.delegateListener);
        }
    }
    static setupPopstateListener() {
        if (this.popstateListener)
            return;
        this.popstateListener = (e) => {
            const state = e.state;
            this.isRestoringFromHistory = true;
            if (!state || !state.sygModal) {
                if (this.currentModalUI && this.currentModalUI.isOpen()) {
                    this.closeModal();
                }
                return;
            }
            this.showModal({
                src: state.src,
                type: state.type,
                ...state.options,
            });
        };
        window.addEventListener('popstate', this.popstateListener);
    }
    static showModal(options) {
        const { src, type, html } = options;
        if (type === 'html') {
            if (!html) {
                console.error('type="html"の場合、htmlプロパティが必要です');
                return;
            }
        }
        else if (!src) {
            console.error('srcが指定されていません');
            return;
        }
        const contentType = type || (src ? this.detectType(src) : null);
        if (!contentType) {
            console.error('コンテンツタイプが判別できません');
            return;
        }
        if (this.currentModalUI && this.currentModalUI.isOpen()) {
            this.updateContent(src || '', options);
            return;
        }
        this.currentOptions = options;
        this.currentModalUI = new SygModalUI({
            ...options,
            onClose: () => {
                this.cleanupImageDragListeners();
                if ((this.useHistory || options.useHistory) && !this.isRestoringFromHistory) {
                    window.history.back();
                }
                this.isRestoringFromHistory = false;
                if (options.onClose) {
                    options.onClose();
                }
                if (this.currentModalUI) {
                    this.currentModalUI.destroy();
                    this.currentModalUI = null;
                }
            },
        });
        this.currentModalUI.setType(contentType);
        this.currentModalUI.open();
        this.pushHistory(src || '', contentType, options);
        this.loadContent(src || '', contentType, options);
    }
    static detectType(src) {
        if (/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(src)) {
            return 'youtube';
        }
        if (/\.(jpe?g|png|gif|webp)$/i.test(src)) {
            return 'image';
        }
        return null;
    }
    static cleanupImageDragListeners() {
        if (!this.imageDragListeners)
            return;
        const { doDrag, endDrag, startDrag, touchStart, touchMove, touchEnd, onResizeHandler, rafId } = this.imageDragListeners;
        if (rafId !== null && rafId !== undefined) {
            cancelAnimationFrame(rafId);
        }
        if (this.currentModalUI) {
            const container = this.currentModalUI.getContainer();
            container.removeEventListener('mousedown', startDrag);
            container.removeEventListener('touchstart', touchStart);
        }
        document.removeEventListener('mousemove', doDrag);
        document.removeEventListener('touchmove', touchMove);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchend', touchEnd);
        document.removeEventListener('touchcancel', touchEnd);
        window.removeEventListener('resize', onResizeHandler);
        this.imageDragListeners = null;
    }
    static pushHistory(src, type, options) {
        if (!this.isRestoringFromHistory && (this.useHistory || options.useHistory) && type !== 'html' && src) {
            const historyState = {
                sygModal: true,
                src,
                type,
                options: {
                    closeButtonContent: options.closeButtonContent || this.currentOptions.closeButtonContent,
                    loadingContent: options.loadingContent || this.currentOptions.loadingContent,
                    modalClass: options.modalClass || this.currentOptions.modalClass,
                    containerClass: options.containerClass || this.currentOptions.containerClass,
                    contentClass: options.contentClass || this.currentOptions.contentClass,
                    closeBtnClass: options.closeBtnClass || this.currentOptions.closeBtnClass,
                    loadingClass: options.loadingClass || this.currentOptions.loadingClass,
                },
            };
            window.history.pushState(historyState, '', window.location.href);
        }
    }
    static async loadContent(src, type, options) {
        if (!this.currentModalUI)
            return;
        const content = this.currentModalUI.getContent();
        const dialog = this.currentModalUI.getDialog();
        const container = this.currentModalUI.getContainer();
        content.innerHTML = '';
        this.currentModalUI.setLoadingState('loading');
        try {
            switch (type) {
                case 'youtube':
                    await loadYoutube(src, content);
                    break;
                case 'image':
                    this.imageDragListeners = await loadImage(src, content, dialog, container);
                    break;
                case 'ajax':
                    await loadAjax(src, content);
                    break;
                case 'selector':
                    loadSelector(src, content);
                    break;
                case 'html':
                    const html = options?.html || src;
                    loadHtml(html, content);
                    break;
            }
            this.currentModalUI.setLoadingState('complete');
        }
        catch (error) {
            console.error('コンテンツの読み込みに失敗しました:', error);
            content.innerHTML = '<p>コンテンツの取得に失敗しました</p>';
            this.currentModalUI.setLoadingState('complete');
        }
    }
    static updateContent(src, options) {
        if (!this.currentModalUI)
            return;
        const type = options.type || this.detectType(src);
        if (!type) {
            console.error('コンテンツタイプが判別できません:', src);
            return;
        }
        this.currentModalUI.setType(type);
        this.pushHistory(src, type, options);
        this.loadContent(src, type, options);
    }
    static closeModal() {
        if (this.currentModalUI) {
            this.currentModalUI.close();
        }
    }
}
SygModalDialog.currentModalUI = null;
SygModalDialog.boundSelectors = new Set();
SygModalDialog.delegateListener = null;
SygModalDialog.imageDragListeners = null;
SygModalDialog.popstateListener = null;
SygModalDialog.useHistory = false;
SygModalDialog.isRestoringFromHistory = false;
SygModalDialog.currentOptions = {};
//# sourceMappingURL=SygModalDialog.js.map