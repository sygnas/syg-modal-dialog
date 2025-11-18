/**
 * HTML文字列を直接表示するローダー
 */

/**
 * HTML文字列をコンテンツとして設定
 * @param html HTML文字列
 * @param content コンテンツ要素
 */
export function loadHtml(html: string, content: HTMLElement): void {
  content.innerHTML = html;
}
