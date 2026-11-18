/**
 * <dialog>要素を使ったモーダルポップアップ
 *
 */

// import '../css/modal-dialog.scss';
import { SygModalUI } from './SygModalUI';
import type { TModalDialogType, TModalDialogOption, TModalDialogEventInfo, TModalHistoryState } from './types';
import {
  loadYoutube,
  loadImage,
  loadAjax,
  loadSelector,
  loadHtml,
  isYoutubeUrl,
  extractYoutubeId,
  resetImageContainer,
  type ImageDragListeners,
} from './loaders';

export type { TModalDialogOption, TModalDialogType, TModalDialogEventInfo };

/** 別のバンドルから開く・閉じるためのイベント名 */
const OPEN_EVENT = 'syg-modal:open';
const CLOSE_EVENT = 'syg-modal:close';

export class SygModalDialog {
  private static currentModalUI: SygModalUI | null = null;
  private static boundSelectors: Set<string> = new Set();
  private static delegateListener: ((e: MouseEvent) => void) | null = null;
  private static imageDragListeners: ImageDragListeners | null = null;
  private static popstateListener: ((e: PopStateEvent) => void) | null = null;
  private static useHistory: boolean = false;
  private static isRestoringFromHistory: boolean = false;
  private static currentOptions: TModalDialogOption = {};
  /** 最初に bind() したときのオプション（イベントで開くときに使う） */
  private static bindOptions: TModalDialogOption | null = null;
  /** 開いたときのオプション。入れ替えたときのコールバックはこれを使う */
  private static sessionOptions: TModalDialogOption = {};
  /** 表示している中身の情報（コールバックに渡す） */
  private static currentInfo: TModalDialogEventInfo | null = null;
  /** ハッシュを入れているか */
  private static hashActive: boolean = false;
  /** 開いてから積んだ履歴の数（useHistory）。閉じるときにこの数だけ戻る */
  private static historyDepth: number = 0;
  /** 閉じるために履歴を戻している最中か（そのときの popstate は無視する） */
  private static isClosingByHistory: boolean = false;

