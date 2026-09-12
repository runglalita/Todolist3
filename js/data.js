const SHOP = {
  name: "ตลาดเกษตรกรบ้านลีเล็ด",
  tagline: "สินค้าเกษตรคุณภาพจากชุมชนบ้านลีเล็ด สุราษฎร์ธานี",
  phone: "077-123-456",
  line: "@lileudfarm",
  facebook: "lileud.farm",
  email: "hello@lileud.local",
  address: "หมู่ที่ 5 ตำบลลีเล็ด อำเภอพุนพิน จังหวัดสุราษฎร์ธานี 84130",
  hours: "จันทร์ - อาทิตย์ 08:00 - 18:00 น.",
  lat: "9.0515",
  lng: "99.3465",
};

const CATEGORIES = [
  { id: "veg", name: "ผักสด", icon: "🥬", c1: "#2e8b57", c2: "#9adcae" },
  { id: "fruit", name: "ผลไม้", icon: "🍎", c1: "#d9480f", c2: "#f7b733" },
  { id: "local", name: "สินค้าพื้นบ้าน", icon: "🧺", c1: "#8d3b5c", c2: "#dda2c0" },
  { id: "processed", name: "ผลิตภัณฑ์แปรรูป", icon: "🫙", c1: "#7a4a33", c2: "#d8b08c" },
  { id: "agri", name: "สินค้าเกษตรทั่วไป", icon: "🌾", c1: "#c9a227", c2: "#f2e088" },
];

const STORES = [
  { id: "st1", name: "สวนผลไม้ลุงสม", owner: "ลุงสม วิเศษสิน", emoji: "🍈", c1: "#c9a227", c2: "#e8c547", phone: "081-222-0001", line: "sonsuan", desc: "สวนผลไม้ผสมหลากชนิด ปล่อยสุกคาต้น ส่งตรงจากสวน", rating: 4.9, since: "2562", status: "active", approvedAt: "2562-04-12" },
  { id: "st2", name: "สวนมะพร้าวป้าแจ๋ว", owner: "ป้าแจ๋ว สุขเกษม", emoji: "🥥", c1: "#4c8c4a", c2: "#9acd87", phone: "081-222-0002", line: "jaeo_farm", desc: "มะพร้าวน้ำหอมและสับปะรดภูแล ตัดสดตามออเดอร์", rating: 4.8, since: "2560", status: "active", approvedAt: "2560-03-02" },
  { id: "st3", name: "สวนกล้วยป้าชื่น", owner: "ป้าชื่น สุขสถิตย์", emoji: "🍌", c1: "#e8c547", c2: "#f6e27a", phone: "081-222-0003", line: "chuensuan", desc: "กล้วยน้ำว้าและกล้วยไข่ หวีใหญ่ ผลอวบ ปลอดสาร 100%", rating: 4.7, since: "2561", status: "active", approvedAt: "2561-07-21" },
  { id: "st4", name: "กลุ่มแม่บ้านลีเล็ด", owner: "แม่อรทัย ใจศิลป์", emoji: "🥘", c1: "#b5482f", c2: "#e2703f", phone: "081-222-0004", line: "maeban_lileud", desc: "อาหารแปรรูป สินค้าพื้นบ้านและของฝากขึ้นชื่อของชุมชน", rating: 4.9, since: "2558", status: "active", approvedAt: "2558-01-15" },
  { id: "st5", name: "ไร่ข้าวและป่าชุมชนลุงทองดี", owner: "ลุงทองดี ธัญญะ", emoji: "🌾", c1: "#d8c082", c2: "#efdfae", phone: "081-222-0005", line: "thongdee_rice", desc: "ข้าวหอมมะลิ น้ำผึ้งป่า และผลิตภัณฑ์อินทรีย์จากป่าชุมชน", rating: 4.9, since: "2560", status: "active", approvedAt: "2560-09-30" },
  { id: "st6", name: "ฟาร์มผักปลอดสารป้าวิลัย", owner: "ป้าวิลัย หมื่นศรี", emoji: "🥬", c1: "#2e8b57", c2: "#7cc576", phone: "081-222-0006", line: "wilai_veg", desc: "ผักสวนครัวปลอดสาร เก็บเช้า-ส่งเย็น ครบวงจรชุมชน", rating: 4.8, since: "2563", status: "active", approvedAt: "2563-02-18" },
  { id: "st7", name: "สวนมังคุดคุณตู๋", owner: "สมบูรณ์ ทองศรี", emoji: "🍇", c1: "#8a3b5c", c2: "#c98aa8", phone: "081-222-0007", line: "tub_mangosteen", desc: "สวนมังคุดเกรดส่งออก คัดยางน้อย เนื้อขาวสะอาด", rating: 0, since: "", status: "pending", approvedAt: "", requestedAt: "2569-09-02" },
  { id: "st8", name: "ไร่กาแฟภูเขาแดง", owner: "กิตติ ธารทอง", emoji: "☕", c1: "#5d4037", c2: "#a1887f", phone: "081-222-0008", line: "kafei_san", desc: "กาแฟอาราบิก้าภูเขา กระบวนการล้างน้ำ", rating: 0, since: "2564", status: "suspended", approvedAt: "2564-05-10", reason: "จำหน่ายสินค้าไม่ตรงรายละเอียดที่แจ้ง" },
];

