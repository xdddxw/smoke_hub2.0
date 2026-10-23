import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js"; import { getFirestore, collection, doc, onSnapshot, addDoc, updateDoc, runTransaction, serverTimestamp, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"; import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
// Конфігурація вашого проєкту Firebase const firebaseConfig = { apiKey: "AIzaSyBQmLz3avJrmkrmB9f_EAbkZ2_nsQOCJbI", authDomain: "shub-313e7.firebaseapp.com", projectId: "shub-313e7", storageBucket: "shub-313e7.firebasestorage.app", messagingSenderId: "138251084689", appId: "1:138251084689:web:2d60a4aa09c1ce8aeev030", measurementId: "G-TJW09LSWLF" };
const app = initializeApp(firebaseConfig); const db = getFirestore(app); const auth = getAuth(app);
let products = []; let cart = JSON.parse(localStorage.getItem('cart') || '[]'); let currentUser = null;
// Realtime підписка на каталог товарів onSnapshot(collection(db, "products"), (snapshot) => { products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); renderCatalog(); updateCartUI(); });
// Розрахунок оптової ціни на основі кількості export function calculateUnitPrice(product, quantity) { if (!product.tiers || product.tiers.length === 0) { return product.price; } // Сортуємо пороги за спаданням const sortedTiers = [...product.tiers].sort((a, b) => b.minQty - a.minQty); const matchingTier = sortedTiers.find(tier => quantity >= tier.minQty); return matchingTier ? matchingTier.price : product.price; }
// Оформлення замовлення клієнтом (створення зі статусом 'pending') export async function placeOrder(customerDetails) { if (cart.length === 0) throw new Error("Кошик порожній");
const orderItems = cart.map(item => { const product = products.find(p => p.id === item.id); const unitPrice = calculateUnitPrice(product, item.quantity); return { productId: item.id, name: product.name, quantity: item.quantity, pricePerUnit: unitPrice, totalPrice: unitPrice * item.quantity }; });
const totalAmount = orderItems.reduce((sum, i) => sum + i.totalPrice, 0);
const newOrder = { items: orderItems, totalAmount: totalAmount, customer: customerDetails, status: "pending", // Замовлення очікує підтвердження createdAt: serverTimestamp() };
await addDoc(collection(db, "orders"), newOrder); cart = []; localStorage.removeItem('cart'); updateCartUI(); }
// Підтвердження замовлення адміністратором (Атомарна транзакція) export async function approveOrder(orderId) { const orderRef = doc(db, "orders", orderId);
await runTransaction(db, async (transaction) => { const orderDoc = await transaction.get(orderRef); if (!orderDoc.exists()) { throw new Error("Замовлення не знайдено!"); }
const orderData = orderDoc.data();
if (orderData.status !== "pending") {
  throw new Error("Замовлення вже оброблено або скасовано!");
}

// Перевірка наявності товарів на складі
for (const item of orderData.items) {
  const productRef = doc(db, "products", item.productId);
  const productDoc = await transaction.get(productRef);

  if (!productDoc.exists()) {
    throw new Error(`Товар ${item.name} більше не існує!`);
  }

  const currentStock = productDoc.data().stock || 0;
  if (currentStock < item.quantity) {
    throw new Error(`Недостатньо товару "${item.name}" на складі! Доступно: ${currentStock}`);
  }
}

// Списання товарів зі складу
for (const item of orderData.items) {
  const productRef = doc(db, "products", item.productId);
  const productDoc = await transaction.get(productRef);
  const currentStock = productDoc.data().stock || 0;

  transaction.update(productRef, {
    stock: currentStock - item.quantity
  });
}

// Зміна статусу замовлення на 'approved'
transaction.update(orderRef, {
  status: "approved",
  approvedAt: serverTimestamp()
});
}); }
// Відхилення замовлення адміністратором export async function rejectOrder(orderId) { const orderRef = doc(db, "orders", orderId); await updateDoc(orderRef, { status: "rejected", rejectedAt: serverTimestamp() }); }
