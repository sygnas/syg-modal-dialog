const R = class R {
  constructor(t = {}) {
    const s = {};
    Object.keys(t).forEach((e) => {
      t[e] !== void 0 && (s[e] = t[e]);
    }), this.options = {
      ...R.defaultOptions,
      ...s
    }, this.dialog = this.createDialog(), this.container = this.dialog.querySelector("#syg-modal-container"), this.content = this.dialog.querySelector("#syg-modal-content"), this.loading = this.dialog.querySelector("#syg-modal-loading"), this.setupEventListeners();
  }
  /**
   * dialog要素を作成
   */
  createDialog() {
    const t = document.createElement("dialog");
    t.id = "syg-modal-dialog", t.className = this.options.modalClass;
    const s = document.createElement("div");
    s.id = "syg-modal-container", s.className = this.options.containerClass;
    const e = document.createElement("div");
    e.id = "syg-modal-content", e.className = this.options.contentClass;
    const r = document.createElement("form");
    r.method = "dialog";
    const i = document.createElement("button");
    i.type = "submit", i.className = this.options.closeBtnClass, i.innerHTML = this.options.closeButtonContent, r.appendChild(i);
    const n = document.createElement("div");
    return n.id = "syg-modal-loading", n.className = this.options.loadingClass, n.setAttribute("data-state", "init"), n.innerHTML = this.options.loadingContent, s.appendChild(e), t.appendChild(s), t.appendChild(r), t.appendChild(n), t;
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
R.defaultOptions = {
  closeButtonContent: "×",
  loadingContent: "",
  modalClass: "c-modal",
  containerClass: "c-modal__container",
  contentClass: "c-modal__content",
  closeBtnClass: "c-modal__close-btn",
  loadingClass: "c-modal__loading"
};
let k = R;
async function nt(h, t) {
  const s = J(h);
  if (!s)
    throw new Error("YouTube動画IDを取得できませんでした");
  const e = document.createElement("iframe");
  e.src = `https://www.youtube.com/embed/${s}?autoplay=1`, e.width = "560", e.height = "315", e.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture", e.allowFullscreen = !0, e.style.maxWidth = "100%", t.innerHTML = "", t.appendChild(e);
}
function G(h) {
  return /^https?:\/\/(www\.|m\.)?(youtube\.com|youtube-nocookie\.com|youtu\.be)\//i.test(h);
}
function J(h) {
  if (!G(h)) return null;
  let t;
  try {
    t = new URL(h);
  } catch {
    return null;
  }
  const s = t.hostname.toLowerCase().replace(/^(www\.|m\.)/, "");
  let e = "";
  if (s === "youtu.be")
    e = t.pathname.split("/")[1] || "";
  else {
    const i = t.pathname.match(/^\/(embed|shorts|live|v)\/([^/]+)/);
    e = (i == null ? void 0 : i[2]) ?? (t.searchParams.get("v") || "");
  }
  const r = e.match(/^([\w-]{11})(?![\w-])/);
  return (r == null ? void 0 : r[1]) ?? null;
}
async function it(h, t, s, e) {
  return new Promise((r, i) => {
    const n = document.createElement("img");
    n.style.cursor = "pointer", n.onload = () => {
      const l = n.naturalWidth, c = n.naturalHeight, d = s.clientWidth, m = s.clientHeight, I = l / c, T = d / m;
      let C, H;
      I > T ? (C = Math.min(d, l), H = C / I) : (H = Math.min(m, c), C = H * I), e.style.width = `${C}px`, e.style.height = `${H}px`, e.style.left = `${(d - C) / 2}px`, e.style.top = `${(m - H) / 2}px`, e.style.transformOrigin = "0 0";
      let g = !1, v = 0, L = 0, b = 1, E = !1, O = 0, D = 0, x = 0, B = 0, U = 0, $ = 0, f = null, Y = 0, A = 0, N = 0;
      const X = () => {
        e.style.transform = `matrix(${b}, 0, 0, ${b}, ${v}, ${L})`;
      }, P = () => {
        v = Y, L = A, X(), f = null;
      }, W = (o) => {
        Date.now() - N < 500 || o.target !== e && o.target !== n || (E = !0, x = o.clientX, B = o.clientY, O = o.clientX, D = o.clientY, U = v, $ = L, e.style.cursor = g ? "grabbing" : "pointer");
      }, S = (o) => {
        if (o.target !== e && o.target !== n || o.touches.length !== 1) return;
        N = Date.now(), o.preventDefault();
        const a = o.touches[0];
        a && (E = !0, x = a.clientX, B = a.clientY, O = a.clientX, D = a.clientY, U = v, $ = L);
      }, q = (o) => {
        if (!E) return;
        const a = o.clientX - O, p = o.clientY - D;
        g && (Y = U + a, A = $ + p, f === null && (f = requestAnimationFrame(P)));
      }, j = (o) => {
        if (!E || o.touches.length !== 1) return;
        const a = o.touches[0];
        if (!a) return;
        const p = a.clientX - O, M = a.clientY - D;
        g && (o.preventDefault(), Y = U + p, A = $ + M, f === null && (f = requestAnimationFrame(P)));
      }, Q = (o, a) => {
        g = !0, b = l / C;
        const p = s.getBoundingClientRect(), M = o - p.left, y = a - p.top, w = parseFloat(e.style.left), tt = parseFloat(e.style.top), et = M - w, st = y - tt;
        v = et * (1 - b), L = st * (1 - b), e.style.cursor = "grab", X();
      }, _ = () => {
        g = !1, b = 1, v = 0, L = 0, e.style.cursor = "pointer", X();
      }, z = (o, a) => {
        if (!E) return;
        f !== null && (cancelAnimationFrame(f), f = null), Math.sqrt(
          Math.pow(o - x, 2) + Math.pow(a - B, 2)
        ) < 5 ? g ? _() : Q(o, a) : (v = Y, L = A), E = !1, g && (e.style.cursor = "grab");
      }, K = (o) => {
        z(o.clientX, o.clientY);
      }, Z = () => {
        if (g) return;
        const o = s.clientWidth, a = s.clientHeight, p = l / c, M = o / a;
        let y, w;
        p > M ? (y = Math.min(o, l), w = y / p) : (w = Math.min(a, c), y = w * p), e.style.width = `${y}px`, e.style.height = `${w}px`, e.style.left = `${(o - y) / 2}px`, e.style.top = `${(a - w) / 2}px`, C = y, H = w;
      }, F = (o) => {
        if (!E) return;
        o.preventDefault();
        const a = o.changedTouches[0];
        a && z(a.clientX, a.clientY);
      };
      e.addEventListener("mousedown", W), e.addEventListener("touchstart", S, { passive: !1 }), document.addEventListener("mousemove", q), document.addEventListener("touchmove", j, { passive: !1 }), document.addEventListener("mouseup", K), document.addEventListener("touchend", F), document.addEventListener("touchcancel", F), window.addEventListener("resize", Z), t.innerHTML = "", t.appendChild(n), r({
        startDrag: W,
        doDrag: q,
        endDrag: K,
        touchStart: S,
        touchMove: j,
        touchEnd: F,
        onResizeHandler: Z,
        rafId: f
      });
    }, n.onerror = () => i(new Error("画像の読み込みに失敗しました")), n.src = h;
  });
}
function ot(h) {
  ["width", "height", "left", "top", "transform", "transform-origin"].forEach((t) => {
    h.style.removeProperty(t);
  });
}
async function rt(h, t) {
  const s = await fetch(h);
  if (!s.ok)
    throw new Error(`HTTP error! status: ${s.status}`);
  const e = await s.text();
  t.innerHTML = e;
}
function at(h, t) {
  const s = document.querySelector(h);
  if (!s)
    throw new Error(`要素が見つかりません: ${h}`);
  t.innerHTML = s.innerHTML;
}
function lt(h, t) {
  t.innerHTML = h;
}
const ct = "syg-modal:open", ht = "syg-modal:close", u = class u {
  /**
   * 要素をバインドしてクリックイベントを設定（イベント委譲方式）
   * 動的に追加された要素にも自動対応し、重複登録を防ぎます
   * 初めて呼んだときに、window の syg-modal:open / syg-modal:close イベントも受けるようになります
   */
  static bind(t, s = {}) {
    this.boundSelectors.has(t) || (this.boundSelectors.add(t), s.useHistory !== void 0 && (this.useHistory = s.useHistory, this.currentOptions = s), this.setupPopstateListener(), this.setupEventListeners(s), this.delegateListener || (this.delegateListener = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || !(e.target instanceof Element)) return;
      const r = e.target;
      for (const i of this.boundSelectors) {
        const n = r.closest(i);
        if (!n) continue;
        let l = n.getAttribute("data-syg-modal-src");
        if (!l && n.tagName === "A") {
          const m = n;
          l = m.getAttribute("href") || m.href;
        }
        if (l = (l || "").trim(), !l) {
          console.error("data-syg-modal-src または href が指定されていません");
          return;
        }
        const c = n.getAttribute("data-syg-modal"), d = c && c !== "" ? c : this.detectType(l);
        if (!d || d === "youtube" && !J(l)) return;
        e.preventDefault(), this.isRestoringFromHistory = !1, this.open(
          {
            ...s,
            src: l,
            type: d,
            hash: n.hasAttribute("data-syg-modal-hash") || s.hash
          },
          n
        );
        break;
      }
    }, document.addEventListener("click", this.delegateListener, !0)));
  }
  /**
   * window の syg-modal:open / syg-modal:close を受ける
   * バンドルを共有しない構成（webpack のエントリごとなど）で、別のバンドルから開けるようにする
   */
  static setupEventListeners(t) {
    this.bindOptions || (this.bindOptions = t, window.addEventListener(ct, (s) => {
      const e = s.detail || {};
      this.isRestoringFromHistory = !1, this.open({ ...this.bindOptions, ...e }, null);
    }), window.addEventListener(ht, () => {
      this.closeModal();
    }));
  }
  /**
   * popstateリスナーをセットアップ
   */
  static setupPopstateListener() {
    this.popstateListener || (this.popstateListener = (t) => {
      if (this.isClosingByHistory) {
        this.isClosingByHistory = !1;
        return;
      }
      const s = t.state;
      if (this.isRestoringFromHistory = !0, !s || !s.sygModal) {
        this.currentModalUI && this.currentModalUI.isOpen() && this.closeModal();
        return;
      }
      this.currentModalUI && this.currentModalUI.isOpen() && this.historyDepth > 0 && (this.historyDepth -= 1), this.showModal({
        src: s.src,
        type: s.type,
        ...s.options
      });
    }, window.addEventListener("popstate", this.popstateListener));
  }
  /**
   * モーダルを表示
   */
  static showModal(t) {
    this.open(t, null);
  }
  /**
   * モーダルを表示（クリックした要素つき）
   */
  static open(t, s) {
    const { type: e, html: r } = t, i = (t.src || "").trim();
    if (e === "html") {
      if (!r) {
        console.error('type="html"の場合、htmlプロパティが必要です');
        return;
      }
    } else if (!i) {
      console.error("srcが指定されていません");
      return;
    }
    const n = e || this.detectType(i);
    if (!n) {
      console.error("コンテンツタイプが判別できません:", i);
      return;
    }
    if (this.currentModalUI && this.currentModalUI.isOpen()) {
      this.updateContent(i, n, t, s);
      return;
    }
    this.currentOptions = t, this.sessionOptions = t, this.historyDepth = 0;
    const { onOpen: l, onClose: c, onChange: d, onLoad: m, ...I } = t;
    this.currentModalUI = new k({
      ...I,
      onClose: () => {
        this.cleanupImageDragListeners(), this.clearHash(), !this.isRestoringFromHistory && this.historyDepth > 0 && (this.isClosingByHistory = !0, window.history.go(-this.historyDepth)), this.historyDepth = 0, this.isRestoringFromHistory = !1;
        const T = this.currentInfo;
        this.currentInfo = null, c && T && c(T), this.currentModalUI && (this.currentModalUI.destroy(), this.currentModalUI = null);
      }
    }), this.currentModalUI.setType(n), this.currentModalUI.open(), this.currentInfo = { src: i, type: n, trigger: s }, this.pushHistory(i, n, t), this.applyHash(t.hash, i), l && l(this.currentInfo), this.loadContent(i, n, t);
  }
  /**
   * コンテンツタイプを自動判別
   */
  static detectType(t) {
    return G(t) ? "youtube" : /\.(jpe?g|png|gif|webp)$/i.test(t.replace(/[?#].*$/, "")) ? "image" : null;
  }
  /**
   * ハッシュを入れる。指定が無ければ、入れているハッシュを消す
   * history.replaceState で書き換えるので、履歴は増えず hashchange も起きない
   */
  static applyHash(t, s) {
    t && s ? (window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}#${s}`), this.hashActive = !0) : this.clearHash();
  }
  /**
   * 入れているハッシュを消す（# も残さない）
   */
  static clearHash() {
    this.hashActive && (this.hashActive = !1, window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}`));
  }
  /**
   * 画像のドラッグイベントリスナーをクリーンアップ
   */
  static cleanupImageDragListeners() {
    if (!this.imageDragListeners) return;
    const { doDrag: t, endDrag: s, startDrag: e, touchStart: r, touchMove: i, touchEnd: n, onResizeHandler: l, rafId: c } = this.imageDragListeners;
    if (c != null && cancelAnimationFrame(c), this.currentModalUI) {
      const d = this.currentModalUI.getContainer();
      d.removeEventListener("mousedown", e), d.removeEventListener("touchstart", r);
    }
    document.removeEventListener("mousemove", t), document.removeEventListener("touchmove", i), document.removeEventListener("mouseup", s), document.removeEventListener("touchend", n), document.removeEventListener("touchcancel", n), window.removeEventListener("resize", l), this.imageDragListeners = null;
  }
  /**
   * 履歴に状態を追加
   */
  static pushHistory(t, s, e) {
    if (!this.isRestoringFromHistory && (this.useHistory || e.useHistory) && s !== "html" && t) {
      const r = {
        sygModal: !0,
        src: t,
        type: s,
        options: {
          closeButtonContent: e.closeButtonContent || this.currentOptions.closeButtonContent,
          loadingContent: e.loadingContent || this.currentOptions.loadingContent,
          modalClass: e.modalClass || this.currentOptions.modalClass,
          containerClass: e.containerClass || this.currentOptions.containerClass,
          contentClass: e.contentClass || this.currentOptions.contentClass,
          closeBtnClass: e.closeBtnClass || this.currentOptions.closeBtnClass,
          loadingClass: e.loadingClass || this.currentOptions.loadingClass,
          hash: e.hash
        }
      };
      window.history.pushState(r, "", window.location.href), this.historyDepth += 1;
    }
  }
  /**
   * コンテンツを読み込み
   */
  static async loadContent(t, s, e) {
    if (!this.currentModalUI) return;
    const r = this.currentModalUI, i = r.getContent(), n = r.getDialog(), l = r.getContainer();
    let c;
    i.innerHTML = "", r.setLoadingState("loading");
    try {
      switch (s) {
        case "youtube":
          await nt(t, i);
          break;
        case "image":
          this.imageDragListeners = await it(t, i, n, l);
          break;
        case "ajax":
          await rt(t, i);
          break;
        case "selector":
          at(t, i);
          break;
        case "html":
          const m = (e == null ? void 0 : e.html) || t;
          lt(m, i);
          break;
      }
    } catch (m) {
      c = m, console.error("コンテンツの読み込みに失敗しました:", m), i.innerHTML = "<p>コンテンツの取得に失敗しました</p>";
    }
    r.setLoadingState("complete");
    const { onLoad: d } = this.sessionOptions;
    d && this.currentModalUI === r && this.currentInfo && d(c === void 0 ? { ...this.currentInfo } : { ...this.currentInfo, error: c });
  }
  /**
   * コンテンツを更新（モーダルが開いている状態で別のコンテンツに切り替え）
   */
  static updateContent(t, s, e, r) {
    if (!this.currentModalUI) return;
    this.cleanupImageDragListeners(), ot(this.currentModalUI.getContainer()), this.currentModalUI.setType(s), this.currentInfo = { src: t, type: s, trigger: r }, this.pushHistory(t, s, e), this.applyHash(e.hash, t);
    const { onChange: i } = this.sessionOptions;
    i && i(this.currentInfo), this.loadContent(t, s, e);
  }
  /**
   * モーダルを閉じる
   */
  static closeModal() {
    this.currentModalUI && this.currentModalUI.close();
  }
};
u.currentModalUI = null, u.boundSelectors = /* @__PURE__ */ new Set(), u.delegateListener = null, u.imageDragListeners = null, u.popstateListener = null, u.useHistory = !1, u.isRestoringFromHistory = !1, u.currentOptions = {}, u.bindOptions = null, u.sessionOptions = {}, u.currentInfo = null, u.hashActive = !1, u.historyDepth = 0, u.isClosingByHistory = !1;
let V = u;
export {
  V as SygModalDialog
};
//# sourceMappingURL=syg-modal-dialog.es.js.map
