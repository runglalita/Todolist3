function bindAddCart(container) {
  _qa("[data-add]", container).forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = Number(btn.dataset.add);
      const p = Store.getProduct(id);
      if (!p) return;
      Store.addToCart(id, 1);
      toast(`เพิ่ม "${p.name}" ลงตะกร้าแล้ว`, "success");
      App.refreshChrome && App.refreshChrome();
    });
  });
}

function productGridInto(container, list) {
  if (!list.length) {
    container.innerHTML = UI.emptyState("🧺", "ไม่พบสินค้าที่ต้องการ", "ลองปรับคำค้นหาหรือหมวดหมู่ของคุณ");
    return;
  }
  container.innerHTML = list.map(UI.productCard).join("");
  bindAddCart(container);
}

function heroHTML() {
  return `
  <section class="hero">
    <div class="container hero-inner">
      <div>
        <span class="hero-kicker">🌱 สินค้าจากเกษตรกรชุมชนบ้านลีเล็ด อ.พุนพิน จ.สุราษฎร์ธานี</span>
        <h1>สินค้าเกษตรคุณภาพ<br>ส่งตรงจากสวนสู่ <span>มือคุณ</span></h1>
        <p class="lead">ผลไม้ตามฤดูกาล ผักปลอดสาร สินค้าพื้นบ้านและของฝากขึ้นชื่อจากกลุ่มเกษตรกรบ้านลีเล็ด สั่งก่อน 15:00 น. ส่งถึงบ้านคุณภายในวันถัดไป</p>
        <div style="display:flex;gap:12px;flex-wrap:wrap">
          <a class="btn btn-accent btn-lg" href="#/products">🛒 เลือกซื้อสินค้า</a>
          <a class="btn btn-outline btn-lg" href="#/about">🌾 รู้จักชุมชนเรา</a>
        </div>
        <div class="hero-stats">
          <div><div class="num">${fmt(COMMUNITY.stats.farmers)}+</div><div class="lbl">สมาชิกเกษตรกร</div></div>
          <div><div class="num">${fmt(COMMUNITY.stats.kinds)}+</div><div class="lbl">ชนิดสินค้า</div></div>
          <div><div class="num">${COMMUNITY.stats.satisfaction}%</div><div class="lbl">ความพึงพอใจ</div></div>
        </div>
      </div>
      <div class="hero-illus">
        <div class="big-img">🌾</div>
        <span class="hero-chip" style="top:6%;left:-4%"><span class="big">🥇</span> ทุเรียนหมอนทอง</span>
        <span class="hero-chip" style="bottom:14%;left:2%;animation-delay:.5s"><span class="big">🥥</span> มะพร้าวน้ำหอม</span>
        <span class="hero-chip" style="top:42%;right:-3%;animation-delay:1s"><span class="big">🥚</span> ไข่เค็มไชยา</span>
        <span class="hero-chip" style="bottom:6%;right:12%;animation-delay:1.5s"><span class="big">🍇</span> มังคุดเกรด AA</span>
      </div>
    </div>
  </section>`;
}

function announcementStrip() {
  return `
  <div class="container" style="margin-top:24px">
    <div class="banner-promo">
      <div style="display:flex;gap:10px;align-items:flex-start">
        <span style="font-size:22px">📢</span>
        <div><h3>${esc(SETTINGS.announcement)}</h3><p>ลงทะเบียนสมาชิกใหม่ เพื่อรับสิทธิ์สั่งซื้อและติดตามคำสั่งซื้อของคุณได้ทุกขั้นตอน</p></div>
      </div>
      <a class="btn btn-accent" href="#/register">สมัครสมาชิก</a>
    </div>
  </div>`;
}

