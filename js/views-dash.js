const Fav = {
  key: "lileud_favs",
  list() { try { return JSON.parse(localStorage.getItem(this.key)) || []; } catch (e) { return []; } },
  has(id) { return this.list().includes(Number(id)); },
  toggle(id) {
    const l = this.list(); const n = Number(id);
    const i = l.indexOf(n);
    if (i >= 0) l.splice(i, 1); else l.push(n);
    localStorage.setItem(this.key, JSON.stringify(l));
    return i < 0;
  },
  products() { return this.list().map((id) => Store.getProduct(id)).filter(Boolean); },
};

const DashShell = {
  menus: {
    owner: () => [
      { key: "overview", href: "#/dash/owner", icon: "📊", label: "ภาพรวมระบบ" },
      { key: "accounts", href: "#/dash/owner/accounts", icon: "👤", label: "บัญชีผู้ใช้งาน" },
      { key: "sellers", href: "#/dash/owner/sellers", icon: "🏪", label: "ผู้ขาย / ร้านค้า" },
      { key: "buyers", href: "#/dash/owner/buyers", icon: "🛒", label: "ผู้ซื้อ" },
      { key: "products", href: "#/dash/owner/products", icon: "🍎", label: "สินค้า" },
      { key: "orders", href: "#/dash/owner/orders", icon: "📦", label: "คำสั่งซื้อ" },
      { key: "sales", href: "#/dash/owner/sales", icon: "💰", label: "ยอดขาย" },
      { key: "reports", href: "#/dash/owner/reports", icon: "📈", label: "รายงานภาพรวม" },
      { key: "health", href: "#/dash/owner/health", icon: "🩺", label: "สุขภาพระบบ" },
    ],
    admin: () => [
      { key: "overview", href: "#/dash/admin", icon: "📊", label: "ภาพรวมระบบ" },
      { key: "users", href: "#/dash/admin/users", icon: "👥", label: "จัดการผู้ใช้", badge: () => Store.getUsers().filter((u) => u.role === "buyer" && u.createdAt >= "2569-09-01").length },
      { key: "sellers", href: "#/dash/admin/sellers", icon: "✅", label: "อนุมัติผู้ขาย", badge: () => STORES.filter((s) => s.status === "pending").length },
      { key: "products", href: "#/dash/admin/products", icon: "🍎", label: "จัดการสินค้า" },
      { key: "categories", href: "#/dash/admin/categories", icon: "🗂️", label: "หมวดหมู่สินค้า" },
      { key: "orders", href: "#/dash/admin/orders", icon: "📦", label: "คำสั่งซื้อ" },
      { key: "settings", href: "#/dash/admin/settings", icon: "⚙️", label: "ตั้งค่าเว็บไซต์" },
      { key: "reports", href: "#/dash/admin/reports", icon: "📈", label: "รายงานระบบ" },
    ],
    seller: () => [
      { key: "overview", href: "#/dash/seller", icon: "📊", label: "ภาพรวมร้าน" },
      { key: "store", href: "#/dash/seller/store", icon: "🏪", label: "ร้านค้าของฉัน" },
      { key: "products", href: "#/dash/seller/products", icon: "🍎", label: "จัดการสินค้า" },
      { key: "orders", href: "#/dash/seller/orders", icon: "📦", label: "คำสั่งซื้อ", badge: () => Store.getOrders().filter((o) => o.sellerId === Store.currentUser().storeId && o.status === "pending").length },
      { key: "sales", href: "#/dash/seller/sales", icon: "💰", label: "ยอดขาย" },
    ],
    buyer: () => [
      { key: "overview", href: "#/dash/buyer", icon: "📊", label: "ภาพรวม" },
      { key: "favorites", href: "#/dash/buyer/favorites", icon: "❤️", label: "สินค้าที่สนใจ" },
      { key: "orders", href: "#/orders", icon: "📦", label: "ประวัติคำสั่งซื้อ" },
      { key: "profile", href: "#/profile", icon: "👤", label: "โปรไฟล์" },
    ],
  },

  build(user, activeKey, menuKey, contentHtml, opts) {
    opts = opts || {};
    const items = this.menus[menuKey]();
    const pendingBadges = {};
    items.forEach((it) => { if (it.badge) pendingBadges[it.key] = it.badge(); });
    const menuHtml = items.map((it) => `
      <a class="sidebar-link ${activeKey === it.key ? "active" : ""} ${it.badge ? "badge-dot" : ""}" href="${it.href}" data-count="${it.badge ? pendingBadges[it.key] : ""}">
        <span class="ico">${it.icon}</span><span>${esc(it.label)}</span>
      </a>`).join("");
    const roleLabel = Store.ROLE_LABEL[user.role];
    const content = (opts.title ? `<div class="dash-title">${esc(opts.title)}</div>` : "") + (opts.sub ? `<div class="dash-sub">${esc(opts.sub)}</div>` : "") + contentHtml;
    const html = `
      <div class="dash-layout">
        <aside class="dash-sidebar">
          <div class="sidebar-brand">
            <div class="brand-logo" style="width:38px;height:38px;font-size:19px">🌾</div>
            <div><div class="brand-name" style="font-size:14px">${esc(SHOP.name)}</div><div class="brand-sub">${esc(roleLabel)}</div></div>
          </div>
          <div class="sidebar-section">เมนูระบบ</div>
          ${menuHtml}
          <div class="sidebar-link" data-out="1" style="color:var(--danger)"><span class="ico">🚪</span><span>ออกจากระบบ</span></div>
          <div class="sidebar-user">
            ${UI.avatar(user.name, "avatar-sm", user.username)}
            <div style="min-width:0"><div class="u-name truncate">${esc(user.name)}</div><div class="u-role">@${esc(user.username)} · ${esc(roleLabel)}</div></div>
          </div>
        </aside>
        <div class="dash-main">
          <div class="dash-topbar">
            <button class="icon-btn" id="dashMenuBtn" aria-label="เมนู" style="border-radius:10px;color:var(--text)">☰</button>
            <span class="strong" style="font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${opts.title ? esc(opts.title) : "Dashboard"}</span>
            <span class="spacer"></span>
            <button class="icon-btn" id="dashThemeBtn" title="สลับธีม" aria-label="สลับธีม">${Store.getTheme() === "light" ? "🌙" : "☀️"}</button>
            <button class="icon-btn" data-goto="/profile" title="โปรไฟล์" aria-label="โปรไฟล์">👤</button>
          </div>
          <div class="dash-mobile-menu" id="dashMobileMenu"></div>
          <div class="dash-content">${content}</div>
        </div>
      </div>`;
    return {
      title: opts.title,
      html,
      init(container) {
        const mm = _q("#dashMobileMenu", container);
        if (mm) {
          mm.innerHTML = `<div class="chip-row" style="padding:10px 16px;background:var(--surface);border-bottom:1px solid var(--border);overflow-x:auto;flex-wrap:nowrap;display:flex">${items.map((it) => `<a class="chip ${activeKey === it.key ? "active" : ""}" href="${it.href}" style="flex:none">${it.icon} ${esc(it.label)}</a>`).join("")}</div>`;
        }
        const themeBtn = _q("#dashThemeBtn", container);
        if (themeBtn) themeBtn.addEventListener("click", () => { Store.toggleTheme(); Router.reload(); });
        const out = _q('[data-out="1"]', container);
        if (out) out.addEventListener("click", () => {
          UI.confirmModal("ออกจากระบบ", "ต้องการออกจากระบบหรือไม่?", "", () => { Store.logout(); location.hash = "#/"; });
        });
        const menuBtn = _q("#dashMenuBtn", container);
        if (menuBtn && window.innerWidth <= 767) {
          menuBtn.addEventListener("click", () => {
            const mm = _q("#dashMobileMenu", container);
            if (mm) mm.style.display = mm.style.display === "none" ? "block" : "none";
          });
        }
        if (opts.init) opts.init(container);
      },
    };
  },
};

