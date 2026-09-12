function loginView() {
  const html = `
    <div class="auth-wrap">
      <div class="auth-card">
        <div class="auth-logo">
          <div class="logo">🌾</div>
          <h1>เข้าสู่ระบบ</h1>
          <p>ยินดีต้อนรับกลับสู่ ${esc(SHOP.name)}</p>
        </div>
        <div class="demo-login mb-4">
          <div><b>บัญชีทดลอง</b> (รหัสผ่านทั้งหมด: <b>1234</b>)</div>
          <div class="chip-row">
            <button class="chip" data-demo="owner">👑 owner</button>
            <button class="chip" data-demo="admin">🛡️ admin</button>
            <button class="chip" data-demo="seller1">🏪 seller1</button>
            <button class="chip" data-demo="buyer1">🛒 buyer1</button>
          </div>
        </div>
        <form id="loginForm" novalidate>
          ${UI.field("lgUser", "ชื่อผู้ใช้", { ph: "username", required: true, msg: "กรุณากรอกชื่อผู้ใช้" })}
          ${UI.field("lgPass", "รหัสผ่าน", { type: "password", ph: "••••••", required: true, msg: "กรุณากรอกรหัสผ่าน" })}
          <div class="row-between mb-3">
            <span></span>
            <a class="small" href="#/forgot">ลืมรหัสผ่าน?</a>
          </div>
          <button class="btn btn-primary btn-lg btn-block" type="submit">เข้าสู่ระบบ</button>
        </form>
        <div style="height:14px"></div>
        <div class="center small" style="color:var(--muted)">ยังไม่มีบัญชี? <a href="#/register" class="strong">สมัครสมาชิก</a></div>
      </div>
    </div>`;
  return {
    title: "เข้าสู่ระบบ",
    html,
    init(container) {
      _qa("[data-demo]", container).forEach((b) => {
        b.addEventListener("click", () => {
          _q("#lgUser", container).value = b.dataset.demo;
          _q("#lgPass", container).value = "1234";
          _q("#loginForm", container).requestSubmit();
        });
      });
      const form = _q("#loginForm", container);
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!UI.validate(form, ["lgUser", "lgPass"])) return;
        const res = Store.login(_q("#lgUser", container).value, _q("#lgPass", container).value);
        if (!res.ok) { toast(res.msg, "danger"); return; }
        toast(`ยินดีต้อนรับ คุณ${esc(res.user.name)}`, "success");
        const next = App.flash && App.flash.next ? App.flash.next : Store.ROLE_HOME[res.user.role];
        App.flash = null;
        location.hash = next;
      });
    },
  };
}

