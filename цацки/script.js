/* ==========================================================================
   ЦАЦКИ — интернет-магазин украшений
   Каталог, корзина и оформление заказа
   ========================================================================== */

/* ---------- Данные: товары ---------- */

const PRODUCTS = [
  {
    id: 1,
    category: 'chokers',
    image: 'images/img1.jpg',
    name: 'Чокер из белой шпинели с сердцем',
    price: 1200,
    description: 'Натуральные камни, фурнитура с родиевым покрытием — не темнеет при носке.',
  },
  {
    id: 2,
    category: 'charms',
    image: 'images/img2.jpg',
    name: 'Обвес «Бант и сердце»',
    price: 1000,
    description: 'Подвеска-брелок на сумку или джинсы. Бисер ручной работы.',
  },
  {
    id: 3,
    category: 'charms',
    image: 'images/img3.jpg',
    name: 'Обвес «Белый, чёрный агат и шип»',
    price: 1500,
    description: 'Брелок из натурального агата с металлическим шипом-подвеской.',
  },
  {
    id: 4,
    category: 'chokers',
    image: 'images/img4.jpg',
    name: 'Базовый чокер из шпинели',
    price: 900,
    description: 'Тонкий базовый чокер, который подходит к любому образу.',
  },
  {
    id: 5,
    category: 'necklaces',
    image: 'images/img5.jpg',
    name: 'Базовое ожерелье из перламутра',
    price: 1200,
    description: 'Мягкий перламутровый блеск на каждый день — порадуйте себя.',
  },
  {
    id: 6,
    category: 'necklaces',
    image: 'images/img6.jpg',
    name: 'Ожерелье из речного жемчуга с шипами',
    price: 2000,
    description: 'Натуральный речной жемчуг с металлическими шипами, которые не темнеют.',
  },
  {
    id: 7,
    category: 'chokers',
    image: 'images/img7.jpg',
    name: 'Чокер из лунного камня с крестом',
    price: 1300,
    description: 'Лунный камень и подвеска-крест с фианитами.',
  },
  {
    id: 8,
    category: 'chokers',
    image: 'images/img7.jpg',
    name: 'Базовый белый чокер',
    price: 700,
    description: 'Простой светлый чокер на каждый день.',
  },
  {
    id: 9,
    category: 'necklaces',
    image: 'images/img8.jpg',
    name: 'Ожерелье из нежно-розовых цирконов',
    price: 1500,
    description: 'Звёзды с фианитами и подвески с родиевым покрытием, которое не темнеет.',
  },
  {
    id: 10,
    category: 'necklaces',
    image: 'images/img9.jpg',
    name: 'Ожерелье из алмазного стекла с шипом',
    price: 1200,
    description: 'Лёгкое сияющее ожерелье с подвеской-шипом.',
  },
  {
    id: 11,
    category: 'necklaces',
    image: 'images/img11.jpg',
    name: 'Ожерелье из чёрной шпинели с цепями',
    price: 1300,
    description: 'Цепочки двигаются и регулируются — можно носить по-разному.',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'Все украшения' },
  { id: 'chokers', label: 'Чокеры' },
  { id: 'necklaces', label: 'Ожерелья' },
  { id: 'charms', label: 'Брелоки' },
];

const VK_GROUP_URL = 'https://vk.ru/tsatski_alnfdvaa';

/* ---------- Состояние ---------- */

const state = {
  activeCategory: 'all',
  cart: {},        // { productId: quantity }
  lastOrderText: '',
};

/* ---------- DOM-элементы ---------- */

const el = {
  tabs: document.getElementById('tabs'),
  grid: document.getElementById('grid'),
  cartCount: document.getElementById('cartCount'),
  drawer: document.getElementById('drawer'),
  drawerBody: document.getElementById('drawerBody'),
  drawerFoot: document.getElementById('drawerFoot'),
  cartTotal: document.getElementById('cartTotal'),
  overlay: document.getElementById('overlay'),
  checkoutModal: document.getElementById('checkoutModal'),
  checkoutSummary: document.getElementById('checkoutSummary'),
  checkoutForm: document.getElementById('checkoutForm'),
  successModal: document.getElementById('successModal'),
  orderText: document.getElementById('orderText'),
};

/* ---------- Утилиты ---------- */

function formatPrice(amount) {
  return amount.toLocaleString('ru-RU') + ' ₽';
}

function findProduct(id) {
  return PRODUCTS.find((p) => p.id === Number(id));
}

function categoryLabel(id) {
  return CATEGORIES.find((c) => c.id === id).label;
}

function getCartItems() {
  return Object.entries(state.cart).map(([id, qty]) => ({
    ...findProduct(id),
    qty,
  }));
}

function getCartTotal() {
  return getCartItems().reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getCartCount() {
  return Object.values(state.cart).reduce((sum, qty) => sum + qty, 0);
}

/* ==========================================================================
   Каталог
   ========================================================================== */

function renderTabs() {
  el.tabs.innerHTML = CATEGORIES.map((category) => `
    <button
      class="tab ${category.id === state.activeCategory ? 'active' : ''}"
      onclick="setCategory('${category.id}')"
    >
      ${category.label}
    </button>
  `).join('');
}

function setCategory(categoryId) {
  state.activeCategory = categoryId;
  renderTabs();
  renderCatalog();
}

function renderCatalog() {
  const products = state.activeCategory === 'all'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === state.activeCategory);

  el.grid.innerHTML = products.map((product) => `
    <article class="card">
      <div class="card-photo">
        <img src="${product.image}" alt="${product.name}">
        <span class="price-charm">${formatPrice(product.price)}</span>
      </div>
      <div class="card-body">
        <span class="card-cat">${categoryLabel(product.category)}</span>
        <h3 class="card-name">${product.name}</h3>
        <p class="card-desc">${product.description}</p>
        <button class="add-btn" id="add-btn-${product.id}" onclick="addToCart(${product.id})">
          Добавить в корзину
        </button>
      </div>
    </article>
  `).join('');
}

