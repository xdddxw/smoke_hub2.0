// Firebase SDK (modular v10.8.0)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore, collection, doc, onSnapshot, setDoc, updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
const firestore = getFirestore(app);

const CONFIG = {
  telegramChannelUrl: "https://t.me/+a0dUnfeiyoViNDRh",
  telegramManagerUrl: "https://t.me/smokehub_manager1",
  useFirebase: true
};

const CATEGORIES = [
  {id:"elfliq", pl:"Elfliq", uk:"Elfliq"},
  {id:"chaser-lux", pl:"Chaser Lux", uk:"Chaser Lux"},
  {id:"chaser-black", pl:"Chaser Black", uk:"Chaser Black"},
  {id:"chaser-pods", pl:"Chaser for Pods", uk:"Chaser for Pods"},
  {id:"chaser-special", pl:"Chaser Special", uk:"Chaser Special"},
  {id:"chaser-youme", pl:"Chaser You&Me", uk:"Chaser You&Me"},
  {id:"devices", pl:"Urządzenia XROS i OXVA", uk:"Пристрої XROS та OXVA"},
  {id:"cartridges", pl:"Kartridże XROS i OXVA", uk:"Картриджі XROS та OXVA"}
];

const I18N = {
pl:{
ageTitle:"Tylko dla osób pełnoletnich",ageText:"Produkty nikotynowe i vape są przeznaczone wyłącznie dla osób pełnoletnich. Potwierdź wiek, aby przejść dalej.",ageYes:"Mam ukończone 18 lat",ageNo:"Nie mam 18 lat",ageNote:"To potwierdzenie nie zastępuje wymaganej prawem weryfikacji wieku przy sprzedaży.",
navHome:"Główna",navCatalog:"Katalog",navPopular:"Popularne",navPromos:"Promocje",navContact:"Kontakt",cart:"Koszyk",heroLine1:"TWÓJ STYL.",heroLine2:"TWOJA STREFA.",heroText:"Poznaj katalog SMOKE HUB. Sprawdź dostępność i złóż zapytanie o zamówienie.",browse:"Przeglądaj katalog ↗",contactManager:"Kontakt z menedżerem",secure:"Dla pełnoletnich",local:"Łódź, Polska",feature1:"Aktualny katalog",feature1s:"Ceny i dostępność",feature2:"Kontakt z menedżerem",feature2s:"Pomoc przy dostawie",feature3:"Odbiór w Łodzi",feature3s:"Odbiór lub dostawa lokalna",catalogEyebrow:"WYBIERZ KATEGORIĘ",catalogTitle:"Katalog produktów",searchPlaceholder:"Szukaj produktu...",noProducts:"Brak produktów w tej kategorii. Dodaj je w panelu administratora.",popularEyebrow:"WYBIERANE NAJCZĘŚCIEJ",popularTitle:"Popularne produkty",popularText:"Ranking jest liczony z zamówień oznaczonych jako zakończone.",promoEyebrow:"SMOKE HUB / INFO",promoTitle:"Promocje i ogłoszenia",promoText:"Aktualne informacje sklepu pojawią się tutaj.",contactEyebrow:"JESTEŚMY W KONTAKCIE",contactTitle:"Masz pytanie? Napisz do nas.",contactText:"Linki do kanału i menedżera skonfiguruj w pliku app.js.",writeManager:"Napisz do menedżera ↗",adminLogin:"Panel administratora",footerText:"Dla osób pełnoletnich. Sprzedaż wymaga zgodności z lokalnymi przepisami.",yourCart:"Twój koszyk",total:"Razem",checkout:"Przejdź do zamówienia",checkoutNote:"Zamówienie jest zapytaniem do sklepu; szczegóły potwierdzi menedżer.",checkoutEyebrow:"OSTATNI KROK",checkoutTitle:"Dane zamówienia",name:"Imię",phone:"Telefon",telegramNick:"Nick Telegram (opcjonalnie)",delivery:"Sposób odbioru",pickup:"Odbiór osobisty — Łódź",localDelivery:"Dostawa po Łodzi",otherCity:"Inne miasto — InPost / menedżer",address:"Adres dostawy",inpost:"Paczkomat InPost (nazwa/kod)",inpostNote:"Wpisz wybrany punkt. Integracja z oficjalną wyszukiwarką punktów wymaga osobnej konfiguracji.",comment:"Komentarz do zamówienia",cashNote:"Płatność przy odbiorze. Zamówienie zostanie potwierdzone przez menedżera.",sendOrder:"Wyślij zapytanie o zamówienie",orderReceived:"Zapytanie zapisane",close:"Zamknij",adminTitle:"Panel administratora",adminSetupNote:"Tryb demonstracyjny jest lokalny. Przed publikacją skonfiguruj Firebase Authentication i reguły Firestore.",adminPassword:"Hasło demonstracyjne",login:"Zaloguj (demo)",manageProducts:"Produkty",manageOrders:"Zamówienia",managePromos:"Promocje",settings:"Ustawienia",addProduct:"Dodaj / edytuj produkt",productName:"Nazwa",category:"Kategoria",pricePln:"Cena PLN",stock:"Stan magazynowy",variants:"Warianty (oddziel przecinkami)",description:"Opis",saveProduct:"Zapisz produkt",clear:"Wyczyść",ordersTitle:"Zamówienia",createPromo:"Dodaj ogłoszenie",promoName:"Nagłówek",publishPromo:"Opublikuj ogłoszenie",exchangeRate:"Kurs: 1 PLN = ? UAH",lowStock:"Próg niskiego stanu",saveSettings:"Zapisz ustawienia",firebaseNote:"Firebase nie jest jeszcze podłączony. Zobacz README, aby skonfigurować projekt i przełączyć się z lokalnego trybu.",logout:"Wyloguj z demo",outOfStock:"Brak",inStock:"Dostępne",addToCart:"Dodaj do koszyka",variant:"Wariant",emptyCart:"Koszyk jest pusty.",remove:"Usuń",orderNo:"Numer zapytania",managerWillContact:"Menedżer SMOKE HUB skontaktuje się z Tobą w celu potwierdzenia zamówienia.",otherCityMessage:"Dla dostawy do innego miasta menedżer skontaktuje się z Tobą, aby uzgodnić InPost i szczegóły.",demoOnly:"To jest lokalny tryb demonstracyjny. Zamówienie zapisano tylko w tej przeglądarce.",productSaved:"Produkt zapisany.",promoSaved:"Ogłoszenie dodane.",settingsSaved:"Ustawienia zapisane.",wrongPassword:"Nieprawidłowe hasło demo.",deleted:"Usunięto.",noPromos:"Na razie brak ogłoszeń.",noOrders:"Brak zamówień.",stockLow:"Niski stan",statusNew:"Oczekuje na potwierdzenie",statusConfirmed:"Potwierdzone",statusCompleted:"Zakończone",statusCancelled:"Anulowane",orderStatus:"Status",customer:"Klient",deliveryLabel:"Dostawa",items:"Pozycje",edit:"Edytuj",delete:"Usuń",sales:"Sprzedaż zakończona",ordersCount:"Wszystkie zamówienia",productsCount:"Produkty",accountNote:"Konta klientów będą dostępne po konfiguracji Firebase."
},
uk:{
ageTitle:"Лише для повнолітніх",ageText:"Нікотинові та vape-продукти призначені лише для повнолітніх. Підтвердь вік, щоб продовжити.",ageYes:"Мені вже є 18 років",ageNo:"Мені немає 18 років",ageNote:"Це підтвердження не замінює перевірку віку, передбачену законом.",
navHome:"Головна",navCatalog:"Каталог",navPopular:"Популярне",navPromos:"Акції",navContact:"Контакти",cart:"Кошик",heroLine1:"ТВІЙ СТИЛЬ.",heroLine2:"ТВІЙ ПРОСТІР.",heroText:"Переглянь каталог SMOKE HUB, перевір наявність і надішли запит на замовлення.",browse:"Переглянути каталог ↗",contactManager:"Зв’язатися з менеджером",secure:"Для повнолітніх",local:"Лодзь, Польща",feature1:"Актуальний каталог",feature1s:"Ціни та наявність",feature2:"Зв’язок із менеджером",feature2s:"Допомога з доставкою",feature3:"Самовивіз у Лодзі",feature3s:"Самовивіз або місцева доставка",catalogEyebrow:"ОБЕРИ КАТЕГОРІЮ",catalogTitle:"Каталог товарів",searchPlaceholder:"Пошук товару...",noProducts:"У цій категорії поки немає товарів. Додай їх в адмін-панелі.",popularEyebrow:"НАЙЧАСТІШЕ ОБИРАЮТЬ",popularTitle:"Популярні товари",popularText:"Рейтинг формується за завершеними замовленнями.",promoEyebrow:"SMOKE HUB / ІНФО",promoTitle:"Акції та оголошення",promoText:"Тут з’являтиметься актуальна інформація магазину.",contactEyebrow:"МИ НА ЗВ’ЯЗКУ",contactTitle:"Є питання? Напиши нам.",contactText:"Налаштуй посилання на канал і менеджера у файлі app.js.",writeManager:"Написати менеджеру ↗",adminLogin:"Панель адміністратора",footerText:"Для повнолітніх. Продаж має відповідати місцевому законодавству.",yourCart:"Твій кошик",total:"Разом",checkout:"Перейти до замовлення",checkoutNote:"Це запит до магазину; деталі підтвердить менеджер.",checkoutEyebrow:"ОСТАННІЙ КРОК",checkoutTitle:"Дані замовлення",name:"Ім’я",phone:"Телефон",telegramNick:"Нік Telegram (необов’язково)",delivery:"Спосіб отримання",pickup:"Самовивіз — Лодзь",localDelivery:"Доставка по Лодзі",otherCity:"Інше місто — InPost / менеджер",address:"Адреса доставки",inpost:"Поштомат InPost (назва/код)",inpostNote:"Вкажи обраний пункт. Інтеграція з офіційним пошуком поштоматів потребує окремого налаштування.",comment:"Коментар до замовлення",cashNote:"Оплата при отриманні. Менеджер підтвердить замовлення.",sendOrder:"Надіслати запит на замовлення",orderReceived:"Запит збережено",close:"Закрити",adminTitle:"Панель адміністратора",adminSetupNote:"Демонстраційний режим локальний. Перед публікацією налаштуй Firebase Authentication і правила Firestore.",adminPassword:"Демонстраційний пароль",login:"Увійти (демо)",manageProducts:"Товари",manageOrders:"Замовлення",managePromos:"Акції",settings:"Налаштування",addProduct:"Додати / редагувати товар",productName:"Назва",category:"Категорія",pricePln:"Ціна PLN",stock:"Залишок на складі",variants:"Варіанти (через кому)",description:"Опис",saveProduct:"Зберегти товар",clear:"Очистити",ordersTitle:"Замовлення",createPromo:"Додати оголошення",promoName:"Заголовок",publishPromo:"Опублікувати",exchangeRate:"Курс: 1 PLN = ? UAH",lowStock:"Поріг низького залишку",saveSettings:"Зберегти налаштування",firebaseNote:"Firebase ще не підключено. Дивись README, щоб налаштувати проєкт і перейти з локального режиму.",logout:"Вийти з демо",outOfStock:"Немає",inStock:"Є в наявності",addToCart:"Додати в кошик",variant:"Варіант",emptyCart:"Кошик порожній.",remove:"Видалити",orderNo:"Номер запиту",managerWillContact:"Менеджер SMOKE HUB зв’яжеться з тобою для підтвердження замовлення.",otherCityMessage:"Для доставки в інше місто менеджер зв’яжеться з тобою, щоб узгодити InPost і деталі.",demoOnly:"Це локальний деморежим. Замовлення збережено лише в цьому браузері.",productSaved:"Товар збережено.",promoSaved:"Оголошення додано.",settingsSaved:"Налаштування збережено.",wrongPassword:"Неправильний демопароль.",deleted:"Видалено.",noPromos:"Оголошень поки немає.",noOrders:"Замовлень поки немає.",stockLow:"Мало на складі",statusNew:"Очікує підтвердження",statusConfirmed:"Підтверджено",statusCompleted:"Завершено",statusCancelled:"Скасовано",orderStatus:"Статус",customer:"Покупець",deliveryLabel:"Доставка",items:"Позиції",edit:"Редагувати",delete:"Видалити",sales:"Завершені продажі",ordersCount:"Усі замовлення",productsCount:"Товари",accountNote:"Кабінети покупців запрацюють після налаштування Firebase."
}
};

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const DBKEY = "smokeHubProDataV1";
const defaultData = () => ({products:[],orders:[],promos:[],settings:{rate:11.5,lowStock:3},currency:"PLN"});

