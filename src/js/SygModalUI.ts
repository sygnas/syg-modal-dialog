/**
 * SygModalUI
 * モーダルダイアログのUI層
 * <dialog>要素のDOM生成・管理を担当
 */

import type { TModalUIOption, TModalDialogType, TModalLoadingState } from './types';

export class SygModalUI {
  private dialog: HTMLDialogElement;
  private container: HTMLElement;
  private content: HTMLElement;
  private loading: HTMLElement;
  private options: {
    closeButtonContent: string;
    loadingContent: string;
    modalClass: string;
    containerClass: string;
    contentClass: string;
    closeBtnClass: string;
    loadingClass: string;
    onOpen?: () => void;
    onClose?: () => void;
  };
  
  public static defaultOptions = {
    closeButtonContent: '×',
    loadingContent: '',
    modalClass: 'c-modal',
    containerClass: 'c-modal__container',
    contentClass: 'c-modal__content',
    closeBtnClass: 'c-modal__close-btn',
    loadingClass: 'c-modal__loading',
  };

  constructor(options: TModalUIOption = {}) {
    this.options = {
      ...SygModalUI.defaultOptions,
      ...options,
    };

    // dialog要素を作成
    this.dialog = this.createDialog();
    this.container = this.dialog.querySelector(`#syg-modal-container`) as HTMLElement;
    this.content = this.dialog.querySelector(`#syg-modal-content`) as HTMLElement;
    this.loading = this.dialog.querySelector(`#syg-modal-loading`) as HTMLElement;

    // イベントリスナーを設定
    this.setupEventListeners();
  }

  /**
   * dialog要素を作成
   */
  private createDialog(): HTMLDialogElement {
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

  /**
   * イベントリスナーを設定
   */
  private setupEventListeners(): void {
    // 背景クリックで閉じる
    this.dialog.addEventListener('click', (ev) => {
      if (ev.target === this.dialog) {
        this.close();
      }
    });

    // closeイベント
    this.dialog.addEventListener('close', () => {
      // スクロールを戻す
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';

      // onCloseコールバック
      if (this.options.onClose) {
        this.options.onClose();
      }
    });
  }

  /**
   * モーダルを開く
   */
  open(): void {
    // bodyに追加（まだ追加されていない場合）
    if (!this.dialog.parentElement) {
      document.body.appendChild(this.dialog);
    }

    // モーダルを表示
    this.dialog.showModal();

    // 背景スクロールを止める
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.height = '100vh';

    // onOpenコールバック
    if (this.options.onOpen) {
      this.options.onOpen();
    }
  }

  /**
   * モーダルを閉じる
   */
  close(): void {
    this.dialog.close();
  }

  /**
   * コンテンツを設定
   */
  setContent(html: string): void {
    this.content.innerHTML = html;
  }

  /**
   * ローディング状態を設定
   */
  setLoadingState(state: TModalLoadingState): void {
    this.loading.setAttribute('data-state', state);
  }

  /**
   * タイプを設定（data属性とクラス名を更新）
   */
  setType(type: TModalDialogType): void {
    this.dialog.setAttribute('data-syg-modal-type', type);
    
    // ajax/selectorの場合はcontentClassを適用、それ以外は削除
    if (type === 'ajax' || type === 'selector') {
      this.content.className = this.options.contentClass;
    } else {
      this.content.className = '';
    }
  }

  /**
   * dialog要素を取得
   */
  getDialog(): HTMLDialogElement {
    return this.dialog;
  }

  /**
   * container要素を取得
   */
  getContainer(): HTMLElement {
    return this.container;
  }

  /**
   * content要素を取得
   */
  getContent(): HTMLElement {
    return this.content;
  }

  /**
   * loading要素を取得
   */
  getLoading(): HTMLElement {
    return this.loading;
  }

  /**
   * モーダルが開いているかどうか
   */
  isOpen(): boolean {
    return this.dialog.open;
  }

  /**
   * リソースを破棄
   */
  destroy(): void {
    if (this.dialog.parentElement) {
      this.dialog.remove();
    }
  }
}
