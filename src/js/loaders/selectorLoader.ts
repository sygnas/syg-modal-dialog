/**
 * セレクタコンテンツローダー
 */

/**
 * セレクタで指定した要素のコンテンツを読み込み
 */
export function loadSelector(src: string, content: HTMLElement): void {
  const element = document.querySelector(src);

  if (!element) {
    throw new Error(`要素が見つかりません: ${src}`);
  }

  content.innerHTML = element.innerHTML;
}