function registerView() {
  let nextStoreId = "st" + (STORES.reduce((mx, s) => Math.max(mx, parseInt(String(s.id).replace(/\D/g, "")) || 0), 0) + 1);
  const html = `
    <div class="auth-wrap">
      <div class="auth-card" style="max-width:560px">
        <div class="auth-logo">
          <div class="logo">🌱</div>
          <h1>สมัครสมาชิก</h1>
          <p>เริ่มต้นออเดอร์ของคุณกับสินค้าเกษตรจากชุมชน</p>
        </div>
        <form id="regForm" novalidate>
          <div class="field">
            <label class="label">สมัครเป็น</label>
            <div class="grid" style="grid-template-columns:1fr 1fr;gap:10px">
              <label class="radio-card sel" id="roleBuyerCard">
                <input type="radio" name="regRole" value="buyer" checked>
                <div><div class="r-title">🛒 ผู้ซื้อ</div><div class="r-sub">ซื้อสินค้าจากร้านต่าง ๆ</div></div>
              </label>
              <label class="radio-card" id="roleSellerCard">
                <input type="radio" name="regRole" value="seller">
                <div><div class="r-title">🏪 ผู้ขาย</div><div class="r-sub">เปิดร้านค้าของคุณ (ต้องผ่านการอนุมัติ)</div></div>
              </label>
            </div>
          </div>
          ${UI.field("rgName", "ชื่อ-นามสกุล", { ph: "เช่น สมชาย ใจดี", required: true, msg: "กรุณากรอกชื่อ-นามสกุล" })}
          <div class="form-grid">
            ${UI.field("rgPhone", "เบอร์โทรศัพท์", { ph: "08x-xxx-xxxx", required: true, msg: "กรุณากรอกเบอร์โทรศัพท์" })}
            ${UI.field("rgEmail", "อีเมล", { type: "email", ph: "you@mail.com", required: false })}
          </div>
          <div class="form-grid">
            ${UI.field("rgUser", "ชื่อผู้ใช้", { ph: "username", required: true, msg: "กรุณากรอกชื่อผู้ใช้ (อย่างน้อย 4 ตัว)" })}
            ${UI.field("rgPass", "รหัสผ่าน", { type: "password", ph: "อย่างน้อย 4 ตัว", required: true, msg: "กรุณากรอกรหัสผ่าน (อย่างน้อย 4 ตัว)" })}
          </div>
          <div class="form-grid">
            ${UI.field("rgPass2", "ยืนยันรหัสผ่าน", { type: "password", ph: "พิมพ์ซ้ำอีกครั้ง", required: true, msg: "กรุณายืนยันรหัสผ่าน" })}
            ${UI.field("rgAddr", "ที่อยู่จัดส่ง", { ph: "บ้านเลขที่ ถนน ตำบล อำเภอ จังหวัด", required: false })}
          </div>
          <div id="sellerFields" class="hidden">
            <div class="alert alert-info mb-4"><span class="ico">ℹ️</span><div>หลังจากสมัครแล้ว บัญชีผู้ขายของคุณจะถูกส่งให้ผู้ดูแลระบบตรวจสอบและอนุมัติก่อนเปิดร้าน ใช้เวลาประมาณ 1-3 วัน</div></div>
            <div class="form-grid">
              ${UI.field("rgStoreName", "ชื่อร้านค้า", { ph: "เช่น สวนผลไม้คุณลุง", required: false })}
              ${UI.field("rgStoreLine", "Line ID ร้านค้า", { ph: "สำหรับติดต่อ", required: false })}
            </div>
          </div>
          <button class="btn btn-primary btn-lg btn-block" type="submit">สร้างบัญชีสมาชิก</button>
        </form>
        <div style="height:14px"></div>
        <div class="center small" style="color:var(--muted)">มีบัญชีอยู่แล้ว? <a href="#/login" class="strong">เข้าสู่ระบบ</a></div>
      </div>
    </div>`;
  return {
    title: "สมัครสมาชิก",
    html,
    init(container) {
      const roleCards = [_q("#roleBuyerCard", container), _q("#roleSellerCard", container)];
      const sellerFields = _q("#sellerFields", container);
      function syncRole() {
        const val = _q('input[name="regRole"]:checked', container).value;
        roleCards.forEach((c) => c.classList.toggle("sel", c.querySelector("input").checked));
        sellerFields.classList.toggle("hidden", val !== "seller");
        const storeName = _q("#rgStoreName", container);
        if (val === "seller" && storeName) storeName.parentElement.querySelector(".label").innerHTML = 'ชื่อร้านค้า <span class="text-danger">*</span>';
        else if (storeName) { const l = storeName.parentElement.querySelector(".label"); if (l) l.innerHTML = "ชื่อร้านค้า"; }
      }
      roleCards.forEach((c) => c.addEventListener("click", () => { c.querySelector("input").checked = true; syncRole(); }));
      const form = _q("#regForm", container);
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!UI.validate(form, ["rgName", "rgPhone", "rgUser", "rgPass", "rgPass2"])) return;
        const role = _q('input[name="regRole"]:checked', container).value;
        if (role === "seller" && !_q("#rgStoreName", container).value.trim()) {
          _q("#rgStoreName", container).closest(".field").classList.add("invalid");
          toast("กรุณากรอกชื่อร้านค้า", "danger");
          return;
        }
        const user = _q("#rgUser", container).value.trim();
        const pass = _q("#rgPass", container).value;
        if (user.length < 4) { toast("ชื่อผู้ใช้ต้องมีอย่างน้อย 4 ตัวอักษร", "danger"); return; }
        if (pass.length < 4) { toast("รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร", "danger"); return; }
        if (pass !== _q("#rgPass2", container).value) { toast("รหัสผ่านทั้งสองช่องไม่ตรงกัน", "danger"); return; }
        const phone = _q("#rgPhone", container).value.trim();
        if (!/^0\d{8,9}$/.test(phone)) { _q("#rgPhone", container).closest(".field").classList.add("invalid"); toast("กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (ขึ้นต้น 0)", "danger"); return; }

        let storeId = null;
        if (role === "seller") {
          storeId = nextStoreId;
          STORES.push({
            id: nextStoreId, name: _q("#rgStoreName", container).value.trim(),
            owner: _q("#rgName", container).value.trim(), emoji: "🏪", c1: "#1e7b45", c2: "#a8d5a2",
            phone, line: _q("#rgStoreLine", container).value.trim() || "-", desc: "ร้านค้าน้องใหม่จากชุมชน บ้านลีเล็ด",
            rating: 0, since: "2569", status: "pending", requestedAt: new Date().toISOString().slice(0, 10),
          });
        }
        const res = Store.register({ name: _q("#rgName", container).value, username: user, password: pass, phone, email: _q("#rgEmail", container).value, address: _q("#rgAddr", container).value, role, storeId });
        if (!res.ok) { toast(res.msg, "danger"); return; }
        if (role === "seller") {
          toast("สมัครเรียบร้อย! บัญชีผู้ขายรอการอนุมัติจากผู้ดูแลระบบ", "success");
        } else {
          Store.setSession({ userId: res.user.id, username: res.user.username, role: "buyer", name: res.user.name, at: Date.now() });
          toast("สมัครสมาชิกเรียบร้อย ยินดีต้อนรับ! 🎉", "success");
        }
        App.refreshChrome && App.refreshChrome();
        location.hash = role === "seller" ? "#/login" : "#/dash/buyer";
      });
    },
  };
}

