const Store = (function () {
  const LS = {
    users: "lileud_users",
    session: "lileud_session",
    cart: "lileud_cart",
    orders: "lileud_orders",
    reviews: "lileud_reviews",
    theme: "lileud_theme",
  };

  function read(key, fallback) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
  }
  function write(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  function seed() {
    if (!localStorage.getItem(LS.users)) write(LS.users, USERS);
    if (!localStorage.getItem(LS.orders)) write(LS.orders, ORDERS);
    if (!localStorage.getItem(LS.reviews)) write(LS.reviews, REVIEWS);
    if (!localStorage.getItem(LS.cart)) write(LS.cart, []);
  }

  const ROLE_LABEL = { owner: "เจ้าของระบบ", admin: "ผู้ดูแลระบบ", seller: "ผู้ขาย", buyer: "ผู้ซื้อ" };
  const ROLE_HOME = { owner: "#/dash/owner", admin: "#/dash/admin", seller: "#/dash/seller", buyer: "#/dash/buyer" };

  function getUsers() { return read(LS.users, USERS); }
  function saveUsers(list) { write(LS.users, list); }
  function getUser(id) { return getUsers().find((u) => u.id === Number(id)); }
  function getUserByUsername(name) { return getUsers().find((u) => u.username.toLowerCase() === String(name).toLowerCase().trim()); }

  function getSession() { return read(LS.session, null); }
  function setSession(s) { if (s) write(LS.session, s); else localStorage.removeItem(LS.session); }
  function currentUser() {
    const s = getSession();
    if (!s) return null;
    const u = getUser(s.userId);
    return u && u.status === "active" ? u : null;
  }
  function login(username, password) {
    const u = getUserByUsername(username);
    if (!u || u.password !== password) return { ok: false, msg: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" };
    if (u.status !== "active") return { ok: false, msg: "บัญชีนี้ถูกระงับการใช้งาน กรุณาติดต่อผู้ดูแลระบบ" };
    setSession({ userId: u.id, username: u.username, role: u.role, name: u.name, at: Date.now() });
    return { ok: true, user: u };
  }
  function logout() { setSession(null); Store.emit("auth"); }
  function register(data) {
    const users = getUsers();
    if (!data.username || !data.password) return { ok: false, msg: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน" };
    if (getUserByUsername(data.username)) return { ok: false, msg: "ชื่อผู้ใช้นี้ถูกใช้แล้ว" };
    const maxId = users.reduce((m, u) => Math.max(m, u.id), 0);
    const newUser = {
      id: maxId + 1,
      username: data.username.trim(),
      password: data.password,
      role: data.role || "buyer",
      name: data.name.trim(),
      phone: (data.phone || "").trim(),
      email: (data.email || "").trim(),
      address: (data.address || "").trim(),
      status: data.role === "seller" ? "active" : "active",
      createdAt: new Date().toISOString().slice(0, 10),
      storeId: data.role === "seller" ? data.storeId || null : undefined,
    };
    if (data.role === "seller") {
      newUser.storeId = data.storeId;
      const store = STORES.find((s) => s.id === data.storeId);
      if (store) { store.status = "pending"; store.requestedAt = new Date().toISOString().slice(0, 10); store.owner = data.name; }
      newUser.status = "active";
    }
    users.push(newUser);
    saveUsers(users);
    return { ok: true, user: newUser };
  }
  function updateUser(id, patch) {
    const users = getUsers();
    const u = users.find((x) => x.id === Number(id));
    if (!u) return { ok: false, msg: "ไม่พบผู้ใช้" };
    Object.assign(u, patch);
    saveUsers(users);
    return { ok: true, user: u };
  }
  function deleteUser(id) {
    saveUsers(getUsers().filter((x) => x.id !== Number(id)));
  }

  function getCart() { return read(LS.cart, []); }
  function saveCart(c) { write(LS.cart, c); Store.emit("cart"); }
  function cartCount() { return getCart().reduce((s, i) => s + i.qty, 0); }
  function addToCart(productId, qty) {
    const cart = getCart();
    const hit = cart.find((i) => i.id === productId);
    if (hit) hit.qty = Math.min(hit.qty + qty, 999);
    else cart.push({ id: productId, qty });
    saveCart(cart);
  }
  function setCartQty(productId, qty) {
    const cart = getCart().map((i) => (i.id === productId ? { ...i, qty: Math.max(0, qty) } : i)).filter((i) => i.qty > 0);
    saveCart(cart);
  }
  function removeFromCart(productId) { saveCart(getCart().filter((i) => i.id !== productId)); }
  function clearCart() { saveCart([]); }
  function cartDetailed() {
    return getCart().map((i) => {
      const p = PRODUCTS.find((x) => x.id === i.id);
      if (!p || p.status !== "active") return null;
      return { ...p, qty: i.qty, line: p.price * i.qty };
    }).filter(Boolean);
  }

  function getOrders() { return read(LS.orders, []); }
  function saveOrders(o) { write(LS.orders, o); }
  function genOrderNo() {
    const d = new Date();
    const p = (n, l = 2) => String(n).padStart(l, "0");
    return `LL-${p(d.getDate())}${p(d.getMonth() + 1)}${String(d.getFullYear()).slice(2)}-${Math.floor(1000 + Math.random() * 9000)}`;
  }
  function createOrder(buyerId, shipping, payment, addr, discount) {
    const lines = cartDetailed();
    if (!lines.length) return { ok: false, msg: "ตะกร้าไม่ว่างหรือสินค้าถูกปิดการขาย" };
    const groups = {};
    lines.forEach((l) => { (groups[l.sellerId] = groups[l.sellerId] || []).push(l); });
    const sellers = Object.keys(groups);
    const orders = getOrders();
    const d = new Date();
    const now = d.toLocaleString("th-TH", { dateStyle: "short", timeStyle: "short" });
    const dateISO = d.toISOString();
    const created = [];
    for (const sid of sellers) {
      const lines2 = groups[sid];
      const subtotal = lines2.reduce((s, l) => s + l.line, 0);
      const ship = Number(shipping.method) === "pick" ? 0 : subtotal >= SETTINGS.freeShippingAbove ? 0 : Number(shipping.method === "express" ? SETTINGS.expressFee : SETTINGS.shippingFee);
      const disc = Math.min(discount, subtotal);
      const buyer = getUser(buyerId);
      orders.unshift({
        id: orders.length ? Math.max(...orders.map((o) => o.id)) + 1 : 1,
        no: genOrderNo(),
        date: now,
        dateISO,
        sellerId: sid,
        buyerId,
        buyerName: buyer ? buyer.name : "ลูกค้า",
        buyerPhone: buyer ? buyer.phone : "",
        address: addr,
        status: "pending",
        payment,
        shipping: shipping.method,
        shipLabel: shipping.label,
        items: lines2.map((l) => ({ id: l.id, name: l.name, emoji: l.emoji, unit: l.unit, price: l.price, qty: l.qty, line: l.line, store: l.sellerId })),
        subtotal,
        ship,
        discount: disc,
        total: subtotal + ship - disc,
      });
      created.push(orders[0]);
    }
    saveOrders(orders);
    clearCart();
    return { ok: true, orders: created };
  }
  function updateOrderStatus(orderId, status) {
    const orders = getOrders();
    const o = orders.find((x) => x.id === Number(orderId));
    if (!o) return { ok: false, msg: "ไม่พบคำสั่งซื้อ" };
    if (o.status === "delivered" || o.status === "cancelled") return { ok: false, msg: "ไม่สามารถเปลี่ยนสถานะคำสั่งซื้อที่เสร็จสิ้นแล้วได้" };
    o.status = status;
    saveOrders(orders);
    return { ok: true };
  }

  function getReviews() { return read(LS.reviews, REVIEWS); }
  function saveReviews(r) { write(LS.reviews, r); }
  function productReviews(productId) {
    return getReviews().filter((r) => r.productId === Number(productId)).sort((a, b) => (b.date < a.date ? -1 : 1));
  }
  function productRating(productId) {
    const list = productReviews(productId);
    if (!list.length) {
      const p = PRODUCTS.find((x) => x.id === Number(productId));
      return { avg: p ? p.rating : 0, count: p ? p.ratingCount : 0 };
    }
    const avg = list.reduce((s, r) => s + r.rating, 0) / list.length;
    return { avg: Math.round(avg * 10) / 10, count: list.length };
  }
  function addReview(productId, buyerId, rating, comment) {
    const reviews = getReviews();
    const ex = reviews.find((r) => r.productId === Number(productId) && r.buyerId === Number(buyerId));
    const buyer = getUser(buyerId);
    if (ex) {
      ex.rating = rating; ex.comment = comment; ex.date = new Date().toISOString().slice(0, 10);
    } else {
      reviews.unshift({
        id: reviews.length ? Math.max(...reviews.map((r) => r.id)) + 1 : 1,
        productId: Number(productId), buyerId, buyerName: buyer ? buyer.name : "ลูกค้า",
        rating, comment, date: new Date().toISOString().slice(0, 10),
      });
    }
    saveReviews(reviews);
  }
  function canReview(productId, buyerId) {
    const orders = getOrders().filter((o) => o.buyerId === Number(buyerId) && o.status === "delivered");
    return orders.some((o) => o.items.some((i) => i.id === Number(productId)));
  }

  function getTheme() { try { return localStorage.getItem(LS.theme) || "light"; } catch (e) { return "light"; } }
  function setTheme(t) {
    try { localStorage.setItem(LS.theme, t); } catch (e) {}
    document.documentElement.setAttribute("data-theme", t);
    Store.emit("theme");
  }
  function toggleTheme() { setTheme(getTheme() === "light" ? "dark" : "light"); }

  const events = {};
  function on(name, fn) { (events[name] = events[name] || []).push(fn); }
  function emit(name) { (events[name] || []).forEach((fn) => fn()); }

  function getStore(id) { return STORES.find((s) => s.id === id); }
  function getCategory(id) { return CATEGORIES.find((c) => c.id === id); }
  function storeProducts(storeId, activeOnly) {
    return PRODUCTS.filter((p) => p.sellerId === storeId && (!activeOnly || p.status === "active"));
  }
  function getProduct(id) { return PRODUCTS.find((p) => p.id === Number(id)); }
  function productUpdated() { Store.emit("products"); }

  function counts() {
    const users = getUsers();
    const orders = getOrders();
    const revenue = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
    return {
      users: users.length,
      sellers: users.filter((u) => u.role === "seller").length,
      buyers: users.filter((u) => u.role === "buyer").length,
      admins: users.filter((u) => u.role === "admin" || u.role === "owner").length,
      products: PRODUCTS.filter((p) => p.status === "active").length,
      stores: STORES.filter((s) => s.status === "active").length,
      pendingStores: STORES.filter((s) => s.status === "pending").length,
      orders: orders.length,
      revenue,
      pendingOrders: orders.filter((o) => o.status === "pending").length,
      soldItems: orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.items.reduce((a, i) => a + i.qty, 0), 0),
      reviews: getReviews().length,
    };
  }

  function weeklyRevenue(weeks = 8, sid) {
    const out = [];
    const now = new Date();
    for (let w = weeks - 1; w >= 0; w--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - w * 7);
      const key = d.toISOString().slice(0, 10);
      let sum = 0;
      getOrders().forEach((o) => {
        if (o.status === "cancelled") return;
        if (sid && o.sellerId !== sid) return;
        if (o.dateISO && o.dateISO.slice(0, 10) === key) sum += o.total;
      });
      const label = `${d.getDate()}/${d.getMonth() + 1}`;
      out.push({ label, sum });
    }
    return out;
  }

  function salesByCategory(sid) {
    const map = {};
    getOrders().forEach((o) => {
      if (o.status === "cancelled") return;
      if (sid && o.sellerId !== sid) return;
      o.items.forEach((i) => {
        const p = getProduct(i.id);
        const c = p ? getCategory(p.category) : null;
        const k = c ? c.name : "อื่น ๆ";
        map[k] = (map[k] || 0) + i.line;
      });
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }

  function bestSellers(limit, sid) {
    const map = {};
    getOrders().forEach((o) => {
      if (o.status === "cancelled") return;
      if (sid && o.sellerId !== sid) return;
      o.items.forEach((i) => {
        map[i.id] = (map[i.id] || 0) + i.qty;
      });
    });
    return Object.entries(map)
      .map(([id, qty]) => ({ product: getProduct(id), qty, revenue: (getProduct(id) || {}).price ? getProduct(id).price * qty : 0 }))
      .filter((x) => x.product)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, limit || 10);
  }

  function formatOrderTimeline(status) {
    const steps = ["pending", "processing", "shipping", "delivered"];
    return steps.map((s) => ({ id: s, done: steps.indexOf(s) < steps.indexOf(status) || status === "delivered", active: s === status }));
  }

  function initials(name) {
    return (name || "").split(/\s+/).map((x) => x[0]).slice(0, 2).join("").toUpperCase() || "?";
  }

  function currency(n) {
    return "฿" + Number(n || 0).toLocaleString("th-TH", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }

  seed();
  return {
    LS, ROLE_LABEL, ROLE_HOME, STATUS_LABEL,
    getUsers, saveUsers, getUser, getUserByUsername,
    getSession, setSession, currentUser, login, logout, register, updateUser, deleteUser,
    getCart, saveCart, cartCount, addToCart, setCartQty, removeFromCart, clearCart, cartDetailed,
    getOrders, saveOrders, genOrderNo, createOrder, updateOrderStatus,
    getReviews, saveReviews, productReviews, productRating, addReview, canReview,
    getTheme, setTheme, toggleTheme, on, emit,
    getStore, getCategory, storeProducts, getProduct, productUpdated,
    counts, weeklyRevenue, salesByCategory, bestSellers, formatOrderTimeline,
    initials, currency,
  };
})();