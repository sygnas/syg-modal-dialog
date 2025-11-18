const X = class X {
  constructor(t = {}) {
    this.options = {
      ...X.defaultOptions,
      ...t
    }, this.dialog = this.createDialog(), this.container = this.dialog.querySelector("#syg-modal-container"), this.content = this.dialog.querySelector("#syg-modal-content"), this.loading = this.dialog.querySelector("#syg-modal-loading"), this.setupEventListeners();
  }
  /**
   * dialog要素を作成
   */
  createDialog() {
    const t = document.createElement("dialog");
    t.id = "syg-modal-dialog", t.className = this.options.modalClass;
    const n = document.createElement("div");
    n.id = "syg-modal-container", n.className = this.options.containerClass;
    const e = document.createElement("div");
    e.id = "syg-modal-content", e.className = this.options.contentClass;
    const r = document.createElement("form");
    r.method = "dialog";
    const a = document.createElement("button");
    a.type = "submit", a.className = this.options.closeBtnClass, a.innerHTML = this.options.closeButtonContent, r.appendChild(a);
    const s = document.createElement("div");
    return s.id = "syg-modal-loading", s.className = this.options.loadingClass, s.setAttribute("data-state", "init"), s.innerHTML = this.options.loadingContent, n.appendChild(e), t.appendChild(n), t.appendChild(r), t.appendChild(s), t;
  }
  /**
   * イベントリスナーを設定
   */
  setupEventListeners() {
    this.dialog.addEventListener("click", (t) => {
      t.target === this.dialog && this.close();
    }), this.dialog.addEventListener("close", () => {
      document.documentElement.style.overflow = "", document.documentElement.style.height = "", this.options.onClose && this.options.onClose();
    });
  }
  /**
   * モーダルを開く
   */
  open() {
    this.dialog.parentElement || document.body.appendChild(this.dialog), this.dialog.showModal(), document.documentElement.style.overflow = "hidden", document.documentElement.style.height = "100vh", this.options.onOpen && this.options.onOpen();
  }
  /**
   * モーダルを閉じる
   */
  close() {
    this.dialog.close();
  }
  /**
   * コンテンツを設定
   */
  setContent(t) {
    this.content.innerHTML = t;
  }
  /**
   * ローディング状態を設定
   */
  setLoadingState(t) {
    this.loading.setAttribute("data-state", t);
  }
  /**
   * タイプを設定（data属性とクラス名を更新）
   */
  setType(t) {
    this.dialog.setAttribute("data-syg-modal-type", t), t === "ajax" || t === "selector" ? this.content.className = this.options.contentClass : this.content.className = "";
  }
  /**
   * dialog要素を取得
   */
  getDialog() {
    return this.dialog;
  }
  /**
   * container要素を取得
   */
  getContainer() {
    return this.container;
  }
  /**
   * content要素を取得
   */
  getContent() {
    return this.content;
  }
  /**
   * loading要素を取得
   */
  getLoading() {
    return this.loading;
  }
  /**
   * モーダルが開いているかどうか
   */
  isOpen() {
    return this.dialog.open;
  }
  /**
   * リソースを破棄
   */
  destroy() {
    this.dialog.parentElement && this.dialog.remove();
  }
};
X.defaultOptions = {
  closeButtonContent: "×",
  loadingContent: "",
  modalClass: "c-modal",
  containerClass: "c-modal__container",
  contentClass: "c-modal__content",
  closeBtnClass: "c-modal__close-btn",
  loadingClass: "c-modal__loading"
};
let W = X;
async function et(c, t) {
  const n = nt(c);
  if (!n)
    throw new Error("YouTube動画IDを取得できませんでした");
  const e = document.createElement("iframe");
  e.src = `https://www.youtube.com/embed/${n}?autoplay=1`, e.width = "560", e.height = "315", e.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture", e.allowFullscreen = !0, e.style.maxWidth = "100%", t.innerHTML = "", t.appendChild(e);
}
function nt(c) {
  let t = c.match(/[?&]v=([^&]+)/);
  return t != null && t[1] || (t = c.match(/youtu\.be\/([^?&]+)/), t != null && t[1]) || (t = c.match(/youtube\.com\/embed\/([^?&]+)/), t != null && t[1]) ? t[1] : null;
}
async function ot(c, t, n, e) {
  return new Promise((r, a) => {
    const s = document.createElement("img");
    s.style.cursor = "pointer", s.onload = () => {
      const l = s.naturalWidth, d = s.naturalHeight, m = n.clientWidth, C = n.clientHeight, $ = l / d, G = m / C;
      let y, E;
      $ > G ? (y = Math.min(m, l), E = y / $) : (E = Math.min(C, d), y = E * $), e.style.width = `${y}px`, e.style.height = `${E}px`, e.style.left = `${(m - y) / 2}px`, e.style.top = `${(C - E) / 2}px`, e.style.transformOrigin = "0 0";
      let g = !1, v = 0, w = 0, M = 1, L = !1, I = 0, D = 0, S = 0, k = 0, H = 0, U = 0, h = null, Y = 0, x = 0, N = 0;
      const A = () => {
        e.style.transform = `matrix(${M}, 0, 0, ${M}, ${v}, ${w})`;
      }, O = () => {
        v = Y, w = x, A(), h = null;
      }, q = (o) => {
        Date.now() - N < 500 || o.target !== e && o.target !== s || (L = !0, S = o.clientX, k = o.clientY, I = o.clientX, D = o.clientY, H = v, U = w, e.style.cursor = g ? "grabbing" : "pointer");
      }, F = (o) => {
        if (o.target !== e && o.target !== s || o.touches.length !== 1) return;
        N = Date.now(), o.preventDefault();
        const i = o.touches[0];
        i && (L = !0, S = i.clientX, k = i.clientY, I = i.clientX, D = i.clientY, H = v, U = w);
      }, B = (o) => {
        if (!L) return;
        const i = o.clientX - I, u = o.clientY - D;
        g && (Y = H + i, x = U + u, h === null && (h = requestAnimationFrame(O)));
      }, j = (o) => {
        if (!L || o.touches.length !== 1) return;
        const i = o.touches[0];
        if (!i) return;
        const u = i.clientX - I, T = i.clientY - D;
        g && (o.preventDefault(), Y = H + u, x = U + T, h === null && (h = requestAnimationFrame(O)));
      }, J = (o, i) => {
        g = !0, M = l / y;
        const u = n.getBoundingClientRect(), T = o - u.left, p = i - u.top, f = parseFloat(e.style.left), Q = parseFloat(e.style.top), V = T - f, tt = p - Q;
        v = V * (1 - M), w = tt * (1 - M), e.style.cursor = "grab", A();
      }, K = () => {
        g = !1, M = 1, v = 0, w = 0, e.style.cursor = "pointer", A();
      }, z = (o, i) => {
        if (!L) return;
        h !== null && (cancelAnimationFrame(h), h = null), Math.sqrt(
          Math.pow(o - S, 2) + Math.pow(i - k, 2)
        ) < 5 ? g ? K() : J(o, i) : (v = Y, w = x), L = !1, g && (e.style.cursor = "grab");
      }, P = (o) => {
        z(o.clientX, o.clientY);
      }, Z = () => {
        if (g) return;
        const o = n.clientWidth, i = n.clientHeight, u = l / d, T = o / i;
        let p, f;
        u > T ? (p = Math.min(o, l), f = p / u) : (f = Math.min(i, d), p = f * u), e.style.width = `${p}px`, e.style.height = `${f}px`, e.style.left = `${(o - p) / 2}px`, e.style.top = `${(i - f) / 2}px`, y = p, E = f;
      }, R = (o) => {
        if (!L) return;
        o.preventDefault();
        const i = o.changedTouches[0];
        i && z(i.clientX, i.clientY);
      };
      e.addEventListener("mousedown", q), e.addEventListener("touchstart", F, { passive: !1 }), document.addEventListener("mousemove", B), document.addEventListener("touchmove", j, { passive: !1 }), document.addEventListener("mouseup", P), document.addEventListener("touchend", R), document.addEventListener("touchcancel", R), window.addEventListener("resize", Z), t.innerHTML = "", t.appendChild(s), r({
        startDrag: q,
        doDrag: B,
        endDrag: P,
        touchStart: F,
        touchMove: j,
        touchEnd: R,
        onResizeHandler: Z,
        rafId: h
      });
    }, s.onerror = () => a(new Error("画像の読み込みに失敗しました")), s.src = c;
  });
}
async function st(c, t) {
  const n = await fetch(c);
  if (!n.ok)
    throw new Error(`HTTP error! status: ${n.status}`);
  const e = await n.text();
  t.innerHTML = e;
}
function it(c, t) {
  const n = document.querySelector(c);
  if (!n)
    throw new Error(`要素が見つかりません: ${c}`);
  t.innerHTML = n.innerHTML;
}
function rt(c, t) {
  t.innerHTML = c;
}
const b = class b {
  /**
   * 要素をバインドしてクリックイベントを設定（イベント委譲方式）
   * 動的に追加された要素にも自動対応し、重複登録を防ぎます
   */
  static bind(t, n = {}) {
    this.boundSelectors.has(t) || (this.boundSelectors.add(t), this.delegateListener || (this.delegateListener = (e) => {
      const r = e.target;
      for (const a of this.boundSelectors) {
        const s = r.closest(a);
        if (s) {
          e.preventDefault();
          let l = s.getAttribute("data-syg-modal-src");
          if (!l && s.tagName === "A") {
            const C = s;
            l = C.getAttribute("href") || C.href;
          }
          const d = s.getAttribute("data-syg-modal"), m = d && d !== "" ? d : void 0;
          if (!l) {
            console.error("data-syg-modal-src または href が指定されていません");
            return;
          }
          this.showModal({
            ...n,
            src: l,
            type: m
          });
          break;
        }
      }
    }, document.addEventListener("click", this.delegateListener)));
  }
  /**
   * モーダルを表示
   */
  static showModal(t) {
    const { src: n, type: e, html: r } = t;
    if (e === "html") {
      if (!r) {
        console.error('type="html"の場合、htmlプロパティが必要です');
        return;
      }
    } else if (!n) {
      console.error("srcが指定されていません");
      return;
    }
    const a = e || (n ? this.detectType(n) : null);
    if (!a) {
      console.error("コンテンツタイプが判別できません");
      return;
    }
    if (this.currentModalUI && this.currentModalUI.isOpen()) {
      this.updateContent(n || "", t);
      return;
    }
    this.currentModalUI = new W({
      ...t,
      onClose: () => {
        this.cleanupImageDragListeners(), t.onClose && t.onClose(), this.currentModalUI && (this.currentModalUI.destroy(), this.currentModalUI = null);
      }
    }), this.currentModalUI.setType(a), this.currentModalUI.open(), this.loadContent(n || "", a, t);
  }
  /**
   * コンテンツタイプを自動判別
   */
  static detectType(t) {
    return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(t) ? "youtube" : /^[.#]/.test(t) ? "selector" : /\.(jpe?g|png|gif|webp)$/i.test(t) ? "image" : /^https?:\/\//.test(t) ? "ajax" : null;
  }
  /**
   * 画像のドラッグイベントリスナーをクリーンアップ
   */
  static cleanupImageDragListeners() {
    if (!this.imageDragListeners) return;
    const { doDrag: t, endDrag: n, startDrag: e, touchStart: r, touchMove: a, touchEnd: s, onResizeHandler: l, rafId: d } = this.imageDragListeners;
    if (d != null && cancelAnimationFrame(d), this.currentModalUI) {
      const m = this.currentModalUI.getContainer();
      m.removeEventListener("mousedown", e), m.removeEventListener("touchstart", r);
    }
    document.removeEventListener("mousemove", t), document.removeEventListener("touchmove", a), document.removeEventListener("mouseup", n), document.removeEventListener("touchend", s), document.removeEventListener("touchcancel", s), window.removeEventListener("resize", l), this.imageDragListeners = null;
  }
  /**
   * コンテンツを読み込み
   */
  static async loadContent(t, n, e) {
    if (!this.currentModalUI) return;
    const r = this.currentModalUI.getContent(), a = this.currentModalUI.getDialog(), s = this.currentModalUI.getContainer();
    r.innerHTML = "", this.currentModalUI.setLoadingState("loading");
    try {
      switch (n) {
        case "youtube":
          await et(t, r);
          break;
        case "image":
          this.imageDragListeners = await ot(t, r, a, s);
          break;
        case "ajax":
          await st(t, r);
          break;
        case "selector":
          it(t, r);
          break;
        case "html":
          const l = (e == null ? void 0 : e.html) || t;
          rt(l, r);
          break;
      }
      this.currentModalUI.setLoadingState("complete");
    } catch (l) {
      console.error("コンテンツの読み込みに失敗しました:", l), r.innerHTML = "<p>コンテンツの取得に失敗しました</p>", this.currentModalUI.setLoadingState("complete");
    }
  }
  /**
   * コンテンツを更新（モーダルが開いている状態で別のコンテンツに切り替え）
   */
  static updateContent(t, n) {
    if (!this.currentModalUI) return;
    const e = n.type || this.detectType(t);
    if (!e) {
      console.error("コンテンツタイプが判別できません:", t);
      return;
    }
    this.currentModalUI.setType(e), this.loadContent(t, e, n);
  }
};
b.currentModalUI = null, b.boundSelectors = /* @__PURE__ */ new Set(), b.delegateListener = null, b.imageDragListeners = null;
let _ = b;
export {
  _ as SygModalDialog
};
//# sourceMappingURL=syg-modal-dialog.es.js.map
