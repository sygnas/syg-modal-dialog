/**
 * モーダルダイアログの型定義
 * SygModalDialog.ts および SygModalUI.ts で共有
 */

/**
 * モーダルダイアログのコンテンツタイプ
 * - youtube: YouTube動画の埋め込み
 * - image: 画像の表示（ズーム・ドラッグ機能付き）
 * - ajax: Ajaxで取得した外部コンテンツ
 * - selector: document.querySelector()で指定した要素内のHTML
 * - html: HTML文字列を直接表示
 */
export type TModalDialogType = 'youtube' | 'image' | 'ajax' | 'selector' | 'html';

/**
 * モーダルダイアログのオプション
 */
export type TModalDialogOption = {
  /** コンテンツのURL/セレクタ */
  src?: string;
  /** コンテンツタイプ */
  type?: TModalDialogType;
  /** HTML文字列（type="html"の場合に使用） */
  html?: string;
  /** 閉じるボタンのテキスト/HTML（デフォルト: '×'） */
  closeButtonContent?: string;
  /** 閉じるボタンのテキスト/HTML（デフォルト: ''） */
  loadingContent?: string;
  /** モーダルのクラス（デフォルト: 'c-modal'） */
  modalClass?: string;
  /** コンテナのクラス（デフォルト: 'c-modal__container'） */
  containerClass?: string;
  /** コンテンツのクラス（デフォルト: 'c-modal__content'） */
  contentClass?: string;
  /** 閉じるボタンのクラス（デフォルト: 'c-modal__close-btn'） */
  closeBtnClass?: string;
  /** ローディングのクラス（デフォルト: 'c-modal__loading'） */
  loadingClass?: string;
  /** 開いた時のコールバック */
  onOpen?: () => void;
  /** 閉じた時のコールバック */
  onClose?: () => void;
};

/**
 * モーダルUIのオプション
 * SygModalUI.ts で使用
 */
export type TModalUIOption = {
  /** モーダルのクラス（デフォルト: 'c-modal'） */
  modalClass?: string;
  /** コンテナのクラス（デフォルト: 'c-modal__container'） */
  containerClass?: string;
  /** コンテンツのクラス（デフォルト: 'c-modal__content'） */
  contentClass?: string;
  /** 閉じるボタンのクラス（デフォルト: 'c-modal__close-btn'） */
  closeBtnClass?: string;
  /** 閉じるボタンのテキスト/HTML（デフォルト: '×'） */
  closeButtonContent?: string;
  /** ローディングのクラス（デフォルト: 'c-modal__loading'） */
  loadingClass?: string;
  /** ローディングのテキスト/HTML（デフォルト: ''） */
  loadingContent?: string;
  /** 開いた時のコールバック */
  onOpen?: () => void;
  /** 閉じた時のコールバック */
  onClose?: () => void;
};

/**
 * ローディング状態
 */
export type TModalLoadingState = 'init' | 'loading' | 'complete';
