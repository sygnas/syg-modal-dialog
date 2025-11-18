# SygModalDialog

`<dialog>`要素を使ったLightbox風モーダルダイアログライブラリ。

YouTube動画、画像、Ajax取得コンテンツ、ページ内要素、HTML文字列の表示に対応。

## 特徴

- 📦 **軽量**: 依存ライブラリなし、純粋なTypeScript実装
- 🎨 **柔軟なUI**: UI層とロジック層を分離した設計
- 🖼️ **画像最適化**: ズーム・ドラッグ機能付き画像表示
- 🎬 **YouTube対応**: 自動再生での動画埋め込み
- 🔄 **動的対応**: イベント委譲で動的要素にも自動対応
- ⚡ **高速**: ローディング状態管理とパフォーマンス最適化
- 📱 **タッチ対応**: マウス・タッチイベント両対応

## インストール

```bash
npm install @sygnas/modal-dialog
```

## 基本的な使い方

### HTML

```html
<!-- 画像を表示 -->
<a href="/images/photo.jpg" data-syg-modal>画像を開く</a>

<!-- YouTube動画を表示 -->
<a href="https://www.youtube.com/watch?v=VIDEO_ID" data-syg-modal>動画を見る</a>

<!-- セレクタで指定した要素のコンテンツを表示 -->
<button data-syg-modal data-syg-modal-src="#content">コンテンツを開く</button>

<!-- タイプを明示的に指定 -->
<a href="/content.html" data-syg-modal="ajax">外部HTMLを開く</a>
```

### JavaScript

```typescript
import { SygModalDialog } from 'syg-modal-dialog';
import '@sygnas/modal-dialog/style.css';

// 要素をバインド
SygModalDialog.bind('[data-syg-modal]');

// オプション付きでバインド
SygModalDialog.bind('[data-syg-modal]', {
  closeButton: '閉じる',
  onOpen: () => console.log('opened'),
  onClose: () => console.log('closed'),
});
```

### プログラムから起動

```typescript
// 画像を表示
SygModalDialog.showModal({
  src: '/images/photo.jpg',
  type: 'image',
});

// HTML文字列を表示
SygModalDialog.showModal({
  type: 'html',
  html: '<h3>タイトル</h3><p>コンテンツ</p>',
});

// セレクタで要素を表示
SygModalDialog.showModal({
  src: '#content',
  type: 'selector',
});
```

## コンテンツタイプ

### `youtube` - YouTube動画

YouTube動画を埋め込んで表示します（自動再生）。

```html
<a href="https://www.youtube.com/watch?v=VIDEO_ID" data-syg-modal>動画を見る</a>
```

```typescript
SygModalDialog.showModal({
  src: 'https://www.youtube.com/watch?v=VIDEO_ID',
  type: 'youtube',
});
```

対応URL形式:
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`

### `image` - 画像表示

画像を表示します。クリックでズーム、ドラッグで移動が可能です。

```html
<a href="/images/photo.jpg" data-syg-modal>画像を開く</a>
```

```typescript
SygModalDialog.showModal({
  src: '/images/photo.jpg',
  type: 'image',
});
```

**機能:**
- クリック/タップでズーム
- ズーム時はドラッグで移動
- レスポンシブ対応（ウィンドウリサイズに自動追従）
- タッチデバイス対応

対応形式: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`

### `ajax` - 外部HTML取得

Ajaxで外部HTMLファイルを取得して表示します。

```html
<a href="/content.html" data-syg-modal="ajax">外部HTMLを開く</a>
```

```typescript
SygModalDialog.showModal({
  src: '/content.html',
  type: 'ajax',
});
```

### `selector` - ページ内要素

ページ内の要素をセレクタで指定して、そのHTMLをコピー表示します。

```html
<div id="hidden-content" style="display: none;">
  <h3>タイトル</h3>
  <p>本文</p>
</div>

<button data-syg-modal="selector" data-syg-modal-src="#hidden-content">
  コンテンツを開く
</button>
```

```typescript
SygModalDialog.showModal({
  src: '#hidden-content',
  type: 'selector',
});
```

### `html` - HTML文字列

HTML文字列を直接表示します。