function statCard(icon, value, label, color, trend) {
  const pal = { green: ["var(--primary)", "var(--primary-soft)"], amber: ["var(--accent)", "var(--accent-soft)"], blue: ["var(--info)", "var(--info-soft)"], red: ["var(--danger)", "var(--danger-soft)"], purple: ["#8a3b5c", "#e8d4e0"] };
  const c = pal[color] || pal.green;
  return `
    <div class="stat-card">
      <div class="stat-ico" style="background:${c[1]}">${icon}</div>
      <div class="stat-value">${value}</div>
      <div class="stat-label">${esc(label)}</div>
      ${trend ? `<div class="stat-trend ${trend[0] === "up" ? "trend-up" : "trend-down"}">${trend[0] === "up" ? "▲" : "▼"} ${esc(trend[1])}</div>` : ""}
    </div>`;
}

function recentOrdersTable(orders, limit) {
  const list = (orders || []).slice(0, limit || 6);
  if (!list.length) return UI.emptyState("📦", "ยังไม่มีคำสั่งซื้อ", "คำสั่งซื้อจะแสดงที่นี่");
  return `<div class="table-wrap"><table class="table">
    <thead><tr><th>หมายเลขคำสั่งซื้อ</th><th>วันที่</th><th>ร้านค้า</th><th>ลูกค้า</th><th>ยอดรวม</th><th>สถานะ</th></tr></thead>
    <tbody>${list.map((o) => {
      const store = Store.getStore(o.sellerId);
      return `<tr>
        <td class="cell-compact strong">#${esc(o.no)}</td>
        <td class="cell-compact small muted">${esc(o.date)}</td>
        <td class="cell-compact small">${store ? store.emoji + " " + esc(store.name) : "-"}</td>
        <td class="cell-compact small">${esc(o.buyerName)}</td>
        <td class="cell-compact strong">${Store.currency(o.total)}</td>
        <td class="cell-compact">${statusBadge(o.status)}</td>
      </tr>`; }).join("")}
    </tbody></table></div>`;
}

