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
export function isYoutubeUrl(url) {
    return /^https?:\/\/(www\.|m\.)?(youtube\.com|youtube-nocookie\.com|youtu\.be)\//i.test(url);
}
export function extractYoutubeId(url) {
    if (!isYoutubeUrl(url))
        return null;
    let parsed;
    try {
        parsed = new URL(url);
    }
    catch {
        return null;
    }
    const host = parsed.hostname.toLowerCase().replace(/^(www\.|m\.)/, '');
    let candidate = '';
    if (host === 'youtu.be') {
        candidate = parsed.pathname.split('/')[1] || '';
    }
    else {
        const match = parsed.pathname.match(/^\/(embed|shorts|live|v)\/([^/]+)/);
        candidate = match?.[2] ?? (parsed.searchParams.get('v') || '');
    }
    const id = candidate.match(/^([\w-]{11})(?![\w-])/);
    return id?.[1] ?? null;
}
//# sourceMappingURL=youtubeLoader.js.map