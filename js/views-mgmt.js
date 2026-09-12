function mgmtPage(user, activeKey, menuKey, title, sub, buildBody) {
  const b = dashWrapper(null, buildBody);
  return DashShell.build(user, activeKey, menuKey, b.html, { title, sub, init: b.init });
}

function emojiPicker(selected) {
  return `<div class="thumb-pick">${EMOJI_CHOICES.map((e) => `<button type="button" class="tp ${e === selected ? "sel" : ""}" data-emoji="${e}" style="font-size:20px">${e}</button>`).join("")}</div>`;
}
function bindEmojiPicker(root) {
  _qa("[data-emoji]", root).forEach((b) => b.addEventListener("click", () => {
    _qa("[data-emoji]", root).forEach((x) => x.classList.remove("sel"));
    b.classList.add("sel");
    const hidden = _q("[data-emoji-val]", root);
    if (hidden) hidden.value = b.dataset.emoji;
  }));
}

function userModal(u, title) {
  const isEdit = !!u;
  u = u || {};
  const m = UI.modal(`
    <div class="modal-head"><h3>${esc(title || (isEdit ? "แก้ไขผู้ใช้" : "เพิ่มผู้ใช้"))}</h3><button class="modal-close" data-close-modal>✕</button></div>
    <div class="modal-body">
      <form id="userFormM" novalidate>
        <div class="form-grid">
          ${UI.field("muName", "ชื่อ-นามสกุล", { required: true, value: u.name, msg: "กรุณากรอกชื่อ" })}
          ${UI.field("muPhone", "เบอร์โทรศัพท์", { required: true, value: u.phone, msg: "กรุณากรอกเบอร์โทรศัพท์" })}
          ${UI.field("muEmail", "อีเมล", { type: "email", value: u.email, required: false })}
          ${UI.field("muAddr", "ที่อยู่", { value: u.address, required: false })}
        </div>
        <div class="form-grid">
          ${UI.field("muUser", "ชื่อผู้ใช้", { required: true, value: u.username, msg: "กรุณากรอกชื่อผู้ใช้" })}
          ${UI.field("muPass", isEdit ? "รหัสผ่านใหม่" : "รหัสผ่าน", { type: "password", required: !isEdit, ph: isEdit ? "เว้นว่างเพื่อคงเดิม" : "อย่างน้อย 4 ตัว", msg: "อย่างน้อย 4 ตัว" })}
        </div>
        <div class="form-grid">
          ${UI.field("muRole", "บทบาท", { type: "select", required: true, value: u.role || "buyer", options: [{ value: "buyer", label: "ผู้ซื้อ" }, { value: "seller", label: "ผู้ขาย" }, { value: "admin", label: "ผู้ดูแลระบบ" }, { value: "owner", label: "เจ้าของระบบ" }], msg: "เลือกบทบาท" })}
          ${UI.field("muStatus", "สถานะ", { type: "select", required: true, value: u.status || "active", options: [{ value: "active", label: "เปิดใช้งาน" }, { value: "suspended", label: "ระงับการใช้งาน" }], msg: "เลือกสถานะ" })}
        </div>
      </form>
    </div>
    <div class="modal-foot">
      <button class="btn btn-ghost" data-cancel="1">ยกเลิก</button>
      <button class="btn btn-primary" id="muSave">บันทึก</button>
    </div>`);
  _q("[data-cancel]", m.el).addEventListener("click", m.close);
  const save = _q("#muSave", m.el);
  save.addEventListener("click", () => {
    const form = _q("#userFormM", m.el);
    const fields = ["muName", "muPhone", "muUser"];
    if (!isEdit) fields.push("muPass");
    if (!UI.validate(form, fields)) { toast("กรุณากรอกข้อมูลให้ครบถ้วน", "danger"); return; }
    const uname = _q("#muUser", m.el).value.trim();
    if (!isEdit && Store.getUserByUsername(uname)) { toast("ชื่อผู้ใช้นี้ถูกใช้แล้ว", "danger"); return; }
    const pass = isEdit ? _q("#muPass", m.el).value : _q("#muPass", m.el).value;
    if (pass && pass.length < 4) { toast("รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร", "danger"); return; }
    const data = {
      name: _q("#muName", m.el).value.trim(), phone: _q("#muPhone", m.el).value.trim(),
      email: _q("#muEmail", m.el).value.trim(), address: _q("#muAddr", m.el).value.trim(),
      username: uname, role: _q("#muRole", m.el).value, status: _q("#muStatus", m.el).value,
    };
    if (pass) data.password = pass;
    if (isEdit) {
      Store.updateUser(u.id, data);
      toast("บันทึกข้อมูลผู้ใช้เรียบร้อย", "success");
    } else {
      Store.register(data);
      toast("เพิ่มบัญชีผู้ใช้เรียบร้อย", "success");
    }
    m.close();
    Router.reload();
  });
}

function storeDetailModal(store) {
  const owner = Store.getUsers().find((x) => x.storeId === store.id);
  const infoRows = [
    ["ร้านค้า", store.emoji + " " + store.name],
    ["เจ้าของร้าน", store.owner],
    ["ชื่อผู้ใช้", owner ? "@" + owner.username : "-"],
    ["โทรศัพท์", store.phone],
    ["Line", store.line],
    ["รายละเอียด", store.desc],
    ["สมาชิกตั้งแต่", store.since || "-"],
    ["สถานะ", store.status],
  ];
  UI.modal(`
    <div class="modal-head"><h3>${store.emoji} ${esc(store.name)}</h3><button class="modal-close" data-close-modal>✕</button></div>
    <div class="modal-body">
      <div class="stack small" style="font-size:13.5px;gap:10px">
        ${infoRows.map(([k, v]) => `<div class="row-between"><span class="muted">${esc(k)}</span><b style="text-align:right;max-width:65%">${esc(v)}</b></div>`).join("")}
      </div>
      <div style="border-top:1px dashed var(--border);margin-top:14px;padding-top:12px">
        <div class="small muted mb-2">สินค้าในร้าน (${fmt(Store.storeProducts(store.id, false).length)} รายการ)</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          ${Store.storeProducts(store.id, false).slice(0, 8).map((p) => `<span class="badge badge-outline">${p.emoji} ${esc(p.name)}</span>`).join("") || '<span class="small muted">ยังไม่มีสินค้า</span>'}
        </div>
      </div>
    </div>`);
}

function matters() {}

/* ==================== OWNER: บัญชีผู้ใช้ / ผู้ขาย / ผู้ซื้อ ==================== */

function ownerAccountsView() {
  const u = Store.currentUser();
  const users = Store.getUsers();
  const rows = (f, opts) => users.filter(f).map((x) => `
    <tr>
      <td class="cell-compact">${UI.avatar(x.name, "avatar-sm", x.username)}<div class="strong" style="font-size:13px">${esc(x.name)}</div><div class="small muted">@${esc(x.username)}</div></td>
      <td class="cell-compact small">${(opts && opts.roleOnly) ? Store.ROLE_LABEL[x.role] : `<span class="badge badge-primary">${Store.ROLE_LABEL[x.role]}</span>`}</td>
      <td class="cell-compact small">${esc(x.phone)}</td>
      <td class="cell-compact small">${esc(x.createdAt)}</td>
      <td class="cell-compact">${statusBadge(x.status)}</td>
      <td class="cell-compact"><div class="row-actions">
        <button class="btn btn-outline btn-sm" data-uedit="${x.id}">✏️</button>
        <button class="btn ${x.status === "active" ? "btn-danger" : "btn-soft"} btn-sm" data-utoggle="${x.id}">${x.status === "active" ? "⛔ ระงับ" : "✓ เปิดใช้"}</button>
        ${x.role !== "owner" ? `<button class="btn btn-danger btn-sm" data-udel="${x.id}">🗑️</button>` : ""}
      </div></td>
    </tr>`).join("");
  return mgmtPage(u, "accounts", "owner", "บัญชีผู้ใช้งาน", "เพิ่ม แก้ไข ลบ ตรวจสอบบัญชีผู้ใช้ทั้งหมดของระบบ",
    (c) => {
      const admin = users.filter((x) => x.role === "admin" || x.role === "owner");
      const sellers = users.filter((x) => x.role === "seller");
      const buyers = users.filter((x) => x.role === "buyer");
      c.innerHTML = `
        <div class="dash-grid">
          ${statCard("👥", fmt(users.length), "ผู้ใช้ทั้งหมด", "green")}
          ${statCard("🛡️", fmt(admin.length), "ทีมงานระบบ", "blue")}
          ${statCard("🧑‍🌾", fmt(sellers.length), "ผู้ขาย", "amber")}
          ${statCard("🛒", fmt(buyers.length), "ผู้ซื้อ", "purple")}
        </div>
        <div class="card">
          <div class="card-head"><div class="card-title" style="margin:0">ผู้ใช้งานทั้งหมด</div><button class="btn btn-primary btn-sm" id="addUserBtn">＋ เพิ่มผู้ใช้</button></div>
          <div class="card-pad" style="padding-top:8px">
            <div class="table-wrap"><table class="table">
              <thead><tr><th>ผู้ใช้</th><th>บทบาท</th><th>เบอร์โทร</th><th>สมัครเมื่อ</th><th>สถานะ</th><th class="t-right">จัดการ</th></tr></thead>
              <tbody>${users.map((x) => `
                <tr>
                  <td class="cell-compact">${UI.avatar(x.name, "avatar-sm", x.username)}<div class="strong" style="font-size:13px">${esc(x.name)}</div><div class="small muted">@${esc(x.username)}</div></td>
                  <td class="cell-compact">${x.role === "owner" ? '<span class="badge badge-hot">👑 เจ้าของระบบ</span>' : `<span class="badge badge-primary">${Store.ROLE_LABEL[x.role]}</span>`}</td>
                  <td class="cell-compact small">${esc(x.phone)}</td>
                  <td class="cell-compact small">${esc(x.createdAt)}</td>
                  <td class="cell-compact">${statusBadge(x.status)}</td>
                  <td class="cell-compact"><div class="row-actions">
                    <button class="btn btn-outline btn-sm" data-uedit="${x.id}" title="แก้ไข">✏️</button>
                    <button class="btn ${x.status === "active" ? "btn-outline" : "btn-soft"} btn-sm" data-utoggle="${x.id}" title="${x.status === "active" ? "ระงับ" : "เปิดใช้"}">${x.status === "active" ? "⛔" : "✓"}</button>
                    ${x.role !== "owner" && x.id !== Store.currentUser().id ? `<button class="btn btn-danger btn-sm" data-udel="${x.id}" title="ลบ">🗑️</button>` : ""}
                  </div></td>
                </tr>`).join("")}
              </tbody></table></div>
          </div>
        </div>`;
      bindUserActions(c);
    });
}

