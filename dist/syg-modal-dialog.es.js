let b = null;
function it() {
  if (b) return;
  const r = document.documentElement, t = getComputedStyle(r);
  b = {
    overflow: r.style.overflow,
    height: r.style.height,
    paddingRight: r.style.paddingRight
  };
  const s = window.innerWidth - r.clientWidth, e = t.scrollbarGutter || "";
  if (s > 0 && !e.includes("stable")) {
    const a = parseFloat(t.paddingRight) || 0;
    r.style.paddingRight = `${a + s}px`;
  }
  r.style.overflow = "hidden", r.style.height = "100vh";
}
function ot() {
  if (!b) return;
  const r = document.documentElement;
  r.style.overflow = b.overflow, r.style.height = b.height, r.style.paddingRight = b.paddingRight, b = null;
}
const x = class x {
  constructor(t = {}) {
    const s = {};
    Object.keys(t).forEach((e) => {
      t[e] !== void 0 && (s[e] = t[e]);
    }), this.options = {
      ...x.defaultOptions,
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
    const a = document.createElement("form");
    a.method = "dialog";
    const i = document.createElement("button");
    i.type = "submit", i.className = this.options.closeBtnClass, i.innerHTML = this.options.closeButtonContent, a.appendChild(i);
    const n = document.createElement("div");
    return n.id = "syg-modal-loading", n.className = this.options.loadingClass, n.setAttribute("data-state", "init"), n.innerHTML = this.options.loadingContent, s.appendChild(e), t.appendChild(s), t.appendChild(a), t.appendChild(n), t;
  }
  /**
   * イベントリスナーを設定
   */
  setupEventListeners() {
    this.dialog.addEventListener("click", (t) => {
      t.target === this.dialog && this.close();
    }), this.dialog.addEventListener("close", () => {
      ot(), this.options.onClose && this.options.onClose();
    });
  }
  /**
   * モーダルを開く
   */
  open() {
    this.dialog.parentElement || document.body.appendChild(this.dialog), this.dialog.showModal(), it(), this.options.onOpen && this.options.onOpen();
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
let W = x;
async function rt(r, t) {
  const s = Q(r);
  if (!s)
    throw new Error("YouTube動画IDを取得できませんでした");
  const e = document.createElement("iframe");
  e.src = `https://www.youtube.com/embed/${s}?autoplay=1`, e.width = "560", e.height = "315", e.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture", e.allowFullscreen = !0, e.style.maxWidth = "100%", t.innerHTML = "", t.appendChild(e);
}
function J(r) {
  return /^https?:\/\/(www\.|m\.)?(youtube\.com|youtube-nocookie\.com|youtu\.be)\//i.test(r);
}
function Q(r) {
  if (!J(r)) return null;
  let t;
  try {
    t = new URL(r);
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
  const a = e.match(/^([\w-]{11})(?![\w-])/);
  return (a == null ? void 0 : a[1]) ?? null;
}
async function at(r, t, s, e) {
  return new Promise((a, i) => {
    const n = document.createElement("img");
    n.style.cursor = "pointer", n.onload = () => {
      const c = n.naturalWidth, h = n.naturalHeight, u = s.clientWidth, m = s.clientHeight, M = c / h, O = u / m;
      let v, H;
      M > O ? (v = Math.min(u, c), H = v / M) : (H = Math.min(m, h), v = H * M), e.style.width = `${v}px`, e.style.height = `${H}px`, e.style.left = `${(u - v) / 2}px`, e.style.top = `${(m - H) / 2}px`, e.style.transformOrigin = "0 0";
      let f = !1, C = 0, L = 0, I = 1, E = !1, D = 0, U = 0, B = 0, X = 0, R = 0, $ = 0, g = null, Y = 0, A = 0, N = 0;
      const k = () => {
        e.style.transform = `matrix(${I}, 0, 0, ${I}, ${C}, ${L})`;
      }, S = () => {
        C = Y, L = A, k(), g = null;
      }, P = (o) => {
        Date.now() - N < 500 || o.target !== e && o.target !== n || (E = !0, B = o.clientX, X = o.clientY, D = o.clientX, U = o.clientY, R = C, $ = L, e.style.cursor = f ? "grabbing" : "pointer");
      }, q = (o) => {
        if (o.target !== e && o.target !== n || o.touches.length !== 1) return;
        N = Date.now(), o.preventDefault();
        const l = o.touches[0];
        l && (E = !0, B = l.clientX, X = l.clientY, D = l.clientX, U = l.clientY, R = C, $ = L);
      }, j = (o) => {
        if (!E) return;
        const l = o.clientX - D, p = o.clientY - U;
        f && (Y = R + l, A = $ + p, g === null && (g = requestAnimationFrame(S)));
      }, z = (o) => {
        if (!E || o.touches.length !== 1) return;
        const l = o.touches[0];
        if (!l) return;
        const p = l.clientX - D, T = l.clientY - U;
        f && (o.preventDefault(), Y = R + p, A = $ + T, g === null && (g = requestAnimationFrame(S)));
      }, _ = (o, l) => {
        f = !0, I = c / v;
        const p = s.getBoundingClientRect(), T = o - p.left, y = l - p.top, w = parseFloat(e.style.left), et = parseFloat(e.style.top), st = T - w, nt = y - et;
        C = st * (1 - I), L = nt * (1 - I), e.style.cursor = "grab", k();
      }, tt = () => {
        f = !1, I = 1, C = 0, L = 0, e.style.cursor = "pointer", k();
      }, K = (o, l) => {
        if (!E) return;
        g !== null && (cancelAnimationFrame(g), g = null), Math.sqrt(
          Math.pow(o - B, 2) + Math.pow(l - X, 2)
        ) < 5 ? f ? tt() : _(o, l) : (C = Y, L = A), E = !1, f && (e.style.cursor = "grab");
      }, Z = (o) => {
        K(o.clientX, o.clientY);
      }, V = () => {
        if (f) return;
        const o = s.clientWidth, l = s.clientHeight, p = c / h, T = o / l;
        let y, w;
        p > T ? (y = Math.min(o, c), w = y / p) : (w = Math.min(l, h), y = w * p), e.style.width = `${y}px`, e.style.height = `${w}px`, e.style.left = `${(o - y) / 2}px`, e.style.top = `${(l - w) / 2}px`, v = y, H = w;
      }, F = (o) => {
        if (!E) return;
        o.preventDefault();
        const l = o.changedTouches[0];
        l && K(l.clientX, l.clientY);
      };
      e.addEventListener("mousedown", P), e.addEventListener("touchstart", q, { passive: !1 }), document.addEventListener("mousemove", j), document.addEventListener("touchmove", z, { passive: !1 }), document.addEventListener("mouseup", Z), document.addEventListener("touchend", F), document.addEventListener("touchcancel", F), window.addEventListener("resize", V), t.innerHTML = "", t.appendChild(n), a({
        startDrag: P,
        doDrag: j,
        endDrag: Z,
        touchStart: q,
        touchMove: z,
        touchEnd: F,
        onResizeHandler: V,
        rafId: g
      });
    }, n.onerror = () => i(new Error("画像の読み込みに失敗しました")), n.src = r;
  });
}
function lt(r) {
  ["width", "height", "left", "top", "transform", "transform-origin"].forEach((t) => {
    r.style.removeProperty(t);
  });
}
async function ct(r, t) {
  const s = await fetch(r);
  if (!s.ok)
    throw new Error(`HTTP error! status: ${s.status}`);
  const e = await s.text();
  t.innerHTML = e;
}
function ht(r, t) {
  const s = document.querySelector(r);
  if (!s)
    throw new Error(`要素が見つかりません: ${r}`);
  t.innerHTML = s.innerHTML;
}
function dt(r, t) {
  t.innerHTML = r;
}
const ut = "syg-modal:open", mt = "syg-modal:close", d = class d {
  /**
   * 要素をバインドしてクリックイベントを設定（イベント委譲方式）
   * 動的に追加された要素にも自動対応し、重複登録を防ぎます
   * 初めて呼んだときに、window の syg-modal:open / syg-modal:close イベントも受けるようになります
   */
  static bind(t, s = {}) {
    this.boundSelectors.has(t) || (this.boundSelectors.add(t), s.useHistory !== void 0 && (this.useHistory = s.useHistory, this.currentOptions = s), this.setupPopstateListener(), this.setupEventListeners(s), this.delegateListener || (this.delegateListener = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || !(e.target instanceof Element)) return;
      const a = e.target;
      for (const i of this.boundSelectors) {
        const n = a.closest(i);
        if (!n) continue;
        let c = n.getAttribute("data-syg-modal-src");
        if (!c && n.tagName === "A") {
          const m = n;
          c = m.getAttribute("href") || m.href;
        }
        if (c = (c || "").trim(), !c) {
          console.error("data-syg-modal-src または href が指定されていません");
          return;
        }
        const h = n.getAttribute("data-syg-modal"), u = h && h !== "" ? h : this.detectType(c);
        if (!u || u === "youtube" && !Q(c)) return;
        e.preventDefault(), this.isRestoringFromHistory = !1, this.open(
          {
            ...s,
            src: c,
            type: u,
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
    this.bindOptions || (this.bindOptions = t, window.addEventListener(ut, (s) => {
      const e = s.detail || {};
      this.isRestoringFromHistory = !1, this.open({ ...this.bindOptions, ...e }, null);
    }), window.addEventListener(mt, () => {
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
    const { type: e, html: a } = t, i = (t.src || "").trim();
    if (e === "html") {
      if (!a) {
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
    const { onOpen: c, onClose: h, onChange: u, onLoad: m, ...M } = t;
    this.currentModalUI = new W({
      ...M,
      onClose: () => {
        this.cleanupImageDragListeners(), this.clearHash(), !this.isRestoringFromHistory && this.historyDepth > 0 && (this.isClosingByHistory = !0, window.history.go(-this.historyDepth)), this.historyDepth = 0, this.isRestoringFromHistory = !1;
        const O = this.currentInfo;
        this.currentInfo = null, h && O && h(O), this.currentModalUI && (this.currentModalUI.destroy(), this.currentModalUI = null);
      }
    }), this.currentModalUI.setType(n), this.currentModalUI.open(), this.currentInfo = { src: i, type: n, trigger: s }, this.pushHistory(i, n, t), this.applyHash(t.hash, i), c && c(this.currentInfo), this.loadContent(i, n, t);
  }
  /**
   * コンテンツタイプを自動判別
   */
  static detectType(t) {
    return J(t) ? "youtube" : /\.(jpe?g|png|gif|webp)$/i.test(t.replace(/[?#].*$/, "")) ? "image" : null;
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
    const { doDrag: t, endDrag: s, startDrag: e, touchStart: a, touchMove: i, touchEnd: n, onResizeHandler: c, rafId: h } = this.imageDragListeners;
    if (h != null && cancelAnimationFrame(h), this.currentModalUI) {
      const u = this.currentModalUI.getContainer();
      u.removeEventListener("mousedown", e), u.removeEventListener("touchstart", a);
    }
    document.removeEventListener("mousemove", t), document.removeEventListener("touchmove", i), document.removeEventListener("mouseup", s), document.removeEventListener("touchend", n), document.removeEventListener("touchcancel", n), window.removeEventListener("resize", c), this.imageDragListeners = null;
  }
  /**
   * 履歴に状態を追加
   */
  static pushHistory(t, s, e) {
    if (!this.isRestoringFromHistory && (this.useHistory || e.useHistory) && s !== "html" && t) {
      const a = {
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
      window.history.pushState(a, "", window.location.href), this.historyDepth += 1;
    }
  }
  /**
   * コンテンツを読み込み
   */
  static async loadContent(t, s, e) {
    if (!this.currentModalUI) return;
    const a = this.currentModalUI, i = a.getContent(), n = a.getDialog(), c = a.getContainer();
    let h;
    i.innerHTML = "", a.setLoadingState("loading");
    try {
      switch (s) {
        case "youtube":
          await rt(t, i);
          break;
        case "image":
          this.imageDragListeners = await at(t, i, n, c);
          break;
        case "ajax":
          await ct(t, i);
          break;
        case "selector":
          ht(t, i);
          break;
        case "html":
          const m = (e == null ? void 0 : e.html) || t;
          dt(m, i);
          break;
      }
    } catch (m) {
      h = m, console.error("コンテンツの読み込みに失敗しました:", m), i.innerHTML = "<p>コンテンツの取得に失敗しました</p>";
    }
    a.setLoadingState("complete");
    const { onLoad: u } = this.sessionOptions;
    u && this.currentModalUI === a && this.currentInfo && u(h === void 0 ? { ...this.currentInfo } : { ...this.currentInfo, error: h });
  }
  /**
   * コンテンツを更新（モーダルが開いている状態で別のコンテンツに切り替え）
   */
  static updateContent(t, s, e, a) {
    if (!this.currentModalUI) return;
    this.cleanupImageDragListeners(), lt(this.currentModalUI.getContainer()), this.currentModalUI.setType(s), this.currentInfo = { src: t, type: s, trigger: a }, this.pushHistory(t, s, e), this.applyHash(e.hash, t);
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
d.currentModalUI = null, d.boundSelectors = /* @__PURE__ */ new Set(), d.delegateListener = null, d.imageDragListeners = null, d.popstateListener = null, d.useHistory = !1, d.isRestoringFromHistory = !1, d.currentOptions = {}, d.bindOptions = null, d.sessionOptions = {}, d.currentInfo = null, d.hashActive = !1, d.historyDepth = 0, d.isClosingByHistory = !1;
let G = d;
export {
  G as SygModalDialog
};
//# sourceMappingURL=syg-modal-dialog.es.js.map