function bestSellersTable(list) {
  if (!list || !list.length) return UI.emptyState("🏆", "ยังไม่มีข้อมูลยอดขาย", "");
  return `<div class="table-wrap"><table class="table">
    <thead><tr><th>#</th><th>สินค้า</th><th>ร้านค้า</th><th>ราคา</th><th>ยอดขาย (ชิ้น)</th><th>รายได้</th></tr></thead>
    <tbody>${list.map((x, i) => `
      <tr>
        <td class="cell-compact">${i + 1}</td>
        <td class="cell-compact"><a href="#/products/${x.product.id}">${x.product.emoji} ${esc(x.product.name)}</a></td>
        <td class="cell-compact small muted">${esc((Store.getStore(x.product.sellerId) || {}).name || "-")}</td>
        <td class="cell-compact">${Store.currency(x.product.price)}/${esc(x.product.unit)}</td>
        <td class="cell-compact strong">${fmt(x.qty)}</td>
        <td class="cell-compact">${Store.currency(x.revenue)}</td>
      </tr>`).join("")}
    </tbody></table></div>`;
}

function dashWrapper(loader, initBody) {
  return { html: `<div class="dash-loading">${UI.skeletonCards(8)}</div><div class="mt-4">${UI.loadingBox("กำลังโหลดข้อมูล...")}</div>`, init(c) {
    const root = _q(".dash-content", c);
    if (!root) { if (initBody) initBody(c); return; }
    setTimeout(() => { if (initBody) initBody(root); }, 320);
  } };
}

/* ==================== หน้า dashboards (overview) ==================== */

