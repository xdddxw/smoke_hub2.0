import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc,
  runTransaction, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase Конфігурація проєкту SHub
const firebaseConfig = {
  apiKey: "AIzaSyBQmLz3avJrmkrmB9f_EAbkZ2_nsQOCJbI",
  authDomain: "shub-313e7.firebaseapp.com",
  projectId: "shub-313e7",
  storageBucket: "shub-313e7.firebasestorage.app",
  messagingSenderId: "138251084689",
  appId: "1:138251084689:web:2d60a4aa09c1ce8aeev030",
  measurementId: "G-TJW09LSWLF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let products = [];
let orders = [];
let promos = [];
let cart = JSON.parse(localStorage.getItem('shub_cart') || '[]');
let currentCurrency = 'PLN';
let exchangeRate = 4.3; // дефолтний курс PLN -> UAH

// --- ІНІЦІАЛІЗАЦІЯ ПРИ ЗАВАНТАЖЕННІ ---
document.addEventListener('DOMContentLoaded', () => {
  // Рік у футері
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.innerText = new Date().getFullYear();

  // Перевірка віку (Age Gate)
  const ageGate = document.getElementById('ageGate');
  const confirmAgeBtn = document.getElementById('confirmAge');
  const leaveSiteBtn = document.getElementById('leaveSite');

  if (localStorage.getItem('shub_age_confirmed') === 'true') {
    if (ageGate) ageGate.classList.add('hidden');
  }

  if (confirmAgeBtn) {
    confirmAgeBtn.addEventListener('click', () => {
      localStorage.setItem('shub_age_confirmed', 'true');
      if (ageGate) ageGate.classList.add('hidden');
    });
  }

  if (leaveSiteBtn) {
    leaveSiteBtn.addEventListener('click', () => {
      alert('Вибачте, сайт призначений лише для повнолітніх.');
      window.location.href = 'https://www.google.com';
    });
  }

  // Керування мобільним меню
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('active');
    });
  }

  // Перемикання сторінок у навігації
  document.querySelectorAll('nav a, .hero-actions a').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetPage = link.getAttribute('data-page');
      if (targetPage) {
        e.preventDefault();
        switchSitePage(targetPage);
        if (nav) nav.classList.remove('active');
      }
    });
  });

  // Відкриття/закриття кошика (Drawer)
  const cartBtn = document.getElementById('cartBtn');
  const cartDrawer = document.getElementById('cartDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');

  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      if (cartDrawer) cartDrawer.classList.toggle('open');
      if (drawerBackdrop) drawerBackdrop.classList.toggle('hidden');
    });
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', () => {
      if (cartDrawer) cartDrawer.classList.remove('open');
      drawerBackdrop.classList.add('hidden');
      closeAllModals();
    });
  }

  // Кнопки закриття модальних вік та дрейверів
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-close');
      const el = document.getElementById(targetId);
      if (el) el.classList.add('hidden');
      if (cartDrawer) cartDrawer.classList.remove('open');
      if (drawerBackdrop) drawerBackdrop.classList.add('hidden');
    });
  });

  // Оформлення замовлення - модалка
  const checkoutOpenBtn = document.getElementById('checkoutOpen');
  const checkoutModal = document.getElementById('checkoutModal');
  if (checkoutOpenBtn && checkoutModal) {
    checkoutOpenBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Кошик порожній!');
        return;
      }
      if (cartDrawer) cartDrawer.classList.remove('open');
      checkoutModal.classList.remove('hidden');
    });
  }

  // Адмінка - відкриття входу
  const adminOpenBtn = document.getElementById('adminOpen');
  const adminModal = document.getElementById('adminModal');
  const demoAdminLogin = document.getElementById('demoAdminLogin');
  const adminLoginPane = document.getElementById('adminLoginPane');
  const adminPanel = document.getElementById('adminPanel');

  if (adminOpenBtn && adminModal) {
    adminOpenBtn.addEventListener('click', () => {
      adminModal.classList.remove('hidden');
    });
  }

  if (demoAdminLogin) {
    demoAdminLogin.addEventListener('click', () => {
      const passInput = document.getElementById('demoAdminPassword');
      if (passInput && passInput.value === 'smoke-demo') {
        if (adminLoginPane) adminLoginPane.classList.add('hidden');
        if (adminPanel) adminPanel.classList.remove('hidden');
      } else {
        alert('Невірний пароль! (Спробуйте: smoke-demo)');
      }
    });
  }

  // Вихід з адмінки
  const adminLogout = document.getElementById('adminLogout');
  if (adminLogout) {
    adminLogout.addEventListener('click', () => {
      if (adminPanel) adminPanel.classList.add('hidden');
      if (adminLoginPane) adminLoginPane.classList.remove('hidden');
      if (adminModal) adminModal.classList.add('hidden');
    });
  }

  // Перемикання табів в адмінці
  document.querySelectorAll('.admin-tabs button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.admin-tabs button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.getAttribute('data-admin-tab');
      
      const pPane = document.getElementById('adminProductsPane');
      const oPane = document.getElementById('adminOrdersPane');
      const prPane = document.getElementById('adminPromosPane');
      const sPane = document.getElementById('adminSettingsPane');

      if (pPane) pPane.classList.add('hidden');
      if (oPane) oPane.classList.add('hidden');
      if (prPane) prPane.classList.add('hidden');
      if (sPane) sPane.classList.add('hidden');

      if (tab === 'products' && pPane) pPane.classList.remove('hidden');
      if (tab === 'orders' && oPane) oPane.classList.remove('hidden');
      if (tab === 'promos' && prPane) prPane.classList.remove('hidden');
      if (tab === 'settings' && sPane) sPane.classList.remove('hidden');
    });
  });

  // Вибір способу доставки (показувати поля)
  const deliverySelect = document.getElementById('deliverySelect');
  const addressFields = document.getElementById('addressFields');
  const inpostFields = document.getElementById('inpostFields');

  if (deliverySelect) {
    deliverySelect.addEventListener('change', (e) => {
      const val = e.target.value;
      if (addressFields) addressFields.classList.add('hidden');
      if (inpostFields) inpostFields.classList.add('hidden');

      if (val === 'local' && addressFields) addressFields.classList.remove('hidden');
      if (val === 'other' && inpostFields) inpostFields.classList.remove('hidden');
    });
  }

  // Пошук товарів
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderCatalog(e.target.value);
    });
  }

  // Валюта та мова
  const currencySelect = document.getElementById('currency');
  if (currencySelect) {
    currencySelect.addEventListener('change', (e) => {
      currentCurrency = e.target.value;
      updateCartUI();
      renderCatalog();
    });
  }

  // Обробники форм
  const productForm = document.getElementById('productForm');
  if (productForm) {
    productForm.addEventListener('submit', handleProductSubmit);
  }

  const checkoutForm = document.getElementById('checkoutForm');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', handleCheckoutSubmit);
  }

  const resetProductBtn = document.getElementById('resetProduct');
  if (resetProductBtn) {
    resetProductBtn.addEventListener('click', resetProductForm);
  }
});

