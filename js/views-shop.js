function orderCardHTML(o, opts) {
  const store = Store.getStore(o.sellerId);
  const tl = Store.formatOrderTimeline(o.status);
  const stepsMap = { pending: "⏳", processing: "🧺", shipping: "🚚", delivered: "✅" };
  const isBuyer = opts && opts.role === "buyer";
  return `
    <div class="order-card" data-order="${o.id}">
      <div class="order-head">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <span class="order-no">#${esc(o.no)}</span>
          <span class="small muted">${esc(o.date)}</span>
          ${!isBuyer && store ? `<span class="badge badge-primary">${store.emoji} ${esc(store.name)}</span>` : ""}
          ${isBuyer ? `<span class="small muted">ผู้ขาย: ${esc(store ? store.name : "-")}</span>` : `<span class="small muted">ลูกค้า: ${esc(o.buyerName)}</span>`}
        </div>
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          ${statusBadge(o.status)}
          <button class="btn btn-outline btn-sm" data-detail="${o.id}">ดูรายละเอียด</button>
        </div>
      </div>
      <div class="card-pad" style="padding-top:12px">
        <div class="timeline">
          ${["pending", "processing", "shipping", "delivered"].map((s, i) => `
            ${i ? `<div class="tl-line"></div>` : ""}
            <div class="tl-step ${tl[i].done ? "done" : ""} ${tl[i].active ? "active" : ""}">
              <span class="tl-dot">${stepsMap[s]}</span>
              <span class="step-label">${Store.STATUS_LABEL[s]}</span>
            </div>`).join("")}
        </div>
        <div class="stack" style="gap:6px">
          ${o.items.map((i) => `<div class="order-item">
            <div class="order-item-media" style="background:linear-gradient(135deg,${(Store.getProduct(i.id) || { c1: "#999", c2: "#bbb" }).c1},${(Store.getProduct(i.id) || { c1: "#999", c2: "#bbb" }).c2})">${i.emoji}</div>
            <div><div class="strong truncate" style="font-size:13.5px">${esc(i.name)}</div><div class="small muted">${fmt(i.qty)} × ${Store.currency(i.price)} / ${esc(i.unit)}</div></div>
            <b class="small">${Store.currency(i.line)}</b>
          </div>`).join("")}
        </div>
        <div class="row-between mt-3" style="border-top:1px dashed var(--border);padding-top:10px">
          <div class="small muted">รวม ${fmt(o.items.reduce((s, i) => s + i.qty, 0))} ชิ้น · ค่าส่ง ${o.ship ? Store.currency(o.ship) : "ฟรี"}</div>
          <div><span class="small muted">ยอดรวม </span><b style="font-size:16px;color:var(--primary)">${Store.currency(o.total)}</b></div>
        </div>
        ${isBuyer && o.status === "pending" ? `<div class="mt-3" style="text-align:right"><button class="btn btn-danger btn-sm" data-cancel="${o.id}">ยกเลิกคำสั่งซื้อ</button></div>` : ""}
      </div>
    </div>`;
}

