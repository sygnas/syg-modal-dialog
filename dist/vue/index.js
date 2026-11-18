import { defineComponent as h, ref as g, watch as p, onMounted as v, onUnmounted as y, createElementBlock as C, openBlock as k, normalizeClass as d, createElementVNode as c, renderSlot as V, createCommentVNode as _ } from "vue";
let a = null;
function w() {
  if (a) return;
  const e = document.documentElement, s = getComputedStyle(e);
  a = {
    overflow: e.style.overflow,
    height: e.style.height,
    paddingRight: e.style.paddingRight
  };
  const l = window.innerWidth - e.clientWidth, o = s.scrollbarGutter || "";
  if (l > 0 && !o.includes("stable")) {
    const t = parseFloat(s.paddingRight) || 0;
    e.style.paddingRight = `${t + l}px`;
  }
  e.style.overflow = "hidden", e.style.height = "100vh";
}
function i() {
  if (!a) return;
  const e = document.documentElement;
  e.style.overflow = a.overflow, e.style.height = a.height, e.style.paddingRight = a.paddingRight, a = null;
}
const R = { method: "dialog" }, B = ["innerHTML"], b = /* @__PURE__ */ h({
  __name: "SygModalUI",
  props: {
    modelValue: { type: Boolean, default: !1 },
    modalClass: { default: "c-modal" },
    containerClass: { default: "c-modal__container" },
    contentClass: { default: "c-modal__content" },
    closeBtnClass: { default: "c-modal__close-btn" },
    closeButtonContent: { default: "×" }
  },
  emits: ["update:modelValue", "open", "close"],
  setup(e, { emit: s }) {
    const l = e, o = s, t = g(null), u = () => {
      t.value && (t.value.showModal(), w(), o("open"));
    }, r = () => {
      var n;
      (n = t.value) != null && n.open && (t.value.close(), i(), o("update:modelValue", !1), o("close"));
    }, m = (n) => {
      n.target === t.value && r();
    };
    p(() => l.modelValue, (n) => {
      n ? u() : r();
    });
    const f = () => {
      i(), l.modelValue && (o("update:modelValue", !1), o("close"));
    };
    return v(() => {
      l.modelValue && u();
    }), y(() => {
      i();
    }), (n, S) => (k(), C("dialog", {
      ref_key: "dialogRef",
      ref: t,
      class: d(e.modalClass),
      onClick: m,
      onClose: f
    }, [
      c("div", {
        class: d(e.containerClass)
      }, [
        c("div", {
          class: d(e.contentClass)
        }, [
          e.modelValue ? V(n.$slots, "default", { key: 0 }, void 0, !0) : _("", !0)
        ], 2)
      ], 2),
      c("form", R, [
        c("button", {
          type: "submit",
          class: d(e.closeBtnClass),
          innerHTML: e.closeButtonContent
        }, null, 10, B)
      ])
    ], 34));
  }
}), M = (e, s) => {
  const l = e.__vccOpts || e;
  for (const [o, t] of s)
    l[o] = t;
  return l;
}, x = /* @__PURE__ */ M(b, [["__scopeId", "data-v-1a60c999"]]);
export {
  x as SygModalUI
};
//# sourceMappingURL=index.js.map
