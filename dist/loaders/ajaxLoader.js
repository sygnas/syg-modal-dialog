export async function loadAjax(src, content) {
    const response = await fetch(src);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();
    content.innerHTML = html;
}
//# sourceMappingURL=ajaxLoader.js.map