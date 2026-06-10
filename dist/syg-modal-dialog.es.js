const x = class x {
  constructor(t = {}) {
    this.options = {
      ...x.defaultOptions,
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
    const o = document.createElement("div");
    return o.id = "syg-modal-loading", o.className = this.options.loadingClass, o.setAttribute("data-state", "init"), o.innerHTML = this.options.loadingContent, n.appendChild(e), t.appendChild(n), t.appendChild(r), t.appendChild(o), t;
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
x.defaultOptions = {
  closeButtonContent: "×",
  loadingContent: "",
  modalClass: "c-modal",
  containerClass: "c-modal__container",
  contentClass: "c-modal__content",
  closeBtnClass: "c-modal__close-btn",
  loadingClass: "c-modal__loading"
};
let F = x;
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
async function st(c, t, n, e) {
  return new Promise((r, a) => {
    const o = document.createElement("img");
    o.style.cursor = "pointer", o.onload = () => {
      const l = o.naturalWidth, d = o.naturalHeight, g = n.clientWidth, M = n.clientHeight, X = l / d, J = g / M;
      let C, E;
      X > J ? (C = Math.min(g, l), E = C / X) : (E = Math.min(M, d), C = E * X), e.style.width = `${C}px`, e.style.height = `${E}px`, e.style.left = `${(g - C) / 2}px`, e.style.top = `${(M - E) / 2}px`, e.style.transformOrigin = "0 0";
      let p = !1, w = 0, v = 0, b = 1, L = !1, I = 0, T = 0, $ = 0, R = 0, D = 0, U = 0, m = null, O = 0, Y = 0, B = 0;
      const k = () => {
        e.style.transform = `matrix(${b}, 0, 0, ${b}, ${w}, ${v})`;
      }, S = () => {
        w = O, v = Y, k(), m = null;
      }, W = (s) => {
        Date.now() - B < 500 || s.target !== e && s.target !== o || (L = !0, $ = s.clientX, R = s.clientY, I = s.clientX, T = s.clientY, D = w, U = v, e.style.cursor = p ? "grabbing" : "pointer");
      }, N = (s) => {
        if (s.target !== e && s.target !== o || s.touches.length !== 1) return;
        B = Date.now(), s.preventDefault();
        const i = s.touches[0];
        i && (L = !0, $ = i.clientX, R = i.clientY, I = i.clientX, T = i.clientY, D = w, U = v);
      }, q = (s) => {
        if (!L) return;
        const i = s.clientX - I, u = s.clientY - T;
        p && (O = D + i, Y = U + u, m === null && (m = requestAnimationFrame(S)));
      }, z = (s) => {
        if (!L || s.touches.length !== 1) return;
        const i = s.touches[0];
        if (!i) return;
        const u = i.clientX - I, H = i.clientY - T;
        p && (s.preventDefault(), O = D + u, Y = U + H, m === null && (m = requestAnimationFrame(S)));
      }, K = (s, i) => {
        p = !0, b = l / C;
        const u = n.getBoundingClientRect(), H = s - u.left, f = i - u.top, y = parseFloat(e.style.left), V = parseFloat(e.style.top), _ = H - y, tt = f - V;
        w = _ * (1 - b), v = tt * (1 - b), e.style.cursor = "grab", k();
      }, Q = () => {
        p = !1, b = 1, w = 0, v = 0, e.style.cursor = "pointer", k();
      }, P = (s, i) => {
        if (!L) return;
        m !== null && (cancelAnimationFrame(m), m = null), Math.sqrt(
          Math.pow(s - $, 2) + Math.pow(i - R, 2)
        ) < 5 ? p ? Q() : K(s, i) : (w = O, v = Y), L = !1, p && (e.style.cursor = "grab");
      }, j = (s) => {
        P(s.clientX, s.clientY);
      }, Z = () => {
        if (p) return;
        const s = n.clientWidth, i = n.clientHeight, u = l / d, H = s / i;
        let f, y;
        u > H ? (f = Math.min(s, l), y = f / u) : (y = Math.min(i, d), f = y * u), e.style.width = `${f}px`, e.style.height = `${y}px`, e.style.left = `${(s - f) / 2}px`, e.style.top = `${(i - y) / 2}px`, C = f, E = y;
      }, A = (s) => {
        if (!L) return;
        s.preventDefault();
        const i = s.changedTouches[0];
        i && P(i.clientX, i.clientY);
      };
      e.addEventListener("mousedown", W), e.addEventListener("touchstart", N, { passive: !1 }), document.addEventListener("mousemove", q), document.addEventListener("touchmove", z, { passive: !1 }), document.addEventListener("mouseup", j), document.addEventListener("touchend", A), document.addEventListener("touchcancel", A), window.addEventListener("resize", Z), t.innerHTML = "", t.appendChild(o), r({
        startDrag: W,
        doDrag: q,
        endDrag: j,
        touchStart: N,
        touchMove: z,
        touchEnd: A,
        onResizeHandler: Z,
        rafId: m
      });
    }, o.onerror = () => a(new Error("画像の読み込みに失敗しました")), o.src = c;
  });
}
async function ot(c, t) {
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
const h = class h {
  /**
   * 要素をバインドしてクリックイベントを設定（イベント委譲方式）
   * 動的に追加された要素にも自動対応し、重複登録を防ぎます
   */
  static bind(t, n = {}) {
    this.boundSelectors.has(t) || (this.boundSelectors.add(t), n.useHistory !== void 0 && (this.useHistory = n.useHistory, this.currentOptions = n), this.setupPopstateListener(), this.delegateListener || (this.delegateListener = (e) => {
      const r = e.target;
      for (const a of this.boundSelectors) {
        const o = r.closest(a);
        if (o) {
          e.preventDefault();
          let l = o.getAttribute("data-syg-modal-src");
          if (!l && o.tagName === "A") {
            const M = o;
            l = M.getAttribute("href") || M.href;
          }
          const d = o.getAttribute("data-syg-modal"), g = d && d !== "" ? d : void 0;
          if (!l) {
            console.error("data-syg-modal-src または href が指定されていません");
            return;
          }
          this.isRestoringFromHistory = !1, this.showModal({
            ...n,
            src: l,
            type: g
          });
          break;
        }
      }
    }, document.addEventListener("click", this.delegateListener)));
  }
  /**
   * popstateリスナーをセットアップ
   */
  static setupPopstateListener() {
    this.popstateListener || (this.popstateListener = (t) => {
      const n = t.state;
      if (this.isRestoringFromHistory = !0, !n || !n.sygModal) {
        this.currentModalUI && this.currentModalUI.isOpen() && this.closeModal();
        return;
      }
      this.showModal({
        src: n.src,
        type: n.type,
        ...n.options
      });
    }, window.addEventListener("popstate", this.popstateListener));
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
    this.currentOptions = t, this.currentModalUI = new F({
      ...t,
      onClose: () => {
        this.cleanupImageDragListeners(), (this.useHistory || t.useHistory) && !this.isRestoringFromHistory && window.history.back(), this.isRestoringFromHistory = !1, t.onClose && t.onClose(), this.currentModalUI && (this.currentModalUI.destroy(), this.currentModalUI = null);
      }
    }), this.currentModalUI.setType(a), this.currentModalUI.open(), this.pushHistory(n || "", a, t), this.loadContent(n || "", a, t);
  }
  /**
   * コンテンツタイプを自動判別
   */
  static detectType(t) {
    return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(t) ? "youtube" : /\.(jpe?g|png|gif|webp)$/i.test(t) ? "image" : null;
  }
  /**
   * 画像のドラッグイベントリスナーをクリーンアップ
   */
  static cleanupImageDragListeners() {
    if (!this.imageDragListeners) return;
    const { doDrag: t, endDrag: n, startDrag: e, touchStart: r, touchMove: a, touchEnd: o, onResizeHandler: l, rafId: d } = this.imageDragListeners;
    if (d != null && cancelAnimationFrame(d), this.currentModalUI) {
      const g = this.currentModalUI.getContainer();
      g.removeEventListener("mousedown", e), g.removeEventListener("touchstart", r);
    }
    document.removeEventListener("mousemove", t), document.removeEventListener("touchmove", a), document.removeEventListener("mouseup", n), document.removeEventListener("touchend", o), document.removeEventListener("touchcancel", o), window.removeEventListener("resize", l), this.imageDragListeners = null;
  }
  /**
   * 履歴に状態を追加
   */
  static pushHistory(t, n, e) {
    if (!this.isRestoringFromHistory && (this.useHistory || e.useHistory) && n !== "html" && t) {
      const r = {
        sygModal: !0,
        src: t,
        type: n,
        options: {
          closeButtonContent: e.closeButtonContent || this.currentOptions.closeButtonContent,
          loadingContent: e.loadingContent || this.currentOptions.loadingContent,
          modalClass: e.modalClass || this.currentOptions.modalClass,
          containerClass: e.containerClass || this.currentOptions.containerClass,
          contentClass: e.contentClass || this.currentOptions.contentClass,
          closeBtnClass: e.closeBtnClass || this.currentOptions.closeBtnClass,
          loadingClass: e.loadingClass || this.currentOptions.loadingClass
        }
      };
      window.history.pushState(r, "", window.location.href);
    }
  }
  /**
   * コンテンツを読み込み
   */
  static async loadContent(t, n, e) {
    if (!this.currentModalUI) return;
    const r = this.currentModalUI.getContent(), a = this.currentModalUI.getDialog(), o = this.currentModalUI.getContainer();
    r.innerHTML = "", this.currentModalUI.setLoadingState("loading");
    try {
      switch (n) {
        case "youtube":
          await et(t, r);
          break;
        case "image":
          this.imageDragListeners = await st(t, r, a, o);
          break;
        case "ajax":
          await ot(t, r);
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
    this.currentModalUI.setType(e), this.pushHistory(t, e, n), this.loadContent(t, e, n);
  }
  /**
   * モーダルを閉じる
   */
  static closeModal() {
    this.currentModalUI && this.currentModalUI.close();
  }
};
h.currentModalUI = null, h.boundSelectors = /* @__PURE__ */ new Set(), h.delegateListener = null, h.imageDragListeners = null, h.popstateListener = null, h.useHistory = !1, h.isRestoringFromHistory = !1, h.currentOptions = {};
let G = h;
export {
  G as SygModalDialog
};
//# sourceMappingURL=syg-modal-dialog.es.js.map