function OwnerDashView() {
  const user = Store.currentUser();
  const c = Store.counts();
  const weekly = Store.weeklyRevenue(8);
  const catSales = Store.salesByCategory();
  const best = Store.bestSellers(5);
  const recent = Store.getOrders().sort((a, b) => (b.dateISO || "").localeCompare(a.dateISO || ""));
  Store.counts();
  const content = dashWrapper(null, (container) => {
    container.innerHTML = `
      ${c.pendingStores ? UI.alertBox("warning", `<b>${fmt(c.pendingStores)} ร้านค้า</b> กำลังรอการตรวจสอบอนุญาตจากผู้ดูแลระบบ`, { closable: true }) : ""}
      <div class="dash-grid">
        ${statCard("👥", fmt(c.users), "ผู้ใช้ทั้งหมด", "green")}
        ${statCard("🏪", fmt(c.stores), "ร้านค้าที่เปิดขาย", "amber")}
        ${statCard("🍎", fmt(c.products), "สินค้าที่ขายอยู่", "blue")}
        ${statCard("📦", fmt(c.orders), "คำสั่งซื้อทั้งหมด", "purple")}
        ${statCard("💰", Store.currency(c.revenue), "ยอดขายรวม", "green", ["up", "8.2% จากเดือนก่อน"])}
        ${statCard("⭐", fmt(c.reviews), "รีวิวทั้งหมด", "amber")}
        ${statCard("🧑‍🌾", fmt(c.sellers), "ผู้ขาย", "blue")}
        ${statCard("🛒", fmt(c.buyers), "ผู้ซื้อ", "purple")}
      </div>
      <div class="grid" style="grid-template-columns:1.4fr 1fr;gap:20px;margin-bottom:20px">
        <div class="card"><div class="card-head"><div class="card-title" style="margin:0">ยอดขายรายสัปดาห์ (8 สัปดาห์ล่าสุด)</div></div><div class="card-pad">${UI.barChart(weekly)}</div></div>
        <div class="card"><div class="card-head"><div class="card-title" style="margin:0">สัดส่วนยอดขายตามหมวดหมู่</div></div><div class="card-pad">${UI.donutChart(catSales, "ยอดขาย", "ภาพรวม")}</div></div>
      </div>
      <div class="grid" style="grid-template-columns:1.5fr 1fr;gap:20px;align-items:start">
        <div class="card"><div class="card-head"><div class="card-title" style="margin:0">คำสั่งซื้อล่าสุด</div><a class="small" href="#/dash/owner/orders">ดูทั้งหมด →</a></div><div class="card-pad" style="padding-top:8px">${recentOrdersTable(recent, 6)}</div></div>
        <div class="card"><div class="card-head"><div class="card-title" style="margin:0">สินค้าขายดี</div></div><div class="card-pad" style="padding-top:8px">${bestSellersTable(best)}</div></div>
      </div>`;
  });
  return DashShell.build(user, "overview", "owner", content.html, { title: "ภาพรวมระบบ", sub: "ภาพรวมการทำงานทั้งหมดของตลาดเกษตรกรบ้านลีเล็ด", init: content.init });
}