function forgotView() {
  const html = `
    <div class="auth-wrap">
      <div class="auth-card">
        <div class="auth-logo">
          <div class="logo">🔑</div>
          <h1>ลืมรหัสผ่าน</h1>
          <p>ป้อนชื่อผู้ใช้หรืออีเมลเพื่อรีเซ็ตรหัสผ่าน</p>
        </div>
        <form id="forgotForm" novalidate>
          ${UI.field("fgUser", "ชื่อผู้ใช้", { ph: "username", required: true, msg: "กรุณากรอกชื่อผู้ใช้" })}
          ${UI.field("fgEmail", "อีเมลที่ลงทะเบียน", { type: "email", ph: "you@mail.com", required: true, msg: "กรุณากรอกอีเมล" })}
          <button class="btn btn-primary btn-lg btn-block" type="submit">ส่งลิงก์รีเซ็ตรหัสผ่าน</button>
        </form>
        <div style="height:14px"></div>
        <div class="center small" style="color:var(--muted)"><a href="#/login">← กลับไปเข้าสู่ระบบ</a></div>
      </div>
    </div>`;
  return {
    title: "ลืมรหัสผ่าน",
    html,
    init(container) {
      const form = _q("#forgotForm", container);
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!UI.validate(form, ["fgUser", "fgEmail"])) return;
        const u = Store.getUserByUsername(_q("#fgUser", container).value);
        if (!u || u.email.toLowerCase() !== _q("#fgEmail", container).value.trim().toLowerCase()) {
          toast("ไม่พบข้อมูลผู้ใช้ที่ตรงกัน กรุณาตรวจสอบอีกครั้ง", "danger");
          return;
        }
        toast("ส่งอีเมลรีเซ็ตรหัสผ่านเรียบร้อยแล้ว กรุณาตรวจสอบอีเมลของคุณ", "success");
        location.hash = "#/login";
      });
    },
  };
}

