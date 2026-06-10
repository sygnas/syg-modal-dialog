export async function loadYoutube(src, content) {
    const videoId = extractYoutubeId(src);
    if (!videoId) {
        throw new Error('YouTube動画IDを取得できませんでした');
    }
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    iframe.width = '560';
    iframe.height = '315';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.style.maxWidth = '100%';
    content.innerHTML = '';
    content.appendChild(iframe);
}
function extractYoutubeId(url) {
    let match = url.match(/[?&]v=([^&]+)/);
    if (match?.[1])
        return match[1];
    match = url.match(/youtu\.be\/([^?&]+)/);
    if (match?.[1])
        return match[1];
    match = url.match(/youtube\.com\/embed\/([^?&]+)/);
    if (match?.[1])
        return match[1];
    return null;
}
//# sourceMappingURL=youtubeLoader.js.map