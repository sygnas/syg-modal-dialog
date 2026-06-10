export class SygModalUI {
    constructor(options = {}) {
        this.options = {
            ...SygModalUI.defaultOptions,
            ...options,
        };
        this.dialog = this.createDialog();
        this.container = this.dialog.querySelector(`#syg-modal-container`);
        this.content = this.dialog.querySelector(`#syg-modal-content`);
        this.loading = this.dialog.querySelector(`#syg-modal-loading`);
        this.setupEventListeners();
    }
    createDialog() {
        const dialog = document.createElement('dialog');
        dialog.id = 'syg-modal-dialog';
        dialog.className = this.options.modalClass;
        const container = document.createElement('div');
        container.id = 'syg-modal-container';
        container.className = this.options.containerClass;
        const content = document.createElement('div');
        content.id = 'syg-modal-content';
        content.className = this.options.contentClass;
        const form = document.createElement('form');
        form.method = 'dialog';
        const closeBtn = document.createElement('button');
        closeBtn.type = 'submit';
        closeBtn.className = this.options.closeBtnClass;
        closeBtn.innerHTML = this.options.closeButtonContent;
        form.appendChild(closeBtn);
        const loading = document.createElement('div');
        loading.id = 'syg-modal-loading';
        loading.className = this.options.loadingClass;
        loading.setAttribute('data-state', 'init');
        loading.innerHTML = this.options.loadingContent;
        container.appendChild(content);
        dialog.appendChild(container);
        dialog.appendChild(form);
        dialog.appendChild(loading);
        return dialog;
    }
    setupEventListeners() {
        this.dialog.addEventListener('click', (ev) => {
            if (ev.target === this.dialog) {
                this.close();
            }
        });
        this.dialog.addEventListener('close', () => {
            document.documentElement.style.overflow = '';
            document.documentElement.style.height = '';
            if (this.options.onClose) {
                this.options.onClose();
            }
        });
    }
    open() {
        if (!this.dialog.parentElement) {
            document.body.appendChild(this.dialog);
        }
        this.dialog.showModal();
        document.documentElement.style.overflow = 'hidden';
        document.documentElement.style.height = '100vh';
        if (this.options.onOpen) {
            this.options.onOpen();
        }
    }
    close() {
        this.dialog.close();
    }
    setContent(html) {
        this.content.innerHTML = html;
    }
    setLoadingState(state) {
        this.loading.setAttribute('data-state', state);
    }
    setType(type) {
        this.dialog.setAttribute('data-syg-modal-type', type);
        if (type === 'ajax' || type === 'selector') {
            this.content.className = this.options.contentClass;
        }
        else {
            this.content.className = '';
        }
    }
    getDialog() {
        return this.dialog;
    }
    getContainer() {
        return this.container;
    }
    getContent() {
        return this.content;
    }
    getLoading() {
        return this.loading;
    }
    isOpen() {
        return this.dialog.open;
    }
    destroy() {
        if (this.dialog.parentElement) {
            this.dialog.remove();
        }
    }
}
SygModalUI.defaultOptions = {
    closeButtonContent: '×',
    loadingContent: '',
    modalClass: 'c-modal',
    containerClass: 'c-modal__container',
    contentClass: 'c-modal__content',
    closeBtnClass: 'c-modal__close-btn',
    loadingClass: 'c-modal__loading',
};
//# sourceMappingURL=SygModalUI.js.map