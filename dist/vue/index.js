import { defineComponent as r, ref as f, watch as C, onMounted as h, onUnmounted as v, createElementBlock as y, openBlock as g, normalizeClass as a, createElementVNode as s, renderSlot as p, createCommentVNode as V } from "vue";
const _ = { method: "dialog" }, k = ["innerHTML"], B = /* @__PURE__ */ r({
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
  setup(e, { emit: c }) {
    const n = e, l = c, t = f(null), d = () => {
      t.value && (t.value.showModal(), document.documentElement.style.overflow = "hidden", document.documentElement.style.height = "100vh", l("open"));
    }, u = () => {
      var o;
      (o = t.value) != null && o.open && (t.value.close(), document.documentElement.style.overflow = "", document.documentElement.style.height = "", l("update:modelValue", !1), l("close"));
    }, m = (o) => {
      o.target === t.value && u();
    };
    C(() => n.modelValue, (o) => {
      o ? d() : u();
    });
    const i = () => {
      n.modelValue && (l("update:modelValue", !1), l("close"));
    };
    return h(() => {
      n.modelValue && d();
    }), v(() => {
      document.documentElement.style.overflow = "", document.documentElement.style.height = "";
    }), (o, M) => (g(), y("dialog", {
      ref_key: "dialogRef",
      ref: t,
      class: a(e.modalClass),
      onClick: m,
      onClose: i
    }, [
      s("div", {
        class: a(e.containerClass)
      }, [
        s("div", {
          class: a(e.contentClass)
        }, [
          e.modelValue ? p(o.$slots, "default", { key: 0 }, void 0, !0) : V("", !0)
        ], 2)
      ], 2),
      s("form", _, [
        s("button", {
          type: "submit",
          class: a(e.closeBtnClass),
          innerHTML: e.closeButtonContent
        }, null, 10, k)
      ])
    ], 34));
  }
}), E = (e, c) => {
  const n = e.__vccOpts || e;
  for (const [l, t] of c)
    n[l] = t;
  return n;
}, b = /* @__PURE__ */ E(B, [["__scopeId", "data-v-d8c4186d"]]);
export {
  b as SygModalUI
};
//# sourceMappingURL=index.js.map
