const UI = (function () {
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  }
  function fmt(num) { return Number(num || 0).toLocaleString("th-TH"); }

  function atom(html) { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; }

  function colorAvatar(name, seed) {
    const colors = ["#1e7b45", "#d97706", "#2563eb", "#8a3b5c", "#b5722b", "#2e7d8b", "#6b5ce7", "#c0392b"];
    let h = 0;
    const s = String(seed || name || "");
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 997;
    return colors[h % colors.length];
  }
  function avatar(name, cls, seed) {
    return `<div class="avatar ${cls || ""}" style="background:${colorAvatar(name, seed)}">${esc(Store.initials(name))}</div>`;
  }

  function stars(rating, cls) {
    const r = Math.round(rating || 0);
    let out = "";
    for (let i = 1; i <= 5; i++) out += `<span class="${i <= r ? "" : "off"}">★</span>`;
    return `<span class="stars ${cls || ""}" aria-label="คะแนน ${rating||0} จาก 5">${out}</span>`;
  }

  function statusBadge(status) {
    const map = {
      pending: ["badge-warning", "⏳"],
      processing: ["badge-info", "🧺"],
      shipping: ["badge-primary", "🚚"],
      delivered: ["badge-success", "✅"],
      cancelled: ["badge-danger", "✖"],
      active: ["badge-success", "✓"],
      suspended: ["badge-danger", "⛔"],
      approved: ["badge-success", "✓"],
      rejected: ["badge-danger", "✖"],
      hidden: ["badge-outline", "🙈"],
      out: ["badge-danger", "😴"],
    };
    const m = map[status] || ["badge-outline", ""];
    return `<span class="badge ${m[0]}">${m[1]} ${esc(Store.STATUS_LABEL[status] || (status === "active" ? "เปิดใช้งาน" : status === "suspended" ? "ระงับ" : status === "hidden" ? "ซ่อน" : status === "approved" ? "อนุมัติแล้ว" : status === "rejected" ? "ไม่อนุมัติ" : status))}</span>`;
  }

  function pimg(product, cls) {
    return `<div class="${cls || "product-media"}" data-goto="/products/${product.id}" style="background:linear-gradient(135deg,${product.c1},${product.c2})" role="img" aria-label="${esc(product.name)}"><span class="pimg-emoji" style="font-size:inherit">${product.emoji}</span></div>`;
  }

  function stockLine(p) {
    if (p.status !== "active") return `<div class="stock-line out">สินค้าปิดการขายชั่วคราว</div>`;
    if (p.stock <= 0) return `<div class="stock-line out">สินค้าหมดชั่วคราว</div>`;
    if (p.stock < 30) return `<div class="stock-line low">เหลือน้อย เหลือ ${fmt(p.stock)} ${esc(p.unit)}</div>`;
    return `<div class="stock-line ok">มีสินค้าในสต็อก ${fmt(p.stock)} ${esc(p.unit)}</div>`;
  }

  function productCard(p) {
    const store = Store.getStore(p.sellerId);
    const tagsHtml = (p.best || p.featured) ? `<span class="product-badges">${p.best ? '<span class="badge badge-hot">🔥 ขายดี</span>' : ""}${p.featured ? '<span class="badge badge-primary">⭐ แนะนำ</span>' : ""}${p.stock <= 0 ? '<span class="badge badge-danger">สินค้าหมด</span>' : ""}</span>` : `${p.stock <= 0 ? `<span class="product-badges"><span class="badge badge-danger">สินค้าหมด</span></span>` : ""}`;
    return `
      <article class="product-card">
        <a href="#/products/${p.id}" class="product-media" style="background:linear-gradient(135deg,${p.c1},${p.c2})">
          ${tagsHtml}
          <span style="font-size:74px;line-height:1">${p.emoji}</span>
        </a>
        <div class="product-body">
          <div class="product-store"><span class="dot" style="background:${store ? store.c1 : "#999"}"></span>${esc(store ? store.name : "ร้านค้า")}</div>
          <h3 class="product-name"><a href="#/products/${p.id}">${esc(p.name)}</a></h3>
          <div class="product-meta">${stars(p.rating)} <span>${Number(p.rating||0).toFixed(1)}</span> · ขายแล้ว ${fmt(p.sold)} ${esc(p.unit)}</div>
          ${stockLine(p)}
          <div class="product-foot">
            <div class="price">${Store.currency(p.price)} <small>/ ${esc(p.unit)}</small></div>
            <button class="add-cart" data-add="${p.id}" aria-label="เพิ่มลงตะกร้า" ${p.status !== "active" || p.stock <= 0 ? "disabled" : ""} title="เพิ่มลงตะกร้า">＋</button>
          </div>
        </div>
      </article>`;
  }

  function skeletonCards(n) {
    return Array.from({ length: n || 8 }, () => `<div class="skeleton skeleton-card"></div>`).join("");
  }

  function loadingBox(text) {
    return `<div class="loading-box"><div class="spinner"></div><span>${esc(text || "กำลังโหลดข้อมูล...")}</span></div>`;
  }
  function emptyState(icon, title, sub, actions) {
    return `<div class="empty-state"><div class="ico">${icon}</div><h3>${esc(title)}</h3>${sub ? `<p>${esc(sub)}</p>` : ""}${actions || ""}</div>`;
  }
  function errorState(title, sub, actions) {
    return `<div class="error-state"><div class="ico">⚠️</div><h3>${esc(title)}</h3>${sub ? `<p>${esc(sub)}</p>` : ""}${actions || ""}</div>`;
  }

  function toast(msg, type) {
    let root = $("#toastRoot");
    if (!root) { root = document.createElement("div"); root.className = "toast-root"; document.body.appendChild(root); }
    const el = atom(`<div class="toast ${type === "success" ? "toast-success" : type === "danger" ? "toast-danger" : type === "warning" ? "toast-warning" : ""}"><span class="ico">${type === "success" ? "✅" : type === "danger" ? "❌" : type === "warning" ? "⚠️" : "ℹ️"}</span><span>${esc(msg)}</span></div>`);
    root.appendChild(el);
    const t = setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 260); }, 2600);
    el.addEventListener("click", () => { clearTimeout(t); el.classList.add("out"); setTimeout(() => el.remove(), 260); });
  }

  function alertBox(type, msg, opts) {
    const icon = { info: "ℹ️", success: "✅", warning: "⚠️", danger: "⛔" }[type] || "ℹ️";
    return `<div class="alert alert-${type}"><span class="ico">${icon}</span><div>${msg}</div>${opts && opts.closable ? '<button class="alert-close" data-close>✕</button>' : ""}</div>`;
  }

  function modal(html, cls) {
    const root = $("#modalRoot");
    const backdrop = atom(`<div class="modal-backdrop" role="dialog" aria-modal="true"><div class="modal ${cls || ""}">${html}</div></div>`);
    root.appendChild(backdrop);
    function close() { backdrop.remove(); document.removeEventListener("keydown", escKey); }
    function escKey(e) { if (e.key === "Escape") close(); }
    document.addEventListener("keydown", escKey);
    backdrop.addEventListener("click", (e) => { if (e.target === backdrop) close(); });
    const x = $("button[data-close-modal]", backdrop);
    if (x) x.addEventListener("click", close);
    return { el: backdrop, close };
  }
  function confirmModal(title, heading, body, onOk, dangerText) {
    const m = modal(`
      <div class="modal-head"><h3>${esc(title)}</h3><button class="modal-close" data-close-modal>✕</button></div>
      <div class="modal-body">
        ${heading ? `<div class="strong mb-3" style="font-size:15px">${esc(heading)}</div>` : ""}
        <div class="muted" style="font-size:14px">${body}</div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" data-cancel>ยกเลิก</button>
        <button class="btn ${dangerText ? "btn-danger" : "btn-primary"}" data-ok>${esc(dangerText || "ยืนยัน")}</button>
      </div>`);
    $("[data-cancel]", m.el).addEventListener("click", m.close);
    $("[data-ok]", m.el).addEventListener("click", () => { m.close(); onOk(); });
    return m;
  }

  function bindRows(container) {
    container.addEventListener("click", (e) => {
      const target = e.target.closest("[data-goto]");
      if (target) { e.preventDefault(); location.hash = target.getAttribute("data-goto"); return; }
    });
  }

  function groupByStore(lines) {
    const map = {};
    lines.forEach((l) => { (map[l.store || l.sellerId] = map[l.store || l.sellerId] || []).push(l); });
    return map;
  }

  function field(id, label, opts) {
    const type = opts.type || "text";
    const ph = opts.ph || "";
    const value = opts.value != null ? ` value="${esc(opts.value)}"` : "";
    const sel = opts.options ? `<option value="" ${opts.value ? "" : "selected"}>${esc(opts.placeholder || "เลือก")}</option>` + opts.options.map((o) => `<option value="${esc(o.value)}" ${String(opts.value) === String(o.value) ? "selected" : ""}>${esc(o.label)}</option>`).join("") : "";
    const msg = opts.msg || "กรุณากรอกข้อมูลนี้";
    const control = type === "textarea"
      ? `<textarea class="textarea" id="${id}" placeholder="${esc(ph)}">${esc(opts.value || "")}</textarea>`
      : type === "select"
        ? `<select class="select" id="${id}">${sel}</select>`
        : `<input class="input" id="${id}" type="${type}" placeholder="${esc(ph)}"${value} ${opts.min ? `min="${opts.min}"` : ""} ${opts.max ? `max="${opts.max}"` : ""}>`;
    return `<div class="field" data-field="${id}"><label class="label" for="${id}">${esc(label)} ${opts.required ? '<span class="text-danger">*</span>' : ""}</label>${control}<div class="field-msg">${esc(msg)}</div></div>`;
  }

  function validate(formRoot, list) {
    let ok = true;
    list.forEach((id) => {
      const el = $("#" + id, formRoot);
      const f = el && el.closest(".field");
      if (!el) return;
      const raw = el.value.trim();
      const valid = raw.length > 0;
      if (!valid) { if (f) f.classList.add("invalid"); ok = false; }
      else if (f) f.classList.remove("invalid");
    });
    return ok;
  }

  function barChart(weeks) {
    const max = Math.max(...weeks.map((w) => w.sum), 1);
    return `<div class="bar-chart">${weeks.map((w) => `
      <div class="bar-col">
        <div class="bar-value">${w.sum ? Math.round(w.sum / 1000) + "k" : ""}</div>
        <div class="bar" style="height:${Math.max(4, Math.round((w.sum / max) * 100))}%"></div>
        <div class="bar-label">${w.label}</div>
      </div>`).join("")}</div>`;
  }

  function donutChart(entries, title, totalLabel) {
    const total = entries.reduce((s, e) => s + e[1], 0) || 1;
    const parts = entries.slice(0, 5);
    const colors = ["#1e7b45", "#d97706", "#2563eb", "#8a3b5c", "#2e7d8b"];
    let acc = 0;
    const legend = parts.map((e, i) => {
      const frac = (e[1] / total) * 100;
      const segStart = acc;
      acc += frac;
      return `<div class="li"><span class="dot" style="background:${colors[i % colors.length]}"></span><span>${esc(e[0])}</span><span class="val">${Math.round(frac)}%</span></div>`;
    }).join("");
    const firstFrac = parts.length ? (parts[0][1] / total) * 100 : 0;
    return `<div style="display:flex;gap:24px;align-items:center;flex-wrap:wrap">
      <div class="donut" style="--val:${firstFrac};--c:${colors[0]}">
        <div class="donut-inner"><b>${esc(title)}</b><span>${esc(totalLabel || "ทั้งหมด")}</span></div>
      </div>
      <div class="legend" style="flex:1;min-width:140px">${legend}</div>
    </div>`;
  }

  function breadcrumb(items) {
    return `<div class="small muted mb-3" style="display:flex;gap:6px;flex-wrap:wrap">${items.map((it, i) => `${i ? '<span style="color:var(--faint)">/</span>' : ""}<a href="${it.href}" style="color:${it.current ? "var(--primary)" : "var(--muted)"}">${esc(it.label)}</a>`).join("")}</div>`;
  }

  return {
    $, $$, esc, fmt, atom, toast, alertBox, modal, confirmModal,
    avatar, stars, statusBadge, pimg, stockLine, productCard,
    skeletonCards, loadingBox, emptyState, errorState,
    field, validate, bindRows, groupByStore,
    barChart, donutChart, breadcrumb,
  };
})();

const $ = UI.$, $$ = UI.$$, _q = UI.$, _qa = UI.$$,
  esc = UI.esc, fmt = UI.fmt, toast = UI.toast, statusBadge = UI.statusBadge, stockLine = UI.stockLine;