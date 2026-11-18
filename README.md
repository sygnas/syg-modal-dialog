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

## デモについて

`npm run dev` でViteのサーバーを起動してください。


## Vueコンポーネント版について

<a href="./README_vue.md">README_vue.md</a> をご覧下さい。

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

// 要素をバインド
SygModalDialog.bind('[data-syg-modal]');

// オプション付きでバインド
SygModalDialog.bind('[data-syg-modal]', {
  closeButtonContent: '閉じる',
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

## CSSの読み込み

スタイルを変更するならCDN読み込みする方法が詳細度が低く一番ラクです。

### CDNから
```html
<link rel="stylesheet" href="https://unpkg.com/@sygnas/modal-dialog@3.2.0/dist/style.css">
```

### JavaScriptから
```js
import { SygModalDialog } from 'syg-modal-dialog';
import '@sygnas/modal-dialog/style.css';
```

## スクロールバーによる背景ズレの対策

モーダルを開いている間は背景のスクロールを止めるため、`html` に `overflow: hidden` を適用しています。
このとき縦スクロールバーが消え、その幅（約 15px）だけ表示領域が広がるので、そのままでは背景が右にずれます。

v3.2.0 から、ライブラリが自動で補正します。

- 開くときに消えるスクロールバーの幅を測り、`html` の `padding-right` に足します（閉じると元に戻します）
- 表示領域はスクロールバーの分まで広がるので、背景（`::backdrop`）は画面の幅いっぱいに出ます
- スクロールバーが重ねて表示される環境（macOS の標準設定・スマートフォン）では、幅が 0 なので何もしません
- 画面の右端に `position: fixed` で置いた要素は、スクロールバーの幅だけ右に動きます。気になる場合はサイト側で調整してください

`html` に `scrollbar-gutter: stable` を指定する対策は、おすすめしません（v3.1.0 までの README で紹介していました）。
開いている間もスクロールバーの溝が残り、その部分が背景（`::backdrop`）で覆われず、帯のように見えます。
指定されている場合は、溝で幅が変わらないので、ライブラリは補正しません。

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

対応URL形式（`www.`・`m.` なし / ありのどちらも。`?si=` や `&t=` 付きも可）:
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- `https://www.youtube.com/shorts/VIDEO_ID`
- `https://www.youtube.com/live/VIDEO_ID`
- `https://www.youtube-nocookie.com/embed/VIDEO_ID`

動画IDは、取り出した値の先頭 11 文字（英数字・`-`・`_`）を使います。`embed/VIDEO_ID%22` のように後ろに余計な文字が付いていても再生できます。

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

<a data-syg-modal="selector" href="#hidden-content">
  コンテンツを開く
</a>
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
| `youtube.com` / `youtu.be` / `youtube-nocookie.com` の URL | `youtube` |
| クエリ（`?`）とハッシュ（`#`）を除いて `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp` で終わる（大文字・小文字を区別しない） | `image` |

- `src` の前後の空白（全角スペースも）は取り除きます
- `selector` と `ajax` は自動判別されません。`data-syg-modal="selector"` / `data-syg-modal="ajax"` のように指定してください
- `html`タイプは自動判別されません。明示的に指定してください

**判別できないリンク:** クリックしても種類が判別できない（例: `.mp4` のリンク）、または YouTube の動画IDが取れないときは、モーダルを開かず、リンクのとおりにページを移動します。

**修飾キー付きのクリック:** Ctrl / Cmd / Shift / Alt + クリックと、左ボタン以外のクリックは、モーダルを開かずブラウザに任せます（新しいタブで開くなど）。

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
  
  // ブラウザバック対応を有効にする（デフォルト: false）
  useHistory?: boolean;

  // 表示中の src を URL のハッシュに入れる（デフォルト: false。data-syg-modal-hash 属性と同じ）
  hash?: boolean;
  
  // コールバック（引数を受け取らない書き方もそのまま使えます）
  onOpen?: (info: TModalDialogEventInfo) => void;    // 開いた時
  onClose?: (info: TModalDialogEventInfo) => void;   // 閉じた時（閉じる直前の中身）
  onChange?: (info: TModalDialogEventInfo) => void;  // 開いたまま中身を入れ替えた時
  onLoad?: (info: TModalDialogEventInfo) => void;    // 中身の読み込みが終わった時
}

type TModalDialogEventInfo = {
  src: string;                  // 表示している URL / セレクタ（html タイプは ''）
  type: TModalDialogType;
  trigger: HTMLElement | null;  // クリックした要素。showModal() やイベントで開いた時は null
  error?: unknown;              // 読み込みに失敗した時のエラー（onLoad だけ）
}
```

- 中身を入れ替えた時のコールバック（`onChange` / `onLoad` / `onClose`）は、最初に開いた時のオプションのものが使われます
- `onLoad` は読み込みに失敗した時も呼ばれ、`info.error` にエラーが入ります。Ajax で読み込んだ中身の画像の遅延読み込みを始める時などに使えます

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

### 動的に追加された要素にも対応

`bind()`メソッドはイベント委譲を使用しているため、後から動的に追加された要素にも自動的に対応します。

クリックは `document` の capture フェーズで受けます。Google タグマネージャーのリンククリックのトリガー（「タグの配信を待つ」が有効で「妥当性をチェック」が無効）は、`document` の bubble でクリックを受け、その時点で `preventDefault()` されていないと、タグを送ったあとにリンク先へ移動させてしまうためです。そのため、リンクの内側の要素で `preventDefault()` しても、モーダルは開きます。開かせたくない要素には `data-syg-modal` を付けないでください。

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

### ブラウザバック対応

`useHistory: true`を設定すると、ブラウザの戻るボタンでモーダルの履歴を遡れるようになります。

```typescript
SygModalDialog.bind('[data-syg-modal]', {
  useHistory: true,
});
```

**動作:**
- モーダルを開くと履歴に追加されます
- モーダル内でコンテンツを切り替えても履歴に追加されます
- ブラウザバックで前のコンテンツに戻れます
- さらにブラウザバックでモーダルが閉じます

**制限事項:**
- `type="html"`は履歴に保存されません（保存内容が複雑なため）
- URLは変更されません（VueRouterなどとの競合を避けるため）

閉じるボタン・ESC・背景のクリックで閉じたときは、開いてから積んだ履歴の数だけ戻ります（中身を入れ替えていても、前の中身が開き直しません）。

### ハッシュ（共有できる URL）

`data-syg-modal-hash` 属性（または `hash: true`）を付けると、開いている間、URL のハッシュに `src` が入ります。SNS などで共有された URL からモーダルを開けるようにするためのものです。

```html
<a href="#detail.php?id=1" data-syg-modal="ajax" data-syg-modal-src="detail.php?id=1" data-syg-modal-hash>詳細</a>
```

- 開くと `#detail.php?id=1` になり、閉じると消えます（`#` も残りません）
- ハッシュの指定がある中身に入れ替えるとハッシュを更新し、指定が無い中身に入れ替えるとハッシュを消します
- `history.replaceState()` で書き換えるので、履歴は増えず、`hashchange` も起きません（Vue Router などのハッシュのルーターを動かしません）

**ページを開いた時にハッシュから開く処理は入っていません。** ハッシュをそのまま `showModal()` に渡すと、`#https://外部/x.html` のような URL で外部の HTML をサイトの中に読み込めてしまいます。開いてよい形かをサイト側でチェックしてから開いてください。

```typescript
// 例：detail.php?id={数字} の形のときだけ開く
const hash = window.location.hash.slice(1);
if (/^detail\.php\?id=\d+$/.test(hash)) {
  SygModalDialog.showModal({ src: hash, type: 'ajax', hash: true });
}
```

### イベントで開く・閉じる

`bind()` を呼ぶと、`window` の `syg-modal:open` / `syg-modal:close` イベントを受けるようになります。

webpack のエントリごとにバンドルしているなど、ページの中でライブラリが別々に読み込まれる構成では、別のバンドルから `showModal()` を呼ぶと、開いているモーダルを入れ替えられず 2 枚目が重なります。別のバンドルからはライブラリを import せず、イベントで開いてください。

```javascript
// bind() したバンドルとは別のスクリプトから
window.dispatchEvent(new CustomEvent('syg-modal:open', {
  detail: { src: 'detail.php?id=1', type: 'ajax', hash: true },
}));

window.dispatchEvent(new CustomEvent('syg-modal:close'));
```

- `detail` は `showModal()` のオプションと同じです（`src` / `type` / `html` / `hash`）。最初に `bind()` した時のオプション（閉じるボタン・コールバックなど）と合わせて開きます
- 開いている間に `syg-modal:open` すると、中身が入れ替わります

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


## アーキテクチャ

SygModalDialogは以下の3層構造で設計されています:

```
SygModalDialog (ロジック層)
  ├── SygModalUI (UI層)
  │     └── scrollLock（背景のスクロールを止める。Vue版と共有）
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
import { SygModalDialog, TModalDialogOption, TModalDialogType, TModalDialogEventInfo } from 'syg-modal-dialog';

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

### v3.2.0
- 追加
  - 開いている間、消えたスクロールバーの幅を `html` の `padding-right` で補正するようにした（背景のずれと、`scrollbar-gutter: stable` を使ったときに右端が背景で覆われない問題への対策）
- 修正
  - YouTube の iframe の下に、文字のベースラインの分の隙間（約 7px）ができ、上下の中央がずれていた
  - Vue 版で、閉じるボタン・ESC で閉じると背景のスクロールが止まったままになっていた

### v3.1.0
Fancybox 3 からの移行で足りなかった機能の追加と、不具合の修正。今の使い方はそのまま動きます。
- 追加
  - ハッシュ（`data-syg-modal-hash` / `hash: true`）
  - `syg-modal:open` / `syg-modal:close` イベントで開閉できるようにした（別のバンドルから開くため）
  - コールバックに `{ src, type, trigger }` を渡すようにし、`onChange`・`onLoad` を追加
  - YouTube の `shorts/`・`live/`・`youtube-nocookie.com`・`m.youtube.com` に対応
- 修正
  - クエリ付きの画像の URL（`photo.jpg?5`）を画像と判別できなかった
  - `src` の前後に空白があると判別できなかった
  - YouTube の動画IDの後ろに余計な文字（`%22` など）があると再生できなかった
  - 種類が判別できないリンクをクリックすると何も起きなかった（リンクのとおり移動するようにした）
  - Ctrl / Cmd + クリックで新しいタブが開かなかった
  - 画像のあとに別の種類へ入れ替えると、画像の大きさ・位置が残った
  - `useHistory: true` で中身を入れ替えたあとに閉じると、前の中身が開き直した（`class="undefined"` にもなった）
  - 閉じるボタンのホバー色の初期値が、`--root-color_green` の無いサイトで効かなかった（無いときは `#ccc`）
  - クリックを `document` の capture で受けるようにした。Google タグマネージャーのリンククリックのトリガーが、モーダルを開いた直後にリンク先へ移動させることがあった
  - ビルドの出力先の修正：`vite.config.ts` の `root: 'demo'`（v3.0.0 の Vue 版の追加で入った）のため、入口のバンドル（`syg-modal-dialog.es.js` / `umd.js`）と型定義（`index.d.ts`）が `dist/` に出ず、更新されていなかった
  - Vue 版の型定義（`dist/vue/index.d.ts`。`exports` の `./vue` の `types` が指すファイル）がビルドで作られていなかった
  - README の自動判別の表を、実際の動き（`selector`・`ajax` は自動判別しない）に合わせた

### v3.0.1
- Safari で dialog の外側に置いた要素（クローズボタンなど）が表示されない問題を修正
  - `max-height` を `100vh` に固定し、余白は `padding` で取るように変更
  - `--c-modal--theme-margin-tb` を廃止

### v3.0.0
- Vue版を追加

### v2.1.0
- `useHistory`を追加

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
