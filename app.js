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
let cart = JSON.parse(localStorage.getItem('shub_cart') || '[]');

// Realtime слухач каталогу
onSnapshot(collection(db, "products"), (snapshot) => {
  products = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  renderCatalog();
  renderAdminProducts();
  updateCartUI();
});

// Realtime слухач замовлень
onSnapshot(collection(db, "orders"), (snapshot) => {
  orders = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  renderAdminOrders();
});

// Розрахунок оптової ціни від кількості (Tier Pricing)
export function calculateUnitPrice(product, quantity) {
  if (!product || !product.tiers || product.tiers.length === 0) {
    return product ? Number(product.price) : 0;
  }
  const sortedTiers = [...product.tiers].sort((a, b) => b.minQty - a.minQty);
  const matchingTier = sortedTiers.find(tier => quantity >= tier.minQty);
  return matchingTier ? Number(matchingTier.price) : Number(product.price);
}

// Рендер каталогу для клієнтів
function renderCatalog() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;
  grid.innerHTML = '';

  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    let tiersText = '';
    if (p.tiers && p.tiers.length > 0) {
      tiersText = `<div class="tier-badge">Опт: ` + 
        p.tiers.map(t => `від ${t.minQty} шт - ${t.price} zł`).join(', ') + 
        `</div>`;
    }

    card.innerHTML = `
      <img src="${p.image || 'https://via.placeholder.com/150'}" alt="${p.name}">
      <div>
        <h3>${p.name}</h3>
        <p>${p.description || ''}</p>
        ${tiersText}
        <div class="price-tag">Ціна: ${p.price} zł</div>
        <small>На складі: ${p.stock ?? 0} шт</small>
      </div>
      <button class="btn btn-primary" onclick="addToCart('${p.id}')" ${ (p.stock || 0) <= 0 ? 'disabled' : '' }>
        ${ (p.stock || 0) <= 0 ? 'Немає в наявності' : 'В кошик' }
      </button>
    `;
    grid.appendChild(card);
  });
}

// Управління кошиком
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
  const cartItemsList = document.getElementById('cartItemsList');
  const cartTotal = document.getElementById('cartTotal');

  if (cartCount) {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalCount;
  }

  if (cartItemsList && cartTotal) {
    cartItemsList.innerHTML = '';
    let grandTotal = 0;

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
      div.style.marginBottom = '10px';
      div.style.borderBottom = '1px solid #333';
      div.style.paddingBottom = '5px';

      div.innerHTML = `
        <div>
          <strong>${product.name}</strong><br>
          <small>${unitPrice} zł / шт (всього ${item.quantity} шт)</small>
        </div>
        <div>
          <button class="btn btn-sm btn-outline" onclick="updateCartQuantity('${item.id}', -1)">-</button>
          <span style="margin: 0 8px;">${item.quantity}</span>
          <button class="btn btn-sm btn-outline" onclick="updateCartQuantity('${item.id}', 1)">+</button>
          <span style="margin-left: 10px; font-weight: bold;">${itemTotal} zł</span>
        </div>
      `;
      cartItemsList.appendChild(div);
    });

    cartTotal.innerText = grandTotal;
  }
}

// Оформлення замовлення (Статус pending, без списання зі складу)
export async function handleCheckoutSubmit(event) {
  event.preventDefault();
  if (cart.length === 0) {
    alert('Кошик порожній!');
    return;
  }

  const name = document.getElementById('custName').value;
  const phone = document.getElementById('custPhone').value;
  const address = document.getElementById('custAddress').value;

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
      customer: { name, phone, address },
      status: "pending",
      createdAt: serverTimestamp()
    });

    alert('Замовлення успішно створено! Очікуйте підтвердження адміністратора.');
    cart = [];
    saveCart();
    updateCartUI();
    toggleCart();
  } catch (err) {
    console.error("Помилка створення замовлення:", err);
    alert('Не вдалося оформити замовлення. Спробуйте ще раз.');
  }
}