let db = loadDB(), cart = [], selectedCategory = "all", lang = "pl", currency = "PLN", toastTimer;

function loadDB(){
  try { return JSON.parse(localStorage.getItem(DBKEY)) || defaultData(); }
  catch { return defaultData(); }
}

function saveDB(){
  if (CONFIG.useFirebase) {
    setDoc(doc(firestore, "shopData", "main"), {
      products: db.products,
      promos: db.promos,
      settings: db.settings
    }, { merge: true }).catch(error => {
      console.error("Firebase save error:", error);
      toast("Помилка збереження даних у Firebase");
    });
    return;
  }
  localStorage.setItem(DBKEY, JSON.stringify(db));
}

let firebaseReady = false;

function startFirebaseSync(){
  if (!CONFIG.useFirebase || firebaseReady) return;
  firebaseReady = true;

  onSnapshot(doc(firestore, "shopData", "main"), snapshot => {
    if (snapshot.exists()) {
      const data = snapshot.data();
      db.products = Array.isArray(data.products) ? data.products : [];
      db.promos = Array.isArray(data.promos) ? data.promos : [];
      db.settings = data.settings || defaultData().settings;
    }
    renderProducts();
    renderPromos();
    renderAdminLists();
  }, error => console.error("Shop listener error:", error));

  onSnapshot(collection(firestore, "orders"), snapshot => {
    db.orders = snapshot.docs.map(item => ({ ...item.data(), id: item.id }));
    renderProducts();
    renderAdminLists();
  }, error => console.error("Orders listener error:", error));
}
function t(key){return (I18N[lang]&&I18N[lang][key])||I18N.pl[key]||key}

