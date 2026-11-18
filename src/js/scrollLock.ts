/**
 * 背景のスクロールを止める・戻す
 * TS 版（SygModalUI.ts）と Vue 版（SygModalUI.vue）で共有する
 *
 * html に overflow: hidden を付けると縦スクロールバーが消え、その幅だけ表示領域が広がって背景がずれる。
 * 消えるスクロールバーの幅を html の padding-right に足して、ずれを補正する。
 * 表示領域はスクロールバーの分まで広がるので、::backdrop は画面の幅いっぱいに出る。
 */

// 止めている間に覚えておく、html のインラインスタイルの元の値
let saved: { overflow: string; height: string; paddingRight: string } | null = null;

/**
 * 背景のスクロールを止める（止めている間に呼ばれても何もしない）
 */
export function lockScroll(): void {
  if (saved) return;

  const html = document.documentElement;
  const style = getComputedStyle(html);

  saved = {
    overflow: html.style.overflow,
    height: html.style.height,
    paddingRight: html.style.paddingRight,
  };

  // スクロールを止める前に、スクロールバーの幅を測る（重ねて表示するスクロールバーなら 0）
  const scrollbarWidth = window.innerWidth - html.clientWidth;

  // scrollbar-gutter: stable のときは、止めても溝が残って幅が変わらないので補正しない
  const gutter = (style as CSSStyleDeclaration & { scrollbarGutter?: string }).scrollbarGutter || '';

  if (scrollbarWidth > 0 && !gutter.includes('stable')) {
    const paddingRight = parseFloat(style.paddingRight) || 0;
    html.style.paddingRight = `${paddingRight + scrollbarWidth}px`;
  }

  html.style.overflow = 'hidden';
  html.style.height = '100vh';
}

/**
 * 背景のスクロールを戻す（止めていないときに呼ばれても何もしない）
 */
export function unlockScroll(): void {
  if (!saved) return;

  const html = document.documentElement;
  html.style.overflow = saved.overflow;
  html.style.height = saved.height;
  html.style.paddingRight = saved.paddingRight;

  saved = null;
}