const USERS = [
  { id: 1, username: "owner", password: "1234", role: "owner", name: "กำนันประดิษฐ์ รักไทย", phone: "081-111-0001", email: "owner@lileud.local", status: "active", createdAt: "2561-01-01" },
  { id: 2, username: "admin", password: "1234", role: "admin", name: "มานี ใจดี", phone: "081-111-0002", email: "admin@lileud.local", status: "active", createdAt: "2561-01-01" },
  { id: 3, username: "seller1", password: "1234", role: "seller", storeId: "st1", name: "ลุงสม วิเศษสิน", phone: "081-222-0001", email: "seller1@lileud.local", status: "active", createdAt: "2562-04-12" },
  { id: 4, username: "seller2", password: "1234", role: "seller", storeId: "st2", name: "ป้าแจ๋ว สุขเกษม", phone: "081-222-0002", email: "seller2@lileud.local", status: "active", createdAt: "2560-03-02" },
  { id: 5, username: "seller3", password: "1234", role: "seller", storeId: "st3", name: "ป้าชื่น สุขสถิตย์", phone: "081-222-0003", email: "seller3@lileud.local", status: "active", createdAt: "2561-07-21" },
  { id: 6, username: "seller4", password: "1234", role: "seller", storeId: "st4", name: "แม่อรทัย ใจศิลป์", phone: "081-222-0004", email: "seller4@lileud.local", status: "active", createdAt: "2558-01-15" },
  { id: 7, username: "seller5", password: "1234", role: "seller", storeId: "st5", name: "ลุงทองดี ธัญญะ", phone: "081-222-0005", email: "seller5@lileud.local", status: "active", createdAt: "2560-09-30" },
  { id: 8, username: "seller6", password: "1234", role: "seller", storeId: "st6", name: "ป้าวิลัย หมื่นศรี", phone: "081-222-0006", email: "seller6@lileud.local", status: "active", createdAt: "2563-02-18" },
  { id: 9, username: "seller7", password: "1234", role: "seller", storeId: "st7", name: "สมบูรณ์ ทองศรี", phone: "081-222-0007", email: "seller7@lileud.local", status: "active", createdAt: "2569-09-02" },
  { id: 10, username: "seller8", password: "1234", role: "seller", storeId: "st8", name: "กิตติ ธารทอง", phone: "081-222-0008", email: "seller8@lileud.local", status: "suspended", createdAt: "2564-05-10" },
  { id: 11, username: "buyer1", password: "1234", role: "buyer", name: "สมชาย ใจดี", phone: "091-333-0001", email: "buyer1@mail.com", status: "active", createdAt: "2565-06-15", address: "12/3 ถ.ท่านคร ต.ในเมือง อ.เมือง จ.สุราษฎร์ธานี 84000" },
  { id: 12, username: "buyer2", password: "1234", role: "buyer", name: "สมหญิง แสนดี", phone: "091-333-0002", email: "buyer2@mail.com", status: "active", createdAt: "2566-01-20", address: "88 หมู่ 2 ต.ท่าข้าม อ.พุนพิน จ.สุราษฎร์ธานี 84130" },
  { id: 13, username: "buyer3", password: "1234", role: "buyer", name: "วิชัย ทองคำ", phone: "091-333-0003", email: "buyer3@mail.com", status: "active", createdAt: "2567-11-03", address: "45 หมู่ 8 ต.ท่าทองใหม่ อ.กาญจนดิษฐ์ จ.สุราษฎร์ธานี 84160" },
  { id: 14, username: "buyer4", password: "1234", role: "buyer", name: "ปรียา สายใจ", phone: "091-333-0004", email: "buyer4@mail.com", status: "suspended", createdAt: "2566-09-12", address: "101 ถ.ขนานสิบทิศ ต.บางกุ้ง อ.เมือง จ.สุราษฎร์ธานี 84000", suspendReason: "แจ้งเลขบัตรผิดหลายครั้งระหว่างชำระ" },
];