  /**
   * 要素をバインドしてクリックイベントを設定（イベント委譲方式）
   * 動的に追加された要素にも自動対応し、重複登録を防ぎます
   * 初めて呼んだときに、window の syg-modal:open / syg-modal:close イベントも受けるようになります
   */
  static bind(selector: string, options: TModalDialogOption = {}): void {
    // 既にバインド済みのセレクタは再登録しない
    if (this.boundSelectors.has(selector)) {
      return;
    }

    this.boundSelectors.add(selector);

    // 履歴機能の設定を保存
    if (options.useHistory !== undefined) {
      this.useHistory = options.useHistory;
      this.currentOptions = options;
    }

    // popstateリスナーの設定
    this.setupPopstateListener();

    // イベントで開く・閉じる（オプションは最初に bind() したもの）
    this.setupEventListeners(options);

    // 初回のみdocumentにイベントリスナーを設定
    if (!this.delegateListener) {
      this.delegateListener = (e: MouseEvent) => {
        // 修飾キー付き・左ボタン以外・処理済みのクリックはブラウザに任せる（新しいタブで開くなど）
        // capture で受けているので、ここで分かる「処理済み」は、先に登録された capture のリスナーが止めたものだけ
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
          return;
        }
        if (!(e.target instanceof Element)) return;
        const target = e.target;

        // バインド済みのセレクタのいずれかにマッチするか確認
        for (const sel of this.boundSelectors) {
          const matchedElement = target.closest(sel) as HTMLElement | null;
          if (!matchedElement) continue;

          // src の取得（data-syg-modal-src 優先、なければ href）
          let src = matchedElement.getAttribute('data-syg-modal-src');
          if (!src && matchedElement.tagName === 'A') {
            const anchor = matchedElement as HTMLAnchorElement;
            // hrefが#で始まる場合はhashを使用（完全なURLにならないように）
            src = anchor.getAttribute('href') || anchor.href;
          }
          src = (src || '').trim();

          if (!src) {
            console.error('data-syg-modal-src または href が指定されていません');
            return;
          }

          // type の取得。指定が無ければ src から判別する
          const typeAttr = matchedElement.getAttribute('data-syg-modal');
          const type = typeAttr && typeAttr !== '' ? (typeAttr as TModalDialogType) : this.detectType(src);

          // 判別できない・YouTube の動画IDが取れないときは、リンクのとおりにする
          if (!type) return;
          if (type === 'youtube' && !extractYoutubeId(src)) return;

          e.preventDefault();

          // ユーザーの能動的なアクションなので履歴モードを解除
          this.isRestoringFromHistory = false;

          this.open(
            {
              ...options,
              src,
              type,
              hash: matchedElement.hasAttribute('data-syg-modal-hash') || options.hash,
            },
            matchedElement
          );

          break;
        }
      };

      // capture で受ける。GTM のリンククリックのトリガー（タグの配信を待つ）などは document の bubble でクリックを受け、
      // その時点で preventDefault されていないと、タグを送ったあとに自分でリンク先へ移動させてしまうため、それより先に止める
      document.addEventListener('click', this.delegateListener, true);
    }
  }

  /**
   * window の syg-modal:open / syg-modal:close を受ける
   * バンドルを共有しない構成（webpack のエントリごとなど）で、別のバンドルから開けるようにする
   */
  private static setupEventListeners(options: TModalDialogOption): void {
    if (this.bindOptions) return;
    this.bindOptions = options;

    window.addEventListener(OPEN_EVENT, (e: Event) => {
      const detail = ((e as CustomEvent).detail || {}) as TModalDialogOption;
      this.isRestoringFromHistory = false;
      this.open({ ...this.bindOptions, ...detail }, null);
    });

    window.addEventListener(CLOSE_EVENT, () => {
      this.closeModal();
    });
  }

  /**
   * popstateリスナーをセットアップ
   */
  private static setupPopstateListener(): void {
    if (this.popstateListener) return;

    this.popstateListener = (e: PopStateEvent) => {
      // 閉じるために履歴を戻したときの popstate は無視する（前の中身を開き直さない）
      if (this.isClosingByHistory) {
        this.isClosingByHistory = false;
        return;
      }

      const state = e.state as TModalHistoryState | null;

      // 履歴から復元中フラグを立てる
      this.isRestoringFromHistory = true;

      // モーダル関連の履歴でない場合
      if (!state || !state.sygModal) {
        // モーダルが開いている場合は閉じる
        if (this.currentModalUI && this.currentModalUI.isOpen()) {
          this.closeModal();
        }
        return;
      }

      // 1 つ前の中身に戻ったので、積んだ履歴の数を減らす
      if (this.currentModalUI && this.currentModalUI.isOpen() && this.historyDepth > 0) {
        this.historyDepth -= 1;
      }

      // 履歴から復元
      this.showModal({
        src: state.src,
        type: state.type,
        ...state.options,
      });
    };

    window.addEventListener('popstate', this.popstateListener);
  }

  /**
   * モーダルを表示
   */
  static showModal(options: TModalDialogOption): void {
    this.open(options, null);
  }

  /**
   * モーダルを表示（クリックした要素つき）
   */
  private static open(options: TModalDialogOption, trigger: HTMLElement | null): void {
    const { type, html } = options;
    const src = (options.src || '').trim();

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

    const contentType = type || this.detectType(src);

    if (!contentType) {
      console.error('コンテンツタイプが判別できません:', src);
      return;
    }

    // すでにモーダルが開いている場合はコンテンツだけ入れ替え
    if (this.currentModalUI && this.currentModalUI.isOpen()) {
      this.updateContent(src, contentType, options, trigger);
      return;
    }

    // オプションを保存
    this.currentOptions = options;
    this.sessionOptions = options;
    this.historyDepth = 0;

    // SygModalUIを作成（コールバックは SygModalDialog が情報を付けて呼ぶので、UI には渡さない）
    const { onOpen, onClose, onChange, onLoad, ...uiOptions } = options;
    this.currentModalUI = new SygModalUI({
      ...uiOptions,
      onClose: () => {
        // ドラッグイベントリスナーをクリーンアップ
        this.cleanupImageDragListeners();

        // ハッシュを消す（history.back() の前に、今の履歴の URL から消す）
        this.clearHash();

        // 手動で閉じた場合は、開いてから積んだ履歴の数だけ戻す
        // （1 つだけ戻すと、中身を入れ替えていたときに前の中身が開き直してしまう）
        if (!this.isRestoringFromHistory && this.historyDepth > 0) {
          this.isClosingByHistory = true;
          window.history.go(-this.historyDepth);
        }
        this.historyDepth = 0;
        this.isRestoringFromHistory = false;

        // onCloseコールバック
        const info = this.currentInfo;
        this.currentInfo = null;
        if (onClose && info) {
          onClose(info);
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
    this.currentInfo = { src, type: contentType, trigger };

    // 履歴に追加してから、ハッシュを入れる（履歴を戻ったときに、開く前の URL にハッシュが残らないように）
    this.pushHistory(src, contentType, options);
    this.applyHash(options.hash, src);

    // onOpenコールバック
    if (onOpen) {
      onOpen(this.currentInfo);
    }

    // コンテンツを読み込み
    this.loadContent(src, contentType, options);
  }

  /**
   * コンテンツタイプを自動判別
   */
  private static detectType(src: string): TModalDialogType | null {
    if (isYoutubeUrl(src)) {
      return 'youtube';
    }
    // if (/^[.#]/.test(src)) {
    //   return 'selector';
    // }
    // クエリとハッシュを除いて拡張子を見る（photo.jpg?5 などのキャッシュ対策）
    if (/\.(jpe?g|png|gif|webp)$/i.test(src.replace(/[?#].*$/, ''))) {
      return 'image';
    }
    // if (/^https?:\/\//.test(src)) {
    //   return 'ajax';
    // }
    return null;
  }

  /**
   * ハッシュを入れる。指定が無ければ、入れているハッシュを消す
   * history.replaceState で書き換えるので、履歴は増えず hashchange も起きない
   */
  private static applyHash(enabled: boolean | undefined, src: string): void {
    if (enabled && src) {
      window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}#${src}`);
      this.hashActive = true;
    } else {
      this.clearHash();
    }
  }

  /**
   * 入れているハッシュを消す（# も残さない）
   */
  private static clearHash(): void {
    if (!this.hashActive) return;
    this.hashActive = false;
    window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}`);
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
   * 履歴に状態を追加
   */
  private static pushHistory(src: string, type: TModalDialogType, options: TModalDialogOption): void {
    if (!this.isRestoringFromHistory && (this.useHistory || options.useHistory) && type !== 'html' && src) {
      const historyState: TModalHistoryState = {
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

  /**
   * コンテンツを読み込み
   */
  private static async loadContent(src: string, type: TModalDialogType, options?: TModalDialogOption): Promise<void> {
    if (!this.currentModalUI) return;

    const modalUI = this.currentModalUI;
    const content = modalUI.getContent();
    const dialog = modalUI.getDialog();
    const container = modalUI.getContainer();
    let error: unknown = undefined;

    // 既存のコンテンツをクリア
    content.innerHTML = '';

    // ローディング開始
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
    } catch (e) {
      error = e;
      console.error('コンテンツの読み込みに失敗しました:', e);
      content.innerHTML = '<p>コンテンツの取得に失敗しました</p>';
    }

    // ローディング完了
    modalUI.setLoadingState('complete');

    // onLoadコールバック（読み込み中に閉じた・別のモーダルになったときは呼ばない）
    const { onLoad } = this.sessionOptions;
    if (onLoad && this.currentModalUI === modalUI && this.currentInfo) {
      onLoad(error === undefined ? { ...this.currentInfo } : { ...this.currentInfo, error });
    }
  }

  /**
   * コンテンツを更新（モーダルが開いている状態で別のコンテンツに切り替え）
   */
  private static updateContent(
    src: string,
    type: TModalDialogType,
    options: TModalDialogOption,
    trigger: HTMLElement | null
  ): void {
    if (!this.currentModalUI) return;

    // 画像の後片付け（ドラッグのリスナーと、container に付けた大きさ・位置）
    this.cleanupImageDragListeners();
    resetImageContainer(this.currentModalUI.getContainer());

    // タイプを更新
    this.currentModalUI.setType(type);
    this.currentInfo = { src, type, trigger };

    // 履歴に追加してから、ハッシュを入れ替える
    this.pushHistory(src, type, options);
    this.applyHash(options.hash, src);

    // onChangeコールバック（開いたときのオプションのものを使う）
    const { onChange } = this.sessionOptions;
    if (onChange) {
      onChange(this.currentInfo);
    }

    // コンテンツを読み込み
    this.loadContent(src, type, options);
  }

  /**
   * モーダルを閉じる
   */
  private static closeModal(): void {
    if (this.currentModalUI) {
      this.currentModalUI.close();
    }
  }
}