function HomeView() {
  const featured = PRODUCTS.filter((p) => p.featured && p.status === "active").slice(0, 8);
  const best = [...PRODUCTS].filter((p) => p.status === "active").sort((a, b) => b.sold - a.sold).slice(0, 8);
  const html = `
    ${heroHTML()}
    ${announcementStrip()}
    <section class="container section" id="cats">
      <div class="section-title">หมวดหมู่สินค้า <span class="accent">🍃</span></div>
      <div class="section-sub">เลือกหมวดหมู่ที่คุณชื่นชอบ</div>
      <div class="grid-5" style="grid-template-columns:repeat(auto-fill,minmax(150px,1fr))">
        ${CATEGORIES.map((c) => `
          <a class="cat-card" href="#/categories/${c.id}">
            <span class="ico" style="background:linear-gradient(135deg,${c.c1},${c.c2})">${c.icon}</span>
            <h4>${esc(c.name)}</h4>
            <small>${fmt(PRODUCTS.filter((p) => p.category === c.id).length)} รายการ</small>
          </a>`).join("")}
      </div>
    </section>
    <section class="container section" style="padding-top:0">
      <div class="row-between">
        <div><div class="section-title">สินค้าแนะนำ <span class="accent">✨</span></div><div class="section-sub">คัดสรรสินค้าคุณภาพจากเกษตรกร</div></div>
        <a class="small" href="#/products" style="color:var(--muted)">ดูทั้งหมด →</a>
      </div>
      <div class="grid-products" id="homeFeatured">${UI.skeletonCards(8)}</div>
    </section>
    <section class="container section" style="padding-top:0">
      <div class="row-between">
        <div><div class="section-title">สินค้าขายดี <span class="accent">🔥</span></div><div class="section-sub">ยอดนิยมที่ผู้ซื้อชื่นชอบ</div></div>
        <a class="small" href="#/products?sort=popular" style="color:var(--muted)">ดูทั้งหมด →</a>
      </div>
      <div class="grid-products" id="homeBest">${UI.skeletonCards(8)}</div>
    </section>
    <section class="container section" style="padding-top:0">
      <div class="banner-promo">
        <div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap">
          <span style="font-size:40px">🚚</span>
          <div><h3>จัดส่งทั่วประเทศ · เก็บเงินปลายทางได้</h3><p>แพ็กสินค้าสดใหม่ด้วยกล่องโฟมและน้ำแข็งแห้ง รับประกันคุณภาพ เน่าเสียแก้ไขให้ทันที</p></div>
        </div>
        <a class="btn btn-primary" href="#/products">เริ่มช้อปเลย</a>
      </div>
    </section>
    <section class="container section" style="padding-top:0">
      <div class="section-title">เกี่ยวกับชุมชน <span class="accent">🌏</span></div>
      <div class="grid" style="grid-template-columns:1.2fr .8fr;gap:24px">
        <div class="card card-pad">
          <h3 style="font-size:17px">${esc(COMMUNITY.name)}</h3>
          <p class="muted" style="font-size:14px">${esc(COMMUNITY.story)}</p>
          <div class="row" style="flex-wrap:wrap">
            <a class="btn btn-soft" href="#/about">อ่านเพิ่มเติม →</a>
            <a class="btn btn-ghost" href="#/contact">ติดต่อชุมชน</a>
          </div>
        </div>
        <div class="card card-pad">
          <div class="card-title">สถิติชุมชน</div>
          <div class="stack">
            <div class="row-between"><span class="muted small">สมาชิกเกษตรกร</span><b>${fmt(COMMUNITY.stats.farmers)} คน</b></div>
            <div class="row-between"><span class="muted small">ร้านค้าในระบบ</span><b>${fmt(COMMUNITY.stats.memberShops)} ร้าน</b></div>
            <div class="row-between"><span class="muted small">ชนิดสินค้า</span><b>${fmt(COMMUNITY.stats.kinds)} รายการ</b></div>
            <div class="row-between"><span class="muted small">ความพึงพอใจ</span><b style="color:var(--success)">${COMMUNITY.stats.satisfaction}%</b></div>
          </div>
        </div>
      </div>
    </section>`;
  return {
    title: "หน้าแรก",
    html,
    init(container) {
      setTimeout(() => { productGridInto(_q("#homeFeatured", container), featured); }, 120);
      setTimeout(() => { productGridInto(_q("#homeBest", container), best); }, 240);
    },
  };
}