const PRODUCTS = [
  { id: 1, name: "ทุเรียนหมอนทอง สวนลุงสม", category: "fruit", price: 220, unit: "กก.", stock: 50, sellerId: "st1", emoji: "🥇", c1: "#c9a227", c2: "#e8c547", rating: 4.9, ratingCount: 214, sold: 240, featured: true, best: true, tags: ["ขายดี", "ปล่อยสุกคาต้น"], status: "active", desc: "ทุเรียนหมอนทองเนื้อหนา เม็ดลีบ สีเหลืองทอง หอม หวาน มัน ปล่อยสุกคาต้น ส่งตรงจากสวนถึงมือคุณ" },
  { id: 2, name: "มังคุดคัดเกรด AA", category: "fruit", price: 90, unit: "กก.", stock: 80, sellerId: "st1", emoji: "🍇", c1: "#8a3b5c", c2: "#c98aa8", rating: 4.8, ratingCount: 186, sold: 620, featured: false, best: true, tags: ["คัดเกรด AA"], status: "active", desc: "มังคุดเปลือกสวย เนื้อขาวสะอาด หวานอมเปรี้ยวน้อย คว้านขั้วล้างยางให้ทุกผล ส่งใหม่อร่อยชัวร์" },
  { id: 3, name: "เงาะโรงเรียน", category: "fruit", price: 75, unit: "กก.", stock: 60, sellerId: "st1", emoji: "🍒", c1: "#c1344a", c2: "#e6788a", rating: 4.6, ratingCount: 98, sold: 340, featured: false, best: false, tags: ["ตามฤดูกาล"], status: "active", desc: "เงาะโรงเรียนเนื้อกรอบ หวาน ฉ่ำน้ำ ผลใหญ่เป็นพวง คัดทั้งรถ จำหน่ายตามฤดูกาล" },
  { id: 4, name: "ลองกองคละชั้น", category: "fruit", price: 45, unit: "กก.", stock: 70, sellerId: "st1", emoji: "🟡", c1: "#d9a03f", c2: "#f0d68a", rating: 4.5, ratingCount: 84, sold: 190, featured: false, best: false, tags: ["ตามฤดูกาล"], status: "active", desc: "ลองกองรสหวานอมเปรี้ยว เนื้อฉ่ำ เมล็ดลีบ ราคาเป็นมิตร เหมาะทานเล่นทั้งบ้าน" },
  { id: 5, name: "ส้มโอขาวน้ำผึ้ง", category: "fruit", price: 60, unit: "ลูก", stock: 90, sellerId: "st1", emoji: "🍊", c1: "#e2954b", c2: "#f5c88a", rating: 4.8, ratingCount: 121, sold: 275, featured: false, best: false, tags: ["หอมหวาน"], status: "active", desc: "ส้มโอขาวน้ำผึ้ง กลีบใหญ่ เนื้อกรอบ หวานหอม น้ำเยอะ ปลูกแบบอินทรีย์ ห่างไกลสารเคมี" },
  { id: 6, name: "มะพร้าวน้ำหอม ลูกใหญ่", category: "fruit", price: 40, unit: "ลูก", stock: 100, sellerId: "st2", emoji: "🥥", c1: "#4c8c4a", c2: "#9acd87", rating: 4.9, ratingCount: 231, sold: 710, featured: true, best: true, tags: ["ขายดี", "สดจากต้น"], status: "active", desc: "มะพร้าวน้ำหอมสดจากสวน น้ำหวานเย็น เนื้อนุ่ม ปอกเปลือกสะอาดพร้อมดื่มทันที" },
  { id: 7, name: "สับปะรดภูแล", category: "fruit", price: 30, unit: "ลูก", stock: 85, sellerId: "st2", emoji: "🍍", c1: "#d9a03f", c2: "#f7dc9a", rating: 4.7, ratingCount: 112, sold: 330, featured: false, best: false, tags: ["ตามฤดูกาล"], status: "active", desc: "สับปะรดภูแล เนื้อกรอบ สีเหลืองทอง หวานฉ่ำ คัดลูกโต ตัดช่อเปลือกพร้อมทานหรือทั้งเปลือกตามสั่ง" },
  { id: 8, name: "กล้วยน้ำว้าพวงใหญ่", category: "fruit", price: 35, unit: "หวี", stock: 120, sellerId: "st3", emoji: "🍌", c1: "#e8c547", c2: "#f6e27a", rating: 4.7, ratingCount: 167, sold: 880, featured: false, best: true, tags: ["ของขึ้นชื่อ"], status: "active", desc: "กล้วยน้ำว้าสวนป้าชื่น หวีใหญ่ ผลอวบ เนื้อนุ่มหอมหวาน ปลอดสาร 100% ตัดใหม่ทุกวัน" },
  { id: 9, name: "กล้วยไข่หอม ๆ", category: "fruit", price: 45, unit: "หวี", stock: 60, sellerId: "st3", emoji: "🍌", c1: "#e6c229", c2: "#fbe68a", rating: 4.7, ratingCount: 96, sold: 430, featured: false, best: false, tags: ["หอมหวาน"], status: "active", desc: "กล้วยไข่ลูกเล็กประกบ เปลือกบาง เนื้อเหลืองทอง หอมหวานละมุน เหมาะเป็นของว่างเพื่อสุขภาพ" },
  { id: 10, name: "ผักสวนครัวรวมมิตร", category: "veg", price: 49, unit: "ชุด", stock: 40, sellerId: "st6", emoji: "🥬", c1: "#2e8b57", c2: "#7cc576", rating: 4.8, ratingCount: 143, sold: 305, featured: false, best: false, tags: ["ปลอดสาร"], status: "active", desc: "ชุดผักสวนครัวปลอดสาร เช่น คะน้า กวางตุ้ง ผักบุ้ง แตงกวา เก็บเช้า-ส่งเย็น ขอเปลี่ยนชนิดได้" },
  { id: 11, name: "พริกสดสวนบ้านลีเล็ด", category: "veg", price: 40, unit: "กก.", stock: 25, sellerId: "st6", emoji: "🌶️", c1: "#c0392b", c2: "#e57368", rating: 4.6, ratingCount: 77, sold: 420, featured: false, best: false, tags: ["เผ็ดจัด"], status: "active", desc: "พริกขี้หนูสดจากสวน รสเผ็ดร้อนจัดจ้าน หอมกลิ่นพริกสด เอาไปทำน้ำพริกหรือต้มยำจี๊ดเลย" },
  { id: 12, name: "คะน้าและกวางตุ้งปลอดสาร", category: "veg", price: 35, unit: "กก.", stock: 45, sellerId: "st6", emoji: "🥦", c1: "#3a7d44", c2: "#8ec98f", rating: 4.7, ratingCount: 88, sold: 260, featured: false, best: false, tags: ["ปลอดสาร"], status: "active", desc: "คะน้าและกวางตุ้งใบกรอบ ปลอดภัยจากสารพิษ ตัดส่งเช้ามืด ถึงมือคุณความสดที่สุด" },
  { id: 13, name: "มะเขือเปราะเพชร", category: "veg", price: 55, unit: "กก.", stock: 30, sellerId: "st6", emoji: "🍆", c1: "#8a3b5c", c2: "#c78fb0", rating: 4.6, ratingCount: 52, sold: 140, featured: false, best: false, tags: ["ปลอดสาร"], status: "active", desc: "มะเขือเปราะเพชร กรอบ ไม่ฝาด เก็บสดจากแปลง เหมาะทำแกงเขียวหวานหรือลาบ" },
  { id: 14, name: "มะนาวแป้นรสดี", category: "veg", price: 65, unit: "กก.", stock: 60, sellerId: "st6", emoji: "🍋", c1: "#7fa832", c2: "#c8d97e", rating: 4.6, ratingCount: 65, sold: 190, featured: false, best: false, tags: ["ปลอดสาร"], status: "active", desc: "มะนาวแป้นน้ำเยอะ เปลือกบาง รสเปรี้ยวจัด ปลอดสาร ทำน้ำผลไม้หรืออาหารได้ชุ่มฉ่ำ" },
  { id: 15, name: "ไข่เค็มไชยา สูตรโบราณ", category: "processed", price: 120, unit: "โหล", stock: 200, sellerId: "st4", emoji: "🥚", c1: "#a0522d", c2: "#d8a37e", rating: 4.9, ratingCount: 320, sold: 1520, featured: true, best: true, tags: ["สุดยอดของฝาก", "ขายดีอันดับ 1"], status: "active", desc: "ไข่เค็มสูตรเลื่องชื่อไชยา ไข่แดงเข้ม มัน เค็มกลมกล่อม ไม่คาว วัตถุดิบท้องถิ่นคุณภาพ เสิร์ฟคู่ข้าวยำหรือหมูสามชั้น" },
  { id: 16, name: "กะปิแท้ สูตรแม่เป้า", category: "processed", price: 80, unit: "ขวด (300ก.)", stock: 150, sellerId: "st4", emoji: "🍤", c1: "#7a4a33", c2: "#bfa08a", rating: 4.8, ratingCount: 246, sold: 860, featured: false, best: false, tags: ["ของฝากขึ้นชื่อ"], status: "active", desc: "กะปิแท้จากเคยทะเล หมักสูตรโบราณ กลิ่นหอม รสจัด เหมาะทำน้ำพริกกะปิ ส้มตำ เครื่องแกง" },
  { id: 17, name: "น้ำพริกกะปิพร้อมทาน + ผักสด", category: "processed", price: 35, unit: "ถ้วย", stock: 80, sellerId: "st4", emoji: "🥘", c1: "#b5482f", c2: "#e2703f", rating: 4.7, ratingCount: 134, sold: 540, featured: false, best: false, tags: ["พร้อมทาน"], status: "active", desc: "น้ำพริกกะปิตำสด พร้อมผักสดเครื่องเคียง ปลาทูทอดและไข่ต้ม ใส่กล่องพร้อมทาน" },
  { id: 18, name: "ปลาแห้งแดดเดียว", category: "processed", price: 150, unit: "กก.", stock: 45, sellerId: "st4", emoji: "🐟", c1: "#8d6e63", c2: "#c4a79b", rating: 4.6, ratingCount: 88, sold: 380, featured: false, best: false, tags: ["ตามสั่ง"], status: "active", desc: "ปลาแดดเดียวตากใหม่ เนื้อแน่น เกลือกำลังดี ย่างหรือทอดหอมกรุ่น เมนูง่ายของทุกบ้าน" },
  { id: 19, name: "เครื่องแกงใต้ หอมเครื่องสด", category: "local", price: 40, unit: "ถุง", stock: 70, sellerId: "st4", emoji: "🌶️", c1: "#a33", c2: "#d96b6b", rating: 4.8, ratingCount: 164, sold: 610, featured: false, best: false, tags: ["สไตล์ใต้"], status: "active", desc: "เครื่องแกงใต้สไตล์ปักษ์ใต้ โขลกสดแบบโบราณ เผ็ดร้อน หอมถึงเครื่อง เหมาะกับปลาทูหรือไก่บ้าน" },
  { id: 20, name: "ข้าวแต๋นน้ำแตงโมสูตรโบราณ", category: "local", price: 25, unit: "ถุง", stock: 300, sellerId: "st4", emoji: "🍘", c1: "#b8860b", c2: "#e0c060", rating: 4.7, ratingCount: 208, sold: 950, featured: false, best: true, tags: ["ของว่าง", "ของฝาก"], status: "active", desc: "ข้าวแต๋นอบสูตรโบราณ กรอบอร่อย หอมงา อบสดทุกสัปดาห์ ไม่ชุบน้ำตาลเคมี เหมาะเป็นของฝาก" },
  { id: 21, name: "ขนมไทยโบราณ ทำมือ", category: "local", price: 120, unit: "กล่อง", stock: 50, sellerId: "st4", emoji: "🍮", c1: "#c778a5", c2: "#e6b3cd", rating: 4.9, ratingCount: 118, sold: 470, featured: false, best: false, tags: ["ทำมือ", "ของฝาก"], status: "active", desc: "ขนมไทยโบราณทำมือ เช่น กล้วยบวชชี ขนมถ้วยฟู ขนมหน้านวล ตะโก้ ใส่กล่องสวยรับของขวัญ" },
  { id: 22, name: "ข้าวสารหอมมะลิใหม่", category: "agri", price: 45, unit: "กก.", stock: 200, sellerId: "st5", emoji: "🍚", c1: "#d8c082", c2: "#efdfae", rating: 4.9, ratingCount: 265, sold: 1100, featured: true, best: true, tags: ["ขายดี"], status: "active", desc: "ข้าวหอมมะลิใหม่จากนา หุงขึ้นหม้อ หอม นุ่ม ปลอดภัย มอก. รับรอง สั่ง 10 กก.ขึ้นไปส่งฟรีในอำเภอ" },
  { id: 23, name: "น้ำผึ้งป่าแท้จากรังธรรมชาติ", category: "agri", price: 280, unit: "ขวด (500ก.)", stock: 60, sellerId: "st5", emoji: "🍯", c1: "#e4a010", c2: "#f5cf85", rating: 4.8, ratingCount: 149, sold: 290, featured: false, best: false, tags: ["บริสุทธิ์ 100%"], status: "active", desc: "น้ำผึ้งป่าจากรังธรรมชาติ ไม่ผสมน้ำตาล ตรวจความบริสุทธิ์แล้ว สีเข้มรสกลมกล่อม หอมดอกไม้ป่า" },
  { id: 24, name: "ปุ๋ยหมักอินทรีย์ครบสูตร", category: "agri", price: 60, unit: "ถุง (10กก.)", stock: 300, sellerId: "st5", emoji: "💩", c1: "#6d4c41", c2: "#a1887f", rating: 4.7, ratingCount: 88, sold: 410, featured: false, best: false, tags: ["อินทรีย์"], status: "active", desc: "ปุ๋ยหมักอินทรีย์จากเศษวัสดุการเกษตร หมักครบสูตร บำรุงดิน บำรุงพืช ลดการใช้สารเคมี" },
  { id: 25, name: "น้ำหมักจุลินทรีย์ EM", category: "agri", price: 45, unit: "ขวด (1ล.)", stock: 150, sellerId: "st5", emoji: "🧪", c1: "#3b82c4", c2: "#8ec4e8", rating: 4.6, ratingCount: 71, sold: 230, featured: false, best: false, tags: ["อินทรีย์"], status: "active", desc: "น้ำหมักจุลินทรีย์ EM ช่วยย่อยสลาย ปรับปรุงดินและบำบัดน้ำเสีย ใช้ในครัวเรือนและไร่นา" },
  { id: 26, name: "เมล็ดพันธุ์ผักรวมปลอดการตัดต่อ", category: "agri", price: 39, unit: "ซอง", stock: 120, sellerId: "st6", emoji: "🌱", c1: "#2e8b57", c2: "#9adcae", rating: 4.7, ratingCount: 64, sold: 180, featured: false, best: false, tags: ["อินทรีย์"], status: "active", desc: "เมล็ดพันธุ์ผักปลอดการตัดต่อพันธุกรรม เช่น โหระพา กะเพรา คะน้า บีทรูท ปลูกง่ายงอกไว" },
  { id: 27, name: "ต้นกล้าผักปลอดสาร", category: "agri", price: 15, unit: "ต้น", stock: 250, sellerId: "st6", emoji: "🪴", c1: "#3a7d44", c2: "#8ec98f", rating: 4.8, ratingCount: 92, sold: 520, featured: false, best: true, tags: ["อินทรีย์", "ขายดี"], status: "active", desc: "ต้นกล้าผักปลอดสารพร้อมย้ายปลูก เช่น มะเขือ กะหล่ำ พริก บรรจุถ้วยเพาะอย่างดี ส่งตรงถึงสวน" },
];