function bindUserActions(c) {
  _q("#addUserBtn", c).addEventListener("click", () => userModal(null));
  _qa("[data-uedit]", c).forEach((b) => b.addEventListener("click", () => userModal(Store.getUser(Number(b.dataset.uedit)), "แก้ไขผู้ใช้")));
  _qa("[data-utoggle]", c).forEach((b) => b.addEventListener("click", () => {
    const u = Store.getUser(Number(b.dataset.utoggle));
    const next = u.status === "active" ? "suspended" : "active";
    UI.confirmModal(next === "suspended" ? "ระงับบัญชี" : "เปิดใช้บัญชี", next === "suspended" ? `ต้องการระงับบัญชีของ ${u.name} หรือไม่?` : `เปิดใช้บัญชี ${u.name}`, next === "suspended" ? "บัญชีที่ถูกระงับจะไม่สามารถเข้าสู่ระบบได้จนกว่าจะเปิดใช้ใหม่" : "", () => {
      Store.updateUser(u.id, { status: next });
      toast(next === "suspended" ? "ระงับบัญชีเรียบร้อยแล้ว" : "เปิดใช้บัญชีเรียบร้อยแล้ว", "success");
      Router.reload();
    }, next === "suspended" ? "ระงับบัญชี" : "เปิดใช้งาน");
  }));
  _qa("[data-udel]", c).forEach((b) => b.addEventListener("click", () => {
    const u = Store.getUser(Number(b.dataset.udel));
    UI.confirmModal("ลบผู้ใช้", `ต้องการลบบัญชี ${u.name} (@${u.username}) ?`, "การลบไม่สามารถย้อนกลับได้ โปรดตรวจสอบให้แน่ใจ", () => {
      Store.deleteUser(u.id);
      toast("ลบบัญชีผู้ใช้เรียบร้อย", "success");
      Router.reload();
    }, "ลบผู้ใช้");
  }));
}

function ownerSellersView() {
  const u = Store.currentUser();
  return mgmtPage(u, "sellers", "owner", "ผู้ขาย / ร้านค้า", "ตรวจสอบข้อมูลผู้ขายและร้านค้าทั้งหมดในระบบ",
    (c) => {
      c.innerHTML = `
        <div class="card"><div class="card-head"><div class="card-title" style="margin:0">ร้านค้าทั้งหมด</div><span class="small muted">${fmt(STORES.length)} ร้าน</span></div>
        <div class="card-pad" style="padding-top:8px">
          <div class="table-wrap"><table class="table">
            <thead><tr><th>ร้านค้า</th><th>เจ้าของ</th><th>สินค้า</th><th>ยอดขาย</th><th>เรตติ้ง</th><th>สถานะ</th><th class="t-right">จัดการ</th></tr></thead>
            <tbody>${STORES.map((s) => {
              const orders = Store.getOrders().filter((o) => o.sellerId === s.id && o.status !== "cancelled");
              const rev = orders.reduce((a, o) => a + o.total, 0);
              return `<tr>
                <td class="cell-compact"><span class="avatar avatar-sm" style="background:linear-gradient(135deg,${s.c1},${s.c2})">${s.emoji}</span><div class="strong" style="font-size:13px">${esc(s.name)}</div></td>
                <td class="cell-compact small">${esc(s.owner)}</td>
                <td class="cell-compact">${fmt(Store.storeProducts(s.id, true).length)} รายการ</td>
                <td class="cell-compact strong">${Store.currency(rev)}</td>
                <td class="cell-compact">${s.rating ? "⭐ " + Number(s.rating).toFixed(1) : "-"}</td>
                <td class="cell-compact">${statusBadge(s.status)}</td>
                <td class="cell-compact"><div class="row-actions">
                  <button class="btn btn-outline btn-sm" data-sview="${s.id}">👁️</button>
                  ${s.status === "active" ? `<button class="btn btn-outline btn-sm" data-stoggle="${s.id}">⛔</button>` : s.status === "suspended" ? `<button class="btn btn-soft btn-sm" data-stoggle="${s.id}">✓ เปิด</button>` : `<button class="btn btn-primary btn-sm" data-sapprove="${s.id}">✓ อนุมัติ</button>`}
                </div></td>
              </tr>`; }).join("")}
            </tbody></table></div>
        </div></div>`;
      bindStoreActions(c);
    });
}

function bindStoreActions(c) {
  _qa("[data-sview]", c).forEach((b) => b.addEventListener("click", () => storeDetailModal(STORES.find((s) => s.id === b.dataset.sview))));
  _qa("[data-sapprove]", c).forEach((b) => b.addEventListener("click", () => {
    const s = STORES.find((x) => x.id === b.dataset.sapprove);
    UI.confirmModal("อนุมัติร้านค้า", `ยืนยันการอนุมัติร้าน "${s.name}" ?`, "ร้านค้าจะสามารถเปิดขายสินค้าได้ทันที", () => {
      s.status = "active"; s.approvedAt = new Date().toISOString().slice(0, 10);
      toast("อนุมัติร้านค้าเรียบร้อยแล้ว", "success"); Router.reload();
    });
  }));
  _qa("[data-stoggle]", c).forEach((b) => b.addEventListener("click", () => {
    const s = STORES.find((x) => x.id === b.dataset.stoggle);
    const next = s.status === "active" ? "suspended" : "active";
    UI.confirmModal(next === "suspended" ? "ระงับร้านค้า" : "เปิดใช้ร้านค้า", next === "suspended" ? `ระงับร้าน "${s.name}"` : `เปิดใช้ร้าน "${s.name}"`, next === "suspended" ? "ร้านค้านี้จะหยุดรับคำสั่งซื้อใหม่ทันที" : "", () => {
      s.status = next;
      const owner = Store.getUsers().find((x) => x.storeId === s.id);
      if (owner && next === "suspended") Store.updateUser(owner.id, { status: "suspended" });
      if (owner && next === "active") Store.updateUser(owner.id, { status: "active" });
      toast("อัปเดตสถานะร้านค้าเรียบร้อย", "success"); Router.reload();
    }, next === "suspended" ? "ระงับร้าน" : "เปิดใช้");
  }));
}

function ownerBuyersView() {
  const u = Store.currentUser();
  const buyers = Store.getUsers().filter((x) => x.role === "buyer");
  return mgmtPage(u, "buyers", "owner", "ผู้ซื้อ", "ตรวจสอบข้อมูลบัญชีผู้ซื้อในระบบ",
    (c) => {
      c.innerHTML = `<div class="card"><div class="card-head"><div class="card-title" style="margin:0">บัญชีผู้ซื้อ</div><span class="small muted">${fmt(buyers.length)} คน</span></div>
      <div class="card-pad" style="padding-top:8px">
        <div class="table-wrap"><table class="table">
          <thead><tr><th>ผู้ซื้อ</th><th>เบอร์โทร</th><th>ที่อยู่</th><th>คำสั่งซื้อ</th><th>ใช้จ่ายรวม</th><th>สมัครเมื่อ</th><th>สถานะ</th><th class="t-right">จัดการ</th></tr></thead>
          <tbody>${buyers.map((x) => {
            const os = Store.getOrders().filter((o) => o.buyerId === x.id && o.status !== "cancelled");
            return `<tr>
              <td class="cell-compact">${UI.avatar(x.name, "avatar-sm", x.username)}<div class="strong" style="font-size:13px">${esc(x.name)}</div><div class="small muted">@${esc(x.username)}</div></td>
              <td class="cell-compact small">${esc(x.phone)}</td>
              <td class="cell-compact small" style="max-width:220px"><span class="truncate">${esc(x.address || "-")}</span></td>
              <td class="cell-compact">${fmt(os.length)}</td>
              <td class="cell-compact strong">${Store.currency(os.reduce((a, o) => a + o.total, 0))}</td>
              <td class="cell-compact small">${esc(x.createdAt)}</td>
              <td class="cell-compact">${statusBadge(x.status)}</td>
              <td class="cell-compact"><button class="btn btn-outline btn-sm" data-uedit="${x.id}">✏️</button></td>
            </tr>`; }).join("")}
          </tbody></table></div>
      </div></div>`;
      _qa("[data-uedit]", c).forEach((b) => b.addEventListener("click", () => userModal(Store.getUser(Number(b.dataset.uedit)), "แก้ไขผู้ซื้อ")));
    });
}

/* ==================== ADMIN: ผู้ใช้ / อนุมัติผู้ขาย ==================== */