function ProductsView(params, query) {
  const pageSize = 12;
  const sortOptions = [
    ["popular", "ขายดีที่สุด"],
    ["newest", "ใหม่ล่าสุด"],
    ["price_asc", "ราคาต่ำสุด"],
    ["price_desc", "ราคาสูงสุด"],
    ["rating", "คะแนนสูงสุด"],
  ];
  const catId = query.cat || query.cid || params.cid || "all";
  const q = (query.q || "").toLowerCase().trim();
  const sort = query.sort || "popular";
  const instock = query.instock === "1";
  const page = Math.max(1, parseInt(query.page || "1", 10));

  let list = PRODUCTS.filter((p) => p.status === "active");
  if (catId !== "all") list = list.filter((p) => p.category === catId);
  if (q) {
    list = list.filter((p) => (p.name + " " + p.desc + " " + (Store.getStore(p.sellerId) || {}).name + " " + p.tags.join(" ")).toLowerCase().includes(q));
  }
  if (instock) list = list.filter((p) => p.stock > 0);
  list.sort((a, b) => {
    if (sort === "price_asc") return a.price - b.price;
    if (sort === "price_desc") return b.price - a.price;
    if (sort === "rating") return b.rating - a.rating;
    if (sort === "newest") return (b.createdAt || 0) - (a.createdAt || 0);
    return b.sold - a.sold;
  });
  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const pageList = list.slice((page - 1) * pageSize, page * pageSize);

  const activeCat = CATEGORIES.find((c) => c.id === catId);
  const html = `
    <div class="view-pad">
      <div class="container">
        ${UI.breadcrumb([{ label: "หน้าแรก", href: "#/" }, { label: activeCat ? activeCat.name : "สินค้าทั้งหมด", href: "#/products", current: true }])}
        <div class="page-head">
          <h1>${q ? `ผลการค้นหา "${esc(query.q)}"` : activeCat ? `${activeCat.icon} ${activeCat.name}` : "สินค้าทั้งหมด"}</h1>
          <div class="sub">พบ ${fmt(total)} รายการ จากร้านค้าสมาชิกของเรา</div>
        </div>
      </div>
      <div class="container">
        <div class="toolbar">
          <div class="group">
            <span class="small muted">หมวด:</span>
            <div class="chip-row">
              <a class="chip ${catId === "all" ? "active" : ""}" href="#/products">ทั้งหมด</a>
              ${CATEGORIES.map((c) => `<a class="chip ${catId === c.id ? "active" : ""}" href="#/products?cat=${c.id}">${c.icon} ${esc(c.name)}</a>`).join("")}
            </div>
          </div>
        </div>
        <div class="toolbar" style="margin-top:0">
          <div class="group">
            <span class="small muted">เรียงตาม:</span>
            <select class="select" id="sortSel" style="width:auto">
              ${sortOptions.map(([v, l]) => `<option value="${v}" ${sort === v ? "selected" : ""}>${l}</option>`).join("")}
            </select>
            <label class="small muted" style="display:inline-flex;align-items:center;gap:6px;margin:0"><input type="checkbox" id="instockChk" style="accent-color:var(--primary)" ${instock ? "checked" : ""}> เฉพาะมีของ</label>
            <a class="btn btn-outline btn-sm" href="#/products">รีเซ็ต</a>
          </div>
          <span class="small muted">${fmt(total)} รายการ</span>
        </div>
        <div class="grid-products" id="plist">${UI.skeletonCards(8)}</div>
        ${pages > 1 ? `<div class="pager" id="pager"></div>` : ""}
      </div>
    </div>`;
  return {
    title: q ? `ค้นหา: ${query.q}` : activeCat ? activeCat.name : "สินค้าทั้งหมด",
    html,
    init(container) {
      setTimeout(() => productGridInto(_q("#plist", container), pageList), 150);
      const pager = _q("#pager", container);
      if (pager) {
        const qs = `cat=${encodeURIComponent(catId)}&q=${encodeURIComponent(query.q || "")}&sort=${sort}&instock=${instock ? "1" : ""}&page=`;
        pager.innerHTML = `
          <button data-p="${page - 1}" ${page <= 1 ? "disabled" : ""}>‹</button>
          ${Array.from({ length: pages }, (_, i) => `<button class="${page === i + 1 ? "active" : ""}" data-p="${i + 1}">${i + 1}</button>`).join("")}
          <button data-p="${page + 1}" ${page >= pages ? "disabled" : ""}>›</button>`;
        pager.addEventListener("click", (e) => {
          const b = e.target.closest("[data-p]");
          if (b && !b.disabled) location.hash = "#/products?" + qs + b.dataset.p;
        });
      }
      const sortSel = _q("#sortSel", container);
      const instockChk = _q("#instockChk", container);
      if (sortSel) sortSel.addEventListener("change", () => applyFilter(container));
      if (instockChk) instockChk.addEventListener("change", () => applyFilter(container));
      function applyFilter(c) {
        const base = `#/products?cat=${encodeURIComponent(catId)}&q=${encodeURIComponent(query.q || "")}`;
        const so = _q("#sortSel", c).value;
        const io = _q("#instockChk", c).checked ? "1" : "";
        location.hash = `${base}&sort=${so}${io ? `&instock=${io}` : ""}`;
      }
    },
  };
}