// Підтвердження замовлення адміном (Атомарна транзакція з перевіркою й списанням)
export async function approveOrder(orderId) {
  const orderRef = doc(db, "orders", orderId);

  try {
    await runTransaction(db, async (transaction) => {
      const orderDoc = await transaction.get(orderRef);
      if (!orderDoc.exists()) {
        throw new Error("Замовлення не знайдено!");
      }

      const orderData = orderDoc.data();
      if (orderData.status !== "pending") {
        throw new Error("Замовлення вже опрацьовано або скасовано!");
      }

      // 1. Перевірка залишків
      for (const item of orderData.items) {
        const productRef = doc(db, "products", item.productId);
        const productDoc = await transaction.get(productRef);

        if (!productDoc.exists()) {
          throw new Error(`Товар ${item.name} більше не існує!`);
        }

        const currentStock = productDoc.data().stock || 0;
        if (currentStock < item.quantity) {
          throw new Error(`Недостатньо товару "${item.name}" на складі! Наявність: ${currentStock}`);
        }
      }

      // 2. Списання зі складу
      for (const item of orderData.items) {
        const productRef = doc(db, "products", item.productId);
        const productDoc = await transaction.get(productRef);
        const currentStock = productDoc.data().stock || 0;

        transaction.update(productRef, {
          stock: currentStock - item.quantity
        });
      }

      // 3. Зміна статусу
      transaction.update(orderRef, {
        status: "approved",
        approvedAt: serverTimestamp()
      });
    });

    alert("Замовлення підтверджено! Товар успішно списано зі складу.");
  } catch (err) {
    console.error("Помилка підтвердження:", err);
    alert("Помилка: " + err.message);
  }
}

// Відхилення замовлення
export async function rejectOrder(orderId) {
  if (!confirm("Скасувати це замовлення?")) return;
  try {
    await updateDoc(doc(db, "orders", orderId), {
      status: "rejected",
      rejectedAt: serverTimestamp()
    });
  } catch (err) {
    alert("Помилка: " + err.message);
  }
}

// Управління товарами в адмінці
export async function handleProductSubmit(event) {
  event.preventDefault();
  const id = document.getElementById('editProductId').value;
  const name = document.getElementById('prodName').value;
  const description = document.getElementById('prodDesc').value;
  const image = document.getElementById('prodImage').value;
  const price = parseFloat(document.getElementById('prodPrice').value);
  const stock = parseInt(document.getElementById('prodStock').value);

  // Оптові рівні
  const tierElems = document.querySelectorAll('.tier-input-row');
  const tiers = [];
  tierElems.forEach(row => {
    const minQty = parseInt(row.querySelector('.tier-qty').value);
    const tierPrice = parseFloat(row.querySelector('.tier-price').value);
    if (!isNaN(minQty) && !isNaN(tierPrice)) {
      tiers.push({ minQty, price: tierPrice });
    }
  });

  const productData = { name, description, image, price, stock, tiers };

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
    alert('Помилка збереження: ' + err.message);
  }
}

export async function deleteProduct(productId) {
  if (confirm("Видалити товар?")) {
    await deleteDoc(doc(db, "products", productId));
  }
}

export function editProduct(productId) {
  const p = products.find(item => item.id === productId);
  if (!p) return;

  document.getElementById('editProductId').value = p.id;
  document.getElementById('prodName').value = p.name;
  document.getElementById('prodDesc').value = p.description || '';
  document.getElementById('prodImage').value = p.image || '';
  document.getElementById('prodPrice').value = p.price;
  document.getElementById('prodStock').value = p.stock;

  const tierList = document.getElementById('tierList');
  tierList.innerHTML = '';
  if (p.tiers) {
    p.tiers.forEach(t => addTierInput(t.minQty, t.price));
  }
}

export function resetProductForm() {
  document.getElementById('productForm').reset();
  document.getElementById('editProductId').value = '';
  document.getElementById('tierList').innerHTML = '';
}