// Функція перемикання сторінок сайту
function switchSitePage(pageName) {
  document.querySelectorAll('.site-page').forEach(page => {
    page.classList.remove('active');
  });
  const target = document.querySelector(`[data-site-page="${pageName}"]`);
  if (target) {
    target.classList.add('active');
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeAllModals() {
  document.querySelectorAll('.modal-wrap').forEach(m => m.classList.add('hidden'));
}

// Realtime слухачі Firebase
onSnapshot(collection(db, "products"), (snapshot) => {
  products = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  renderCatalog();
  renderAdminProducts();
  updateCartUI();
});

onSnapshot(collection(db, "orders"), (snapshot) => {
  orders = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  renderAdminOrders();
});

onSnapshot(collection(db, "promos"), (snapshot) => {
  promos = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  renderPromos();
  renderAdminPromos();
});

// Розрахунок ціни (з урахуванням опту за кількістю у кошику)
export function calculateUnitPrice(product, quantity) {
  if (!product) return 0;
  let basePrice = Number(product.price) || 0;
  
  // Якщо є рядкові тіри опту на кшталт "2=45, 5=40"
  if (product.priceTiers) {
    // парсимо швиденько
    const pairs = product.priceTiers.split(',');
    let bestPrice = basePrice;
    let maxMinQty = 0;
    pairs.forEach(pair => {
      const [qtyStr, priceStr] = pair.split('=');
      const q = parseInt(qtyStr.trim());
      const p = parseFloat(priceStr.trim());
      if (!isNaN(q) && !isNaN(p) && quantity >= q && q >= maxMinQty) {
        maxMinQty = q;
        bestPrice = p;
      }
    });
    return bestPrice;
  }
  return basePrice;
}

// Форматування ціни (PLN / UAH)
function formatPrice(plnAmount) {
  if (currentCurrency === 'UAH') {
    const uah = Math.round(plnAmount * exchangeRate);
    return `${uah} ₴`;
  }
  return `${plnAmount} zł`;
}

// Рендер каталогу
function renderCatalog(filter = '') {
  const grid = document.getElementById('productGrid');
  const emptyState = document.getElementById('emptyState');
  if (!grid) return;
  grid.innerHTML = '';

  const filtered = products.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));

  if (filtered.length === 0) {
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  } else {
    if (emptyState) emptyState.classList.add('hidden');
  }

  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.background = '#151322';
    card.style.border = '1px solid #2a2540';
    card.style.borderRadius = '12px';
    card.style.padding = '15px';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.justifyContent = 'space-between';

    let imgTag = `<div style="height:140px; background:#1e1a30; border-radius:8px; display:flex; align-items:center; justify-content:center; margin-bottom:10px; color:#666;">No Image</div>`;
    if (p.imageUrl) {
      imgTag = `<img src="${p.imageUrl}" alt="${p.name}" style="height:140px; width:100%; object-fit:cover; border-radius:8px; margin-bottom:10px;">`;
    }

    card.innerHTML = `
      <div>
        ${imgTag}
        <h3 style="font-size:16px; margin-bottom:5px; color:#fff;">${p.name}</h3>
        <p style="font-size:13px; color:#aaa; margin-bottom:10px;">${p.description || ''}</p>
      </div>
      <div>
        <div style="font-size:18px; font-weight:bold; color:#00ffcc; margin-bottom:10px;">${formatPrice(p.price)}</div>
        <button class="btn primary full" onclick="window.addToCart('${p.id}')" ${ (p.stock || 0) <= 0 ? 'disabled' : '' }>
          ${ (p.stock || 0) <= 0 ? 'Немає в наявності' : 'В кошик' }
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Додавання в кошик
export function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const cartItem = cart.find(item => item.id === productId);
  const currentQty = cartItem ? cartItem.quantity : 0;

  if (currentQty + 1 > (product.stock || 0)) {
    alert(`На складі лише ${product.stock} шт.`);
    return;
  }

  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  saveCart();
  updateCartUI();
}

export function updateCartQuantity(productId, delta) {
  const cartItem = cart.find(item => item.id === productId);
  if (!cartItem) return;

  const product = products.find(p => p.id === productId);
  const newQty = cartItem.quantity + delta;

  if (newQty <= 0) {
    cart = cart.filter(item => item.id !== productId);
  } else if (product && newQty > product.stock) {
    alert(`На складі обмежена кількість: ${product.stock} шт.`);
    return;
  } else {
    cartItem.quantity = newQty;
  }

  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('shub_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const cartCount = document.getElementById('cartCount');
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');

  if (cartCount) {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalCount;
  }

  if (cartItems && cartTotal) {
    cartItems.innerHTML = '';
    let grandTotal = 0;

    if (cart.length === 0) {
      cartItems.innerHTML = '<p style="color:#888; text-align:center; padding:20px;">Ваш кошик порожній</p>';
      cartTotal.innerText = formatPrice(0);
      return;
    }

    cart.forEach(item => {
      const product = products.find(p => p.id === item.id);
      if (!product) return;

      const unitPrice = calculateUnitPrice(product, item.quantity);
      const itemTotal = unitPrice * item.quantity;
      grandTotal += itemTotal;

      const div = document.createElement('div');
      div.style.display = 'flex';
      div.style.justifyContent = 'space-between';
      div.style.alignItems = 'center';
      div.style.marginBottom = '12px';
      div.style.borderBottom = '1px solid #2a2540';
      div.style.paddingBottom = '8px';

      div.innerHTML = `
        <div>
          <strong style="color:#fff;">${product.name}</strong><br>
          <small style="color:#aaa;">${formatPrice(unitPrice)} / шт</small>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <button class="btn btn-sm" onclick="window.updateCartQuantity('${item.id}', -1)">-</button>
          <span style="color:#fff; font-weight:bold;">${item.quantity}</span>
          <button class="btn btn-sm" onclick="window.updateCartQuantity('${item.id}', 1)">+</button>
          <span style="color:#00ffcc; font-weight:bold; margin-left:8px;">${formatPrice(itemTotal)}</span>
        </div>
      `;
      cartItems.appendChild(div);
    });

    cartTotal.innerText = formatPrice(grandTotal);
  }
}

// Оформлення замовлення
export async function handleCheckoutSubmit(event) {
  event.preventDefault();
  if (cart.length === 0) {
    alert('Кошик порожній!');
    return;
  }

  const formData = new FormData(event.target);
  const customer = {
    name: formData.get('name'),
    phone: formData.get('phone'),
    telegram: formData.get('telegram'),
    delivery: formData.get('delivery'),
    address: formData.get('address'),
    inpost: formData.get('inpost'),
    comment: formData.get('comment')
  };

  const orderItems = cart.map(item => {
    const product = products.find(p => p.id === item.id);
    const unitPrice = calculateUnitPrice(product, item.quantity);
    return {
      productId: item.id,
      name: product ? product.name : 'Товар',
      quantity: item.quantity,
      pricePerUnit: unitPrice,
      totalPrice: unitPrice * item.quantity
    };
  });

  const totalAmount = orderItems.reduce((sum, i) => sum + i.totalPrice, 0);

  try {
    await addDoc(collection(db, "orders"), {
      items: orderItems,
      totalAmount: totalAmount,
      customer: customer,
      status: "pending",
      createdAt: serverTimestamp()
    });

    closeAllModals();
    const resultModal = document.getElementById('resultModal');
    const orderResultText = document.getElementById('orderResultText');
    if (orderResultText) {
      orderResultText.innerText = `Дякуємо, ${customer.name}! Ваше замовлення на суму ${formatPrice(totalAmount)} успішно створено. Менеджер зв'яжеться з вами найближчим часом.`;
    }
    if (resultModal) resultModal.classList.remove('hidden');

    cart = [];
    saveCart();
    updateCartUI();
    event.target.reset();
  } catch (err) {
    console.error("Помилка замовлення:", err);
    alert('Помилка надсилання замовлення. Спробуйте ще раз.');
  }
}