function adminUsersView() {
  const u = Store.currentUser();
  const users = Store.getUsers();
  const recent = users.filter((x) => x.role === "buyer" && x.createdAt >= "2569-08-20");
  return mgmtPage(u, "users", "admin", "จัดการผู้ใช้", "ตรวจสอบสมาชิกใหม่และจัดการบัญชีผู้ใช้",
    (c) => {
      c.innerHTML = `
        <div class="grid" style="grid-template-columns:1fr 1.5fr;gap:20px;align-items:start">
          <div class="card">
            <div class="card-head"><div class="card-title" style="margin:0">🆕 สมาชิกใหม่</div><span class="small muted">${fmt(recent.length)} ราย</span></div>
            <div class="card-pad stack">
              ${recent.length ? recent.map((x) => `<div class="row">
                ${UI.avatar(x.name, "avatar-sm", x.username)}
                <div style="flex:1;min-width:0"><div class="strong truncate" style="font-size:13px">${esc(x.name)}</div><div class="small muted">@${esc(x.username)} · ${esc(x.createdAt)}</div></div>
                <span>${statusBadge(x.status)}</span>
              </div>`).join("") : `<div class="empty-state" style="padding:24px"><div class="ico">✅</div><h3>ไม่มีสมาชิกใหม่</h3><p>ตรวจสอบล่าสุดแล้ว</p></div>`}
            </div>
          </div>
          <div class="card">
            <div class="card-head"><div class="card-title" style="margin:0">ผู้ใช้ทั้งหมด</div><button class="btn btn-primary btn-sm" id="addUserBtn">＋ เพิ่มผู้ใช้</button></div>
            <div class="card-pad" style="padding-top:8px">
              <div class="table-wrap"><table class="table">
                <thead><tr><th>ผู้ใช้</th><th>บทบาท</th><th>สถานะ</th><th class="t-right">จัดการ</th></tr></thead>
                <tbody>${users.map((x) => `
                  <tr>
                    <td class="cell-compact">${UI.avatar(x.name, "avatar-sm", x.username)}<div class="strong" style="font-size:13px">${esc(x.name)}</div><div class="small muted">@${esc(x.username)}</div></td>
                    <td class="cell-compact small">${Store.ROLE_LABEL[x.role]}</td>
                    <td class="cell-compact">${statusBadge(x.status)}</td>
                    <td class="cell-compact"><div class="row-actions">
                      <button class="btn btn-outline btn-sm" data-uedit="${x.id}">✏️</button>
                      <button class="btn ${x.status === "active" ? "btn-outline" : "btn-soft"} btn-sm" data-utoggle="${x.id}">${x.status === "active" ? "⛔" : "✓"}</button>
                    </div></td>
                  </tr>`).join("")}
                </tbody></table></div>
            </div>
          </div>
        </div>`;
      _q("#addUserBtn", c).addEventListener("click", () => userModal(null));
      _qa("[data-uedit]", c).forEach((b) => b.addEventListener("click", () => userModal(Store.getUser(Number(b.dataset.uedit)), "แก้ไขผู้ใช้")));
      _qa("[data-utoggle]", c).forEach((b) => b.addEventListener("click", () => {
        const x = Store.getUser(Number(b.dataset.utoggle));
        const next = x.status === "active" ? "suspended" : "active";
        UI.confirmModal(next === "suspended" ? "ระงับบัญชี" : "เปิดใช้บัญชี", next === "suspended" ? `ระงับบัญชี ${x.name}` : `เปิดใช้บัญชี ${x.name}`, "", () => {
          Store.updateUser(x.id, { status: next });
          toast("อัปเดตสถานะเรียบร้อย", "success"); Router.reload();
        }, next === "suspended" ? "ระงับ" : "เปิดใช้");
      }));
    });
}

function adminSellersView() {
  const u = Store.currentUser();
  const pending = STORES.filter((s) => s.status === "pending");
  const actives = STORES.filter((s) => s.status !== "pending");
  return mgmtPage(u, "sellers", "admin", "อนุมัติผู้ขาย", "คัดกรอง อนุมัติ และจัดการบัญชีผู้ขาย",
    (c) => {
      c.innerHTML = `
        <div class="dash-grid">
          ${statCard("⏳", fmt(pending.length), "รอรออนุมัติ", "amber")}
          ${statCard("🏪", fmt(actives.filter((s) => s.status === "active").length), "ร้านที่อนุมัติแล้ว", "green")}
          ${statCard("⛔", fmt(actives.filter((s) => s.status === "suspended").length), "ร้านที่ถูกระงับ", "red")}
        </div>
        <div class="card" style="margin-bottom:20px">
          <div class="card-head"><div class="card-title" style="margin:0">รอการอนุมัติ</div></div>
          <div class="card-pad stack" style="gap:14px">
            ${pending.length ? pending.map((s) => {
              const owner = Store.getUsers().find((x) => x.storeId === s.id);
              return `<div class="row" style="border:1px solid var(--border);border-radius:14px;padding:14px;align-items:flex-start">
                <span class="avatar avatar-md" style="background:linear-gradient(135deg,${s.c1},${s.c2})">${s.emoji}</span>
                <div style="flex:1;min-width:0">
                  <div class="strong" style="font-size:14.5px">${esc(s.name)}</div>
                  <div class="small muted">${esc(s.owner)} · ยื่นคำขอเมื่อ ${esc(s.requestedAt || "-")} · โทร ${esc(s.phone)}</div>
                  <div class="small muted" style="margin-top:4px">${esc(s.desc)}</div>
                  <div class="small muted" style="margin-top:4px">Line: ${esc(s.line)} · ชื่อผู้ใช้: <b>@${owner ? owner.username : "-"}</b></div>
                </div>
                <div class="row" style="flex-wrap:wrap;justify-content:flex-end">
                  <button class="btn btn-soft btn-sm" data-sview="${s.id}">👁️ ตรวจสอบ</button>
                  <button class="btn btn-danger btn-sm" data-sreject="${s.id}">ไม่อนุมัติ</button>
                  <button class="btn btn-primary btn-sm" data-sapprove="${s.id}">✓ อนุมัติ</button>
                </div>
              </div>`;
            }).join("") : `<div class="empty-state" style="padding:32px"><div class="ico">✅</div><h3>ไม่มีคำขอรออนุมัติ</h3><p>ร้านค้าทั้งหมดได้รับการตรวจสอบแล้ว</p></div>`}
          </div>
        </div>
        <div class="card">
          <div class="card-head"><div class="card-title" style="margin:0">ร้านค้าที่จัดการแล้ว</div><span class="small muted">${fmt(actives.length)} ร้าน</span></div>
          <div class="card-pad" style="padding-top:8px">
            <div class="table-wrap"><table class="table">
              <thead><tr><th>ร้านค้า</th><th>เจ้าของ</th><th>สินค้า</th><th>สถานะ</th><th class="t-right">จัดการ</th></tr></thead>
              <tbody>${actives.map((s) => `<tr>
                <td class="cell-compact"><span class="avatar avatar-sm" style="background:linear-gradient(135deg,${s.c1},${s.c2})">${s.emoji}</span><div class="strong" style="font-size:13px">${esc(s.name)}</div></td>
                <td class="cell-compact small">${esc(s.owner)}</td>
                <td class="cell-compact">${fmt(Store.storeProducts(s.id, false).length)}</td>
                <td class="cell-compact">${statusBadge(s.status)}</td>
                <td class="cell-compact"><div class="row-actions">
                  <button class="btn btn-outline btn-sm" data-sview="${s.id}">👁️</button>
                  <button class="btn ${s.status === "active" ? "btn-outline" : "btn-soft"} btn-sm" data-stoggle="${s.id}">${s.status === "active" ? "⛔ ระงับ" : "✓ เปิดใช้"}</button>
                </div></td>
              </tr>`).join("")}
              </tbody></table></div>
          </div>
        </div>`;
      bindStoreActions(c);
      _qa("[data-sreject]", c).forEach((b) => b.addEventListener("click", () => {
        const s = STORES.find((x) => x.id === b.dataset.sreject);
        UI.confirmModal("ไม่อนุมัติร้านค้า", `ไม่ผ่านการอนุมัติร้าน "${s.name}"?`, "ผู้ขายจะได้รับแจ้งว่าไม่ผ่านการคัดกรอง ร้านค้าจะถูกบันทึกเป็น 'ไม่อนุมัติ'", () => {
          s.status = "rejected"; toast("บันทึกการไม่อนุมัติแล้ว", "success"); Router.reload();
        }, "ไม่อนุมัติ");
      }));
    });
}

/* ==================== สินค้า (owner/admin/seller) ==================== */