export function addTierInput(minQty = '', price = '') {
  const tierList = document.getElementById('tierList');
  const div = document.createElement('div');
  div.className = 'tier-input-row';
  div.style.display = 'flex';
  div.style.gap = '10px';
  div.style.marginBottom = '5px';
  div.innerHTML = `
    <input type="number" placeholder="Від кількості (шт)" class="tier-qty" value="${minQty}" style="width: 50%;">
    <input type="number" step="0.01" placeholder="Ціна (zł)" class="tier-price" value="${price}" style="width: 50%;">
    <button type="button" class="btn btn-sm btn-outline" onclick="this.parentElement.remove()">✕</button>
  `;
  tierList.appendChild(div);
}

// Відображення товарів у адмінці
function renderAdminProducts() {
  const list = document.getElementById('adminProductList');
  if (!list) return;
  list.innerHTML = '';

  products.forEach(p => {
    const div = document.createElement('div');
    div.style.background = '#2a2a2a';
    div.style.padding = '10px';
    div.style.borderRadius = '6px';
    div.style.marginBottom = '8px';
    div.style.display = 'flex';
    div.style.justifyContent = 'space-between';
    div.style.alignItems = 'center';

    div.innerHTML = `
      <div>
        <strong>${p.name}</strong> — ${p.price} zł (Склад: ${p.stock} шт)
      </div>
      <div>
        <button class="btn btn-sm btn-outline" onclick="editProduct('${p.id}')">✏️ Edit</button>
        <button class="btn btn-sm btn-outline" onclick="deleteProduct('${p.id}')">🗑️ Delete</button>
      </div>
    `;
    list.appendChild(div);
  });
}

// Відображення замовлень у адмінці
function renderAdminOrders() {
  const list = document.getElementById('adminOrdersList');
  if (!list) return;
  list.innerHTML = '';

  orders.sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

  orders.forEach(o => {
    const div = document.createElement('div');
    div.className = 'order-card';

    const itemsText = o.items.map(i => `${i.name} x${i.quantity} (${i.pricePerUnit} zł/шт)`).join('<br>');
    
    let actions = '';
    if (o.status === 'pending') {
      actions = `
        <button class="btn btn-sm btn-primary" onclick="approveOrder('${o.id}')">✅ Підтвердити та списати</button>
        <button class="btn btn-sm btn-outline" onclick="rejectOrder('${o.id}')">❌ Відхилити</button>
      `;
    }

    div.innerHTML = `
      <div><strong>Замовлення ID:</strong> ${o.id}</div>
      <div><strong>Клієнт:</strong> ${o.customer?.name} | ${o.customer?.phone}</div>
      <div><strong>Адреса:</strong> ${o.customer?.address}</div>
      <div><strong>Товари:</strong><br>${itemsText}</div>
      <div style="margin: 5px 0;"><strong>Сума:</strong> ${o.totalAmount} zł</div>
      <div><strong>Статус:</strong> <span class="status-${o.status}">${o.status.toUpperCase()}</span></div>
      <div style="margin-top: 10px;">${actions}</div>
    `;
    list.appendChild(div);
  });
}

// Інтерфейсні функції
export function toggleCart() {
  document.getElementById('cartModal').classList.toggle('hidden');
}

export function toggleAdmin() {
  document.getElementById('adminSection').classList.toggle('hidden');
}

export function switchAdminTab(tabId) {
  document.getElementById('productsTab').classList.add('hidden');
  document.getElementById('ordersTab').classList.add('hidden');
  document.getElementById(tabId).classList.remove('hidden');

  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
}

// Експорт у глобальне вікно для onclick у HTML
window.toggleCart = toggleCart;
window.toggleAdmin = toggleAdmin;
window.switchAdminTab = switchAdminTab;
window.addToCart = addToCart;
window.updateCartQuantity = updateCartQuantity;
window.handleCheckoutSubmit = handleCheckoutSubmit;
window.approveOrder = approveOrder;
window.rejectOrder = rejectOrder;
window.handleProductSubmit = handleProductSubmit;
window.deleteProduct = deleteProduct;
window.editProduct = editProduct;
window.resetProductForm = resetProductForm;
window.addTierInput = addTierInput;
