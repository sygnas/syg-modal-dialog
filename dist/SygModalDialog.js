import { SygModalUI } from './SygModalUI';
import { loadYoutube, loadImage, loadAjax, loadSelector, loadHtml, isYoutubeUrl, extractYoutubeId, resetImageContainer, } from './loaders';
const OPEN_EVENT = 'syg-modal:open';
const CLOSE_EVENT = 'syg-modal:close';
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
        this.setupEventListeners(options);
        if (!this.delegateListener) {
            this.delegateListener = (e) => {
                if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
                    return;
                }
                if (!(e.target instanceof Element))
                    return;
                const target = e.target;
                for (const sel of this.boundSelectors) {
                    const matchedElement = target.closest(sel);
                    if (!matchedElement)
                        continue;
                    let src = matchedElement.getAttribute('data-syg-modal-src');
                    if (!src && matchedElement.tagName === 'A') {
                        const anchor = matchedElement;
                        src = anchor.getAttribute('href') || anchor.href;
                    }
                    src = (src || '').trim();
                    if (!src) {
                        console.error('data-syg-modal-src または href が指定されていません');
                        return;
                    }
                    const typeAttr = matchedElement.getAttribute('data-syg-modal');
                    const type = typeAttr && typeAttr !== '' ? typeAttr : this.detectType(src);
                    if (!type)
                        return;
                    if (type === 'youtube' && !extractYoutubeId(src))
                        return;
                    e.preventDefault();
                    this.isRestoringFromHistory = false;
                    this.open({
                        ...options,
                        src,
                        type,
                        hash: matchedElement.hasAttribute('data-syg-modal-hash') || options.hash,
                    }, matchedElement);
                    break;
                }
            };
            document.addEventListener('click', this.delegateListener, true);
        }
    }
    static setupEventListeners(options) {
        if (this.bindOptions)
            return;
        this.bindOptions = options;
        window.addEventListener(OPEN_EVENT, (e) => {
            const detail = (e.detail || {});
            this.isRestoringFromHistory = false;
            this.open({ ...this.bindOptions, ...detail }, null);
        });
        window.addEventListener(CLOSE_EVENT, () => {
            this.closeModal();
        });
    }
    static setupPopstateListener() {
        if (this.popstateListener)
            return;
        this.popstateListener = (e) => {
            if (this.isClosingByHistory) {
                this.isClosingByHistory = false;
                return;
            }
            const state = e.state;
            this.isRestoringFromHistory = true;
            if (!state || !state.sygModal) {
                if (this.currentModalUI && this.currentModalUI.isOpen()) {
                    this.closeModal();
                }
                return;
            }
            if (this.currentModalUI && this.currentModalUI.isOpen() && this.historyDepth > 0) {
                this.historyDepth -= 1;
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
        this.open(options, null);
    }
    static open(options, trigger) {
        const { type, html } = options;
        const src = (options.src || '').trim();
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
        const contentType = type || this.detectType(src);
        if (!contentType) {
            console.error('コンテンツタイプが判別できません:', src);
            return;
        }
        if (this.currentModalUI && this.currentModalUI.isOpen()) {
            this.updateContent(src, contentType, options, trigger);
            return;
        }
        this.currentOptions = options;
        this.sessionOptions = options;
        this.historyDepth = 0;
        const { onOpen, onClose, onChange, onLoad, ...uiOptions } = options;
        this.currentModalUI = new SygModalUI({
            ...uiOptions,
            onClose: () => {
                this.cleanupImageDragListeners();
                this.clearHash();
                if (!this.isRestoringFromHistory && this.historyDepth > 0) {
                    this.isClosingByHistory = true;
                    window.history.go(-this.historyDepth);
                }
                this.historyDepth = 0;
                this.isRestoringFromHistory = false;
                const info = this.currentInfo;
                this.currentInfo = null;
                if (onClose && info) {
                    onClose(info);
                }
                if (this.currentModalUI) {
                    this.currentModalUI.destroy();
                    this.currentModalUI = null;
                }
            },
        });
        this.currentModalUI.setType(contentType);
        this.currentModalUI.open();
        this.currentInfo = { src, type: contentType, trigger };
        this.pushHistory(src, contentType, options);
        this.applyHash(options.hash, src);
        if (onOpen) {
            onOpen(this.currentInfo);
        }
        this.loadContent(src, contentType, options);
    }
    static detectType(src) {
        if (isYoutubeUrl(src)) {
            return 'youtube';
        }
        if (/\.(jpe?g|png|gif|webp)$/i.test(src.replace(/[?#].*$/, ''))) {
            return 'image';
        }
        return null;
    }
    static applyHash(enabled, src) {
        if (enabled && src) {
            window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}#${src}`);
            this.hashActive = true;
        }
        else {
            this.clearHash();
        }
    }
    static clearHash() {
        if (!this.hashActive)
            return;
        this.hashActive = false;
        window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}`);
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
                    hash: options.hash,
                },
            };
            window.history.pushState(historyState, '', window.location.href);
            this.historyDepth += 1;
        }
    }
    static async loadContent(src, type, options) {
        if (!this.currentModalUI)
            return;
        const modalUI = this.currentModalUI;
        const content = modalUI.getContent();
        const dialog = modalUI.getDialog();
        const container = modalUI.getContainer();
        let error = undefined;
        content.innerHTML = '';
        modalUI.setLoadingState('loading');
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
        }
        catch (e) {
            error = e;
            console.error('コンテンツの読み込みに失敗しました:', e);
            content.innerHTML = '<p>コンテンツの取得に失敗しました</p>';
        }
        modalUI.setLoadingState('complete');
        const { onLoad } = this.sessionOptions;
        if (onLoad && this.currentModalUI === modalUI && this.currentInfo) {
            onLoad(error === undefined ? { ...this.currentInfo } : { ...this.currentInfo, error });
        }
    }
    static updateContent(src, type, options, trigger) {
        if (!this.currentModalUI)
            return;
        this.cleanupImageDragListeners();
        resetImageContainer(this.currentModalUI.getContainer());
        this.currentModalUI.setType(type);
        this.currentInfo = { src, type, trigger };
        this.pushHistory(src, type, options);
        this.applyHash(options.hash, src);
        const { onChange } = this.sessionOptions;
        if (onChange) {
            onChange(this.currentInfo);
        }
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
SygModalDialog.bindOptions = null;
SygModalDialog.sessionOptions = {};
SygModalDialog.currentInfo = null;
SygModalDialog.hashActive = false;
SygModalDialog.historyDepth = 0;
SygModalDialog.isClosingByHistory = false;
//# sourceMappingURL=SygModalDialog.js.map