const STATUS_LABEL = {
  pending: "รอดำเนินการ",
  processing: "กำลังเตรียมสินค้า",
  shipping: "กำลังจัดส่ง",
  delivered: "จัดส่งสำเร็จ",
  cancelled: "ยกเลิก",
};

function _mkOrder(id, no, date, sellerId, buyerId, status, payment, shipping, items) {
  const lines = items.map((pair) => {
    const p = PRODUCTS.find((x) => x.id === pair[0]);
    return { id: p.id, name: p.name, emoji: p.emoji, unit: p.unit, price: p.price, qty: pair[1], line: p.price * pair[1], store: p.sellerId };
  });
  const shipPrice = shipping === "pick" ? 0 : shipping === "express" ? 80 : 40;
  const subtotal = lines.reduce((s, l) => s + l.line, 0);
  return { id, no, date, sellerId, buyerId, status, payment, shipping, items: lines, subtotal, ship: shipPrice, discount: 0, total: subtotal + shipPrice };
}

const ORDERS = [
  _mkOrder(1, "LL-260916-0142", "2026-09-16 10:24", "st4", 11, "pending", "cod", "standard", [[15, 2], [17, 4]]),
  _mkOrder(2, "LL-260915-1130", "2026-09-15 14:05", "st1", 12, "pending", "qr", "standard", [[1, 3], [2, 5]]),
  _mkOrder(3, "LL-260915-0987", "2026-09-15 09:41", "st2", 13, "processing", "cod", "standard", [[6, 6], [7, 4]]),
  _mkOrder(4, "LL-260914-0765", "2026-09-14 16:30", "st6", 11, "shipping", "qr", "express", [[10, 2], [12, 3], [14, 1]]),
  _mkOrder(5, "LL-260913-0554", "2026-09-13 11:12", "st5", 12, "processing", "cod", "standard", [[22, 10], [23, 1]]),
  _mkOrder(6, "LL-260911-0310", "2026-09-11 18:03", "st4", 13, "delivered", "qr", "standard", [[16, 3], [20, 6]]),
  _mkOrder(7, "LL-260910-1102", "2026-09-10 08:47", "st3", 11, "delivered", "cod", "standard", [[8, 4], [9, 2]]),
  _mkOrder(8, "LL-260908-0876", "2026-09-08 13:20", "st1", 14, "cancelled", "cod", "standard", [[3, 2]]),
  _mkOrder(9, "LL-260905-0654", "2026-09-05 15:44", "st2", 12, "delivered", "cod", "pick", [[6, 10]]),
  _mkOrder(10, "LL-260902-0488", "2026-09-02 09:10", "st6", 13, "delivered", "qr", "standard", [[11, 2], [13, 1]]),
  _mkOrder(11, "LL-260830-0366", "2026-08-30 12:35", "st4", 11, "delivered", "cod", "standard", [[15, 1], [19, 3], [21, 1]]),
  _mkOrder(12, "LL-260826-0221", "2026-08-26 17:22", "st5", 12, "delivered", "qr", "standard", [[24, 4], [25, 2]]),
  _mkOrder(13, "LL-260822-0148", "2026-08-22 10:05", "st1", 13, "delivered", "cod", "standard", [[1, 2], [5, 3]]),
  _mkOrder(14, "LL-260818-0099", "2026-08-18 14:50", "st2", 11, "delivered", "qr", "express", [[6, 4], [7, 6]]),
];