function orderDetailModal(o) {
  const store = Store.getStore(o.sellerId);
  const user = Store.getUser(o.buyerId);
  const payMap = { cod: "เก็บเงินปลายทาง (COD)", qr: "QR Payment / โอนเงิน", card: "บัตรเครดิต/เดบิต" };
  const shipMap = { standard: "จัดส่งมาตรฐาน", express: "จัดส่งด่วน", pick: "รับสินค้าด้วยตัวเอง" };
  const m = UI.modal(`
    <div class="modal-head"><h3>คำสั่งซื้อ #${esc(o.no)}</h3><button class="modal-close" data-close-modal>✕</button></div>
    <div class="modal-body">
      <div class="row-between mb-3"><span class="small muted">สถานะ</span>${statusBadge(o.status)}</div>
      <div class="row-between mb-3"><span class="small muted">วันที่สั่ง</span><span>${esc(o.date)}</span></div>
      <div class="row-between mb-3"><span class="small muted">ร้านค้า</span><span>${store ? store.emoji + " " + esc(store.name) : "-"}</span></div>
      <div class="row-between mb-3"><span class="small muted">ลูกค้า</span><span>${esc(o.buyerName)} ${o.buyerPhone ? "(" + esc(o.buyerPhone) + ")" : ""}</span></div>
      <div class="row-between mb-3"><span class="small muted">ที่อยู่จัดส่ง</span><span class="truncate" style="max-width:60%;text-align:right">${esc(o.address || "-")}</span></div>
      <div class="row-between mb-3"><span class="small muted">ชำระเงิน</span><span>${payMap[o.payment] || o.payment}</span></div>
      <div class="row-between mb-3"><span class="small muted">การจัดส่ง</span><span>${shipMap[o.shipping] || o.shipping}</span></div>
      <div style="border-top:1px dashed var(--border);padding-top:12px">
        ${o.items.map((i) => `<div class="row-between mb-2 small" style="font-size:13px"><span>${i.emoji} ${esc(i.name)} × ${fmt(i.qty)}</span><span>${Store.currency(i.line)}</span></div>`).join("")}
      </div>
      <div style="border-top:1px dashed var(--border);margin-top:8px;padding-top:10px">
        <div class="row-between small muted mb-1"><span>ค่าสินค้า</span><span>${Store.currency(o.subtotal)}</span></div>
        <div class="row-between small muted mb-1"><span>ค่าจัดส่ง</span><span>${o.ship ? Store.currency(o.ship) : "ฟรี"}</span></div>
        ${o.discount ? `<div class="row-between small muted mb-1"><span>ส่วนลด</span><span>-${Store.currency(o.discount)}</span></div>` : ""}
        <div class="row-between strong mt-2"><span>ยอดรวม</span><span style="color:var(--primary);font-size:17px">${Store.currency(o.total)}</span></div>
      </div>
    </div>`);
}

function cartView() {
  const items = Store.cartDetailed();
  const subtotal = items.reduce((s, i) => s + i.line, 0);
  const user = Store.currentUser();
  const html = `
    <div class="view-pad">
      <div class="container">
        ${UI.breadcrumb([{ label: "หน้าแรก", href: "#/" }, { label: "ตะกร้าสินค้า", current: true }])}
        <div class="page-head"><h1>🛒 ตะกร้าสินค้า</h1><div class="sub">ตรวจสอบรายการก่อนดำเนินการสั่งซื้อ</div></div>
        <div class="grid" style="grid-template-columns:1fr 340px;gap:20px;align-items:start" id="cartLayout">
          <div id="cartList"></div>
          <div id="cartSummary"></div>
        </div>
      </div>
    </div>`;
  return {
    title: "ตะกร้าสินค้า",
    html,
    init(container) { renderCartInto(container, items, subtotal, user); },
  };
}