/* ==========================================================================
   Корзина
   ========================================================================== */

function addToCart(productId) {
  state.cart[productId] = (state.cart[productId] || 0) + 1;
  renderCartCount();
  flashAddedButton(productId);
}

function flashAddedButton(productId) {
  const button = document.getElementById(`add-btn-${productId}`);
  if (!button) return;

  button.textContent = 'Добавлено ✓';
  button.classList.add('added');

  setTimeout(() => {
    button.textContent = 'Добавить в корзину';
    button.classList.remove('added');
  }, 1200);
}

function changeQuantity(productId, delta) {
  const nextQty = (state.cart[productId] || 0) + delta;

  if (nextQty <= 0) {
    delete state.cart[productId];
  } else {
    state.cart[productId] = nextQty;
  }

  renderCartCount();
  renderCartDrawer();
}

function removeFromCart(productId) {
  delete state.cart[productId];
  renderCartCount();
  renderCartDrawer();
}

function renderCartCount() {
  const count = getCartCount();
  el.cartCount.textContent = count;
  el.cartCount.style.display = count > 0 ? 'flex' : 'none';
}

function renderCartDrawer() {
  const items = getCartItems();

  if (items.length === 0) {
    el.drawerBody.innerHTML = '<div class="cart-empty">Корзина пуста.<br>Загляните в каталог 💫</div>';
    el.drawerFoot.style.display = 'none';
    return;
  }

  el.drawerFoot.style.display = 'block';

  el.drawerBody.innerHTML = items.map((item) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${formatPrice(item.price)}</div>
        <div class="qty-row">
          <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">−</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
          <button class="remove-btn" onclick="removeFromCart(${item.id})">удалить</button>
        </div>
      </div>
    </div>
  `).join('');

  el.cartTotal.textContent = formatPrice(getCartTotal());
}

/* ==========================================================================
   Модальные окна и оверлей
   ========================================================================== */

function openCart() {
  renderCartDrawer();
  el.drawer.classList.add('show');
  el.overlay.classList.add('show');
}

function closeCart() {
  el.drawer.classList.remove('show');
  el.overlay.classList.remove('show');
}

function closeAll() {
  el.drawer.classList.remove('show');
  el.checkoutModal.classList.remove('show');
  el.successModal.classList.remove('show');
  el.overlay.classList.remove('show');
}

function openCheckout() {
  const items = getCartItems();
  if (items.length === 0) return;

  const rows = items
    .map((item) => `<div><span>${item.name} × ${item.qty}</span><span>${formatPrice(item.price * item.qty)}</span></div>`)
    .join('');

  const totalRow = `
    <div style="border-top:1px solid var(--line); margin-top:6px; padding-top:8px; font-weight:700; color:var(--text);">
      <span>Итого</span><span>${formatPrice(getCartTotal())}</span>
    </div>
  `;

  el.checkoutSummary.innerHTML = rows + totalRow;

  el.drawer.classList.remove('show');
  el.checkoutModal.classList.add('show');
  el.overlay.classList.add('show');
}

/* ==========================================================================
   Оформление заказа
   ========================================================================== */

function buildOrderText(name, phone, comment) {
  const items = getCartItems();

  const lines = items
    .map((item) => `— ${item.name} × ${item.qty} — ${formatPrice(item.price * item.qty)}`)
    .join('\n');

  let text = `Здравствуйте! Хочу оформить заказ на сайте ЦАЦКИ.\n\n`
    + `Имя: ${name}\n`
    + `Телефон: ${phone}\n\n`
    + `Заказ:\n${lines}\n\n`
    + `Итого: ${formatPrice(getCartTotal())}\n`
    + `Получение: самовывоз, оплата при встрече`;

  if (comment.trim()) {
    text += `\nКомментарий: ${comment.trim()}`;
  }

  return text;
}

function submitOrder(event) {
  event.preventDefault();

  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const comment = document.getElementById('custComment').value;

  if (!name || !phone) return;

  state.lastOrderText = buildOrderText(name, phone, comment);
  el.orderText.value = state.lastOrderText;

  copyOrderText();
  window.open(VK_GROUP_URL, '_blank');

  state.cart = {};
  renderCartCount();
  el.checkoutForm.reset();

  el.checkoutModal.classList.remove('show');
  el.successModal.classList.add('show');
}

function copyOrderText() {
  el.orderText.select();

  if (navigator.clipboard) {
    navigator.clipboard.writeText(state.lastOrderText).catch(() => {
      document.execCommand('copy');
    });
  } else {
    document.execCommand('copy');
  }
}

/* ==========================================================================
   Инициализация
   ========================================================================== */

function init() {
  renderTabs();
  renderCatalog();
  renderCartCount();
}

init();
