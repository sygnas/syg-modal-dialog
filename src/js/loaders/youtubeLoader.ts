/**
 * YouTube動画ローダー
 */

/**
 * YouTube動画を読み込み
 */
export async function loadYoutube(src: string, content: HTMLElement): Promise<void> {
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

/**
 * YouTube の URL か判定
 * 対象：youtube.com / youtu.be / youtube-nocookie.com（www. / m. 付きも）
 */
export function isYoutubeUrl(url: string): boolean {
  return /^https?:\/\/(www\.|m\.)?(youtube\.com|youtube-nocookie\.com|youtu\.be)\//i.test(url);
}

/**
 * YouTube動画IDを抽出
 * 対応：watch?v=ID / youtu.be/ID / embed/ID / shorts/ID / live/ID（?si= や &t= 付きも可）
 * 取り出した値の先頭 11 文字（英数字・-・_）を ID とする。
 * embed/ID%22 のように後ろに余計な文字が付いていても、ID だけを使う
 */
export function extractYoutubeId(url: string): string | null {
  if (!isYoutubeUrl(url)) return null;

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  const host = parsed.hostname.toLowerCase().replace(/^(www\.|m\.)/, '');
  let candidate = '';

  if (host === 'youtu.be') {
    candidate = parsed.pathname.split('/')[1] || '';
  } else {
    const match = parsed.pathname.match(/^\/(embed|shorts|live|v)\/([^/]+)/);
    candidate = match?.[2] ?? (parsed.searchParams.get('v') || '');
  }

  const id = candidate.match(/^([\w-]{11})(?![\w-])/);
  return id?.[1] ?? null;
}
