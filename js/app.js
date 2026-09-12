const Q = UI.$, QA = UI.$$;

function appFind(sel, ctx) { return (ctx || document).querySelector(sel); }
function appFindAll(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

function headerInit() {
  const host = appFind("#siteHeader");
  if (!host) return;
  host.innerHTML = `
    <div class="container header-inner">
      <a class="brand" href="#/" aria-label="หน้าแรกของ ${esc(SHOP.name)}">
        <span class="brand-logo">🌾</span>
        <span><span class="brand-name">${esc(SHOP.name)}</span><br><span class="brand-sub">สินค้าจากชุมชน สุราษฎร์ธานี</span></span>
      </a>
      <form class="header-search" id="siteSearch">
        <div class="search-box">
          <input id="siteSearchInput" type="search" placeholder="ค้นหาสินค้า เช่น ทุเรียน ไข่เค็ม..." aria-label="ค้นหาสินค้า">
          <button class="btn btn-primary btn-sm" type="submit" aria-label="ค้นหา">ค้นหา</button>
        </div>
      </form>
      <nav class="header-nav" aria-label="เมนูหลัก">
        <a class="header-link" href="#/">หน้าแรก</a>
        <a class="header-link" href="#/products">สินค้า</a>
        <a class="header-link" href="#/about">เกี่ยวกับ</a>
        <a class="header-link" href="#/contact">ติดต่อ</a>
      </nav>
      <div class="header-actions">
        <button class="icon-btn" data-theme-btn title="สลับธีม" aria-label="สลับธีม">${Store.getTheme() === "light" ? "🌙" : "☀️"}</button>
        <a class="icon-btn" href="#/cart" title="ตะกร้าสินค้า" aria-label="ตะกร้าสินค้า">🛒<span class="cart-badge hidden">0</span></a>
        <span class="header-user" id="headerUserArea"></span>
        <button class="icon-btn hamburger" data-open-menu aria-label="เปิดเมนู">☰</button>
      </div>
    </div>`;
}

function footerInit() {
  const host = appFind("#siteFooter");
  if (!host) return;
  host.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="brand" style="margin-bottom:10px">
            <span class="brand-logo">🌾</span>
            <span><span class="brand-name" style="color:var(--text)">${esc(SHOP.name)}</span><br><span class="brand-sub">${esc(SHOP.tagline)}</span></span>
          </div>
          <p>ระบบซื้อขายสินค้าเกษตรออนไลน์ของกลุ่มเกษตรกรชุมชนบ้านลีเล็ด อ.พุนพิน จ.สุราษฎร์ธานี</p>
          <p>🏠 ${esc(SHOP.address)}</p>
        </div>
        <div>
          <h4>หมวดหมู่สินค้า</h4>
          <ul>${CATEGORIES.map((c) => `<li><a href="#/categories/${c.id}">${c.icon} ${esc(c.name)}</a></li>`).join("")}</ul>
        </div>
        <div>
          <h4>ลิงก์</h4>
          <ul>
            <li><a href="#/">หน้าแรก</a></li>
            <li><a href="#/products">สินค้าทั้งหมด</a></li>
            <li><a href="#/about">เกี่ยวกับชุมชน</a></li>
            <li><a href="#/contact">ติดต่อเรา</a></li>
            <li><a href="#/login">เข้าสู่ระบบ</a></li>
            <li><a href="#/register">สมัครสมาชิก</a></li>
          </ul>
        </div>
        <div>
          <h4>ติดต่อเรา</h4>
          <ul>
            <li>📞 ${esc(SHOP.phone)}</li>
            <li>💬 Line: ${esc(SHOP.line)}</li>
            <li>📘 Facebook: ${esc(SHOP.facebook)}</li>
            <li>✉️ ${esc(SHOP.email)}</li>
            <li>🕗 ${esc(SHOP.hours)}</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">© ${new Date().getFullYear() + 543} ${esc(SHOP.name)} · กลุ่มเกษตรกรชุมชนบ้านลีเล็ด · สงวนลิขสิทธิ์</div>
    </div>`;
}

function mobileNavInit() {
  const host = appFind("#mobileNav");
  if (!host) return;
  host.innerHTML = `
    <a class="m-nav-item" href="#/" data-href="#/"><span class="ico-holder"><span class="ico">🏠</span></span>หน้าแรก</a>
    <a class="m-nav-item" href="#/products" data-href="#/products"><span class="ico-holder"><span class="ico">🛍️</span></span>สินค้า</a>
    <a class="m-nav-item" href="#/cart" data-href="#/cart"><span class="ico-holder"><span class="ico">🛒</span></span>ตะกร้า<span class="cart-badge hidden">0</span></a>
    <a class="m-nav-item" href="#/about" data-href="#/about"><span class="ico-holder"><span class="ico">🌾</span></span>เกี่ยวกับ</a>
    <button class="m-nav-item" data-open-menu aria-label="เปิดเมนู"><span class="ico-holder"><span class="ico">☰</span></span>เมนู</button>`;
}

function drawerInit() {
  const host = appFind("#mobileDrawer");
  if (!host) return;
  host.innerHTML = `
    <div class="panel">
      <div class="drawer-head">
        <div class="brand">
          <span class="brand-logo">🌾</span>
          <span><span class="brand-name" style="color:var(--text)">${esc(SHOP.name)}</span><br><span class="brand-sub">สินค้าจากชุมชน สุราษฎร์ธานี</span></span>
        </div>
        <button class="icon-btn" data-close-drawer aria-label="ปิดเมนู">✕</button>
      </div>
      <a class="drawer-link" href="#/"><span class="ico">🏠</span>หน้าแรก</a>
      <a class="drawer-link" href="#/products"><span class="ico">🛍️</span>สินค้าทั้งหมด</a>
      <a class="drawer-link" href="#/cart"><span class="ico">🛒</span>ตะกร้าสินค้า</a>
      <div class="sidebar-section">หมวดหมู่สินค้า</div>
      ${CATEGORIES.map((c) => `<a class="drawer-link" href="#/categories/${c.id}"><span class="ico">${c.icon}</span>${esc(c.name)}</a>`).join("")}
      <div class="sidebar-section">เมนูอื่น ๆ</div>
      <a class="drawer-link" href="#/about"><span class="ico">🌾</span>เกี่ยวกับชุมชน</a>
      <a class="drawer-link" href="#/contact"><span class="ico">📍</span>ติดต่อเรา</a>
      <div class="sidebar-section">บัญชี</div>
      <div class="stack" style="gap:6px;padding:4px 2px" id="drawerAuth"></div>
    </div>`;
}

function setDrawer(open) {
  const d = appFind("#mobileDrawer");
  if (d) d.classList.toggle("open", !!open);
}

function headerUserHTML(user) {
  if (user) {
    const first = String(user.name).split(" ")[0];
    return `<a class="btn btn-soft btn-sm" href="${esc(Store.ROLE_HOME[user.role])}">📊 ${esc(first)}</a>
      <button class="btn btn-outline btn-sm" data-out-header="1" aria-label="ออกจากระบบ">ออกจากระบบ</button>`;
  }
  return `<a class="btn btn-primary btn-sm" href="#/login">เข้าสู่ระบบ</a>
    <a class="btn btn-outline btn-sm" href="#/register">สมัคร</a>`;
}

function drawerAuthHTML(user) {
  if (user) {
    return `<a class="btn btn-primary btn-block" href="${esc(Store.ROLE_HOME[user.role])}">📊 ไปยัง Dashboard</a>
      <a class="btn btn-outline btn-block" href="#/profile">👤 โปรไฟล์</a>
      <button class="btn btn-danger btn-block" data-out-header="1">🚪 ออกจากระบบ</button>`;
  }
  return `<a class="btn btn-primary btn-block" href="#/login">เข้าสู่ระบบ</a>
    <a class="btn btn-outline btn-block" href="#/register">สมัครสมาชิก</a>`;
}

function refreshChrome() {
  const user = Store.currentUser();
  const count = Store.cartCount();
  QA(".cart-badge").forEach((b) => { b.textContent = count; b.classList.toggle("hidden", count <= 0); });
  QA("[data-theme-btn]").forEach((b) => { b.textContent = Store.getTheme() === "light" ? "🌙" : "☀️"; });
  const hu = appFind("#headerUserArea");
  if (hu) hu.innerHTML = headerUserHTML(user);
  const da = appFind("#drawerAuth");
  if (da) da.innerHTML = drawerAuthHTML(user);
  App.currentUser = user;
}

function markActiveLinks() {
  const cur = (location.hash.replace(/^#/, "") || "/").split("?")[0];
  QA("a.header-link").forEach((a) => {
    const h = a.getAttribute("href") || "";
    if (!h.startsWith("#")) return;
    a.classList.toggle("active", h === "#/" ? cur === "/" : cur.startsWith(h.slice(1)));
  });
  QA(".m-nav-item").forEach((b) => {
    const h = b.getAttribute("data-href") || b.getAttribute("href") || "";
    if (!h.startsWith("#")) return;
    b.classList.toggle("active", h === "#/" ? cur === "/" : cur.startsWith(h.slice(1)));
  });
  QA(".drawer-link").forEach((a) => {
    const h = a.getAttribute("href") || "";
    if (!h.startsWith("#")) return;
    const p = h.slice(1);
    a.classList.toggle("active", h === "#/" ? cur === "/" : cur === p || cur.startsWith(p + "/"));
  });
}

function bindChromeEvents() {
  const form = appFind("#siteSearch");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = appFind("#siteSearchInput").value.trim();
      location.hash = v ? "#/products?q=" + encodeURIComponent(v) : "#/products";
    });
  }
  QA("[data-theme-btn]").forEach((b) => b.addEventListener("click", () => { Store.toggleTheme(); refreshChrome(); }));
  QA("[data-open-menu]").forEach((b) => b.addEventListener("click", () => setDrawer(true)));
  const drawer = appFind("#mobileDrawer");
  if (drawer) drawer.addEventListener("click", (e) => { if (e.target === drawer) setDrawer(false); });
}

function bindGlobalDelegation() {
  document.addEventListener("click", (e) => {
    const drawer = appFind("#mobileDrawer");
    if (drawer && drawer.classList.contains("open") && drawer.contains(e.target)) setDrawer(false);

    if (e.target.closest("[data-close-drawer]")) { setDrawer(false); return; }

    const outH = e.target.closest("[data-out-header]");
    if (outH) {
      UI.confirmModal("ออกจากระบบ", "ต้องการออกจากระบบหรือไม่?", "", () => { Store.logout(); Router.go("#/"); });
      return;
    }

    const goto = e.target.closest("[data-goto]");
    if (goto && !goto.disabled && !(goto.classList && goto.classList.contains("disabled"))) {
      if (goto.tagName === "A") e.preventDefault();
      location.hash = goto.getAttribute("data-goto");
      return;
    }

    const ace = e.target.closest(".alert-close[data-close]");
    if (ace) {
      const a = ace.closest(".alert");
      if (a) a.remove();
    }
  });
}

function initApp() {
  headerInit();
  footerInit();
  mobileNavInit();
  drawerInit();
  bindChromeEvents();
  bindGlobalDelegation();

  App.refreshChrome = refreshChrome;
  App.onRoute = function () { markActiveLinks(); refreshChrome(); };
  App.onClickDash = function () { window.scrollTo(0, 0); };
  Store.on("cart", () => { if (App.refreshChrome) App.refreshChrome(); });

  const loader = appFind("#appLoad");
  if (loader) { loader.classList.add("done"); setTimeout(() => { if (loader.parentNode) loader.parentNode.removeChild(loader); }, 320); }

  Router.init();
}

initApp();