const REVIEWS = [
  { id: 1, productId: 15, buyerId: 11, buyerName: "สมชาย ใจดี", rating: 5, date: "2026-09-08", comment: "ไข่แดงเข้มมาก สุกมันเค็มกลมกล่อม ตรงปกจริง ๆ สั่งซ้ำแน่นอน" },
  { id: 2, productId: 15, buyerId: 12, buyerName: "สมหญิง แสนดี", rating: 5, date: "2026-09-05", comment: "ไข่เค็มไชยาต้นตำรับ ห่อส่งดี ไม่แตก ส่งไวมากค่ะ" },
  { id: 3, productId: 1, buyerId: 12, buyerName: "สมหญิง แสนดี", rating: 5, date: "2026-09-12", comment: "ทุเรียนสุกกำลังดี เนื้อหวานมัน แกะง่าย ร้านดูแลดี" },
  { id: 4, productId: 1, buyerId: 13, buyerName: "วิชัย ทองคำ", rating: 5, date: "2026-08-28", comment: "ส่งถึงบ้านเร็ว ทุเรียนสภาพสวย สมราคา" },
  { id: 5, productId: 2, buyerId: 11, buyerName: "สมชาย ใจดี", rating: 4, date: "2026-08-20", comment: "มังคุดเนื้อขาวสะอาด หวานรอบลูกดี มีรสเปรี้ยวอยู่บ้างนิดหน่อย" },
  { id: 6, productId: 6, buyerId: 13, buyerName: "วิชัย ทองคำ", rating: 5, date: "2026-09-01", comment: "น้ำหอมมาก เนื้อนุ่ม ปอกพร้อมดื่ม หอมจริง" },
  { id: 7, productId: 6, buyerId: 12, buyerName: "สมหญิง แสนดี", rating: 5, date: "2026-08-30", comment: "สั่งทีละ 10 ลูก ตัดสดตัวจริง ทุกครั้งคุณภาพสม่ำเสมอ" },
  { id: 8, productId: 22, buyerId: 11, buyerName: "สมชาย ใจดี", rating: 5, date: "2026-08-22", comment: "ข้าวหอมมาก หุงแล้วนุ่ม ขึ้นหม้อ ไม่ต้องซู๊ด" },
  { id: 9, productId: 22, buyerId: 13, buyerName: "วิชัย ทองคำ", rating: 5, date: "2026-08-15", comment: "ซื้อถังใหญ่ไปเลย ข้าวดีจริง ราคาเป็นมิตร" },
  { id: 10, productId: 8, buyerId: 11, buyerName: "สมชาย ใจดี", rating: 5, date: "2026-09-06", comment: "กล้วยหวีใหญ่มาก ลูกอวบ สุกพอกินกำลังดี" },
  { id: 11, productId: 16, buyerId: 13, buyerName: "วิชัย ทองคำ", rating: 5, date: "2026-09-02", comment: "กะปิหอมมาก ทำน้ำพริกแล้วอร่อยสุด ๆ" },
  { id: 12, productId: 20, buyerId: 11, buyerName: "สมชาย ใจดี", rating: 4, date: "2026-08-19", comment: "กรอบอร่อย หอมงา ห่อแน่น ของฝากชอบ" },
  { id: 13, productId: 10, buyerId: 13, buyerName: "วิชัย ทองคำ", rating: 5, date: "2026-09-03", comment: "ผักสดจริง ใบกรอบ ชุดนี้คุ้มมาก" },
  { id: 14, productId: 11, buyerId: 12, buyerName: "สมหญิง แสนดี", rating: 4, date: "2026-08-25", comment: "เผ็ดจัด ถูกใจคนใต้ ห่อมาสดดี" },
  { id: 15, productId: 23, buyerId: 12, buyerName: "สมหญิง แสนดี", rating: 5, date: "2026-08-16", comment: "น้ำผึ้งแท้ดูจากความเข้มข้น หวานแต่ไม่อม พ่อชอบมาก" },
  { id: 16, productId: 21, buyerId: 13, buyerName: "วิชัย ทองคำ", rating: 5, date: "2026-08-12", comment: "ขนมถ้วยฟูนุ่ม หวานกำลังดี ใส่กล่องสวยใช้เป็นของขวัญได้" },
  { id: 17, productId: 3, buyerId: 14, buyerName: "ปรียา สายใจ", rating: 4, date: "2026-08-08", comment: "เงาะกรอบ หวานฉ่ำ แต่บางผลยางนิดหน่อย ยังไงก็อร่อย" },
  { id: 18, productId: 27, buyerId: 11, buyerName: "สมชาย ใจดี", rating: 5, date: "2026-08-10", comment: "ต้นกล้าแข็งแรง กระโดดย้ายปลูกแล้วโตไวมาก" },
];

