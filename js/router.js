const App = {
  routes: [],
  flash: null,
  lastQuery: {},
  onDash: false,
  currentUser: null,
};

const Router = (function () {
  function makeKey(seg) { return seg.startsWith(":") ? null : seg; }

  function match(pattern, segments) {
    const params = {};
    if (pattern.length !== segments.length) return null;
    for (let i = 0; i < pattern.length; i++) {
      const p = pattern[i];
      if (p.startsWith(":")) params[p.slice(1)] = decodeURIComponent(segments[i] || "");
      else if (p !== segments[i]) return null;
    }
    return params;
  }

  function parseQuery(q) {
    const out = {};
    if (!q) return out;
    q.replace(/^\?/, "").split("&").forEach((kv) => {
      if (!kv) return;
      const [k, v] = kv.split("=");
      out[decodeURIComponent(k)] = decodeURIComponent(v || "");
    });
    return out;
  }

  function hasRole(user, allowed) {
    if (!allowed || !allowed.length) return true;
    if (allowed.length && allowed[0] === "any") return !!user;
    return !!user && allowed.includes(user.role);
  }

  function forbidden() {
    const user = Store.currentUser();
    const target = user ? Store.ROLE_HOME[user.role] : "#/login";
    return {
      title: "ไม่มีสิทธิ์เข้าถึง",
      html: (`
        <div class="container-sm" style="padding-top:64px">
          <div class="card card-pad center">
            <div style="font-size:60px;margin-bottom:12px">🚫</div>
            <h2>ไม่มีสิทธิ์เข้าถึงหน้านี้</h2>
            <p class="muted">บทบาทของคุณไม่มีสิทธิ์เข้าถึงส่วนนี้ของระบบ<br>${user ? `บัญชีของคุณ: ${UI.esc(user.name)} (${Store.ROLE_LABEL[user.role]})` : "กรุณาเข้าสู่ระบบก่อนใช้งาน"}</p>
            <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
              ${user ? `<a class="btn btn-primary" href="${target}">ไปยังหน้าหลักของฉัน</a>` : `<a class="btn btn-primary" href="#/login">เข้าสู่ระบบ</a>`}
              <a class="btn btn-outline" href="#/">กลับหน้าหลัก</a>
            </div>
          </div>
        </div>`),
      init: null,
    };
  }

  function resolve() {
    const raw = location.hash.replace(/^#/, "") || "/";
    const [urlPart, queryStr] = raw.split("?");
    const segments = urlPart.split("/").filter(Boolean);
    const query = parseQuery(queryStr);
    App.lastQuery = query;
    if (!segments.length) segments.push("");
    for (const entry of App.routes) {
      const params = match(entry.pattern, segments);
      if (!params) continue;
      const user = Store.currentUser();
      const allowed = hasRole(user, entry.role);
      if (!allowed) return forbidden();
      let res;
      try { res = entry.render(params, query); } catch (e) {
        console.error(e);
        res = { html: UI.errorState("เกิดข้อผิดพลาด", "ไม่สามารถแสดงหน้านี้ได้ กรุณาลองใหม่อีกครั้ง", `<a class="btn btn-outline mt-3" href="#/">กลับหน้าหลัก</a>`), init: null };
      }
      return {
        entry,
        title: res.title || entry.title || document.title,
        html: res.html,
        init: res.init,
        params,
        query,
      };
    }
    return {
      title: "ไม่พบหน้า",
      html: `<div class="container-sm" style="padding-top:64px">${UI.emptyState("🧭", "ไม่พบหน้าที่คุณต้องการ", "ลิงก์นี้อาจไม่ถูกต้อง หรือหน้านี้ถูกลบไปแล้ว", `<a class="btn btn-primary mt-3" href="#/">กลับหน้าหลัก</a>`)}</div>`,
      init: null,
    };
  }

  function mount() {
    const res = resolve();
    const view = $("#view");
    document.title = res.title ? `${res.title} · ${SHOP.name}` : SHOP.name;
    const isDash = !!(res.entry && res.entry.role && res.entry.dash);
    App.onDash = isDash;
    document.body.classList.toggle("dash-mode", isDash);
    if (isDash) {
      document.body.classList.add("m-body-pad");
    } else {
      document.body.classList.remove("m-body-pad");
    }
    view.scrollTop = 0;
    window.scrollTo(0, 0);
    view.innerHTML = res.html;
    if (res.init) {
      try { res.init(view, res.params, res.query); } catch (e) { console.error(e); }
    }
    $$(".header-link").forEach((a) => {
      const href = a.getAttribute("href") || "";
      a.classList.toggle("active", res.entry && res.entry.pattern[0] === href.replace("#/", ""));
    });
    $$(".m-nav-item").forEach((b) => {
      const href = b.getAttribute("data-href") || "";
      b.classList.toggle("active", href && location.hash.startsWith(href));
    });
    if (App.onClickDash && isDash) App.onClickDash();
    App.onRoute && App.onRoute(res);
  }

  function current() {
    const raw = location.hash.replace(/^#/, "") || "/";
    return raw.split("?")[0];
  }

  function go(hash) {
    if (location.hash === hash) mount();
    else location.hash = hash;
  }
  function reload() { mount(); }

  function init() {
    window.addEventListener("hashchange", mount);
    Store.on("auth", () => { App.currentUser = Store.currentUser(); if (App.refreshChrome) App.refreshChrome(); Router.reload(); });
    mount();
  }

  return { init, go, reload, current, mount };
})();