// Промо / Оголошення рендер
function renderPromos() {
  const list = document.getElementById('promoList');
  if (!list) return;
  list.innerHTML = '';
  promos.forEach(p => {
    const div = document.createElement('div');
    div.style.background = '#151322';
    div.style.padding = '15px';
    div.style.borderRadius = '8px';
    div.style.marginBottom = '10px';
    div.innerHTML = `<h3 style="color:#00ffcc; margin-bottom:5px;">${p.title}</h3><p style="color:#ccc;">${p.description}</p>`;
    list.appendChild(div);
  });
}

// --- АДМІНКА ---
export async function handleProductSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const id = formData.get('id');

  const productData = {
    name: formData.get('name'),
    category: formData.get('category'),
    price: parseFloat(formData.get('price')),
    stock: parseInt(formData.get('stock')),
    priceTiers: formData.get('priceTiers'),
    variants: formData.get('variants'),
    description: formData.get('description'),
    imageUrl: formData.get('imageUrl')
  };

  try {
    if (id) {
      await updateDoc(doc(db, "products", id), productData);
      alert('Товар оновлено!');
    } else {
      await addDoc(collection(db, "products"), productData);
      alert('Товар додано!');
    }
    resetProductForm();
  } catch (err) {
    alert('Помилка: ' + err.message);
  }
}