function AdminDashView() {
  const user = Store.currentUser();
  const c = Store.counts();
  const newMembers = Store.getUsers().filter((u) => u.role === "buyer" && u.createdAt >= "2569-08-20");
  const pendingShops = STORES.filter((s) => s.status === "pending");
  const weekly = Store.weeklyRevenue(8);
  const recent = Store.getOrders().sort((a, b) => (b.dateISO || "").localeCompare(a.dateISO || ""));
  const content = dashWrapper(null, (container) => {
    container.innerHTML = `
      ${pendingShops.length ? UI.alertBox("warning", `มี <b>${fmt(pendingShops.length)} ร้านค้า</b> รอการอนุมัติ และสมาชิกใหม่ <b>${fmt(newMembers.length)}</b> ราย ตรวจสอบได้จากเมนูด้านข้าง`, { closable: true }) : ""}
      <div class="dash-grid">
        ${statCard("👥", fmt(c.users), "ผู้ใช้ทั้งหมด", "green")}
        ${statCard("🆕", fmt(newMembers.length), "สมาชิกใหม่ล่าสุด", "amber")}
        ${statCard("🏪", fmt(c.stores), "ร้านค้า", "blue")}
        ${statCard("⏳", fmt(c.pendingStores), "รออนุมัติ", "red")}
        ${statCard("🍎", fmt(c.products), "สินค้า", "amber")}
        ${statCard("📦", fmt(c.orders), "คำสั่งซื้อ", "purple")}
        ${statCard("💰", Store.currency(c.revenue), "ยอดขายรวม", "green")}
        ${statCard("⭐", fmt(c.reviews), "รีวิว", "blue")}
      </div>
      <div class="grid" style="grid-template-columns:1.4fr 1fr;gap:20px;margin-bottom:20px">
        <div class="card"><div class="card-head"><div class="card-title" style="margin:0">ยอดขายรายสัปดาห์</div></div><div class="card-pad">${UI.barChart(weekly)}</div></div>
        <div class="card">
          <div class="card-head"><div class="card-title" style="margin:0">ร้านค้ารออนุมัติ</div><a class="small" href="#/dash/admin/sellers">เปิดดู →</a></div>
          <div class="card-pad stack">
            ${pendingShops.length ? pendingShops.map((s) => `
              <div class="row">
                <span class="avatar avatar-sm" style="background:linear-gradient(135deg,${s.c1},${s.c2})">${s.emoji}</span>
                <div style="flex:1;min-width:0"><div class="truncate strong" style="font-size:13.5px">${esc(s.name)}</div><div class="small muted">${esc(s.owner)} · ยื่นเมื่อ ${esc(s.requestedAt || "-")}</div></div>
                <a class="btn btn-primary btn-sm" href="#/dash/admin/sellers">อนุมัติ</a>
              </div>`).join("") : `<div class="empty-state" style="padding:24px"><div class="ico">✅</div><h3>ไม่มีรออนุมัติ</h3></div>`}
          </div>
        </div>
      </div>
      <div class="card"><div class="card-head"><div class="card-title" style="margin:0">คำสั่งซื้อล่าสุด</div><a class="small" href="#/dash/admin/orders">ดูทั้งหมด →</a></div><div class="card-pad" style="padding-top:8px">${recentOrdersTable(recent, 6)}</div></div>`;
  });
  return DashShell.build(user, "overview", "admin", content.html, { title: "ภาพรวมระบบ", sub: "ภาพรวมสมาชิก ร้านค้า สินค้า และคำสั่งซื้อ", init: content.init });
}