function productModal(p, user, extra) {
  p = p || {};
  const isAdd = !p.id;
  const cats = extra && extra.sellerMode ? CATEGORIES : CATEGORIES;
  const m = UI.modal(`
    <div class="modal-head"><h3>${isAdd ? "เพิ่มสินค้า" : "แก้ไขสินค้า"}</h3><button class="modal-close" data-close-modal>✕</button></div>
    <div class="modal-body">
      <form id="productFormM" novalidate>
        <input type="hidden" data-emoji-val value="${p.emoji || "🍎"}">
        <div class="form-grid">
          ${UI.field("mpName", "ชื่อสินค้า", { required: true, value: p.name, msg: "กรุณากรอกชื่อสินค้า" })}
          ${UI.field("mpCat", "หมวดหมู่", { type: "select", required: true, value: p.category || cats[0] && cats[0].id, options: cats.map((x) => ({ value: x.id, label: x.icon + " " + x.name })), msg: "เลือกหมวดหมู่" })}
        </div>
        <div class="form-grid">
          ${UI.field("mpPrice", "ราคา (บาท)", { type: "number", required: true, value: p.price, min: "1", msg: "กรุณากรอกราคา" })}
          ${UI.field("mpUnit", "หน่วย", { required: true, value: p.unit || "กก.", ph: "เช่น กก., ลูก, ถุง", msg: "กรุณากรอกหน่วย" })}
          ${UI.field("mpStock", "จำนวนคงเหลือ", { type: "number", required: true, value: p.stock, min: "0", msg: "กรุณากรอกจำนวน" })}
          ${UI.field("mpStatus", "สถานะขาย", { type: "select", required: true, value: p.status || "active", options: [{ value: "active", label: "เปิดขาย" }, { value: "hidden", label: "ซ่อน / ปิดขาย" }], msg: "เลือกสถานะ" })}
        </div>
        <div class="field">
          <label class="label">รูปภาพ (เลือกสัญลักษณ์)</label>
          ${emojiPicker(p.emoji || "🍎")}
        </div>
        ${UI.field("mpDesc", "รายละเอียดสินค้า", { type: "textarea", value: p.desc, required: false })}
        ${UI.field("mpTags", "ป้ายกำกับ (คั่นด้วย ,)", { value: (p.tags || []).join(", "), required: false })}
      </form>
    </div>
    <div class="modal-foot">
      <button class="btn btn-ghost" data-cancel="1">ยกเลิก</button>
      <button class="btn btn-primary" id="mpSave">${isAdd ? "เพิ่มสินค้า" : "บันทึก"}</button>
    </div>`);
  bindEmojiPicker(m.el);
  _q("[data-cancel]", m.el).addEventListener("click", m.close);
  _q("#mpSave", m.el).addEventListener("click", () => {
    const form = _q("#productFormM", m.el);
    if (!UI.validate(form, ["mpName", "mpPrice", "mpUnit", "mpStock", "mpCat"])) { toast("กรุณากรอกข้อมูลให้ครบถ้วน", "danger"); return; }
    const tags = _q("#mpTags", m.el).value.split(",").map((t) => t.trim()).filter(Boolean);
    const obj = {
      name: _q("#mpName", m.el).value.trim(),
      category: _q("#mpCat", m.el).value,
      price: Math.max(1, Number(_q("#mpPrice", m.el).value)),
      unit: _q("#mpUnit", m.el).value.trim() || "กก.",
      stock: Math.max(0, Number(_q("#mpStock", m.el).value)),
      status: _q("#mpStatus", m.el).value,
      emoji: _q("[data-emoji-val]", m.el).value,
      desc: _q("#mpDesc", m.el).value.trim(),
      tags,
      sellerId: isAdd ? (user.storeId || (extra && extra.sellerId) || "st1") : p.sellerId,
    };
    if (isAdd) {
      PRODUCTS.push(Object.assign({ id: PRODUCTS.length + 1, rating: 0, ratingCount: 0, sold: 0, featured: false, best: false, c1: "#1e7b45", c2: "#9adcae", createdAt: Date.now() }, obj));
      toast("เพิ่มสินค้าเรียบร้อยแล้ว", "success");
    } else {
      Object.assign(p, obj);
      toast("บันทึกการแก้ไขสินค้าเรียบร้อย", "success");
    }
    Store.productUpdated();
    if (App.refreshChrome) App.refreshChrome();
    m.close();
    Router.reload();
  });
}

function bindProductActions(c, user, opts) {
  opts = opts || {};
  _qa("[data-padd]", c).forEach((b) => b.addEventListener("click", () => productModal(null, user)));
  _qa("[data-pedit]", c).forEach((b) => b.addEventListener("click", () => productModal(Store.getProduct(Number(b.dataset.pedit)), user)));
  _qa("[data-pstat]", c).forEach((b) => b.addEventListener("click", () => {
    const p = Store.getProduct(Number(b.dataset.pstat));
    if (!p) return;
    p.status = p.status === "active" ? "hidden" : "active";
    Store.productUpdated();
    toast(p.status === "active" ? `เปิดขาย "${p.name}" แล้ว` : `ปิดขาย "${p.name}" แล้ว`, "success");
    Router.reload();
  }));
  _qa("[data-pdel]", c).forEach((b) => b.addEventListener("click", () => {
    const p = Store.getProduct(Number(b.dataset.pdel));
    UI.confirmModal("ลบสินค้า", `ลบสินค้า "${p.name}" ?`, "", () => {
      const idx = PRODUCTS.indexOf(p);
      if (idx >= 0) PRODUCTS.splice(idx, 1);
      Store.productUpdated();
      toast("ลบสินค้าเรียบร้อย", "success");
      Router.reload();
    }, "ลบสินค้า");
  }));
}

function productMgmtTable(products, user, opts) {
  return `
    <div class="card">
      <div class="card-head"><div class="card-title" style="margin:0">${esc(opts.title || "สินค้า")}</div>${opts.canAdd ? `<button class="btn btn-primary btn-sm" data-padd="1">＋ เพิ่มสินค้า</button>` : ""}</div>
      <div class="card-pad" style="padding-top:8px">
        <div class="table-wrap"><table class="table">
          <thead><tr><th>สินค้า</th><th>หมวดหมู่</th><th>ราคา</th><th>คงเหลือ</th><th>ขายแล้ว</th><th>คะแนน</th><th>สถานะ</th><th class="t-right">จัดการ</th></tr></thead>
          <tbody>${products.map((p) => `
            <tr>
              <td class="cell-compact"><div style="display:flex;align-items:center;gap:8px"><span class="avatar avatar-sm" style="background:linear-gradient(135deg,${p.c1},${p.c2});font-size:16px">${p.emoji}</span><a href="#/products/${p.id}" class="strong" style="font-size:13px">${esc(p.name)}</a></div></td>
              <td class="cell-compact small">${(Store.getCategory(p.category) || {}).icon || ""} ${esc((Store.getCategory(p.category) || {}).name || "-")}</td>
              <td class="cell-compact strong">${Store.currency(p.price)}<span class="faint small">/${esc(p.unit)}</span></td>
              <td class="cell-compact ${p.stock <= 0 ? "text-danger" : p.stock < 30 ? "text-accent" : ""}">${fmt(p.stock)}</td>
              <td class="cell-compact small">${fmt(p.sold)}</td>
              <td class="cell-compact">⭐ ${Number(p.rating || 0).toFixed(1)}</td>
              <td class="cell-compact">${statusBadge(p.status)}</td>
              <td class="cell-compact"><div class="row-actions">
                <button class="btn btn-outline btn-sm" data-pedit="${p.id}">✏️</button>
                ${opts.canToggle ? `<button class="btn ${p.status === "active" ? "btn-outline" : "btn-soft"} btn-sm" data-pstat="${p.id}">${p.status === "active" ? "🙈 ปิดขาย" : "✓ เปิด"}</button>` : ""}
                ${opts.canDelete ? `<button class="btn btn-danger btn-sm" data-pdel="${p.id}">🗑️</button>` : ""}
              </div></td>
            </tr>`).join("")}
          </tbody></table></div>
      </div>
    </div>`;
}

function ownerProductsView() {
  const u = Store.currentUser();
  const products = PRODUCTS;
  return mgmtPage(u, "products", "owner", "สินค้า", "ตรวจสอบข้อมูลสินค้าทั้งหมดในระบบ",
    (c) => {
      c.innerHTML = productMgmtTable(products, u, { title: "สินค้าทั้งหมดในระบบ", canToggle: true });
      bindProductActions(c, u, {});
    });
}

function adminProductsView() {
  const u = Store.currentUser();
  return mgmtPage(u, "products", "admin", "จัดการสินค้า", "ตรวจสอบและแก้ไขสถานะสินค้าของร้านค้าทั้งหมด",
    (c) => {
      const filter = App.lastQuery && App.lastQuery.cat;
      const list = filter && filter !== "all" ? PRODUCTS.filter((p) => p.category === filter) : PRODUCTS;
      const head = `
        <div class="row mb-4" style="flex-wrap:wrap;gap:8px">
          <a class="chip ${!filter ? "active" : ""}" href="#/dash/admin/products">ทั้งหมด</a>
          ${CATEGORIES.map((x) => `<a class="chip ${filter === x.id ? "active" : ""}" href="#/dash/admin/products?cat=${x.id}">${x.icon} ${esc(x.name)}</a>`).join("")}
        </div>`;
      c.innerHTML = head + productMgmtTable(list, u, { title: "สินค้าทั้งหมด", canToggle: true, canDelete: true });
      bindProductActions(c, u, {});
    });
}

function sellerProductsView() {
  const u = Store.currentUser();
  const sid = u.storeId;
  const products = Store.storeProducts(sid, false);
  return mgmtPage(u, "products", "seller", "จัดการสินค้า", "เพิ่ม แก้ไข ลบ และเปิด-ปิดการขายสินค้าของร้าน",
    (c) => {
      c.innerHTML = `
        ${UI.alertBox("info", `ร้าน: <b>${esc((Store.getStore(sid) || {}).name || "-")}</b> · สินค้าทั้งหมด ${fmt(products.length)} รายการ (ขายอยู่ ${fmt(products.filter((p) => p.status === "active").length)})`, { closable: true })}
        <div style="height:14px"></div>
        ${productMgmtTable(products, u, { title: "สินค้าของฉัน", canAdd: true, canToggle: true, canDelete: true })}`;
      bindProductActions(c, u, {});
    });
}

/* ==================== หมวดหมู่ (admin) ==================== */

