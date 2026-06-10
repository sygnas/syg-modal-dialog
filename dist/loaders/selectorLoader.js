export function loadSelector(src, content) {
    const element = document.querySelector(src);
    if (!element) {
        throw new Error(`要素が見つかりません: ${src}`);
    }
    content.innerHTML = element.innerHTML;
}
//# sourceMappingURL=selectorLoader.js.map