function renderCartInto(container, items, subtotal, user) {
  const list = _q("#cartList", container);
  const summary = _q("#cartSummary", container);
  if (!items.length) {
    list.innerHTML = UI.emptyState("🧺", "ตะกร้าของคุณว่างเปล่า", "ยังไม่มีสินค้าในตะกร้า ลองดูสินค้าขายดีก่อนสิ", `<a class="btn btn-primary mt-3" href="#/products">เลือกซื้อสินค้า</a>`);
    summary.innerHTML = "";
    return;
  }
  list.innerHTML = items.map((i) => `
    <div class="cart-item mb-3" data-rid="${i.id}">
      <div class="cart-item-media" style="background:linear-gradient(135deg,${i.c1},${i.c2})">${i.emoji}</div>
      <div>
        <a class="cart-item-name" href="#/products/${i.id}">${esc(i.name)}</a>
        <div class="cart-item-sub">${esc((Store.getStore(i.sellerId) || { name: "ร้านค้า" }).name)} · หน่วย: ${esc(i.unit)}</div>
        <div class="cart-item-price">${Store.currency(i.price)} / ${esc(i.unit)}</div>
        <div class="qty mt-2">
          <button data-dec="${i.id}" aria-label="ลดจำนวน">−</button>
          <input data-qty="${i.id}" type="number" value="${i.qty}" min="1" max="${i.stock}">
          <button data-inc="${i.id}" aria-label="เพิ่มจำนวน">＋</button>
        </div>
      </div>
      <div class="cart-item-right">
        <button class="btn btn-ghost btn-icon" data-del="${i.id}" title="ลบ" aria-label="ลบสินค้า">🗑️</button>
        <div class="cart-item-price" style="font-size:17px">${Store.currency(i.line)}</div>
      </div>
    </div>`).join("");
  _qa("[data-dec]", container).forEach((b) => { const id = Number(b.dataset.dec); b.addEventListener("click", () => { Store.setCartQty(id, (Store.getCart().find((x) => x.id === id) || { qty: 1 }).qty - 1); App.refreshChrome(); Router.reload(); }); });
  _qa("[data-inc]", container).forEach((b) => { const id = Number(b.dataset.inc); b.addEventListener("click", () => { Store.setCartQty(id, (Store.getCart().find((x) => x.id === id) || { qty: 0 }).qty + 1); App.refreshChrome(); Router.reload(); }); });
  _qa("[data-qty]", container).forEach((i) => i.addEventListener("change", () => { Store.setCartQty(Number(i.dataset.qty), Number(i.value) || 1); App.refreshChrome(); Router.reload(); }));
  _qa("[data-del]", container).forEach((b) => b.addEventListener("click", () => { Store.removeFromCart(Number(b.dataset.del)); App.refreshChrome(); Router.reload(); }));

  const shipEstimate = subtotal >= SETTINGS.freeShippingAbove ? 0 : SETTINGS.shippingFee;
  summary.innerHTML = `
    <div class="summary-card">
      <div class="summary-head">สรุปคำสั่งซื้อ</div>
      <div class="summary-body">
        <div class="sum-row"><span>สินค้า (${fmt(items.reduce((s, i) => s + i.qty, 0))} ชิ้น)</span><span>${Store.currency(subtotal)}</span></div>
        <div class="sum-row"><span>ค่าจัดส่ง (โดยประมาณ)</span><span>${shipEstimate ? Store.currency(shipEstimate) : "ฟรี"}</span></div>
        ${subtotal < SETTINGS.freeShippingAbove ? `<div class="alert alert-info mt-2" style="font-size:12.5px;padding:8px 12px"><span class="ico">ℹ️</span><div>สั่งครบ ${Store.currency(SETTINGS.freeShippingAbove)} ขึ้นไป ฟรีค่าจัดส่ง!</div></div>` : `<div class="alert alert-success mt-2" style="font-size:12.5px;padding:8px 12px"><span class="ico">🎉</span><div>คุณได้รับสิทธิ์ค่าจัดส่งฟรีแล้ว</div></div>`}
        <div class="sum-row total"><span>ยอดรวม</span><span>${Store.currency(subtotal + shipEstimate)}</span></div>
        <button class="btn btn-accent btn-lg btn-block" id="goCheckout" style="margin-top:14px">ดำเนินการสั่งซื้อ →</button>
        <a class="btn btn-ghost btn-block mt-2" href="#/products">← เลือกซื้อเพิ่มเติม</a>
      </div>
    </div>`;
  const go = _q("#goCheckout", container);
  if (go) go.addEventListener("click", () => {
    if (!user || user.role !== "buyer") {
      App.flash = { next: "#/checkout" };
      toast("กรุณาเข้าสู่ระบบในฐานะผู้ซื้อเพื่อดำเนินการสั่งซื้อ", "warning");
      location.hash = "#/login";
    } else {
      location.hash = "#/checkout";
    }
  });
}

let appliedPromo = null;