**注意:** `html`タイプは**プログラムからの起動専用**です。data属性では使用できません。

```typescript
// シンプルなHTML
SygModalDialog.showModal({
  type: 'html',
  html: '<h3>タイトル</h3><p>本文</p>',
});

// 複雑なHTML
SygModalDialog.showModal({
  type: 'html',
  html: `
    <div>
      <h3>見出し</h3>
      <ul>
        <li>項目1</li>
        <li>項目2</li>
      </ul>
      <img src="/images/photo.jpg" alt="写真">
    </div>
  `,
});
```

**セキュリティ上の注意:**
- `innerHTML`を使用するため、XSSリスクがあります
- ユーザー入力を直接表示しないでください
- 信頼できる内部データのみを使用してください

## タイプの自動判別

`data-syg-modal`属性でタイプを指定しない場合、`src`から自動判別されます:

| パターン | 判別結果 |
|---------|---------|
| `https://youtube.com/...` または `https://youtu.be/...` | `youtube` |
| `#...` または `.` で始まる | `selector` |
| `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp` で終わる | `image` |
| `http://...` または `https://...` | `ajax` |

**注意:** `html`タイプは自動判別されません。明示的に指定してください。

## オプション

### TModalDialogOption

```typescript
type TModalDialogOption = {
  // コンテンツのURL/セレクタ
  src?: string;
  
  // コンテンツタイプ
  type?: 'youtube' | 'image' | 'ajax' | 'selector' | 'html';
  
  // HTML文字列（type="html"の場合に使用）
  html?: string;
  
  // 閉じるボタンのテキスト/HTML（デフォルト: '×'）
  closeButtonContent?: string;
  
  // ローディングのテキスト/HTML（デフォルト: ''）
  loadingContent?: string;
  
  // CSSクラス名のカスタマイズ
  modalClass?: string;        // デフォルト: 'c-modal'
  containerClass?: string;    // デフォルト: 'c-modal__container'
  contentClass?: string;      // デフォルト: 'c-modal__content'
  closeBtnClass?: string;     // デフォルト: 'c-modal__close-btn'
  loadingClass?: string;      // デフォルト: 'c-modal__loading'
  
  // コールバック
  onOpen?: () => void;        // 開いた時
  onClose?: () => void;       // 閉じた時
}
```

### 使用例

```typescript
SygModalDialog.bind('[data-syg-modal]', {
  closeButtonContent: '✕ 閉じる',
  loadingContent: '<div class="spinner">読み込み中...</div>',
  modalClass: 'my-modal',
  onOpen: () => {
    console.log('モーダルが開きました');
    document.body.style.overflow = 'hidden';
  },
  onClose: () => {
    console.log('モーダルが閉じました');
    document.body.style.overflow = '';
  },
});
```

## 機能詳細

### イベント委譲

`bind()`メソッドはイベント委譲を使用しているため、後から動的に追加された要素にも自動的に対応します。

```typescript
// 初回バインド
SygModalDialog.bind('[data-syg-modal]');

// 後から要素を追加してもOK
const newButton = document.createElement('button');
newButton.setAttribute('data-syg-modal', 'image');
newButton.setAttribute('data-syg-modal-src', '/images/new.jpg');
newButton.textContent = '新しい画像';
document.body.appendChild(newButton);
// クリックすると自動的にモーダルが開きます
```

### モーダル内でのコンテンツ切り替え

モーダル内の`data-syg-modal`付き要素をクリックすると、モーダルを閉じずにコンテンツを切り替えられます。

```html
<div id="gallery" style="display: none;">
  <h3>ギャラリー</h3>
  <a href="/images/photo1.jpg" data-syg-modal>写真1</a>
  <a href="/images/photo2.jpg" data-syg-modal>写真2</a>
  <a href="/images/photo3.jpg" data-syg-modal>写真3</a>
</div>

<button data-syg-modal="selector" data-syg-modal-src="#gallery">
  ギャラリーを開く
</button>
```

### ローディング状態

モーダルは自動的にローディング状態を管理します。`data-state`属性で状態を確認できます:

- `data-state="init"` - 初期状態
- `data-state="loading"` - コンテンツ読み込み中
- `data-state="complete"` - 読み込み完了

```css
/* ローディング中のスタイル */
.c-modal[data-state="loading"] .c-modal__loading {
  display: block;
}

.c-modal[data-state="complete"] .c-modal__loading {
  display: none;
}
```

**カスタムローディング表示:**

`loadingContent`オプションでローディング表示をカスタマイズできます:

```typescript
SygModalDialog.bind('[data-syg-modal]', {
  loadingContent: `
    <div class="spinner">
      <div class="spinner-icon"></div>
      <p>読み込み中...</p>
    </div>
  `,
});
```

### 背景スクロール防止

モーダル表示中は背景のスクロールが自動的に防止されます。

### 閉じる方法

モーダルは以下の方法で閉じることができます:

1. 閉じるボタンをクリック
2. 背景（オーバーレイ）をクリック
3. ESCキー（ブラウザのデフォルト動作）

## CSS

基本的なスタイルの例:

```css
/* モーダル背景 */
.c-modal {
  border: none;
  padding: 0;
  max-width: 90vw;
  max-height: 90vh;
  background: transparent;
}

.c-modal::backdrop {
  background: rgba(0, 0, 0, 0.8);
}

/* コンテナ */
.c-modal__container {
  position: relative;
  width: 100%;
  height: 100%;
}

/* コンテンツ */
.c-modal__content {
  width: 100%;
  height: 100%;
  overflow: auto;
}

/* 閉じるボタン */
.c-modal__close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  padding: 10px 15px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  cursor: pointer;
}

/* ローディング */
.c-modal__loading {
  display: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.c-modal[data-state="loading"] .c-modal__loading {
  display: block;
}

/* タイプ別スタイル */
.c-modal[data-type="image"] .c-modal__content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.c-modal[data-type="youtube"] .c-modal__content iframe {
  width: 100%;
  height: 100%;
}
```

## アーキテクチャ

SygModalDialogは以下の3層構造で設計されています:

```
SygModalDialog (ロジック層)
  ├── SygModalUI (UI層)
  └── loaders/
      ├── youtubeLoader
      ├── imageLoader
      ├── ajaxLoader
      ├── selectorLoader
      └── htmlLoader
```

### UI層 (`SygModalUI.ts`)

`<dialog>`要素のDOM生成と管理を担当します。

```typescript
const modalUI = new SygModalUI({
  closeButton: '閉じる',
  onClose: () => console.log('closed'),
});

modalUI.open();
modalUI.setContent('<p>コンテンツ</p>');
modalUI.setLoadingState('loading');
modalUI.setType('image');
modalUI.close();
```

### ロジック層 (`SygModalDialog.ts`)

コンテンツタイプの判別、読み込み、イベント管理を担当します。

### ローダー (`loaders/`)

各コンテンツタイプ専用の読み込みロジックを提供します。

- `youtubeLoader.ts` - YouTube動画の埋め込み
- `imageLoader.ts` - 画像表示とズーム/ドラッグ機能
- `ajaxLoader.ts` - 外部HTML取得
- `selectorLoader.ts` - ページ内要素のコピー
- `htmlLoader.ts` - HTML文字列の設定

## ブラウザ対応

- Chrome/Edge (最新版)
- Firefox (最新版)
- Safari (最新版)

`<dialog>`要素をサポートするモダンブラウザが必要です。

## TypeScript

完全なTypeScript対応。型定義が含まれています。

```typescript
import { SygModalDialog, TModalDialogOption, TModalDialogType } from 'syg-modal-dialog';

const options: TModalDialogOption = {
  src: '/images/photo.jpg',
  type: 'image',
  onOpen: () => console.log('opened'),
};

SygModalDialog.showModal(options);
```

## ライセンス

MIT

## 変更履歴

### v2.0.0 (Phase 1)
- `type="html"`を追加
- UI層とロジック層を分離
- ローダーを個別ファイルに分離
- TypeScript型定義を改善

### v1.0.0
- 初回リリース
- YouTube、画像、Ajax、セレクタ対応
- イベント委譲実装
- 画像ズーム/ドラッグ機能