function categoriesView() {
  const u = Store.currentUser();
  return mgmtPage(u, "categories", "admin", "จัดการหมวดหมู่สินค้า", "เพิ่ม แก้ไข ปรับหมวดหมู่สินค้า",
    (c) => {
      c.innerHTML = `
        <div class="row mb-4"><button class="btn btn-primary" id="addCatBtn">＋ เพิ่มหมวดหมู่</button></div>
        <div class="grid-5" style="grid-template-columns:repeat(auto-fill,minmax(190px,1fr))">
          ${CATEGORIES.map((cat) => {
            const cnt = PRODUCTS.filter((p) => p.category === cat.id).length;
            return `<div class="card card-pad" style="position:relative">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
                <span class="avatar avatar-sm" style="background:linear-gradient(135deg,${cat.c1},${cat.c2});font-size:16px">${cat.icon}</span>
                <div class="strong" style="font-size:14px">${esc(cat.name)}</div>
              </div>
              <div class="small muted mb-4">${fmt(cnt)} รายการในหมวดนี้</div>
              <div class="row">
                <button class="btn btn-outline btn-sm" data-cedit="${cat.id}">✏️</button>
                <button class="btn btn-danger btn-sm" data-cdel="${cat.id}" ${cnt ? "disabled" : ""} title="${cnt ? "มีสินค้าในหมวดนี้" : "ลบหมวดหมู่"}">🗑️</button>
              </div>
            </div>`;
          }).join("")}
        </div>`;
      const openCatModal = (cat) => {
        cat = cat || {};
        const used = CATEGORIES.filter((x) => x.id === cat.id).length ? false : cat.increment ? false : false;
        const m = UI.modal(`
          <div class="modal-head"><h3>${cat.id ? "แก้ไขหมวดหมู่" : "เพิ่มหมวดหมู่"}</h3><button class="modal-close" data-close-modal>✕</button></div>
          <div class="modal-body">
            <input type="hidden" data-emoji-val value="${cat.icon || "🍎"}">
            ${UI.field("mcName", "ชื่อหมวดหมู่", { required: true, value: cat.name, msg: "กรุณากรอกชื่อหมวดหมู่" })}
            <div class="field"><label class="label">สัญลักษณ์</label>${emojiPicker(cat.icon || "🍎")}</div>
          </div>
          <div class="modal-foot">
            <button class="btn btn-ghost" data-cancel="1">ยกเลิก</button>
            <button class="btn btn-primary" id="mcSave">บันทึก</button>
          </div>`);
        bindEmojiPicker(m.el);
        _q("[data-cancel]", m.el).addEventListener("click", m.close);
        _q("#mcSave", m.el).addEventListener("click", () => {
          const name = _q("#mcName", m.el).value.trim();
          if (!name) { toast("กรุณากรอกชื่อหมวดหมู่", "danger"); return; }
          const icon = _q("[data-emoji-val]", m.el).value;
          if (cat.id) {
            Object.assign(cat, { name, icon });
          } else {
            cat = { id: "cat" + Date.now(), name, icon, c1: "#1e7b45", c2: "#9adcae" };
            CATEGORIES.push(cat);
          }
          toast("บันทึกหมวดหมู่เรียบร้อย", "success");
          m.close();
          Router.reload();
        });
      };
      _q("#addCatBtn", c).addEventListener("click", () => openCatModal(null));
      _qa("[data-cedit]", c).forEach((b) => b.addEventListener("click", () => openCatModal(CATEGORIES.find((x) => x.id === b.dataset.cedit))));
      _qa("[data-cdel]", c).forEach((b) => b.addEventListener("click", () => {
        const cat = CATEGORIES.find((x) => x.id === b.dataset.cdel);
        const cnt = PRODUCTS.filter((p) => p.category === cat.id).length;
        if (cnt) { toast("ไม่สามารถลบหมวดหมู่ที่มีสินค้าอยู่ได้", "warning"); return; }
        UI.confirmModal("ลบหมวดหมู่", `ลบหมวดหมู่ "${cat.name}" ?`, "", () => {
          CATEGORIES.splice(CATEGORIES.indexOf(cat), 1);
          toast("ลบหมวดหมู่เรียบร้อย", "success"); Router.reload();
        }, "ลบ");
      }));
    });
}

/* ==================== คำสั่งซื้อ ==================== */

function bindOrderActions(c) {
  _qa("[data-oview]", c).forEach((b) => b.addEventListener("click", () => orderDetailModal(Store.getOrders().find((x) => x.id === Number(b.dataset.oview)))));
  _qa("[data-oset]", c).forEach((sel) => sel.addEventListener("change", () => {
    const id = Number(sel.dataset.oset);
    const nv = sel.value;
    UI.confirmModal("เปลี่ยนสถานะคำสั่งซื้อ", `เปลี่ยนสถานะเป็น "${Store.STATUS_LABEL[nv]}" ?`, "", () => {
      const r = Store.updateOrderStatus(id, nv);
      if (r.ok) { toast(`อัปเดตสถานะเป็น "${Store.STATUS_LABEL[nv]}" แล้ว`, "success"); Router.reload(); }
      else toast(r.msg, "danger");
    });
  }));
}

function orderMgmtTable(orders, opts) {
  const sellerMode = opts.sellerMode;
  const trans = {
    pending: ["", "processing", "cancelled"],
    processing: ["", "shipping", "cancelled"],
    shipping: ["", "delivered"],
  };
  return `<div class="table-wrap"><table class="table">
    <thead><tr><th>คำสั่งซื้อ</th><th>วันที่</th>${sellerMode ? "<th>ลูกค้า</th>" : "<th>ร้านค้า</th>"}<th>รายการ</th><th>ยอดรวม</th><th>สถานะ</th><th class="t-right">จัดการ</th></tr></thead>
    <tbody>${orders.map((o) => {
      const store = Store.getStore(o.sellerId);
      return `<tr>
        <td class="cell-compact strong">#${esc(o.no)}</td>
        <td class="cell-compact small muted">${esc(o.date)}</td>
        ${sellerMode ? `<td class="cell-compact small">${esc(o.buyerName)}<div class="faint">${esc(o.buyerPhone || "")}</div></td>` : `<td class="cell-compact small">${store ? store.name : "-"}</td>`}
        <td class="cell-compact small">${fmt(o.items.reduce((s, i) => s + i.qty, 0))} ชิ้น</td>
        <td class="cell-compact strong">${Store.currency(o.total)}</td>
        <td class="cell-compact">${statusBadge(o.status)}</td>
        <td class="cell-compact"><div class="row-actions">
          <button class="btn btn-outline btn-sm" data-oview="${o.id}">👁️</button>
          ${sellerMode && trans[o.status] ? `<select class="select" data-oset="${o.id}" style="width:auto;padding:6px 8px;font-size:12.5px">
            ${trans[o.status].map((s) => `<option value="${s}">${Store.STATUS_LABEL[s]}</option>`).join("")}
          </select>` : ""}
        </div></td>
      </tr>`; }).join("")}
    </tbody></table></div>`;
}

function adminOrdersView() {
  const u = Store.currentUser();
  const orders = Store.getOrders().sort((a, b) => (b.dateISO || "").localeCompare(a.dateISO || ""));
  const statuses = ["pending", "processing", "shipping", "delivered", "cancelled"];
  const f = App.lastQuery && App.lastQuery.status;
  const list = f ? orders.filter((o) => o.status === f) : orders;
  return mgmtPage(u, "orders", "admin", "ตรวจสอบคำสั่งซื้อ", "ดูภาพรวมคำสั่งซื้อทั้งหมดของระบบ",
    (c) => {
      c.innerHTML = `
        <div class="dash-grid">
          ${statuses.map((s) => statCard(statusIcon(s), fmt(orders.filter((o) => o.status === s).length), Store.STATUS_LABEL[s], statusColor(s))).join("")}
        </div>
        <div class="row mb-3" style="flex-wrap:wrap;gap:8px">
          <a class="chip ${!f ? "active" : ""}" href="#/dash/admin/orders">ทั้งหมด</a>
          ${statuses.map((s) => `<a class="chip ${f === s ? "active" : ""}" href="#/dash/admin/orders?status=${s}">${esc(Store.STATUS_LABEL[s])}</a>`).join("")}
        </div>
        ${orderMgmtTable(list, { sellerMode: false })}`;
      bindOrderActions(c);
    });
}

function statusIcon(s) { return { pending: "⏳", processing: "🧺", shipping: "🚚", delivered: "✅", cancelled: "✖" }[s] || "📦"; }
function statusColor(s) { return { pending: "amber", processing: "blue", shipping: "green", delivered: "green", cancelled: "red" }[s] || "green"; }

function sellerOrdersView() {
  const u = Store.currentUser();
  const sid = u.storeId;
  const orders = Store.getOrders().filter((o) => o.sellerId === sid).sort((a, b) => (b.dateISO || "").localeCompare(a.dateISO || ""));
  const f = App.lastQuery && App.lastQuery.status;
  const list = f ? orders.filter((o) => o.status === f) : orders;
  const tabs = ["", "pending", "processing", "shipping", "delivered", "cancelled"];
  return mgmtPage(u, "orders", "seller", "จัดการคำสั่งซื้อ", "รับออเดอร์ อัปเดตสถานะ และตรวจสอบข้อมูลลูกค้า",
    (c) => {
      c.innerHTML = `
        <div class="dash-grid">
          ${statCard("⏳", fmt(orders.filter((o) => o.status === "pending").length), "รอรับออเดอร์", "amber")}
          ${statCard("🧺", fmt(orders.filter((o) => o.status === "processing").length), "กำลังเตรียมสินค้า", "blue")}
          ${statCard("🚚", fmt(orders.filter((o) => o.status === "shipping").length), "กำลังจัดส่ง", "green")}
          ${statCard("✅", fmt(orders.filter((o) => o.status === "delivered").length), "จัดส่งสำเร็จ", "green")}
        </div>
        <div class="row mb-3" style="flex-wrap:wrap;gap:8px">
          ${tabs.map((t) => `<a class="chip ${!f === !t ? "active" : ""}" href="#/dash/seller/orders${t ? "?status=" + t : ""}">${t ? esc(Store.STATUS_LABEL[t]) : "ทั้งหมด"}</a>`).join("")}
        </div>
        ${list.length ? orderMgmtTable(list, { sellerMode: true }) : UI.emptyState("📦", "ไม่มีคำสั่งซื้อในสถานะนี้", "")}`;
      bindOrderActions(c);
    });
}

/* ==================== ยอดขาย ==================== */