function esc(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}

function money(pln){
  const n=currency==="UAH"?pln*Number(db.settings.rate||11.5):pln;
  return new Intl.NumberFormat(lang==="pl"?"pl-PL":"uk-UA",{
    minimumFractionDigits:2,
    maximumFractionDigits:2
  }).format(n)+(currency==="UAH"?" ₴":" zł");
}

function toast(msg){
  const el=$("#toast");
  el.textContent=msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>el.classList.remove("show"),2600);
}

function applyLang(){
  document.documentElement.lang=lang;
  $$("[data-i18n]").forEach(el=>{
    const k=el.dataset.i18n;
    if(t(k))el.textContent=t(k);
  });
  $$("[data-i18n-placeholder]").forEach(el=>el.placeholder=t(el.dataset.i18nPlaceholder));
  renderCategories();
  renderProducts();
  renderCart();
  renderPromos();
  renderAdminLists();
  updateDeliveryFields();
}

function catName(id){
  const c=CATEGORIES.find(x=>x.id===id);
  return c?(lang==="uk"?c.uk:c.pl):id;
}

function renderCategories(){
  const el=$("#categories");
  el.innerHTML=`<button class="category-chip ${selectedCategory==="all"?"active":""}" data-category="all">${lang==="pl"?"Wszystkie":"Усі"}</button>`+
    CATEGORIES.map(c=>`<button class="category-chip ${selectedCategory===c.id?"active":""}" data-category="${c.id}">${esc(catName(c.id))}</button>`).join("");
  el.querySelectorAll("button").forEach(b=>b.onclick=()=>{
    selectedCategory=b.dataset.category;
    renderCategories();
    renderProducts();
  });
  $("#adminCategory").innerHTML=CATEGORIES.map(c=>`<option value="${c.id}">${esc(catName(c.id))}</option>`).join("");
}

