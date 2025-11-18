/**
 * <dialog>要素を使ったモーダルポップアップ
 *
 */

// import '../css/modal-dialog.scss';
import { SygModalUI } from './SygModalUI';
import type { TModalDialogType, TModalDialogOption } from './types';
import { loadYoutube, loadImage, loadAjax, loadSelector, loadHtml, type ImageDragListeners } from './loaders';

export type { TModalDialogOption, TModalDialogType };

export class SygModalDialog {
  private static currentModalUI: SygModalUI | null = null;
  private static boundSelectors: Set<string> = new Set();
  private static delegateListener: ((e: Event) => void) | null = null;
  private static imageDragListeners: ImageDragListeners | null = null;

  /**
   * 要素をバインドしてクリックイベントを設定（イベント委譲方式）
   * 動的に追加された要素にも自動対応し、重複登録を防ぎます
   */
  static bind(selector: string, options: TModalDialogOption = {}): void {
    // 既にバインド済みのセレクタは再登録しない
    if (this.boundSelectors.has(selector)) {
      return;
    }

    this.boundSelectors.add(selector);

    // 初回のみdocumentにイベントリスナーを設定
    if (!this.delegateListener) {
      this.delegateListener = (e: Event) => {
        const target = e.target as HTMLElement;
        
        // バインド済みのセレクタのいずれかにマッチするか確認
        for (const sel of this.boundSelectors) {
          const matchedElement = target.closest(sel) as HTMLElement;
          
          if (matchedElement) {
            e.preventDefault();

            // src の取得（data-syg-modal-src 優先、なければ href）
            let src = matchedElement.getAttribute('data-syg-modal-src');
            if (!src && matchedElement.tagName === 'A') {
              const anchor = matchedElement as HTMLAnchorElement;
              // hrefが#で始まる場合はhashを使用（完全なURLにならないように）
              src = anchor.getAttribute('href') || anchor.href;
            }

            // type の取得
            const typeAttr = matchedElement.getAttribute('data-syg-modal');
            const type = typeAttr && typeAttr !== '' ? (typeAttr as TModalDialogType) : undefined;

            if (!src) {
              console.error('data-syg-modal-src または href が指定されていません');
              return;
            }

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

  /**
   * モーダルを表示
   */
  static showModal(options: TModalDialogOption): void {
    const { src, type, html } = options;

    // type="html"の場合はhtmlが必須、それ以外はsrcが必須
    if (type === 'html') {
      if (!html) {
        console.error('type="html"の場合、htmlプロパティが必要です');
        return;
      }
    } else if (!src) {
      console.error('srcが指定されていません');
      return;
    }

    const contentType = type || (src ? this.detectType(src) : null);

    if (!contentType) {
      console.error('コンテンツタイプが判別できません');
      return;
    }

    // すでにモーダルが開いている場合はコンテンツだけ入れ替え
    if (this.currentModalUI && this.currentModalUI.isOpen()) {
      this.updateContent(src || '', options);
      return;
    }

    // SygModalUIを作成
    this.currentModalUI = new SygModalUI({
      ...options,
      onClose: () => {
        // ドラッグイベントリスナーをクリーンアップ
        this.cleanupImageDragListeners();
        
        // onCloseコールバック
        if (options.onClose) {
          options.onClose();
        }

        // SygModalUIを破棄
        if (this.currentModalUI) {
          this.currentModalUI.destroy();
          this.currentModalUI = null;
        }
      },
    });

    // タイプを設定
    this.currentModalUI.setType(contentType);

    // モーダルを開く
    this.currentModalUI.open();

    // コンテンツを読み込み
    this.loadContent(src || '', contentType, options);
  }

  /**
   * コンテンツタイプを自動判別
   */
  private static detectType(src: string): TModalDialogType | null {
    if (/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(src)) {
      return 'youtube';
    }
    if (/^[.#]/.test(src)) {
      return 'selector';
    }
    if (/\.(jpe?g|png|gif|webp)$/i.test(src)) {
      return 'image';
    }
    if (/^https?:\/\//.test(src)) {
      return 'ajax';
    }
    return null;
  }

  /**
   * 画像のドラッグイベントリスナーをクリーンアップ
   */
  private static cleanupImageDragListeners(): void {
    if (!this.imageDragListeners) return;

    const { doDrag, endDrag, startDrag, touchStart, touchMove, touchEnd, onResizeHandler, rafId } = this.imageDragListeners;

    // アニメーションフレームをキャンセル
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

  /**
   * コンテンツを読み込み
   */
  private static async loadContent(src: string, type: TModalDialogType, options?: TModalDialogOption): Promise<void> {
    if (!this.currentModalUI) return;

    const content = this.currentModalUI.getContent();
    const dialog = this.currentModalUI.getDialog();
    const container = this.currentModalUI.getContainer();

    // 既存のコンテンツをクリア
    content.innerHTML = '';

    // ローディング開始
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

      // ローディング完了
      this.currentModalUI.setLoadingState('complete');
    } catch (error) {
      console.error('コンテンツの読み込みに失敗しました:', error);
      content.innerHTML = '<p>コンテンツの取得に失敗しました</p>';
      this.currentModalUI.setLoadingState('complete');
    }
  }

  /**
   * コンテンツを更新（モーダルが開いている状態で別のコンテンツに切り替え）
   */
  private static updateContent(src: string, options: TModalDialogOption): void {
    if (!this.currentModalUI) return;

    const type = options.type || this.detectType(src);

    if (!type) {
      console.error('コンテンツタイプが判別できません:', src);
      return;
    }

    // タイプを更新
    this.currentModalUI.setType(type);

    // コンテンツを読み込み
    this.loadContent(src, type, options);
  }
}