function checkoutView() {
  const user = Store.currentUser();
  const items = Store.cartDetailed();
  const subtotal = items.reduce((s, i) => s + i.line, 0);
  if (!items.length) {
    return { title: "ชำระเงิน", html: `<div class="container-sm" style="padding-top:48px">${UI.emptyState("🧺", "ไม่มีสินค้าในตะกร้า", "กรุณาเพิ่มสินค้าก่อนดำเนินการสั่งซื้อ", `<a class="btn btn-primary mt-3" href="#/products">เลือกซื้อสินค้า</a>`)}</div>`, init: null };
  }
  const shipEstimate = subtotal >= SETTINGS.freeShippingAbove ? 0 : SETTINGS.shippingFee;
  const html = `
    <div class="view-pad">
      <div class="container-sm">
        ${UI.breadcrumb([{ label: "หน้าแรก", href: "#/" }, { label: "ตะกร้า", href: "#/cart" }, { label: "ชำระเงิน", current: true }])}
        <div class="steps">
          <div class="step done"><span class="num">✓</span><span class="step-label">ตะกร้า</span></div><div class="step-line"></div>
          <div class="step active"><span class="num">2</span><span class="step-label">ตรวจสอบรายการ</span></div><div class="step-line"></div>
          <div class="step"><span class="num">3</span><span class="step-label">ชำระเงิน</span></div><div class="step-line"></div>
          <div class="step"><span class="num">4</span><span class="step-label">เสร็จสิ้น</span></div>
        </div>
        <div class="grid" style="grid-template-columns:1fr 320px;gap:20px;align-items:start">
          <form id="checkoutForm" novalidate class="stack" style="gap:16px">
            <div class="card">
              <div class="card-head"><div class="strong">📦 สินค้าในคำสั่งซื้อ</div><span class="small muted">${fmt(items.length)} รายการจาก ${fmt(new Set(items.map((i) => i.sellerId)).size)} ร้านค้า</span></div>
              <div class="card-pad stack" style="gap:10px">
                ${new Set(items.map((i) => i.sellerId)).size > 1 ? `<div class="alert alert-info"><span class="ico">ℹ️</span><div>คำสั่งซื้อจะถูกแยกออกเป็นออเดอร์แยกร้านค้า แล้วจัดส่งให้คุณรวมกันในกรณีเดียวกัน</div></div>` : ""}
                ${items.map((i) => `<div class="row"><span class="avatar avatar-sm" style="background:linear-gradient(135deg,${i.c1},${i.c2});font-size:17px">${i.emoji}</span><div style="flex:1;min-width:0"><div class="truncate strong" style="font-size:13.5px">${esc(i.name)}</div><div class="small muted">${fmt(i.qty)} × ${Store.currency(i.price)} / ${esc(i.unit)}</div></div><b class="small">${Store.currency(i.line)}</b></div>`).join("")}
              </div>
            </div>
            <div class="card">
              <div class="card-head"><div class="strong">📍 ข้อมูลจัดส่ง</div></div>
              <div class="card-pad">
                <div class="form-grid">
                  ${UI.field("coName", "ชื่อผู้รับ", { required: true, value: user.name, msg: "กรุณากรอกชื่อผู้รับ" })}
                  ${UI.field("coPhone", "โทรศัพท์", { required: true, value: user.phone, msg: "กรุณากรอกเบอร์โทรศัพท์" })}
                </div>
                ${UI.field("coAddr", "ที่อยู่จัดส่งโดยละเอียด", { type: "textarea", required: true, value: user.address || "", msg: "กรุณากรอกที่อยู่จัดส่ง" })}
                <div class="form-grid">
                  ${UI.field("coNote", "หมายเหตุถึงผู้ขาย", { ph: "เช่น ส่งช่วงเย็น...", required: false })}
                  <div class="field"></div>
                </div>
                <label class="radio-card mb-2" id="pickAtStore"><input type="checkbox" id="coPick"> รับสินค้าที่จุดนัดพบของชุมชน (ฟรี)</label>
              </div>
            </div>
            <div class="card">
              <div class="card-head"><div class="strong">🚚 วิธีจัดส่ง</div></div>
              <div class="card-pad">
                <div class="stack" style="gap:10px">
                  <label class="radio-card sel" data-ship="standard"><input type="radio" name="ship" value="standard" checked><div><div class="r-title">จัดส่งมาตรฐาน</div><div class="r-sub">${subtotal >= SETTINGS.freeShippingAbove ? "ฟรีค่าส่งสำหรับออเดอร์นี้" : Store.currency(SETTINGS.shippingFee)} · รับภายใน 2-3 วัน</div></div></label>
                  <label class="radio-card" data-ship="express"><input type="radio" name="ship" value="express"><div><div class="r-title">จัดส่งด่วน</div><div class="r-sub">${Store.currency(SETTINGS.expressFee)} · รับภายใน 1 วัน</div></div></label>
                </div>
              </div>
            </div>
            <div class="card">
              <div class="card-head"><div class="strong">💳 วิธีชำระเงิน</div></div>
              <div class="card-pad">
                <div class="stack" style="gap:10px">
                  <label class="radio-card sel"><input type="radio" name="pay" value="cod" checked><div><div class="r-title">เก็บเงินปลายทาง (COD)</div><div class="r-sub">จ่ายเงินเมื่อรับสินค้าที่หน้าบ้าน</div></div></label>
                  <label class="radio-card" data-payqr="1"><input type="radio" name="pay" value="qr"><div><div class="r-title">QR Payment / โอนเงิน</div><div class="r-sub">สแกน QR Code เพื่อชำระเงินทันที</div></div></label>
                  <div id="qrBox" class="hidden" style="border:1px dashed var(--border-strong);border-radius:12px;padding:16px;text-align:center">
                    <div style="width:130px;height:130px;margin:0 auto 10px;border-radius:8px;background:repeating-conic-gradient(var(--text) 0% 25%, var(--bg) 0% 50%) 0 0/16px 16px" role="img" aria-label="QR Code"></div>
                    <div class="small muted">สแกนเพื่อชำระเงิน · อ้างอิง: ${esc(Store.genOrderNo())}</div>
                  </div>
                </div>
              </div>
            </div>
          </form>
          <div class="summary-card">
            <div class="summary-head">สรุปยอดชำระ</div>
            <div class="summary-body">
              <div class="sum-row"><span>ยอดรวมสินค้า</span><span>${Store.currency(subtotal)}</span></div>
              <div class="sum-row" id="coShipRow"><span>ค่าจัดส่ง</span><span>${Store.currency(shipEstimate)}</span></div>
              <div class="sum-row" id="coDiscRow" style="display:${appliedPromo ? "flex" : "none"}"><span>โค้ด ${appliedPromo ? appliedPromo.code : ""}</span><span style="color:var(--danger)">-${Store.currency(appliedPromo ? subtotal * appliedPromo.rate : 0)}</span></div>
              <div class="input-group mt-3"><input class="input" id="promoInput" placeholder="โค้ดส่วนลด เช่น LILEUD10"><button class="btn btn-outline" id="applyPromo" type="button">ใช้</button></div>
              <div id="promoMsg" class="small" style="min-height:18px;margin-top:4px"></div>
              <div class="sum-row total"><span>ยอดรวม</span><span id="coTotal">${Store.currency(subtotal + shipEstimate)}</span></div>
              <button class="btn btn-accent btn-lg btn-block" id="placeOrder" style="margin-top:14px">ยืนยันคำสั่งซื้อ ✓</button>
              <a class="btn btn-ghost btn-block mt-2" href="#/cart">← กลับไปแก้ไขตะกร้า</a>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  return {
    title: "ชำระเงิน",
    html,
    init(container) { initCheckout(container, items, subtotal); },
  };
}

function initCheckout(container, items, subtotal) {
  let shipMode = "standard";
  let payMode = "cod";
  _qa(".radio-card[data-ship]", container).forEach((c) => c.addEventListener("click", () => {
    _qa(".radio-card[data-ship]", container).forEach((x) => x.classList.remove("sel"));
    c.classList.add("sel"); c.querySelector("input").checked = true; shipMode = c.dataset.ship; updateTotal();
  }));
  _qa('input[name="pay"]', container).forEach((r) => r.addEventListener("change", () => {
    payMode = r.value;
    _q("#qrBox", container).classList.toggle("hidden", payMode !== "qr");
    _qa(".radio-card", container).forEach((x) => x.classList.toggle("sel", x.querySelector("input").checked));
  }));
  _q("#coPick", container).addEventListener("change", function () {
    _q("#pickAtStore", container).classList.toggle("sel", this.checked);
    updateTotal();
  });
  const promo = _q("#applyPromo", container);
  promo.addEventListener("click", () => {
    const code = _q("#promoInput", container).value.trim().toUpperCase();
    if (code === "LILEUD10") { appliedPromo = { code, rate: 0.1 }; _q("#promoMsg", container).innerHTML = '<span style="color:var(--success)">✅ ใช้ส่วนลด 10% แล้ว</span>'; }
    else { appliedPromo = null; _q("#promoMsg", container).innerHTML = '<span style="color:var(--danger)">ไม่พบโค้ดส่วนลดนี้</span>'; }
    updateTotal();
  });
  function shippingCost() {
    if (_q("#coPick", container).checked) return 0;
    if (shipMode === "express") return SETTINGS.expressFee;
    return subtotal >= SETTINGS.freeShippingAbove ? 0 : SETTINGS.shippingFee;
  }
  function discount() { return appliedPromo ? subtotal * appliedPromo.rate : 0; }
  function updateTotal() {
    const ship = shippingCost();
    const disc = discount();
    _q("#coShipRow", container).querySelector("span:last-child").textContent = ship ? Store.currency(ship) : "ฟรี";
    _q("#coDiscRow", container).style.display = disc ? "flex" : "none";
    _q("#coTotal", container).textContent = Store.currency(subtotal + ship - disc);
  }
  const place = _q("#placeOrder", container);
  place.addEventListener("click", (e) => {
    e.preventDefault();
    const form = _q("#checkoutForm", container);
    if (!UI.validate(form, ["coName", "coPhone", "coAddr"])) { toast("กรุณากรอกข้อมูลให้ครบถ้วน", "danger"); return; }
    const phone = _q("#coPhone", container).value.trim();
    if (!/^0\d{8,9}$/.test(phone)) { _q("#coPhone", container).closest(".field").classList.add("invalid"); toast("กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง", "danger"); return; }
    const addr = _q("#coPick", container).checked ? "รับสินค้าที่จุดนัดพบของชุมชน บ้านลีเล็ด" : _q("#coAddr", container).value.trim() + (_q("#coNote", container).value.trim() ? " (หมายเหตุ: " + _q("#coNote", container).value.trim() + ")" : "");
    const shipLabel = _q("#coPick", container).checked ? { method: "pick", label: "รับสินค้าด้วยตัวเอง" } : { method: shipMode, label: shipMode === "express" ? "จัดส่งด่วน" : "จัดส่งมาตรฐาน" };
    const res = Store.createOrder(Store.currentUser().id, shipLabel, payMode, addr, discount());
    if (!res.ok) { toast(res.msg, "danger"); return; }
    appliedPromo = null;
    App.refreshChrome && App.refreshChrome();
    showOrderSuccess(res.orders);
  });
}

function showOrderSuccess(ordersArr) {
  const nums = ordersArr.map((o) => o.no).join(" + ");
  const total = ordersArr.reduce((s, o) => s + o.total, 0);
  const m = UI.modal(`
    <div class="modal-head"><h3>🎉 สั่งซื้อสำเร็จ</h3><button class="modal-close" data-close-modal>✕</button></div>
    <div class="modal-body center" style="text-align:center">
      <div style="font-size:52px">🎉</div>
      <h3 style="font-size:18px;margin:10px 0 4px">ขอบคุณสำหรับคำสั่งซื้อ</h3>
      <p class="muted small" style="margin:0">ระบบได้สร้างคำสั่งซื้อ ${ordersArr.length > 1 ? fmt(ordersArr.length) + " รายการ (แยกร้านค้า)" : ""} เรียบร้อยแล้ว<br>ยอดรวม ${Store.currency(total)}</p>
      <div class="alert alert-info mt-4"><span class="ico">ℹ️</span><div>หมายเลขคำสั่งซื้อ: <b>${nums}</b><br>เราจะแจ้งสถานะการจัดส่งให้ทราบทุกขั้นตอน</div></div>
    </div>
    <div class="modal-foot">
      <button class="btn btn-ghost" data-cancel="1">ปิด</button>
      <a class="btn btn-primary" href="#/orders">ดูคำสั่งซื้อของฉัน</a>
    </div>`);
  const c = _q("[data-cancel]", m.el); if (c) c.addEventListener("click", m.close);
}

function buyerOrdersView() {
  const user = Store.currentUser();
  const orders = Store.getOrders().filter((o) => o.buyerId === user.id).sort((a, b) => (b.dateISO || "").localeCompare(a.dateISO || ""));
  return {
    title: "คำสั่งซื้อของฉัน",
    html: `
      <div class="view-pad">
        <div class="container-sm">
          ${UI.breadcrumb([{ label: "Dashboard", href: "#/dash/buyer" }, { label: "คำสั่งซื้อของฉัน", current: true }])}
          <div class="page-head"><h1>📦 คำสั่งซื้อของฉัน</h1><div class="sub">ติดตามสถานะคำสั่งซื้อทั้งหมดของคุณ</div></div>
          <div id="ordersRoot">${UI.loadingBox("กำลังโหลดคำสั่งซื้อ")}</div>
        </div>
      </div>`,
    init(container) {
      setTimeout(() => {
        const root = _q("#ordersRoot", container);
        if (!orders.length) {
          root.innerHTML = UI.emptyState("📦", "ยังไม่มีคำสั่งซื้อ", "เริ่มต้นช้อปปิ้งสินค้าจากชุมชนของเราก่อนได้เลย", `<a class="btn btn-primary mt-3" href="#/products">เริ่มช้อปเลย</a>`);
        } else {
          root.innerHTML = `<div class="stack" style="gap:16px">${orders.map((o) => orderCardHTML(o, { role: "buyer" })).join("")}</div>`;
          _qa("[data-detail]", root).forEach((b) => b.addEventListener("click", () => orderDetailModal(Store.getOrders().find((x) => x.id === Number(b.dataset.detail)))));
          _qa("[data-cancel]", root).forEach((b) => b.addEventListener("click", () => {
            const id = Number(b.dataset.cancel);
            UI.confirmModal("ยกเลิกคำสั่งซื้อ", "ต้องการยกเลิกคำสั่งซื้อนี้หรือไม่?", "การยกเลิกคำสั่งซื้อนี้ไม่สามารถย้อนกลับได้", () => {
              const r = Store.updateOrderStatus(id, "cancelled");
              if (r.ok) { toast("ยกเลิกคำสั่งซื้อเรียบร้อยแล้ว", "success"); Router.reload(); } else { toast(r.msg, "danger"); }
            }, "ยกเลิกคำสั่งซื้อ");
          }));
        }
      }, 250);
    },
  };
}

App.routes.push(
  { pattern: ["cart"], role: null, dash: false, title: "ตะกร้าสินค้า", render: () => cartView() },
  { pattern: ["checkout"], role: ["buyer"], dash: false, title: "ชำระเงิน", render: () => checkoutView() },
  { pattern: ["orders"], role: ["buyer"], dash: false, title: "คำสั่งซื้อของฉัน", render: () => buyerOrdersView() }
);