function SellerDashView() {
  const user = Store.currentUser();
  const store = Store.getStore(user.storeId);
  const sid = user.storeId;
  const orders = Store.getOrders().filter((o) => o.sellerId === sid);
  const revenue = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const soldUnits = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.items.reduce((a, i) => a + i.qty, 0), 0);
  const products = Store.storeProducts(sid, true);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock < 30);
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const weekly = Store.weeklyRevenue(8, sid);
  const best = Store.bestSellers(5, sid);

  if (!store || (store.status !== "active")) {
    const msg = store && store.status === "pending" ? "บัญชีผู้ขายของคุณกำลังรอการอนุมัติจากผู้ดูแลระบบ" : store && store.status === "suspended" ? "ร้านค้าของคุณถูกระงับการใช้งานชั่วคราว" : "ไม่พบข้อมูลร้านค้า";
    return DashShell.build(user, "overview", "seller",
      `<div class="card card-pad center" style="text-align:center;max-width:520px;margin:40px auto">
        <div style="font-size:56px">${store.status === "pending" ? "⏳" : "⛔"}</div>
        <h3 style="font-size:18px;margin:12px 0 6px">${store.status === "pending" ? "รอการอนุมัติร้านค้า" : "ร้านค้าถูกระงับ"}</h3>
        <p class="muted small">${esc(msg)}</p>
        ${store.status === "pending" ? `<p class="small muted">โดยปกติใช้เวลาตรวจสอบ 1-3 วัน ท่านสามารถตรวจสอบสถานะได้ที่นี่</p>` : ""}
      </div>`,
      { title: "ภาพรวมร้านค้า", sub: "สถานะร้านค้าของคุณ" });
  }

  const content = dashWrapper(null, (container) => {
    container.innerHTML = `
      <div class="grid" style="grid-template-columns:.9fr 2.1fr;gap:20px;margin-bottom:20px;align-items:start">
        <div class="card card-pad">
          <div class="center" style="text-align:center">
            <span class="avatar avatar-lg" style="background:linear-gradient(135deg,${store.c1},${store.c2});font-size:26px">${store.emoji}</span>
            <div class="strong" style="font-size:16px;margin-top:10px">${esc(store.name)}</div>
            <div class="small muted">${esc(store.owner)} · สมาชิกตั้งแต่ ${esc(store.since)}</div>
            <div style="margin-top:10px">${UI.stars(store.rating || 0)} <span class="small muted">${Number(store.rating || 0).toFixed(1)}/5</span></div>
          </div>
        </div>
        <div class="dash-grid" style="margin:0">
          ${statCard("💰", Store.currency(revenue), "ยอดขายรวม", "green")}
          ${statCard("📦", fmt(orders.filter((o) => o.status !== "cancelled").length), "ออเดอร์สำเร็จ", "blue")}
          ${statCard("🧺", fmt(soldUnits), "สินค้าที่ขายได้", "amber")}
          ${statCard("⏳", fmt(pendingCount), "รอรับออเดอร์", "red")}
        </div>
      </div>
      ${lowStock.length ? UI.alertBox("danger", `มีสินค้า <b>${fmt(lowStock.length)} รายการ</b> เหลือน้อยกว่า 30 หน่วย ควรเติมสต็อก`, { closable: true }) : ""}
      <div class="grid" style="grid-template-columns:1.5fr 1fr;gap:20px;margin-bottom:20px;align-items:start">
        <div class="card"><div class="card-head"><div class="card-title" style="margin:0">ยอดขาย 8 สัปดาห์ล่าสุด</div></div><div class="card-pad">${UI.barChart(weekly)}</div></div>
        <div class="card"><div class="card-head"><div class="card-title" style="margin:0">สินค้าขายดีของร้าน</div></div><div class="card-pad" style="padding-top:8px">${bestSellersTable(best)}</div></div>
      </div>
      <div class="card"><div class="card-head"><div class="card-title" style="margin:0">คำสั่งซื้อล่าสุด</div><a class="small" href="#/dash/seller/orders">จัดการทั้งหมด →</a></div><div class="card-pad" style="padding-top:8px">${recentOrdersTable(orders, 5)}</div></div>`;
  });
  return DashShell.build(user, "overview", "seller", content.html, { title: "ภาพรวมร้านค้า", sub: `ยอดขาย สินค้า และคำสั่งซื้อของ ${store.name}`, init: content.init });
}