function cartQuantity(){
  return cart.reduce((n,i)=>n+Number(i.qty||0),0);
}

function getTiers(p){
  const raw=Array.isArray(p.priceTiers)?p.priceTiers:[];
  return raw.map(x=>({qty:Number(x.qty),price:Number(x.price)}))
    .filter(x=>Number.isFinite(x.qty)&&x.qty>=1&&Number.isFinite(x.price)&&x.price>=0)
    .sort((a,b)=>a.qty-b.qty);
}

function unitPrice(item,totalQty=cartQuantity()){
  const p=db.products.find(x=>x.id===item.id);
  if(!p)return Number(item.price)||0;
  const tiers=getTiers(p).filter(x=>x.qty<=totalQty);
  return tiers.length?tiers[tiers.length-1].price:Number(p.price)||0;
}

function tierHint(){
  const qty=cartQuantity();
  if(!qty)return "";
  const tiers=db.products.flatMap(p=>getTiers(p)).filter(x=>x.qty<=qty);
  const best=tiers.reduce((m,x)=>Math.max(m,x.qty),0);
  if(!best)return "";
  return lang==="pl"
    ?`Cena hurtowa za miks: próg ${best} szt. (łącznie ${qty} szt.)`
    :`Ціна за мікс: активний поріг від ${best} шт. (у кошику ${qty} шт.)`;
}

function productCard(p){
  const variants=(p.variants||[]).filter(Boolean);
  const variantControl=variants.length
    ?`<select class="variant-select" data-variant="${p.id}"><option value="">${esc(t("variant"))}</option>${variants.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join("")}</select>`
    :"";
  const photo=typeof p.imageUrl==="string"&&/^https:\/\//i.test(p.imageUrl.trim())
    ?`<img src="${esc(p.imageUrl.trim())}" alt="${esc(p.name)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">`
    :"";
  return `<article class="product-card">
    <div class="product-image">${photo}<span class="product-symbol" ${photo?'style="display:none"':""}>${esc((p.name||"SH").slice(0,2).toUpperCase())}</span></div>
    <div class="product-category">${esc(catName(p.category))}</div>
    <h3>${esc(p.name)}</h3>
    <p class="product-desc">${esc(p.description||"SMOKE HUB")}</p>
    ${variantControl}
    <div class="product-price-row">
      <strong class="product-price">${money(Number(p.price)||0)}</strong>
      <span class="stock-label ${(p.stock||0)<=db.settings.lowStock?"low":""}">${p.stock>0?`${p.stock} ${lang==="pl"?"szt.":"шт."}`:t("outOfStock")}</span>
    </div>
    <button class="btn primary" data-add="${p.id}" ${p.stock<=0?"disabled":""}>${t("addToCart")}</button>
  </article>`;
}