const COMMUNITY = {
  name: "กลุ่มเกษตรกรชุมชนบ้านลีเล็ด",
  founded: "พ.ศ. 2558",
  members: 128,
  villages: "หมู่ 5, 6, 9 ตำบลลีเล็ด อำเภอพุนพิน",
  story: "กลุ่มเกษตรกรชุมชนบ้านลีเล็ดก่อตั้งจากชาวสวนและชาวนาท้องถิ่นที่ต้องการรวมกลุ่มจำหน่ายผลผลิตโดยตรงถึงผู้บริโภค แบ่งปันองค์ความรู้การเกษตรอินทรีย์ และอนุรักษ์วิถีชุมชนริมแม่น้ำตาปี เรารวบรวมผลไม้ตามฤดูกาล ผักปลอดสาร อาหารแปรรูปพื้นบ้าน และของดีจากป่าชุมชนมาจำหน่ายในราคาเป็นธรรมทั้งผู้ซื้อและผู้ขาย",
  leaders: [
    { name: "กำนันประดิษฐ์ รักไทย", role: "ประธานกลุ่ม", emoji: "👨‍🌾" },
    { name: "แม่อรทัย ใจศิลป์", role: "เลขาประเภทแปรรูป", emoji: "👩‍🍳" },
    { name: "ลุงทองดี ธัญญะ", role: "หัวหน้าฝ่ายข้าวและป่าชุมชน", emoji: "🌾" },
  ],
  activities: [
    { emoji: "🧑‍🌾", title: "ฝึกอบรมเกษตรอินทรีย์", desc: "จัดอบรมปุ๋ยหมักชีวภาพและน้ำหมัก EM ทุกไตรมาส" },
    { emoji: "🚜", title: "ตลาดนัดชุมชน", desc: "เปิดตลาดนัดผลผลิตสดทุกวันเสาร์หน้าศาลากลางหมู่บ้าน" },
    { emoji: "🎓", title: "ศูนย์เรียนรู้", desc: "ต้อนรับนักเรียนและผู้สนใจเรียนรู้วิถีการเกษตร" },
    { emoji: "♻️", title: "เกษตรหมุนเวียน", desc: "หมุนเวียนแปลงปลูก ลดการใช้สารเคมีทั้งชุมชน" },
  ],
  stats: { farmers: 128, kinds: 40, memberShops: 8, satisfaction: 98 },
};

