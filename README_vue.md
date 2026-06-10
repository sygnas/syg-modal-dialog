# SygModalDialog - Vueコンポーネント

SygModalDialogのVue 3コンポーネント版です。

## 📦 インストール

```bash
npm install @sygnas/modal-dialog
```

## 🎯 コンポーネント概要

### SygModalUI.vue
`<dialog>`ベースの完全リアクティブなモーダルUIコンポーネント。

**特徴:**
- TypeScriptクラスを使用しない独立したコンポーネント
- v-model対応（開閉状態の制御）
- slotで任意のリアクティブコンテンツを表示
- 親コンポーネントのprovide/injectを継承

## 📖 使用例

### パターン1: リアクティブなフォーム

```vue
<template>
  <button @click="isOpen = true">フォームを開く</button>
  
  <SygModalUI v-model="isOpen">
    <h2>お問い合わせ</h2>
    <input v-model="name" placeholder="名前" />
    <p>入力: {{ name }}</p>
    <button @click="submit">送信</button>
  </SygModalUI>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SygModalUI } from '@sygnas/modal-dialog/vue';

const isOpen = ref(false);
const name = ref('');

const submit = () => {
  console.log(name.value);
  isOpen.value = false;
};
</script>
```

### パターン2: カウンター

```vue
<template>
  <button @click="isOpen = true">カウンターを開く</button>
  
  <SygModalUI v-model="isOpen">
    <h2>カウンター</h2>
    <div class="counter">{{ count }}</div>
    <button @click="count++">+1</button>
    <button @click="count--">-1</button>
  </SygModalUI>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SygModalUI } from '@sygnas/modal-dialog/vue';

const isOpen = ref(false);
const count = ref(0);
</script>
```

### パターン3: 動的コンテンツ

```vue
<template>
  <button @click="isOpen = true">詳細を見る</button>
  
  <SygModalUI v-model="isOpen">
    <h2>{{ article.title }}</h2>
    <p>{{ article.content }}</p>
    <button @click="likes++">いいね: {{ likes }}</button>
  </SygModalUI>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SygModalUI } from '@sygnas/modal-dialog/vue';

const isOpen = ref(false);
const article = ref({
  title: 'タイトル',
  content: '本文...'
});
const likes = ref(0);
</script>
```

## 🎨 Props

### SygModalUI.vue

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | `false` | モーダルの開閉状態（v-model） |
| `modalClass` | `string` | `'c-modal'` | モーダルのクラス名 |
| `containerClass` | `string` | `'c-modal__container'` | コンテナのクラス名 |
| `contentClass` | `string` | `'c-modal__content'` | コンテンツのクラス名 |
| `closeBtnClass` | `string` | `'c-modal__close-btn'` | 閉じるボタンのクラス名 |
| `closeButtonContent` | `string` | `'×'` | 閉じるボタンの内容 |

## 🎪 Events

### SygModalUI.vue

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `boolean` | モーダルの開閉状態が変更された |
| `open` | - | モーダルが開かれた |
| `close` | - | モーダルが閉じられた |

## 🎨 スタイリング

コンポーネントは既存のCSSクラスを使用します。スタイルのカスタマイズは、CSS変数を使用してください。

```css
.c-modal {
  --c-modal--theme-bg-color: #fff;
  --c-modal--theme-max-width: 800px;
  --c-modal--theme-backdrop-bg-color: rgba(0, 0, 0, 0.8);
  /* その他のCSS変数... */
}
```

詳細は[メインREADME](../../README.md)を参照してください。

## ⚠️ 注意事項

### XSS対策

`SygModalUI.vue` のslotは任意のHTMLを表示できるため、XSSリスクがあります。

- ユーザー入力を直接表示しない
- 必要に応じてサニタイズライブラリを使用

### 画像・YouTube・Ajaxの表示について

このVueコンポーネントは、リアクティブなHTMLコンテンツの表示に特化しています。

画像のLightbox表示やYouTube動画の埋め込みが必要な場合は、TypeScript版の `SygModalDialog` クラスを使用してください。

```vue
<script setup>
import { onMounted } from 'vue';
import { SygModalDialog } from '@sygnas/modal-dialog';

onMounted(() => {
  // data属性でバインド
  SygModalDialog.bind('[data-syg-modal]');
});
</script>

<template>
  <a href="/img/photo.jpg" data-syg-modal>画像を開く</a>
  <button data-syg-modal="youtube" data-syg-modal-src="https://...">動画</button>
</template>
```

## 📚 TypeScript版との互換性

Vue版とTypeScript版は以下を共有しています:

- CSSクラス名
- DOM構造

既存のTypeScript版と併用可能です。画像・YouTube・Ajax表示にはTypeScript版を、リアクティブなコンテンツにはVue版を使い分けてください。

## 📄 ライセンス

MIT
