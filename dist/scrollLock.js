let saved = null;
export function lockScroll() {
    if (saved)
        return;
    const html = document.documentElement;
    const style = getComputedStyle(html);
    saved = {
        overflow: html.style.overflow,
        height: html.style.height,
        paddingRight: html.style.paddingRight,
    };
    const scrollbarWidth = window.innerWidth - html.clientWidth;
    const gutter = style.scrollbarGutter || '';
    if (scrollbarWidth > 0 && !gutter.includes('stable')) {
        const paddingRight = parseFloat(style.paddingRight) || 0;
        html.style.paddingRight = `${paddingRight + scrollbarWidth}px`;
    }
    html.style.overflow = 'hidden';
    html.style.height = '100vh';
}
export function unlockScroll() {
    if (!saved)
        return;
    const html = document.documentElement;
    html.style.overflow = saved.overflow;
    html.style.height = saved.height;
    html.style.paddingRight = saved.paddingRight;
    saved = null;
}
//# sourceMappingURL=scrollLock.js.map