function renderProducts(){
  const q=$("#searchInput").value.trim().toLowerCase();
  let products=db.products.filter(p=>
    (selectedCategory==="all"||p.category===selectedCategory)&&
    (!q||(p.name+" "+p.description+" "+catName(p.category)).toLowerCase().includes(q))
  );
  $("#productGrid").innerHTML=products.map(productCard).join("");
  $("#emptyState").classList.toggle("hidden",products.length>0);
  $("#popularGrid").innerHTML=[...db.products]
    .filter(p=>p.stock>0)
    .sort((a,b)=>orderCount(b.id)-orderCount(a.id))
    .slice(0,4).map(productCard).join("");
  bindAddButtons();
}

function orderCount(id){
  return db.orders.filter(o=>o.status==="completed")
    .reduce((n,o)=>n+o.items.filter(i=>i.id===id).reduce((s,i)=>s+i.qty,0),0);
}

function bindAddButtons(){
  $$("[data-add]").forEach(b=>b.onclick=()=>{
    const p=db.products.find(p=>p.id===b.dataset.add);
    if(!p||p.stock<1)return;
    const select=b.closest(".product-card")?.querySelector(".variant-select");
    const variant=select?select.value:"";
    if((p.variants||[]).length&&!variant){
      toast(lang==="pl"?"Wybierz wariant.":"Обери варіант.");
      return;
    }
    const key=p.id+"::"+variant;
    const existing=cart.find(i=>i.key===key);
    if(existing){
      if(existing.qty>=p.stock){
        toast(lang==="pl"?"Brak większej ilości.":"Недостатньо залишку.");
        return;
      }
      existing.qty++;
    }else{
      cart.push({key,id:p.id,name:p.name,price:Number(p.price),variant,qty:1});
    }
    renderCart();
    toast(lang==="pl"?"Dodano do koszyka.":"Додано в кошик.");
  });
}

function renderCart(){
  const el=$("#cartItems");
  const totalQty=cartQuantity();
  if(!cart.length){
    el.innerHTML=`<p class="muted">${t("emptyCart")}</p>`;
  }else{
    el.innerHTML=cart.map(i=>{
      const price=unitPrice(i,totalQty);
      return `<div class="cart-row">
        <div>
          <h4>${esc(i.name)}</h4>
          <small>${esc(i.variant||"")} · ${money(price)}</small>
          <div class="qty-controls">
            <button data-qty="${i.key}" data-delta="-1">−</button>
            <span>${i.qty}</span>
            <button data-qty="${i.key}" data-delta="1">+</button>
            <button data-remove="${i.key}" title="${t("remove")}">×</button>
          </div>
        </div>
        <strong>${money(price*i.qty)}</strong>
      </div>`;
    }).join("");
  }
  $("#cartCount").textContent=totalQty;
  $("#cartTotal").textContent=money(cart.reduce((n,i)=>n+unitPrice(i,totalQty)*i.qty,0));
  let hint=$("#bulkPriceHint");
  if(!hint){
    hint=document.createElement("p");
    hint.id="bulkPriceHint";
    hint.className="small-note";
    $("#cartTotal").parentElement.insertAdjacentElement("beforebegin",hint);
  }
  hint.textContent=tierHint();
  hint.classList.toggle("hidden",!tierHint());

  $$("[data-qty]").forEach(b=>b.onclick=()=>{
    const item=cart.find(i=>i.key===b.dataset.qty);
    const p=item&&db.products.find(p=>p.id===item.id);
    if(!item)return;
    item.qty+=Number(b.dataset.delta);
    if(item.qty<1)cart=cart.filter(i=>i.key!==item.key);
    else if(p&&item.qty>p.stock){
      item.qty=p.stock;
      toast(lang==="pl"?"Osiągnięto stan magazynowy.":"Досягнуто складського залишку.");
    }
    renderCart();
  });
  $$("[data-remove]").forEach(b=>b.onclick=()=>{
    cart=cart.filter(i=>i.key!==b.dataset.remove);
    renderCart();
  });
}

function openDrawer(){
  $("#drawerBackdrop").classList.remove("hidden");
  $("#cartDrawer").classList.add("open");
}

function closeDrawer(){
  $("#cartDrawer").classList.remove("open");
  $("#drawerBackdrop").classList.add("hidden");
}

function updateDeliveryFields(){
  const v=$("#deliverySelect").value;
  $("#addressFields").classList.toggle("hidden",v==="pickup");
  $("#inpostFields").classList.toggle("hidden",v!=="other");
  $("#deliveryNotice").textContent=v==="other"?t("otherCityMessage"):t("cashNote");
  $("#addressFields").querySelector("input").required=v==="local";
  $("#inpostFields").querySelector("input").required=v==="other";
}

function openModal(id){$("#"+id).classList.remove("hidden")}
function closeModal(id){$("#"+id).classList.add("hidden")}

