<script setup lang="ts">
/**
 * SygModalUI.vue
 * <dialog>ベースの完全リアクティブなモーダルUIコンポーネント
 * 
 * 特徴:
 * - TypeScriptクラス(SygModalUI.ts, SygModalDialog.ts)を一切利用しない独立コンポーネント
 * - クラス名とDOM構造のみTypeScript版と同一（CSS共有）
 * - v-model対応
 * - slotで任意のコンテンツをリアクティブに表示
 * - 親コンポーネントのprovide/injectを継承
 */

import { ref, watch, onMounted, onUnmounted } from 'vue';

export interface Props {
  /** モーダルの開閉状態 */
  modelValue?: boolean;
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
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  modalClass: 'c-modal',
  containerClass: 'c-modal__container',
  contentClass: 'c-modal__content',
  closeBtnClass: 'c-modal__close-btn',
  closeButtonContent: '×',
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'open': [];
  'close': [];
}>();

const dialogRef = ref<HTMLDialogElement | null>(null);

/**
 * モーダルを開く
 */
const open = () => {
  if (!dialogRef.value) return;
  
  dialogRef.value.showModal();
  
  // 背景スクロールを止める
  document.documentElement.style.overflow = 'hidden';
  document.documentElement.style.height = '100vh';
  
  emit('open');
};

/**
 * モーダルを閉じる
 */
const close = () => {
  if (!dialogRef.value?.open) return;
  
  dialogRef.value.close();
  
  // スクロールを戻す
  document.documentElement.style.overflow = '';
  document.documentElement.style.height = '';
  
  emit('update:modelValue', false);
  emit('close');
};

/**
 * 背景クリックで閉じる
 */
const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === dialogRef.value) {
    close();
  }
};

/**
 * v-modelの値を監視して開閉
 */
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    open();
  } else {
    close();
  }
});

/**
 * dialogのcloseイベントを監視
 */
const handleClose = () => {
  if (props.modelValue) {
    emit('update:modelValue', false);
    emit('close');
  }
};

/**
 * 初期状態で開いている場合の処理
 */
onMounted(() => {
  if (props.modelValue) {
    open();
  }
});

/**
 * クリーンアップ
 */
onUnmounted(() => {
  // スクロールを戻す
  document.documentElement.style.overflow = '';
  document.documentElement.style.height = '';
});
</script>

<template>
  <dialog
    ref="dialogRef"
    :class="modalClass"
    @click="handleBackdropClick"
    @close="handleClose"
  >
    <div :class="containerClass">
      <div :class="contentClass">
        <!-- slotで任意のコンテンツを表示 -->
        <slot v-if="modelValue"></slot>
      </div>
    </div>
    
    <!-- 閉じるボタン -->
    <form method="dialog">
      <button 
        type="submit" 
        :class="closeBtnClass"
        v-html="closeButtonContent"
      ></button>
    </form>
  </dialog>
</template>

<style scoped>
/*
 * スタイルは既存のCSS（style.scss）を使用
 * このコンポーネントはクラス名のみを提供
 */
</style>