function ownerSalesView() {
  const u = Store.currentUser();
  const c = Store.counts();
  return mgmtPage(u, "sales", "owner", "ยอดขาย", "ตรวจสอบยอดขายภาพรวมของระบบ",
    (c) => {
      const best = Store.bestSellers(8);
      const catSales = Store.salesByCategory();
      const storesData = STORES.filter((s) => s.status === "active").map((s) => {
        const os = Store.getOrders().filter((o) => o.sellerId === s.id && o.status !== "cancelled");
        return { store: s, orders: os.length, rev: os.reduce((a, o) => a + o.total, 0) };
      }).sort((a, b) => b.rev - a.rev);
      c.innerHTML = `
        <div class="dash-grid">
          ${statCard("💰", Store.currency(c.revenue), "ยอดขายรวม", "green")}
          ${statCard("🧾", fmt(c.orders), "คำสั่งซื้อทั้งหมด", "blue")}
          ${statCard("📦", fmt(c.soldItems), "ชิ้นสินค้าที่ขายได้", "amber")}
          ${statCard("🏆", Store.currency(c.revenue / Math.max(c.orders, 1)), "ยอดเฉลี่ย/ออเดอร์", "purple")}
        </div>
        <div class="grid" style="grid-template-columns:1.3fr 1fr;gap:20px;margin-bottom:20px">
          <div class="card"><div class="card-head"><div class="card-title" style="margin:0">ยอดขาย 8 สัปดาห์</div></div><div class="card-pad">${UI.barChart(Store.weeklyRevenue(8))}</div></div>
          <div class="card"><div class="card-head"><div class="card-title" style="margin:0">ยอดขายตามหมวด</div></div><div class="card-pad">${UI.donutChart(catSales, "ยอดขาย", "รวมทั้งหมด")}</div></div>
        </div>
        <div class="grid" style="grid-template-columns:1.3fr 1fr;gap:20px;align-items:start">
          <div class="card"><div class="card-head"><div class="card-title" style="margin:0">สินค้าขายดีที่สุด</div></div><div class="card-pad" style="padding-top:8px">${bestSellersTable(best)}</div></div>
          <div class="card"><div class="card-head"><div class="card-title" style="margin:0">ยอดขายรายร้านค้า</div></div><div class="card-pad" style="padding-top:8px">
            <div class="table-wrap"><table class="table">
              <thead><tr><th>ร้านค้า</th><th>ออเดอร์</th><th>ยอดขาย</th></tr></thead>
              <tbody>${storesData.map((x, i) => `<tr>
                <td class="cell-compact">${i + 1}. ${x.store.emoji} ${esc(x.store.name)}</td>
                <td class="cell-compact">${fmt(x.orders)}</td>
                <td class="cell-compact strong">${Store.currency(x.rev)}</td>
              </tr>`).join("")}
              </tbody></table></div>
          </div></div>
        </div>`;
    });
}

function sellerSalesView() {
  const u = Store.currentUser();
  const sid = u.storeId;
  const store = Store.getStore(sid);
  const orders = Store.getOrders().filter((o) => o.sellerId === sid);
  const revenue = orders.filter((o) => o.status !== "cancelled").reduce((a, o) => a + o.total, 0);
  return mgmtPage(u, "sales", "seller", "ยอดขาย", "ยอดขายรวม สินค้าขายดี และประวัติการขายของร้าน",
    (c) => {
      const done = orders.filter((o) => o.status !== "cancelled");
      const best = Store.bestSellers(8, sid);
      c.innerHTML = `
        <div class="dash-grid">
          ${statCard("💰", Store.currency(revenue), "ยอดขายรวม (สุทธิ)", "green")}
          ${statCard("📦", fmt(done.reduce((a, o) => a + o.items.reduce((s, i) => s + i.qty, 0), 0)), "ชิ้นที่ขายได้", "amber")}
          ${statCard("🧾", fmt(done.length), "ออเดอร์", "blue")}
          ${statCard("⭐", (store ? store.rating : 0) ? Number(store.rating).toFixed(1) + " / 5" : "-", "ความพึงพอใจ", "purple")}
        </div>
        <div class="grid" style="grid-template-columns:1.3fr 1fr;gap:20px;margin-bottom:20px">
          <div class="card"><div class="card-head"><div class="card-title" style="margin:0">ยอดขาย 8 สัปดาห์ของร้าน</div></div><div class="card-pad">${UI.barChart(Store.weeklyRevenue(8, sid))}</div></div>
          <div class="card"><div class="card-head"><div class="card-title" style="margin:0">สินค้าขายดีของร้าน</div></div><div class="card-pad" style="padding-top:8px">${bestSellersTable(best)}</div></div>
        </div>
        <div class="card">
          <div class="card-head"><div class="card-title" style="margin:0">ประวัติการขาย</div></div>
          <div class="card-pad" style="padding-top:8px">${orderMgmtTable([...done].sort((a, b) => (b.dateISO || "").localeCompare(a.dateISO || "")), { sellerMode: false })}</div>
        </div>`;
      bindOrderActions(c);
    });
}

/* ==================== รายงาน (owner/admin) ==================== */

function reportBanner() {
  return `<div class="banner-promo mb-4" style="padding:14px 18px">
    <div style="display:flex;gap:10px;align-items:center"><span style="font-size:22px">📄</span><div><div class="strong" style="font-size:14px">รายงานภาพรวมระบบ</div><div class="small muted">ข้อมูล ณ วันที่ ${new Date().toLocaleDateString("th-TH")}</div></div></div>
    <div class="row">
      <button class="btn btn-outline btn-sm" data-dl="รายงานยอดขาย">⬇️ CSV</button>
      <button class="btn btn-primary btn-sm" data-dl="รายงานยอดขาย">🖨️ พิมพ์</button>
    </div>
  </div>`;
}

function ownerReportsView() {
  const u = Store.currentUser();
  const c = Store.counts();
  const users = Store.getUsers();
  const catSales = Store.salesByCategory();
  const statuses = ["pending", "processing", "shipping", "delivered", "cancelled"];
  return mgmtPage(u, "reports", "owner", "รายงานภาพรวม", "รายงานสถิติการทำงานของระบบ",
    (c) => {
      c.innerHTML = `
        ${reportBanner()}
        <div class="dash-grid">
          ${statCard("👥", fmt(c.users), "ผู้ใช้", "green")}
          ${statCard("👨‍🌾", fmt(c.sellers), "ผู้ขาย", "blue")}
          ${statCard("🛒", fmt(c.buyers), "ผู้ซื้อ", "purple")}
          ${statCard("🍎", fmt(c.products), "สินค้า", "amber")}
        </div>
        <div class="grid" style="grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px">
          <div class="card">
            <div class="card-head"><div class="card-title" style="margin:0">อัตราส่วนผู้ใช้งานตามบทบาท</div></div>
            <div class="card-pad">
              ${Object.entries({ "เจ้าของ/แอดมิน": c.admins, "ผู้ขาย": c.sellers, "ผู้ซื้อ": c.buyers }).map(([k, v]) => `
                <div class="mb-3"><div class="row-between small mb-1"><span>${esc(k)}</span><b>${fmt(v)} คน</b></div><div class="progress"><div class="fill" style="width:${Math.round((v / Math.max(c.users, 1)) * 100)}%"></div></div></div>`).join("")}
            </div>
          </div>
          <div class="card">
            <div class="card-head"><div class="card-title" style="margin:0">สัดส่วนยอดขายตามหมวด</div></div>
            <div class="card-pad">${UI.donutChart(catSales, "ยอดขาย", "")}</div>
          </div>
        </div>
        <div class="grid" style="grid-template-columns:1fr 1fr;gap:20px">
          <div class="card">
            <div class="card-head"><div class="card-title" style="margin:0">คำสั่งซื้อตามสถานะ</div></div>
            <div class="card-pad">
              <div class="table-wrap"><table class="table">
                <tbody>${statuses.map((s) => {
                  const n = Store.getOrders().filter((o) => o.status === s).length;
                  const pct = Math.round((n / Math.max(c.orders, 1)) * 100);
                  return `<tr><td>${statusIcon(s)} ${esc(Store.STATUS_LABEL[s])}</td><td class="strong">${fmt(n)}</td><td style="width:40%"><div class="progress"><div class="fill" style="width:${pct}%"></div></div></td><td class="small muted">${pct}%</td></tr>`;
                }).join("")}
                </tbody></table></div>
            </div>
          </div>
          <div class="card">
            <div class="card-head"><div class="card-title" style="margin:0">สมาชิกใหม่รายเดือน (ปี ${new Date().getFullYear() + 543})</div></div>
            <div class="card-pad">
              <div class="table-wrap"><table class="table">
                <thead><tr><th>เดือน</th><th>ผู้สมัครใหม่</th></tr></thead>
                <tbody>${["มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย."].map((mth, i) => {
                  const n = users.filter((x) => { const dd = new Date(x.createdAt + "T00:00:00"); return dd.getMonth() === (6 + i) % 12; }).length;
                  return `<tr><td class="cell-compact">${mth}</td><td class="cell-compact strong">${fmt(n)}</td></tr>`;
                }).join("")}
                </tbody></table></div>
            </div>
          </div>
        </div>`;
      _qa("[data-dl]", c).forEach((b) => b.addEventListener("click", () => toast("เริ่มดาวน์โหลดรายงานแล้ว (ไฟล์ตัวอย่าง)", "success")));
    });
}