function BuyerDashView() {
  const user = Store.currentUser();
  const orders = Store.getOrders().filter((o) => o.buyerId === user.id).sort((a, b) => (b.dateISO || "").localeCompare(a.dateISO || ""));
  const active = orders.filter((o) => ["pending", "processing", "shipping"].includes(o.status));
  const spent = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const favs = Fav.products();
  const stats = orders.length ? [
    { icon: "🧾", value: fmt(orders.length), label: "คำสั่งซื้อทั้งหมด" },
    { icon: "🚚", value: fmt(active.length), label: "กำลังดำเนินการ" },
    { icon: "✅", value: fmt(orders.filter((o) => o.status === "delivered").length), label: "ได้รับสินค้าแล้ว" },
    { icon: "💰", value: Store.currency(spent), label: "ใช้จ่ายรวม" },
  ] : [];
  const content = dashWrapper(null, (container) => {
    container.innerHTML = `
      <div class="dash-grid">
        ${stats.length ? stats.map((s) => statCard(s.icon, s.value, s.label, "green")).join("") : ""}
        ${!orders.length ? statCard("👋", "สวัสดี", "สมัครแล้วยังไม่สั่งซื้อ ลองช้อป!", "amber") : ""}
        ${statCard("❤️", fmt(favs.length), "สินค้าที่สนใจ", "purple")}
      </div>
      ${favs.length ? `
      <div class="card" style="margin-bottom:20px">
        <div class="card-head"><div class="card-title" style="margin:0">สินค้าที่สนใจ</div><a class="small" href="#/dash/buyer/favorites">จัดการ →</a></div>
        <div class="card-pad"><div class="grid-products" style="grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px">${favs.slice(0, 4).map((p) => UI.productCard(p)).join("")}</div></div>
      </div>` : ""}
      <div class="card">
        <div class="card-head"><div class="card-title" style="margin:0">คำสั่งซื้อล่าสุด</div><a class="small" href="#/orders">ดูทั้งหมด →</a></div>
        <div class="card-pad" style="padding-top:8px">
          ${orders.length ? `<div class="stack" style="gap:12px">${orders.slice(0, 3).map((o) => {
            const store = Store.getStore(o.sellerId);
            return `<div class="row-between" style="border:1px solid var(--border);border-radius:12px;padding:12px 14px">
              <div><div class="strong" style="font-size:13.5px">#${esc(o.no)}</div><div class="small muted">${esc(o.date)} · ${store ? store.emoji + " " + esc(store.name) : ""}</div></div>
              <div style="text-align:right"><div>${statusBadge(o.status)}</div><div class="strong mt-1" style="font-size:14px">${Store.currency(o.total)}</div></div>
            </div>`; }).join("")}</div>` : UI.emptyState("🛍️", "ยังไม่มีคำสั่งซื้อ", "เริ่มต้นเลือกซื้อสินค้าจากชุมชนกันเลย", `<a class="btn btn-primary mt-3" href="#/products">เลือกซื้อสินค้า</a>`)}
        </div>
      </div>`;
  });
  return DashShell.build(user, "overview", "buyer", content.html, { title: "สวัสดี " + user.name.split(" ")[0], sub: "ภาพรวมคำสั่งซื้อและสินค้าที่คุณสนใจ", init: content.init });
}

function BuyerFavView() {
  const user = Store.currentUser();
  const favs = Fav.products();
  return DashShell.build(user, "favorites", "buyer",
    `<div class="card"><div class="card-head"><div class="card-title" style="margin:0">❤️ สินค้าที่สนใจ</div><span class="small muted">${fmt(favs.length)} รายการ</span></div>
     <div class="card-pad"><div class="grid-products" id="favGrid">${favs.length ? UI.skeletonCards(favs.length) : ""}</div></div></div>`,
    { title: "สินค้าที่สนใจ", sub: "สินค้าที่คุณบันทึกไว้เพื่อตัดสินใจภายหลัง", init(container) {
      setTimeout(() => {
        const grid = _q("#favGrid", container);
        if (!grid) return;
        grid.innerHTML = favs.length ? favs.map(UI.productCard).join("") : UI.emptyState("🤍", "ยังไม่มีสินค้าที่สนใจ", "กดปุ่ม ❤️ บนหน้ารายละเอียดสินค้าเพื่อบันทึกไว้ที่นี่", `<a class="btn btn-primary mt-3" href="#/products">ดูสินค้าทั้งหมด</a>`);
        bindAddCart(grid);
      }, 200);
    } });
}

App.routes.push(
  { pattern: ["dash", "owner"], role: ["owner"], dash: true, title: "เจ้าของระบบ", render: () => OwnerDashView() },
  { pattern: ["dash", "admin"], role: ["admin", "owner"], dash: true, title: "ผู้ดูแลระบบ", render: () => AdminDashView() },
  { pattern: ["dash", "seller"], role: ["seller"], dash: true, title: "ผู้ขาย", render: () => SellerDashView() },
  { pattern: ["dash", "buyer"], role: ["buyer"], dash: true, title: "ผู้ซื้อ", render: () => BuyerDashView() },
  { pattern: ["dash", "buyer", "favorites"], role: ["buyer"], dash: true, title: "สินค้าที่สนใจ", render: () => BuyerFavView() }
);