function profileView() {
  const user = Store.currentUser();
  if (!user) {
    App.flash = { next: "#/profile" };
    location.hash = "#/login";
    return { title: "โปรไฟล์", html: "", init: null };
  }
  const store = user.role === "seller" ? Store.getStore(user.storeId) : null;
  function f(v) { return esc(v || "—"); }
  const html = `
    <div class="view-pad">
      <div class="container-sm">
        ${UI.breadcrumb([{ label: "หน้าแรก", href: "#/" }, { label: "โปรไฟล์", current: true }])}
        <div class="page-head"><h1>โปรไฟล์ของฉัน</h1><div class="sub">จัดการข้อมูลส่วนตัวและความปลอดภัยของบัญชี</div></div>
        <div class="grid" style="grid-template-columns:300px 1fr;gap:20px;align-items:start">
          <div class="card card-pad center" style="text-align:center">
            ${UI.avatar(user.name, "avatar-lg", user.username)}
            <div class="strong" style="font-size:16px;margin-top:12px">${esc(user.name)}</div>
            <div class="small muted">@${esc(user.username)}</div>
            <div style="margin-top:10px">${statusBadge(user.status)} <span class="badge badge-primary">${Store.ROLE_LABEL[user.role]}</span></div>
            <div class="small muted mt-4">สมัครเมื่อ ${f(user.createdAt)}</div>
            ${store ? `<div style="margin-top:12px;padding-top:12px;border-top:1px dashed var(--border)" class="small"><div class="strong" style="font-size:14px">${store.emoji} ${esc(store.name)}</div><span>${statusBadge(store.status)}</span></div>` : ""}
          </div>
          <div class="card">
            <div class="card-head"><div class="strong">แก้ไขข้อมูลส่วนตัว</div></div>
            <div class="card-pad">
              <form id="profileForm" novalidate>
                <div class="form-grid">
                  ${UI.field("pfName", "ชื่อ-นามสกุล", { ph: "ชื่อของคุณ", required: true, value: user.name, msg: "กรุณากรอกชื่อ" })}
                  ${UI.field("pfPhone", "เบอร์โทรศัพท์", { ph: "08x-xxx-xxxx", required: true, value: user.phone, msg: "กรุณากรอกเบอร์โทรศัพท์" })}
                  ${UI.field("pfEmail", "อีเมล", { type: "email", ph: "you@mail.com", value: user.email, required: false })}
                  ${UI.field("pfAddr", "ที่อยู่", { type: "textarea", value: user.address || "", required: false })}
                </div>
                <button class="btn btn-primary" type="submit">บันทึกข้อมูล</button>
              </form>
              <div style="border-top:1px dashed var(--border);margin:24px 0"></div>
              <form id="passForm" novalidate>
                <div class="card-title" style="margin-bottom:14px">เปลี่ยนรหัสผ่าน</div>
                <div class="form-grid">
                  ${UI.field("pfOld", "รหัสผ่านเดิม", { type: "password", ph: "••••••", required: true, msg: "กรุณากรอกรหัสผ่านเดิม" })}
                  ${UI.field("pfNew", "รหัสผ่านใหม่ (อย่างน้อย 4 ตัว)", { type: "password", ph: "••••••", required: true, msg: "กรุณากรอกรหัสผ่านใหม่" })}
                </div>
                <button class="btn btn-soft" type="submit">เปลี่ยนรหัสผ่าน</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  return {
    title: "โปรไฟล์",
    html,
    init(container) {
      const form = _q("#profileForm", container);
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!UI.validate(form, ["pfName", "pfPhone"])) return;
        Store.updateUser(user.id, {
          name: _q("#pfName", container).value.trim(),
          phone: _q("#pfPhone", container).value.trim(),
          email: _q("#pfEmail", container).value.trim(),
          address: _q("#pfAddr", container).value.trim(),
        });
        toast("บันทึกข้อมูลเรียบร้อยแล้ว", "success");
        App.refreshChrome && App.refreshChrome();
      });
      const pf = _q("#passForm", container);
      pf.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!UI.validate(pf, ["pfOld", "pfNew"])) return;
        if (_q("#pfOld", container).value !== user.password) { toast("รหัสผ่านเดิมไม่ถูกต้อง", "danger"); return; }
        const np = _q("#pfNew", container).value;
        if (np.length < 4) { toast("รหัสผ่านใหม่ต้องมีอย่างน้อย 4 ตัวอักษร", "danger"); return; }
        Store.updateUser(user.id, { password: np });
        toast("เปลี่ยนรหัสผ่านเรียบร้อยแล้ว", "success");
        pf.reset();
      });
    },
  };
}

App.routes.push(
  { pattern: ["login"], role: null, dash: false, title: "เข้าสู่ระบบ", render: () => loginView() },
  { pattern: ["register"], role: null, dash: false, title: "สมัครสมาชิก", render: () => registerView() },
  { pattern: ["forgot"], role: null, dash: false, title: "ลืมรหัสผ่าน", render: () => forgotView() },
  { pattern: ["profile"], role: ["any"], dash: false, title: "โปรไฟล์", render: () => profileView() }
);