function adminReportsView() {
  const u = Store.currentUser();
  const c = Store.counts();
  return mgmtPage(u, "reports", "admin", "รายงานระบบ", "รายงานสถิติการทำงานเพื่อการวางแผน",
    (c) => {
      const best = Store.bestSellers(6);
      const topStores = STORES.filter((s) => s.status === "active").map((s) => {
        const os = Store.getOrders().filter((o) => o.sellerId === s.id && o.status !== "cancelled");
        return { store: s, rev: os.reduce((a, o) => a + o.total, 0) };
      }).sort((a, b) => b.rev - a.rev).slice(0, 5);
      c.innerHTML = `
        ${reportBanner()}
        <div class="dash-grid">
          ${statCard("💵", Store.currency(c.revenue), "ยอดขายรวม", "green")}
          ${statCard("🧾", fmt(c.orders), "คำสั่งซื้อ", "blue")}
          ${statCard("🆕", fmt(Store.getUsers().filter((x) => x.role === "buyer" && x.createdAt >= "2569-08-20").length), "สมาชิกใหม่", "amber")}
          ${statCard("⏳", fmt(c.pendingOrders), "รอรับออเดอร์", "red")}
        </div>
        <div class="card" style="margin-bottom:20px"><div class="card-head"><div class="card-title" style="margin:0">ร้านค้าที่มียอดขายสูงสุด</div></div><div class="card-pad">
          <div class="table-wrap"><table class="table">
            <thead><tr><th>#</th><th>ร้านค้า</th><th>ยอดขายรวม</th></tr></thead>
            <tbody>${topStores.map((x, i) => `<tr>
              <td class="cell-compact">${i + 1}</td>
              <td class="cell-compact">${x.store.emoji} ${esc(x.store.name)}</td>
              <td class="cell-compact strong">${Store.currency(x.rev)}</td>
            </tr>`).join("")}
            </tbody></table></div>
        </div></div>
        <div class="card"><div class="card-head"><div class="card-title" style="margin:0">สินค้าขายดี</div><a class="small" href="#/dash/owner/sales">ดูเพิ่ม →</a></div><div class="card-pad" style="padding-top:8px">${bestSellersTable(best)}</div></div>`;
      _qa("[data-dl]", c).forEach((b) => b.addEventListener("click", () => toast("เริ่มดาวน์โหลดรายงานแล้ว (ไฟล์ตัวอย่าง)", "success")));
    });
}

/* ==================== ตั้งค่าเว็บ / สุขภาพระบบ / ร้านค้าของฉัน ==================== */

function settingsView() {
  const u = Store.currentUser();
  return mgmtPage(u, "settings", "admin", "ตั้งค่าเว็บไซต์", "จัดการข้อมูลเว็บไซต์และระบบทั่วไป",
    (c) => {
      c.innerHTML = `
        <div class="grid" style="grid-template-columns:1.2fr 1fr;gap:20px;align-items:start">
          <div class="card"><div class="card-head"><div class="card-title" style="margin:0">ข้อมูลเว็บไซต์</div></div>
          <div class="card-pad">
            <form id="settingsForm" novalidate>
              <div class="form-grid">
                ${UI.field("stName", "ชื่อเว็บไซต์", { required: true, value: SETTINGS.siteName, msg: "กรุณากรอกชื่อเว็บไซต์" })}
                ${UI.field("stTag", "คำโปรย", { required: false, value: SETTINGS.tagline, msg: "" })}
              </div>
              ${UI.field("stAnn", "ประกาศบนหน้าแรก", { type: "textarea", required: false, value: SETTINGS.announcement, msg: "" })}
              <div class="form-grid">
                ${UI.field("stAddr", "ที่อยู่", { required: false, value: SHOP.address, msg: "" })}
                ${UI.field("stPhone", "เบอร์โทร", { required: false, value: SHOP.phone, msg: "" })}
                ${UI.field("stLine", "Line ID", { required: false, value: SHOP.line, msg: "" })}
                ${UI.field("stEmail", "อีเมล", { required: false, value: SHOP.email, msg: "" })}
              </div>
              <div class="form-grid">
                ${UI.field("stShipFee", "ค่าส่งมาตรฐาน (บาท)", { type: "number", required: false, value: SETTINGS.shippingFee, msg: "" })}
                ${UI.field("stExpressFee", "ค่าส่งด่วน (บาท)", { type: "number", required: false, value: SETTINGS.expressFee, msg: "" })}
              </div>
              <button class="btn btn-primary" type="submit">บันทึกการตั้งค่า</button>
            </form>
          </div></div>
          <div class="card"><div class="card-head"><div class="card-title" style="margin:0">การตั้งค่าระบบ</div></div>
          <div class="card-pad">
            <div class="stack">
              <div class="row-between"><span class="small">เปิดให้สมัครสมาชิก</span><span>${statusBadge("active")}</span></div>
              <div class="row-between"><span class="small">อนุมัติผู้ขายอัตโนมัติ</span><button class="btn btn-ghost btn-sm" data-toggle="auto">ปิด (รอตรวจสอบ)</button></div>
              <div class="row-between"><span class="small">เวอร์ชันระบบต้นแบบ</span><b class="small">v1.0 (Prototype)</b></div>
              <div class="row-between"><span class="small">แพ็กเกจ</span><b class="small">Community Edition</b></div>
            </div>
            <div style="border-top:1px dashed var(--border);margin:16px 0"></div>
            <div class="small muted">การสร้างสแนปช็อตข้อมูลทดสอบ (Mock Data)</div>
            <button class="btn btn-soft btn-sm mt-3" data-reset="1">รีเซ็ตข้อมูลตัวอย่าง</button>
          </div></div>
        </div>`;
      const form = _q("#settingsForm", c);
      const save = (e) => {
        e.preventDefault();
        SETTINGS.siteName = _q("#stName", c).value.trim();
        SETTINGS.tagline = _q("#stTag", c).value.trim();
        SETTINGS.announcement = _q("#stAnn", c).value.trim();
        SHOP.address = _q("#stAddr", c).value.trim();
        SHOP.phone = _q("#stPhone", c).value.trim();
        SHOP.line = _q("#stLine", c).value.trim();
        SHOP.email = _q("#stEmail", c).value.trim();
        SETTINGS.shippingFee = Number(_q("#stShipFee", c).value) || 0;
        SETTINGS.expressFee = Number(_q("#stExpressFee", c).value) || 0;
        toast("บันทึกการตั้งค่าเรียบร้อยแล้ว", "success");
        App.refreshChrome && App.refreshChrome();
      };
      form.addEventListener("submit", save);
      _qa("[data-toggle]", c).forEach((b) => b.addEventListener("click", () => { SETTINGS.autoApproveSeller = !SETTINGS.autoApproveSeller; b.textContent = SETTINGS.autoApproveSeller ? "เปิด (อนุมัติทันที)" : "ปิด (รอตรวจสอบ)"; toast("อัปเดตการตั้งค่าแล้ว", "success"); }));
      _qa("[data-reset]", c).forEach((b) => b.addEventListener("click", () => {
        Object.keys(Store.LS).forEach((k) => localStorage.removeItem(Store.LS[k]));
        App.flash = {};
        location.hash = "#/";
        setTimeout(() => location.reload(), 100);
      }));
    });
}

function healthView() {
  const u = Store.currentUser();
  const services = [
    { icon: "🌐", name: "เว็บเซิร์ฟเวอร์", status: "ok", detail: "ทำงานปกติ · ตอบสนอง 120ms" },
    { icon: "🗄️", name: "ฐานข้อมูล", status: "ok", detail: "เชื่อมต่อปกติ · แบบสอบถาม 8ms" },
    { icon: "💳", name: "ระบบชำระเงิน", status: "ok", detail: "พร้อมใช้งาน · ธนาคาร 4 แห่ง" },
    { icon: "🚚", name: "ระบบขนส่ง / จัดส่ง", status: "warn", detail: "ล่าช้าเล็กน้อย (แจ้งเตือน 2 เหตุการณ์)" },
    { icon: "📦", name: "จัดเก็บข้อมูลภาพสินค้า", status: "ok", detail: "ใช้พื้นที่ 68% ของวงเงิน" },
    { icon: "🔔", name: "ระบบแจ้งเตือน", status: "ok", detail: "ส่งข้อความปกติ · ไม่มีค้างคิว" },
  ];
  const errors = [
    { time: "2569-09-11 23:40", level: "ระดับปานกลาง", msg: "การแจ้งเตือนการจัดส่งล่าช้า (retry 2 ครั้ง, สำเร็จ)" },
    { time: "2569-09-08 02:12", level: "ระดับต่ำ", msg: "ผู้ใช้ลองเข้าสู่ระบบผิดรหัสเกิน 5 ครั้ง (@buyer1)" },
    { time: "2569-08-30 18:45", level: "ระดับสูง", msg: "ชำระเงิน QR ล้มเหลวที่เกตเวย์ A (แก้ไขแล้ว)" },
  ];
  return mgmtPage(u, "health", "owner", "สุขภาพระบบ", "ตรวจสอบความเรียบร้อยของการทำงานภายในระบบ",
    (c) => {
      c.innerHTML = `
        <div class="dash-grid">
          ${statCard("✅", "6/7", "บริการพร้อมใช้งาน", "green")}
          ${statCard("⚡", "120ms", "เวลาตอบสนองเฉลี่ย", "amber")}
          ${statCard("🔴", fmt(errors.length), "เหตุการณ์ล่าสุด 30 วัน", "red")}
          ${statCard("💾", "68%", "พื้นที่จัดเก็บ", "blue")}
        </div>
        <div class="grid-3" style="grid-template-columns:repeat(auto-fill,minmax(240px,1fr));margin-bottom:20px">
          ${services.map((s) => `
            <div class="feature-card">
              <div class="ico">${s.icon}</div>
              <div><h4>${esc(s.name)} <span class="badge ${s.status === "ok" ? "badge-success" : "badge-warning"}" style="margin-left:4px">${s.status === "ok" ? "ปกติ" : "แจ้งเตือน"}</span></h4><p>${esc(s.detail)}</p></div>
            </div>`).join("")}
        </div>
        <div class="card">
          <div class="card-head"><div class="card-title" style="margin:0">บันทึกเหตุการณ์ (Log) ล่าสุด</div><button class="btn btn-outline btn-sm" data-check="1">🔄 ตรวจสอบตอนนี้</button></div>
          <div class="card-pad" style="padding-top:8px">
            <div class="table-wrap"><table class="table">
              <thead><tr><th>เวลา</th><th>ระดับ</th><th>รายละเอียด</th></tr></thead>
              <tbody>${errors.map((e) => `<tr>
                <td class="cell-compact small muted">${esc(e.time)}</td>
                <td class="cell-compact"><span class="badge ${e.level.includes("สูง") ? "badge-danger" : e.level.includes("ปานกลาง") ? "badge-warning" : "badge-outline"}">${esc(e.level)}</span></td>
                <td class="cell-compact small">${esc(e.msg)}</td>
              </tr>`).join("")}
              </tbody></table></div>
          </div>
        </div>`;
      _qa("[data-check]", c).forEach((b) => b.addEventListener("click", () => {
        b.disabled = true; b.textContent = "⏳ กำลังตรวจสอบ...";
        setTimeout(() => { b.disabled = false; b.textContent = "🔄 ตรวจสอบตอนนี้"; toast("ตรวจสอบระบบเรียบร้อย ทุกบริการทำงานปกติ", "success"); }, 900);
      }));
    });
}