function renderPromos(){
  const el=$("#promoList");
  el.innerHTML=db.promos.length
    ?db.promos.map(p=>`<article class="promo-card"><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p></article>`).join("")
    :`<article class="promo-card"><h3>${t("noPromos")}</h3><p>${t("promoText")}</p></article>`;
}
function renderAdminLists(){
  const pl=$("#adminProductList");
  if(!pl)return;

  pl.innerHTML=db.products.map(p=>`
    <div class="admin-item">
      <div>
        <b>${esc(p.name)}</b>
        <small>${esc(catName(p.category))} · ${money(p.price)} · ${p.stock} ${lang==="pl"?"szt.":"шт."}${p.stock<=db.settings.lowStock?" · ⚠ "+t("stockLow"):""}</small>
      </div>
      <div>
        <button data-edit-product="${p.id}">${t("edit")}</button>
        <button data-delete-product="${p.id}">${t("delete")}</button>
      </div>
    </div>`).join("")||`<p class="muted">${t("noProducts")}</p>`;

  const ol=$("#adminOrderList");
  ol.innerHTML=db.orders.slice().reverse().map(o=>`
    <div class="admin-item">
      <div>
        <b>#${esc(o.id)} — ${esc(o.name)}</b>
        <small>${esc(o.phone)} · ${money(o.total)} · ${esc(o.deliveryLabel)}</small>
        <small>${esc(o.items.map(i=>`${i.name} ×${i.qty}${i.variant?" ("+i.variant+")":""}`).join(", "))}</small>
        <small>${esc(o.comment||"")}</small>
      </div>
      <div>
        <select data-status="${o.id}" aria-label="status">
          <option value="new" ${o.status==="new"?"selected":""}>${t("statusNew")}</option>
          <option value="confirmed" ${o.status==="confirmed"?"selected":""}>${t("statusConfirmed")}</option>
          <option value="completed" ${o.status==="completed"?"selected":""}>${t("statusCompleted")}</option>
          <option value="cancelled" ${o.status==="cancelled"?"selected":""}>${t("statusCancelled")}</option>
        </select>
      </div>
    </div>`).join("")||`<p class="muted">${t("noOrders")}</p>`;

  const completed=db.orders.filter(o=>o.status==="completed");
  $("#stats").innerHTML=`
    <div class="stat"><small>${t("ordersCount")}</small><b>${db.orders.length}</b></div>
    <div class="stat"><small>${t("sales")}</small><b>${money(completed.reduce((n,o)=>n+o.total,0))}</b></div>
    <div class="stat"><small>${t("productsCount")}</small><b>${db.products.length}</b></div>`;

  $("#adminPromoList").innerHTML=db.promos.map(p=>`
    <div class="admin-item">
      <div><b>${esc(p.title)}</b><small>${esc(p.description)}</small></div>
      <button data-delete-promo="${p.id}">${t("delete")}</button>
    </div>`).join("");

  $$("[data-edit-product]").forEach(b=>b.onclick=()=>{
    const p=db.products.find(x=>x.id===b.dataset.editProduct);
    const f=$("#productForm");
    if(!p)return;
    Object.entries({
      id:p.id,
      name:p.name,
      category:p.category,
      price:p.price,
      stock:p.stock,
      variants:(p.variants||[]).join(", "),
      description:p.description||"",
      imageUrl:p.imageUrl||"",
      priceTiers:getTiers(p).map(x=>`${x.qty}=${x.price}`).join(", ")
    }).forEach(([k,v])=>f.elements[k].value=v);
    $("#adminProductsPane").scrollIntoView({behavior:"smooth",block:"start"});
  });

  $$("[data-delete-product]").forEach(b=>b.onclick=()=>{
    if(confirm(lang==="pl"?"Usunąć produkt?":"Видалити товар?")){
      db.products=db.products.filter(p=>p.id!==b.dataset.deleteProduct);
      saveDB();
      renderProducts();
      renderAdminLists();
    }
  });

  $$("[data-delete-promo]").forEach(b=>b.onclick=()=>{
    db.promos=db.promos.filter(p=>p.id!==b.dataset.deletePromo);
    saveDB();
    renderPromos();
    renderAdminLists();
  });

  $$("[data-status]").forEach(s=>s.onchange=async()=>{
    const o=db.orders.find(o=>o.id===s.dataset.status);
    if(!o)return;

    const old=o.status;
    const next=s.value;

    if(next==="confirmed"&&!o.stockDeducted){
      const shortage=o.items.find(i=>{
        const p=db.products.find(p=>p.id===i.id);
        return !p||p.stock<i.qty;
      });

      if(shortage){
        toast(lang==="pl"
          ?`Brak wystarczającej ilości: ${shortage.name}.`
          :`Недостатньо товару: ${shortage.name}.`);
        s.value=old;
        return;
      }

      o.items.forEach(i=>{
        const p=db.products.find(p=>p.id===i.id);
        p.stock-=i.qty;
      });
      o.stockDeducted=true;
    }

    if(o.stockDeducted&&(next==="cancelled"||next==="new")){
      o.items.forEach(i=>{
        const p=db.products.find(p=>p.id===i.id);
        if(p)p.stock+=i.qty;
      });
      o.stockDeducted=false;
    }

    o.status=next;

    try{
      if(CONFIG.useFirebase){
        await updateDoc(doc(firestore,"orders",o.id),{
          status:o.status,
          stockDeducted:o.stockDeducted,
          updatedAt:serverTimestamp()
        });
      }
      saveDB();
      renderAdminLists();
      renderProducts();
    }catch(error){
      console.error(error);
      toast("Не вдалося оновити замовлення");
      s.value=old;
    }
  });
}

