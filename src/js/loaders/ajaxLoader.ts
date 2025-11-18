/**
 * Ajax コンテンツローダー
 */

/**
 * Ajaxでコンテンツを読み込み
 */
export async function loadAjax(src: string, content: HTMLElement): Promise<void> {
  const response = await fetch(src);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const html = await response.text();
  content.innerHTML = html;
}