function sellerStoreView() {
  const u = Store.currentUser();
  const store = Store.getStore(u.storeId);
  return mgmtPage(u, "store", "seller", "ร้านค้าของฉัน", "แก้ไขข้อมูลร้านค้าและข้อมูลติดต่อ",
    (c) => {
      c.innerHTML = `
        <div class="grid" style="grid-template-columns:280px 1fr;gap:20px;align-items:start">
          <div class="card card-pad">
            <div class="center" style="text-align:center">
              <span class="avatar avatar-lg" style="background:linear-gradient(135deg,${store.c1},${store.c2});font-size:30px">${store.emoji}</span>
              <div class="strong" style="font-size:17px;margin-top:10px">${esc(store.name)}</div>
              <div class="small muted">${esc(store.owner)}</div>
              <div style="margin-top:10px">${statusBadge(store.status)}</div>
              <div class="small muted mt-4">เรตติ้งร้านค้า<br><b style="color:var(--gold)">${Number(store.rating || 0).toFixed(1)} / 5</b></div>
            </div>
          </div>
          <div class="card">
            <div class="card-head"><div class="card-title" style="margin:0">แก้ไขข้อมูลร้านค้า</div></div>
            <div class="card-pad">
              <form id="storeForm" novalidate>
                <div class="form-grid">
                  ${UI.field("skName", "ชื่อร้านค้า", { required: true, value: store.name, msg: "กรุณากรอกชื่อร้าน" })}
                  ${UI.field("skOwner", "ชื่อเจ้าของร้าน", { required: true, value: store.owner, msg: "กรุณากรอกชื่อเจ้าของ" })}
                  ${UI.field("skPhone", "โทรศัพท์", { required: true, value: store.phone, msg: "กรุณากรอกเบอร์โทร" })}
                  ${UI.field("skLine", "Line ID", { value: store.line, required: false })}
                </div>
                ${UI.field("skDesc", "รายละเอียดร้านค้า", { type: "textarea", value: store.desc, required: false })}
                <button class="btn btn-primary" type="submit">บันทึกข้อมูลร้านค้า</button>
              </form>
            </div>
          </div>
        </div>`;
      const form = _q("#storeForm", c);
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!UI.validate(form, ["skName", "skOwner", "skPhone"])) { toast("กรุณากรอกข้อมูลให้ครบถ้วน", "danger"); return; }
        store.name = _q("#skName", c).value.trim();
        store.owner = _q("#skOwner", c).value.trim();
        store.phone = _q("#skPhone", c).value.trim();
        store.line = _q("#skLine", c).value.trim() || "-";
        store.desc = _q("#skDesc", c).value.trim();
        Store.updateUser(u.id, { name: store.owner });
        toast("บันทึกข้อมูลร้านค้าเรียบร้อยแล้ว", "success");
        Store.on && Store.emit("auth");
        App.refreshChrome && App.refreshChrome();
        Router.reload();
      });
    });
}

/* ==================== Owner: สินค้า / คำสั่งซื้อ / ยอดขาย ==================== */

function ownerProductsManage() {
  const u = Store.currentUser();
  return mgmtPage(u, "products", "owner", "ตรวจสอบสินค้า", "สินค้าทั้งหมดในระบบ",
    (c) => {
      const f = App.lastQuery && App.lastQuery.cat;
      const list = f && f !== "all" ? PRODUCTS.filter((p) => p.category === f) : PRODUCTS;
      c.innerHTML = `
        <div class="row mb-3" style="flex-wrap:wrap;gap:8px">
          <a class="chip ${!f ? "active" : ""}" href="#/dash/owner/products">ทั้งหมด (${fmt(PRODUCTS.length)})</a>
          ${CATEGORIES.map((x) => `<a class="chip ${f === x.id ? "active" : ""}" href="#/dash/owner/products?cat=${x.id}">${x.icon} ${esc(x.name)} (${fmt(PRODUCTS.filter((p) => p.category === x.id).length)})</a>`).join("")}
        </div>
        ${productMgmtTable(list, u, { title: "สินค้าในระบบ", canToggle: true })}`;
      bindProductActions(c, u, {});
    });
}

function ownerOrdersManage() {
  const u = Store.currentUser();
  const orders = Store.getOrders().sort((a, b) => (b.dateISO || "").localeCompare(a.dateISO || ""));
  return mgmtPage(u, "orders", "owner", "ตรวจสอบคำสั่งซื้อ", "คำสั่งซื้อทั้งหมดของระบบ",
    (c) => {
      const f = App.lastQuery && App.lastQuery.status;
      const list = f ? orders.filter((o) => o.status === f) : orders;
      c.innerHTML = `
        <div class="dash-grid">
          ${["pending", "processing", "shipping", "delivered", "cancelled"].map((s) => statCard(statusIcon(s), fmt(orders.filter((o) => o.status === s).length), Store.STATUS_LABEL[s], statusColor(s))).join("")}
        </div>
        <div class="row mb-3" style="flex-wrap:wrap;gap:8px">
          <a class="chip ${!f ? "active" : ""}" href="#/dash/owner/orders">ทั้งหมด</a>
          ${["pending", "processing", "shipping", "delivered", "cancelled"].map((s) => `<a class="chip ${f === s ? "active" : ""}" href="#/dash/owner/orders?status=${s}">${esc(Store.STATUS_LABEL[s])}</a>`).join("")}
        </div>
        ${list.length ? orderMgmtTable(list, { sellerMode: false }) : UI.emptyState("📦", "ไม่มีคำสั่งซื้อในสถานะนี้", "")}`;
      bindOrderActions(c);
    });
}

function ownerSalesManage() {
  return ownerSalesView();
}

App.routes.push(
  { pattern: ["dash", "owner", "accounts"], role: ["owner"], dash: true, title: "บัญชีผู้ใช้งาน", render: () => ownerAccountsView() },
  { pattern: ["dash", "owner", "sellers"], role: ["owner"], dash: true, title: "ผู้ขาย", render: () => ownerSellersView() },
  { pattern: ["dash", "owner", "buyers"], role: ["owner"], dash: true, title: "ผู้ซื้อ", render: () => ownerBuyersView() },
  { pattern: ["dash", "owner", "products"], role: ["owner"], dash: true, title: "สินค้า", render: () => ownerProductsManage() },
  { pattern: ["dash", "owner", "orders"], role: ["owner"], dash: true, title: "คำสั่งซื้อ", render: () => ownerOrdersManage() },
  { pattern: ["dash", "owner", "sales"], role: ["owner"], dash: true, title: "ยอดขาย", render: () => ownerSalesManage() },
  { pattern: ["dash", "owner", "reports"], role: ["owner"], dash: true, title: "รายงาน", render: () => ownerReportsView() },
  { pattern: ["dash", "owner", "health"], role: ["owner"], dash: true, title: "สุขภาพระบบ", render: () => healthView() },

  { pattern: ["dash", "admin", "users"], role: ["admin", "owner"], dash: true, title: "จัดการผู้ใช้", render: () => adminUsersView() },
  { pattern: ["dash", "admin", "sellers"], role: ["admin", "owner"], dash: true, title: "อนุมัติผู้ขาย", render: () => adminSellersView() },
  { pattern: ["dash", "admin", "products"], role: ["admin", "owner"], dash: true, title: "จัดการสินค้า", render: () => adminProductsView() },
  { pattern: ["dash", "admin", "categories"], role: ["admin", "owner"], dash: true, title: "หมวดหมู่สินค้า", render: () => categoriesView() },
  { pattern: ["dash", "admin", "orders"], role: ["admin", "owner"], dash: true, title: "คำสั่งซื้อ", render: () => adminOrdersView() },
  { pattern: ["dash", "admin", "settings"], role: ["admin", "owner"], dash: true, title: "ตั้งค่าเว็บไซต์", render: () => settingsView() },
  { pattern: ["dash", "admin", "reports"], role: ["admin", "owner"], dash: true, title: "รายงานระบบ", render: () => adminReportsView() },

  { pattern: ["dash", "seller", "store"], role: ["seller"], dash: true, title: "ร้านค้าของฉัน", render: () => sellerStoreView() },
  { pattern: ["dash", "seller", "products"], role: ["seller"], dash: true, title: "จัดการสินค้า", render: () => sellerProductsView() },
  { pattern: ["dash", "seller", "orders"], role: ["seller"], dash: true, title: "จัดการคำสั่งซื้อ", render: () => sellerOrdersView() },
  { pattern: ["dash", "seller", "sales"], role: ["seller"], dash: true, title: "ยอดขาย", render: () => sellerSalesView() }
);