function setupAdmin(){
  const f=$("#settingsForm");
  f.elements.rate.value=db.settings.rate;
  f.elements.lowStock.value=db.settings.lowStock;
}

function makeOrderId(){
  return "SH"+Date.now().toString().slice(-8);
}

$("#confirmAge").onclick=()=>{
  sessionStorage.setItem("sh_age_confirmed","1");
  $("#ageGate").classList.add("hidden");
};

$("#leaveSite").onclick=()=>{
  document.body.innerHTML='<main style="min-height:100vh;display:grid;place-items:center;background:#090812;color:#fff;font-family:Arial;text-align:center;padding:30px"><h1>SMOKE HUB</h1><p>Ta strona jest przeznaczona wyłącznie dla osób pełnoletnich.</p></main>';
};

if(sessionStorage.getItem("sh_age_confirmed")==="1"){
  $("#ageGate").classList.add("hidden");
}

$("#language").onchange=e=>{
  lang=e.target.value;
  applyLang();
};

$("#currency").onchange=e=>{
  currency=e.target.value;
  renderProducts();
  renderCart();
  renderAdminLists();
};

$("#searchInput").oninput=renderProducts;

$("#cartBtn").onclick=openDrawer;
$("#drawerBackdrop").onclick=closeDrawer;

$$("[data-close]").forEach(b=>b.onclick=()=>{
  closeModal(b.dataset.close);
  if(b.dataset.close==="cartDrawer")closeDrawer();
});

$("#checkoutOpen").onclick=()=>{
  if(!cart.length){
    toast(t("emptyCart"));
    return;
  }
  closeDrawer();
  openModal("checkoutModal");
};

$("#deliverySelect").onchange=updateDeliveryFields;
$("#checkoutForm").onsubmit=async e=>{
  e.preventDefault();
  if(!cart.length)return;

  const f=e.currentTarget;
  const fd=new FormData(f);
  const delivery=fd.get("delivery");
  const totalQty=cartQuantity();

  const items=cart.map(i=>({
    ...i,
    price:unitPrice(i,totalQty)
  }));

  for(const i of items){
    const p=db.products.find(p=>p.id===i.id);
    if(!p||p.stock<i.qty){
      toast(lang==="pl"?"Stan magazynowy się zmienił.":"Залишок товару змінився.");
      return;
    }
  }

  const deliveryLabels={
    pickup:lang==="pl"?"Odbiór osobisty — Łódź":"Самовивіз — Лодзь",
    local:lang==="pl"?"Dostawa po Łodzi":"Доставка по Лодзі",
    other:lang==="pl"?"Inne miasto — InPost / menedżer":"Інше місто — InPost / менеджер"
  };

  const order={
    id:makeOrderId(),
    createdAt:new Date().toISOString(),
    name:fd.get("name").trim(),
    phone:fd.get("phone").trim(),
    telegram:fd.get("telegram").trim(),
    delivery,
    deliveryLabel:deliveryLabels[delivery],
    address:fd.get("address").trim(),
    inpost:fd.get("inpost").trim(),
    comment:fd.get("comment").trim(),
    items,
    total:items.reduce((n,i)=>n+i.price*i.qty,0),
    status:"new",
    stockDeducted:false
  };

  try{
    if(CONFIG.useFirebase){
      await setDoc(doc(firestore,"orders",order.id),{
        ...order,
        createdAt:serverTimestamp()
      });
    }else{
      db.orders.push(order);
      saveDB();
    }
  }catch(error){
    console.error("Order save error:",error);
    toast("Не вдалося надіслати замовлення. Спробуй ще раз.");
    return;
  }

  cart=[];
  renderCart();
  renderProducts();
  renderAdminLists();
  closeModal("checkoutModal");

  $("#orderResultText").textContent=
    `${t("orderNo")}: ${order.id}. ${
      delivery==="other"
        ?t("otherCityMessage")
        :t("managerWillContact")
    }`;

  openModal("resultModal");
  f.reset();
  updateDeliveryFields();
};