function resetProductForm() {
  const form = document.getElementById('productForm');
  if (form) form.reset();
  const hiddenId = document.querySelector('#productForm input[name="id"]');
  if (hiddenId) hiddenId.value = '';
}

export function editProduct(productId) {
  const p = products.find(item => item.id === productId);
  if (!p) return;

  document.querySelector('#productForm input[name="id"]').value = p.id;
  document.querySelector('#productForm input[name="name"]').value = p.name;
  document.querySelector('#productForm input[name="price"]').value = p.price;
  document.querySelector('#productForm input[name="stock"]').value = p.stock;
  document.querySelector('#productForm input[name="priceTiers"]').value = p.priceTiers || '';
  document.querySelector('#productForm input[name="variants"]').value = p.variants || '';
  document.querySelector('#productForm textarea[name="description"]').value = p.description || '';
  document.querySelector('#productForm input[name="imageUrl"]').value = p.imageUrl || '';
}

export async function deleteProduct(productId) {
  if (confirm('Видалити цей товар?')) {
    await deleteDoc(doc(db, "products", productId));
  }
}

function renderAdminProducts() {
  const list = document.getElementById('adminProductList');
  if (!list) return;
  list.innerHTML = '';

  products.forEach(p => {
    const div = document.createElement('div');
    div.style.background = '#1e1a30';
    div.style.padding = '10px';
    div.style.borderRadius = '6px';
    div.style.marginBottom = '8px';
    div.style.display = 'flex';
    div.style.justifyContent = 'space-between';
    div.style.alignItems = 'center';

    div.innerHTML = `
      <div>
        <strong style="color:#fff;">${p.name}</strong> — ${p.price} zł (Склад: ${p.stock})
      </div>
      <div>
        <button class="btn btn-sm" onclick="window.editProduct('${p.id}')">✏️ Редагувати</button>
        <button class="btn btn-sm" style="color:#ff4444;" onclick="window.deleteProduct('${p.id}')">🗑️ Видалити</button>
      </div>
    `;
    list.appendChild(div);
  });
}