const SETTINGS = {
  siteName: "ตลาดเกษตรกรบ้านลีเล็ด",
  tagline: "สินค้าเกษตรคุณภาพจากชุมชนบ้านลีเล็ด สุราษฎร์ธานี",
  announcement: "โปรโมชันสั่งซื้อครั้งแรก ลด 10% ใช้โค้ด LILEUD10",
  freeShippingAbove: 500,
  shippingFee: 40,
  expressFee: 80,
  allowRegistration: true,
  autoApproveSeller: false,
};

const ANNOUNCEMENTS = [
  { id: 1, title: "เปิดรับสมาชิกผู้ขายรอบใหม่", date: "2569-09-10", body: "เกษตรกรหรือกลุ่มวิสาหกิจในพื้นที่ชุมชนบ้านลีเล็ด ที่ต้องการจำหน่ายสินค้าผ่านเว็บไซต์ ติดต่อประสานงานเพื่อตรวจสอบสถานะได้ที่ Line @lileudfarm" },
  { id: 2, title: "ตลาดนัดประจำเดือนกันยายน", date: "2569-09-05", body: "พบกันทุกวันเสาร์ตลอดเดือนกันยายน ณ ศาลากลางหมู่บ้าน เริ่ม 08:00 น. มีผลิตภัณฑ์สดจากแปลงและอาหารพื้นบ้านให้เลือกชิมฟรี" },
  { id: 3, title: "ปิดปรับปรุงระบบชำระเงินชั่วคราว", date: "2569-08-28", body: "ระบบชำระเงินผ่าน QR จะปิดปรับปรุงช่วง 22:00 - 23:00 น. ของวันที่ 5 กันยายน ขออภัยในความไม่สะดวก" },
];

const EMOJI_CHOICES = ["🍎", "🍌", "🥭", "🍍", "🥥", "🥬", "🍆", "🌽", "🍠", "🥒", "🍅", "🌶️", "🧄", "🧅", "🥚", "🐟", "🍤", "🍚", "🍯", "🥘", "🍮", "🍘", "🌾", "🧺", "🫙", "🌱", "🪴", "💩", "🧪", "🍇", "🍊", "🍒", "🍋", "🥦", "☕"];