$("#adminOpen").onclick=()=>openModal("adminModal");

$("#accountBtn").onclick=()=>toast(t("accountNote"));

$("#demoAdminLogin").onclick=()=>{
  if($("#demoAdminPassword").value!=="smoke-demo"){
    toast(t("wrongPassword"));
    return;
  }

  $("#adminLoginPane").classList.add("hidden");
  $("#adminPanel").classList.remove("hidden");
  renderAdminLists();
  setupAdmin();
};

$("#adminLogout").onclick=()=>{
  $("#adminPanel").classList.add("hidden");
  $("#adminLoginPane").classList.remove("hidden");
  $("#demoAdminPassword").value="";
};

$$("[data-admin-tab]").forEach(b=>b.onclick=()=>{
  $$("[data-admin-tab]").forEach(x=>x.classList.toggle("active",x===b));

  ["products","orders","promos","settings"].forEach(k=>{
    $("#admin"+k[0].toUpperCase()+k.slice(1)+"Pane")
      .classList.toggle("hidden",b.dataset.adminTab!==k);
  });

  renderAdminLists();
});

$("#productForm").onsubmit=e=>{
  e.preventDefault();

  const f=e.currentTarget;
  const fd=new FormData(f);
  const id=fd.get("id")||crypto.randomUUID();

  const p={
    id,
    name:fd.get("name").trim(),
    category:fd.get("category"),
    price:Number(fd.get("price")),
    stock:Number(fd.get("stock")),
    variants:fd.get("variants").split(",").map(s=>s.trim()).filter(Boolean),
    description:fd.get("description").trim(),
    imageUrl:(fd.get("imageUrl")||"").trim(),
    priceTiers:(fd.get("priceTiers")||"")
      .split(/[;,\n]+/)
      .map(x=>{
        const m=x.trim().match(/^(\d+)\s*[:=]\s*(\d+(?:[.,]\d+)?)$/);
        return m?{qty:Number(m[1]),price:Number(m[2].replace(",","."))}:null;
      })
      .filter(Boolean)
      .sort((a,b)=>a.qty-b.qty)
  };

  if(p.imageUrl&&!/^https:\/\//i.test(p.imageUrl)){
    toast("Посилання на фото має починатися з https://");
    return;
  }

  const ix=db.products.findIndex(x=>x.id===id);
  if(ix>=0)db.products[ix]=p;
  else db.products.push(p);

  saveDB();
  f.reset();
  f.elements.id.value="";
  renderProducts();
  renderAdminLists();
  toast(t("productSaved"));
};

$("#resetProduct").onclick=()=>{
  $("#productForm").reset();
  $("#productForm").elements.id.value="";
};

$("#promoForm").onsubmit=e=>{
  e.preventDefault();

  const fd=new FormData(e.currentTarget);

  db.promos.push({
    id:crypto.randomUUID(),
    title:fd.get("title").trim(),
    description:fd.get("description").trim(),
    createdAt:new Date().toISOString()
  });

  saveDB();
  e.currentTarget.reset();
  renderPromos();
  renderAdminLists();
  toast(t("promoSaved"));
};

$("#settingsForm").onsubmit=e=>{
  e.preventDefault();

  const fd=new FormData(e.currentTarget);
  db.settings.rate=Number(fd.get("rate"));
  db.settings.lowStock=Number(fd.get("lowStock"));

  saveDB();
  renderProducts();
  renderCart();
  renderAdminLists();
  toast(t("settingsSaved"));
};

$("#telegramChannel").href=CONFIG.telegramChannelUrl;
$("#telegramManager").href=CONFIG.telegramManagerUrl;

$("#menuToggle").onclick=()=>$("#nav").classList.toggle("open");

function showSitePage(page,updateHash=true){
  const valid=["home","catalog","popular","promos","contact"].includes(page)
    ?page:"home";

  $$("[data-site-page]").forEach(el=>
    el.classList.toggle("active",el.dataset.sitePage===valid)
  );

  $$("[data-page]").forEach(a=>
    a.classList.toggle("active",a.dataset.page===valid)
  );

  $("#nav").classList.remove("open");

  if(updateHash&&location.hash!=="#"+valid){
    history.pushState({page:valid},"","#"+valid);
  }

  window.scrollTo({top:0,behavior:"smooth"});
}

$$("[data-page]").forEach(a=>a.addEventListener("click",e=>{
  e.preventDefault();
  showSitePage(a.dataset.page);
}));

window.addEventListener("popstate",()=>
  showSitePage(location.hash.replace("#","")||"home",false)
);

showSitePage(location.hash.replace("#","")||"home",false);

$("#year").textContent=new Date().getFullYear();

applyLang();
updateDeliveryFields();
startFirebaseSync();