function renderAdminOrders() {
  const list = document.getElementById('adminOrderList');
  if (!list) return;
  list.innerHTML = '';

  orders.forEach(o => {
    const div = document.createElement('div');
    div.style.background = '#1e1a30';
    div.style.padding = '12px';
    div.style.borderRadius = '6px';
    div.style.marginBottom = '10px';

    const itemsText = o.items.map(i => `${i.name} x${i.quantity} (${i.pricePerUnit} zł)`).join('<br>');

    div.innerHTML = `
      <div><strong>ID:</strong> ${o.id}</div>
      <div><strong>Клієнт:</strong> ${o.customer?.name} | ${o.customer?.phone}</div>
      <div><strong>Доставка:</strong> ${o.customer?.delivery} (${o.customer?.address || o.customer?.inpost || 'Самовивіз'})</div>
      <div><strong>Товари:</strong><br>${itemsText}</div>
      <div><strong>Сума:</strong> ${o.totalAmount} zł</div>
      <div><strong>Статус:</strong> <span style="color:#00ffcc;">${o.status}</span></div>
    `;
    list.appendChild(div);
  });
}

function renderAdminPromos() {
  const list = document.getElementById('adminPromoList');
  if (!list) return;
  list.innerHTML = '';
  promos.forEach(p => {
    div = document.createElement('div');
    // рендер промо в адмінці
  });
}

// Експорт функцій у глобальний об'єкт window для кліків в HTML
window.addToCart = addToCart;
window.updateCartQuantity = updateCartQuantity;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