function selectedReviewInfo(productId) {
  const reviews = Store.productReviews(productId);
  const counts = [0, 0, 0, 0, 0];
  reviews.forEach((r) => { counts[r.rating - 1]++; });
  return { reviews, counts };
}

function ProductDetailView(params) {
  const p = Store.getProduct(params.id);
  if (!p) {
    return { title: "ไม่พบสินค้า", html: `<div class="container-sm" style="padding-top:64px">${UI.emptyState("😕", "ไม่พบสินค้า", "สินค้าอาจถูกปิดการขายหรือถูกลบไปแล้ว", `<a class="btn btn-primary mt-3" href="#/products">ดูสินค้าทั้งหมด</a>`)}</div>`, init: null };
  }
  const store = Store.getStore(p.sellerId);
  const cat = Store.getCategory(p.category);
  const reviews = Store.productReviews(p.id);
  const { avg, count } = Store.productRating(p.id);
  const counts = [0, 0, 0, 0, 0];
  reviews.forEach((r) => { counts[r.rating - 1] = (counts[r.rating - 1] || 0) + 1; });
  const user = Store.currentUser();
  const eligible = user && user.role === "buyer" ? Store.canReview(p.id, user.id) : false;
  const myReview = user ? reviews.find((r) => r.buyerId === user.id) : null;
  const related = PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id && x.status === "active").slice(0, 4);
  const soldOut = p.status !== "active" || p.stock <= 0;

  const html = `
    <div class="view-pad">
      <div class="container">
        ${UI.breadcrumb([{ label: "หน้าแรก", href: "#/" }, { label: "สินค้า", href: "#/products" }, { label: cat ? cat.name : "สินค้า", href: `#/products?cat=${p.category}` }, { label: p.name, current: true }])}
        <div class="product-detail">
          <div>
            <div class="pd-media" style="background:linear-gradient(135deg,${p.c1},${p.c2})">
              <span class="badge badge-primary" style="position:absolute;top:14px;left:14px">${cat ? cat.icon + " " + esc(cat.name) : "สินค้า"}</span>
              <span style="font-size:130px;line-height:1">${p.emoji}</span>
            </div>
          </div>
          <div class="pd-info">
            ${p.best ? `<span class="badge badge-hot mb-3">🔥 ขายดี</span> ` : ""}${p.featured ? `<span class="badge badge-primary mb-3">⭐ สินค้าแนะนำ</span>` : ""}
            <h1>${esc(p.name)}</h1>
            <div class="pd-store">
              ${store ? `<span class="avatar avatar-sm" style="background:linear-gradient(135deg,${store.c1},${store.c2})">${store.emoji}</span><a href="#/about">${esc(store.name)}</a> · ตั้งแต่ ${esc(store.since)}` : ""}
            </div>
            <div class="pd-rating">
              <span class="badge badge-gold">★ ${Number(avg).toFixed(1)}</span>
              <span>${fmt(count)} รีวิว</span>
              <span>ขายแล้ว ${fmt(p.sold)} ${esc(p.unit)}</span>
            </div>
            <div class="pd-price"><span class="val">${Store.currency(p.price)}</span><span class="unit">/ ${esc(p.unit)}</span></div>
            ${stockLine(p)}
            <p class="pd-desc">${esc(p.desc)}</p>
            <ul class="pd-summary">
              <li>🚚 ส่งทั่วประเทศ ${SETTINGS.shippingFee > 0 ? "ค่าส่งเริ่มต้น " + Store.currency(SETTINGS.shippingFee) : "ค่าส่งฟรี"}</li>
              <li>💯 รับประกันคุณภาพสินค้า สด ใหม่ จากเกษตรกร</li>
              <li>💰 ชำระปลายทาง หรือ QR Payment</li>
            </ul>
            <div class="qty-row">
              <span class="lbl">จำนวน:</span>
              <div class="qty">
                <button id="qm">−</button>
                <input id="qtyIn" type="number" value="1" min="1" max="${Math.max(p.stock, 1)}" ${soldOut ? "disabled" : ""}>
                <button id="qp">＋</button>
              </div>
              <span class="small muted">มี ${fmt(Math.max(p.stock, 0))} ${esc(p.unit)}</span>
            </div>
            <div class="pd-actions">
              ${user ? `<button id="favBtn" class="btn btn-icon btn-lg ${Fav.has(p.id) ? "fav-on" : ""}" title="บันทึกเป็นสินค้าที่สนใจ" aria-label="บันทึกเป็นสินค้าที่สนใจ">${Fav.has(p.id) ? "❤️" : "🤍"}</button>` : ""}
              <button id="addCartBtn" class="btn btn-soft btn-lg" ${soldOut ? "disabled" : ""} style="flex:1">＋ เพิ่มลงตะกร้า</button>
              <button id="buyBtn" class="btn btn-accent btn-lg" ${soldOut ? "disabled" : ""} style="flex:1">🛒 ซื้อสินค้า</button>
            </div>
            <div class="pd-tags">${p.tags.map((t) => `<span class="badge badge-outline">🏷️ ${esc(t)}</span>`).join("")}</div>
          </div>
        </div>

        <div style="height:48px"></div>
        <div class="grid" style="grid-template-columns:1.1fr .9fr;gap:24px;align-items:start">
          <div class="card">
            <div class="card-head"><div class="strong" style="font-size:15px">รีวิวจากผู้ซื้อ</div><a class="btn btn-primary btn-sm" href="#/products/${p.id}">เขียนรีวิว ${myReview ? "(แก้ไข)" : ""}</a></div>
            <div class="card-pad" id="reviewRoot">${UI.loadingBox("กำลังโหลดรีวิว")}</div>
          </div>
          <div class="card">
            <div class="card-head"><div class="strong" style="font-size:15px">ร้านค้า</div></div>
            <div class="card-pad">
              <div class="row mb-4" style="align-items:flex-start">
                <span class="avatar avatar-lg" style="background:linear-gradient(135deg,${store ? store.c1 : "#999"},${store ? store.c2 : "#bbb"});font-size:28px">${store ? store.emoji : "🏪"}</span>
                <div>
                  <div class="strong" style="font-size:15px">${esc(store ? store.name : "ร้านค้า")}</div>
                  <div class="small muted">${esc(store ? store.desc : "")}</div>
                </div>
              </div>
              <div class="stack small muted mb-4">
                <span>📞 ${esc(store ? store.phone : "-")}</span>
                <span>💬 Line: ${esc(store ? store.line : "-")}</span>
                <span>📅 เป็นสมาชิกตั้งแต่ ${esc(store ? store.since : "-")}</span>
                <span>⭐ ความพึงพอใจ ${store ? store.rating : "-"} / 5</span>
              </div>
              <a class="btn btn-outline btn-sm" href="#/products?cat=${p.category}">ดูสินค้าอื่นในหมวดนี้ →</a>
            </div>
          </div>
        </div>

        ${related.length ? `
        <div class="section" style="padding-bottom:16px">
          <div class="section-title">สินค้าใกล้เคียง <span class="accent">🍃</span></div>
          <div class="grid-products" id="relatedGrid">${related.map(UI.productCard).join("")}</div>
        </div>` : ""}
      </div>
    </div>`;

  return {
    title: p.name,
    html,
    init(container) {
      bindAddCart(container);

      const input = _q("#qtyIn", container);
      const qm = _q("#qm", container), qp = _q("#qp", container);
      if (input && qm && qp) {
        qm.addEventListener("click", () => { input.value = Math.max(1, Number(input.value) - 1); });
        qp.addEventListener("click", () => { input.value = Math.min(p.stock, Number(input.value) + 1); });
        input.addEventListener("change", () => { input.value = Math.max(1, Math.min(p.stock, Number(input.value) || 1)); });
      }
      const redo = () => { Store.addToCart(p.id, Number(input ? input.value : 1) || 1); };
      const buy = _q("#buyBtn", container);
      if (buy) buy.addEventListener("click", () => {
        if (soldOut) return;
        redo();
        const user = Store.currentUser();
        if (!user || user.role !== "buyer") {
          App.flash = { next: "#/cart" };
          toast("กรุณาเข้าสู่ระบบในฐานะผู้ซื้อ เพื่อดำเนินการสั่งซื้อ", "warning");
          location.hash = "#/login";
        } else {
          location.hash = "#/cart";
        }
      });
      const add = _q("#addCartBtn", container);
      if (add) add.addEventListener("click", () => { if (soldOut) return; redo(); toast(`เพิ่มสินค้าลงตะกร้าแล้ว`, "success"); App.refreshChrome && App.refreshChrome(); });

      const fav = _q("#favBtn", container);
      if (fav) fav.addEventListener("click", () => {
        const on = Fav.toggle(p.id);
        fav.textContent = on ? "❤️" : "🤍";
        fav.classList.toggle("fav-on", on);
        toast(on ? "บันทึกเป็นสินค้าที่สนใจแล้ว" : "ลบออกจากสินค้าที่สนใจแล้ว", on ? "success" : "info");
      });

      const reviewBtn = _q("a[href='#/products/" + p.id + "']", container);
      if (reviewBtn) reviewBtn.addEventListener("click", (e) => {
        e.preventDefault();
        renderReviewModal(p);
      });

      const rr = _q("#reviewRoot", container);
      setTimeout(() => {
        if (rr) rr.innerHTML = renderReviewsBlock(p, reviews, counts);
        if (_q("#relatedGrid", container)) { /* already filled */ }
      }, 200);
    },
  };
}

function renderReviewsBlock(p, reviews, counts) {
  const { avg, count } = Store.productRating(p.id);
  const maxCount = Math.max(...counts, 1);
  const bars = [5, 4, 3, 2, 1].map((n) => `
    <div class="review-bar">
      <span style="min-width:26px">${n} ★</span>
      <div class="track"><div class="fill" style="width:${(counts[n - 1] / maxCount) * 100}%"></div></div>
      <span>${fmt(counts[n - 1])}</span>
    </div>`).join("");
  const listHtml = reviews.length ? reviews.map((r) => `
    <div class="review-item">
      <div class="review-head">
        ${UI.avatar(r.buyerName, "avatar-sm")}
        <div>
          <div class="review-name">${esc(r.buyerName)}</div>
          <div class="review-time">${UI.stars(r.rating, "")} · ${r.date}</div>
        </div>
      </div>
      <div class="review-body">${esc(r.comment || "ไม่มีความคิดเห็น")}</div>
    </div>`).join("") : `<div class="empty-state" style="padding:32px 8px"><div class="ico">💬</div><h3>ยังไม่มีรีวิว</h3><p>เป็นคนแรกที่รีวิวสินค้านี้</p></div>`;
  return `
    <div class="grid" style="grid-template-columns:150px 1fr;gap:20px;align-items:start">
      <div class="center">
        <div style="font-size:44px;font-weight:700;color:var(--gold);line-height:1">${Number(avg).toFixed(1)}</div>
        <div style="margin:6px 0">${UI.stars(avg, "")}</div>
        <div class="small muted">จาก ${fmt(count)} รีวิว</div>
      </div>
      <div class="stack">${bars}</div>
    </div>
    <div style="height:20px"></div>
    <div style="border-top:1px solid var(--border);padding-top:8px">${listHtml}</div>`;
}

function renderReviewModal(p) {
  const user = Store.currentUser();
  if (!user) {
    App.flash = { next: "#/products/" + p.id };
    location.hash = "#/login";
    return;
  }
  if (user.role !== "buyer") { toast("เฉพาะผู้ซื้อที่สั่งซื้อสินค้าแล้วเท่านั้นที่สามารถรีวิวได้", "warning"); return; }
  const eligible = Store.canReview(p.id, user.id);
  const my = Store.productReviews(p.id).find((r) => r.buyerId === user.id);
  if (!eligible) { toast("คุณต้องสั่งซื้อสินค้าชิ้นนี้และได้รับสินค้าเรียบร้อยแล้วก่อนรีวิว", "warning"); return; }
  let rate = my ? my.rating : 5;
  let comment = my ? my.comment : "";
  let starsHtml = [1, 2, 3, 4, 5].map((n) => `<button class="rv-star" data-v="${n}" style="font-size:26px;background:none;border:0;color:${n <= rate ? "var(--gold)" : "var(--border-strong)"};padding:0 2px">★</button>`).join("");
  const m = UI.modal(`
    <div class="modal-head"><h3>${my ? "แก้ไขรีวิว" : "รีวิวสินค้า"}: ${esc(p.name)}</h3><button class="modal-close" data-close-modal>✕</button></div>
    <div class="modal-body">
      <div class="row" style="gap:10px" class="mb-3">
        <span class="avatar avatar-md" style="background:linear-gradient(135deg,${p.c1},${p.c2})">${p.emoji}</span>
        <div><div class="strong">${esc(p.name)}</div><div class="small muted">${Store.currency(p.price)} / ${esc(p.unit)}</div></div>
      </div>
      <div class="field">
        <label class="label">ให้คะแนน <span class="text-danger">*</span></label>
        <div class="rv-stars" role="radiogroup">${starsHtml}</div>
      </div>
      <div class="field">
        <label class="label" for="rvComment">ความคิดเห็น</label>
        <textarea class="textarea" id="rvComment" placeholder="แบ่งปันประสบการณ์ของคุณกับสินค้าชิ้นนี้...">${esc(comment)}</textarea>
      </div>
    </div>
    <div class="modal-foot">
      <button class="btn btn-ghost" data-cancel="1">ยกเลิก</button>
      <button class="btn btn-primary" id="rvSubmit">${my ? "บันทึกการแก้ไข" : "ส่งรีวิว"}</button>
    </div>`);
  const starsWrap = _q(".rv-stars", m.el);
  starsWrap.addEventListener("click", (e) => {
    const b = e.target.closest(".rv-star");
    if (!b) return;
    rate = Number(b.dataset.v);
    _qa(".rv-star", starsWrap).forEach((x) => { x.style.color = Number(x.dataset.v) <= rate ? "var(--gold)" : "var(--border-strong)"; });
  });
  const cancel = _q("[data-cancel]", m.el);
  if (cancel) cancel.addEventListener("click", m.close);
  const submit = _q("#rvSubmit", m.el);
  submit.addEventListener("click", () => {
    const text = _q("#rvComment", m.el).value.trim();
    if (!text) { toast("กรุณาพิมพ์ความคิดเห็นด้วย", "warning"); return; }
    Store.addReview(p.id, user.id, rate, text);
    m.close();
    toast(my ? "แก้ไขรีวิวเรียบร้อยแล้ว" : "ขอบคุณสำหรับรีวิวของคุณ", "success");
    Router.reload();
  });
}

function AboutView() {
  const html = `
    <div class="view-pad">
      <div class="container-sm">
        ${UI.breadcrumb([{ label: "หน้าแรก", href: "#/" }, { label: "เกี่ยวกับชุมชน", current: true }])}
        <div class="page-head center" style="text-align:center">
          <h1>🌾 ${esc(COMMUNITY.name)}</h1>
          <div class="sub">ก่อตั้ง ${esc(COMMUNITY.founded)} · ${esc(COMMUNITY.villages)} · ริมแม่น้ำตาปี จ.สุราษฎร์ธานี</div>
        </div>
        <p class="muted" style="font-size:15px;line-height:1.9">${esc(COMMUNITY.story)}</p>
        <div class="stat-banner">
          <div class="center"><div class="b-num">${fmt(COMMUNITY.stats.farmers)}</div><div class="b-lbl">สมาชิกเกษตรกร</div></div>
          <div class="center"><div class="b-num">${fmt(COMMUNITY.stats.kinds)}</div><div class="b-lbl">ชนิดสินค้า</div></div>
          <div class="center"><div class="b-num">${fmt(COMMUNITY.stats.memberShops)}</div><div class="b-lbl">ร้านค้าในระบบ</div></div>
          <div class="center"><div class="b-num">${COMMUNITY.stats.satisfaction}%</div><div class="b-lbl">ความพึงพอใจ</div></div>
        </div>
        <div class="section-title">คณะกรรมการกลุ่ม</div>
        <div class="grid-3" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr));margin-bottom:32px">
          ${COMMUNITY.leaders.map((l) => `
            <div class="comm-card">
              <div class="ico">${l.emoji}</div>
              <h4>${esc(l.name)}</h4>
              <p>${esc(l.role)}</p>
            </div>`).join("")}
        </div>
        <div class="section-title">กิจกรรมของชุมชน</div>
        <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(250px,1fr));margin-bottom:32px">
          ${COMMUNITY.activities.map((a) => `
            <div class="feature-card">
              <div class="ico">${a.emoji}</div>
              <div><h4>${esc(a.title)}</h4><p>${esc(a.desc)}</p></div>
            </div>`).join("")}
        </div>
        <div class="card card-pad center" style="text-align:center">
          <div class="strong" style="font-size:16px;margin-bottom:6px">สนใจร่วมเป็นส่วนหนึ่งของชุมชน?</div>
          <p class="muted small">สมัครสมาชิกเพื่อซื้อสินค้า หรือสมัครเป็นผู้ขายเพื่อเปิดร้านค้าออนไลน์ของคุณ</p>
          <div class="row" style="justify-content:center;flex-wrap:wrap">
            <a class="btn btn-primary" href="#/register">สมัครสมาชิก</a>
            <a class="btn btn-outline" href="#/contact">ติดต่อเรา</a>
          </div>
        </div>
      </div>
    </div>`;
  return { title: "เกี่ยวกับชุมชน", html, init: null };
}

function ContactView() {
  const html = `
    <div class="view-pad">
      <div class="container-sm">
        ${UI.breadcrumb([{ label: "หน้าแรก", href: "#/" }, { label: "ติดต่อเรา", current: true }])}
        <div class="page-head center" style="text-align:center">
          <h1>📍 ติดต่อเรา</h1>
          <div class="sub">ทีมงานพร้อมช่วยเหลือคุณทุกวันในเวลาทำการ</div>
        </div>
        <div class="grid-2" style="grid-template-columns:1fr 1.2fr;gap:24px;align-items:start">
          <div class="card card-pad">
            <div class="card-title">ข้อมูลติดต่อ</div>
            <div class="stack small muted" style="font-size:13.5px">
              <div class="contact-row"><span style="font-size:18px">🏪</span><b style="color:var(--text)">${esc(SHOP.name)}</b></div>
              <div class="contact-row"><span style="font-size:18px">🏠</span>${esc(SHOP.address)}</div>
              <div class="contact-row"><span style="font-size:18px">📞</span><a href="tel:${esc(SHOP.phone)}">${esc(SHOP.phone)}</a></div>
              <div class="contact-row"><span style="font-size:18px">💬</span>Line: <b style="color:var(--text)">${esc(SHOP.line)}</b></div>
              <div class="contact-row"><span style="font-size:18px">📘</span>Facebook: ${esc(SHOP.facebook)}</div>
              <div class="contact-row"><span style="font-size:18px">✉️</span>${esc(SHOP.email)}</div>
              <div class="contact-row"><span style="font-size:18px">🕗</span>${esc(SHOP.hours)}</div>
            </div>
          </div>
          <div class="card card-pad">
            <div class="card-title">ส่งข้อความถึงเรา</div>
            <form id="contactForm" novalidate>
              ${UI.field("cfName", "ชื่อ-นามสกุล", { ph: "เช่น สมชาย ใจดี", required: true, msg: "กรุณากรอกชื่อ" })}
              <div class="form-grid">
                ${UI.field("cfPhone", "เบอร์โทรศัพท์", { ph: "08x-xxx-xxxx", required: true, msg: "กรุณากรอกเบอร์โทรศัพท์" })}
                ${UI.field("cfEmail", "อีเมล", { type: "email", ph: "you@mail.com", required: false })}
              </div>
              ${UI.field("cfMsg", "ข้อความ", { type: "textarea", ph: "เขียนข้อความหรือสอบถามสินค้าที่คุณสนใจ...", required: true, msg: "กรุณากรอกข้อความ" })}
              <button class="btn btn-primary btn-block" type="submit">ส่งข้อความ 💌</button>
            </form>
          </div>
        </div>
      </div>
    </div>`;
  return {
    title: "ติดต่อเรา",
    html,
    init(container) {
      const form = _q("#contactForm", container);
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!UI.validate(form, ["cfName", "cfPhone", "cfMsg"])) { toast("กรุณากรอกข้อมูลให้ครบถ้วน", "danger"); return; }
        toast("ส่งข้อความเรียบร้อยแล้ว ทีมงานจะติดต่อกลับภายใน 24 ชม.", "success");
        form.reset();
      });
    },
  };
}

App.routes.push(
  { pattern: [""], role: null, dash: false, title: "หน้าแรก", render: () => HomeView() },
  { pattern: ["products"], role: null, dash: false, title: "สินค้าทั้งหมด", render: (p, q) => ProductsView(p, q) },
  { pattern: ["categories", ":cid"], role: null, dash: false, title: "หมวดหมู่สินค้า", render: (p, q) => ProductsView(p, Object.assign({}, q, { cat: p.cid })) },
  { pattern: ["products", ":id"], role: null, dash: false, title: "รายละเอียดสินค้า", render: (p) => ProductDetailView(p) },
  { pattern: ["about"], role: null, dash: false, title: "เกี่ยวกับชุมชน", render: () => AboutView() },
  { pattern: ["contact"], role: null, dash: false, title: "ติดต่อเรา", render: () => ContactView() }
);