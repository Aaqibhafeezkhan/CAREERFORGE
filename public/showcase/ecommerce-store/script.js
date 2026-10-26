// Cart state dictionary: { [id]: { name, price, qty, img } }
const cart = {};

// Promo coupon engine. type "percent" takes value off the subtotal,
// type "freeship" waives the flat shipping fee.
const COUPONS = {
  CAREER20: { type: 'percent', value: 0.2, label: 'CAREER20: 20% off' },
  FREESHIP: { type: 'freeship', value: 0, label: 'FREESHIP: free delivery' }
};
const SHIPPING_FEE = 12;
const TAX_RATE = 0.08;
const COUPON_KEY = 'nexusStoreCoupon';
let appliedCoupon = null;

function formatMoney(amount) {
  return `$${amount.toFixed(2)}`;
}

function normalizeCode(raw) {
  return String(raw || '').trim().toUpperCase();
}

function loadSavedCoupon() {
  try {
    const saved = normalizeCode(localStorage.getItem(COUPON_KEY));
    if (COUPONS[saved]) appliedCoupon = saved;
  } catch (e) {
    appliedCoupon = null;
  }
}

function saveCoupon() {
  try {
    if (appliedCoupon) localStorage.setItem(COUPON_KEY, appliedCoupon);
    else localStorage.removeItem(COUPON_KEY);
  } catch (e) {
    // storage can be blocked, the promo then only lasts for this page view
  }
}

// Pure helper so the maths is in one place.
function calculateTotals(subtotal, couponCode) {
  const coupon = COUPONS[couponCode] || null;
  const discount = coupon && coupon.type === 'percent' ? subtotal * coupon.value : 0;
  let shipping = subtotal > 0 ? SHIPPING_FEE : 0;
  if (coupon && coupon.type === 'freeship') shipping = 0;
  const tax = (subtotal - discount) * TAX_RATE;
  const total = subtotal - discount + shipping + tax;
  return { subtotal, discount, shipping, tax, total };
}

function setCouponMessage(text, isError) {
  const msg = document.getElementById('couponMessage');
  const input = document.getElementById('couponInput');
  if (!msg || !input) return;
  msg.textContent = text;
  msg.classList.toggle('error', Boolean(isError));
  if (isError) input.setAttribute('aria-invalid', 'true');
  else input.removeAttribute('aria-invalid');
}

function applyCoupon(rawCode) {
  const code = normalizeCode(rawCode);
  if (!code) {
    setCouponMessage('Enter a promo code first.', true);
    return false;
  }
  if (!COUPONS[code]) {
    setCouponMessage(`"${code}" is not a valid promo code.`, true);
    return false;
  }
  if (appliedCoupon === code) {
    setCouponMessage(`${code} is already applied.`, true);
    return false;
  }
  appliedCoupon = code;
  saveCoupon();
  setCouponMessage(`${code} applied.`, false);
  renderCart();
  return true;
}

function removeCoupon() {
  appliedCoupon = null;
  saveCoupon();
  setCouponMessage('Promo code removed.', false);
  renderCart();
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.innerText = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

function toggleCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartBackdrop');
  if (drawer && backdrop) {
    drawer.classList.toggle('open');
    backdrop.classList.toggle('open');
  }
}

function addToCart(id, name, price, img) {
  if (!cart[id]) {
    cart[id] = { id, name, price, qty: 1, img };
  } else {
    cart[id].qty += 1;
  }
  showToast(`Added ${name} to cart!`);
  renderCart();
}

function updateQuantity(id, delta) {
  if (!cart[id]) return;

  cart[id].qty += delta;

  if (cart[id].qty <= 0) {
    const itemTitle = cart[id].name;
    delete cart[id];
    showToast(`Removed ${itemTitle} from cart.`);
  }

  renderCart();
}

function renderCart() {
  // 1. Calculate Total Items and Price
  let totalItems = 0;
  let totalPrice = 0;

  Object.values(cart).forEach((item) => {
    totalItems += item.qty;
    totalPrice += item.price * item.qty;
  });

  // Update Badge Count
  const cartCountEl = document.getElementById('cartCount');
  if (cartCountEl) {
    cartCountEl.innerText = totalItems;
  }

  // Update order summary (subtotal, discount, shipping, tax, total)
  const totals = calculateTotals(totalPrice, appliedCoupon);
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };
  setText('cartSubtotal', formatMoney(totals.subtotal));
  setText('cartDiscount', `-${formatMoney(totals.discount)}`);
  setText('cartShipping', totals.shipping === 0 && appliedCoupon === 'FREESHIP' && totals.subtotal > 0 ? 'FREE' : formatMoney(totals.shipping));
  setText('cartTax', formatMoney(totals.tax));
  setText('cartTotal', formatMoney(totals.total));

  const discountRow = document.getElementById('discountRow');
  if (discountRow) discountRow.hidden = !(totals.discount > 0);
  setText('discountLabel', appliedCoupon ? `Discount (${appliedCoupon})` : 'Discount');

  const chip = document.getElementById('promoChip');
  if (chip) {
    chip.hidden = !appliedCoupon;
    if (appliedCoupon) setText('promoChipText', COUPONS[appliedCoupon].label);
  }

  // 2. Render Product Card Buttons / Quantity Controls
  const productIds = ['p1', 'p2', 'p3'];
  productIds.forEach((id) => {
    const container = document.getElementById(`action-${id}`);
    if (!container) return;

    const item = cart[id];
    if (item && item.qty > 0) {
      container.innerHTML = `
        <div class="qty-controls">
          <button class="qty-btn" aria-label="Decrease quantity" onclick="updateQuantity('${id}', -1)">-</button>
          <span class="qty-count">${item.qty}</span>
          <button class="qty-btn" aria-label="Increase quantity" onclick="updateQuantity('${id}', 1)">+</button>
        </div>
      `;
    } else {
      // Revert to original Add to Cart button
      let name = 'Product';
      let price = 0;
      let img = '📦';
      if (id === 'p1') { name = 'CyberDeck Pro Mechanical'; price = 249.00; img = '⌨️'; }
      if (id === 'p2') { name = 'Acoustic Pulse ANC Headset'; price = 199.00; img = '🎧'; }
      if (id === 'p3') { name = 'Horizon 32 Curved OLED'; price = 899.00; img = '🖥️'; }

      container.innerHTML = `
        <button class="add-btn" onclick="addToCart('${id}', '${name}', ${price}, '${img}')">Add to Cart</button>
      `;
    }
  });

  // 3. Render Drawer List
  const drawerBody = document.getElementById('cartItemsList');
  if (!drawerBody) return;

  const items = Object.values(cart);
  if (items.length === 0) {
    drawerBody.innerHTML = '<div class="empty-cart">Your cart is currently empty.</div>';
    return;
  }

  drawerBody.innerHTML = items
    .map(
      (item) => `
      <div class="cart-item-row">
        <div class="cart-item-info">
          <span class="cart-item-icon">${item.img}</span>
          <div class="cart-item-details">
            <h4>${item.name}</h4>
            <div class="price-sub">$${(item.price * item.qty).toFixed(2)} ($${item.price.toFixed(2)} x ${item.qty})</div>
          </div>
        </div>
        <div class="qty-controls">
          <button class="qty-btn" aria-label="Decrease quantity" onclick="updateQuantity('${item.id}', -1)">-</button>
          <span class="qty-count">${item.qty}</span>
          <button class="qty-btn" aria-label="Increase quantity" onclick="updateQuantity('${item.id}', 1)">+</button>
        </div>
      </div>
    `
    )
    .join('');
}

function checkout() {
  const items = Object.values(cart);
  if (items.length === 0) {
    showToast('Your cart is empty!');
    return;
  }
  showToast('Order placed successfully! Thank you for testing Nexus Store.');
  Object.keys(cart).forEach((key) => delete cart[key]);
  renderCart();
  toggleCartDrawer();
}

// Coupon form wiring
const couponForm = document.getElementById('couponForm');
if (couponForm) {
  couponForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = document.getElementById('couponInput');
    if (applyCoupon(input.value)) input.value = '';
  });
}
const promoRemoveBtn = document.getElementById('promoRemove');
if (promoRemoveBtn) promoRemoveBtn.addEventListener('click', removeCoupon);

// Escape closes the drawer
document.addEventListener('keydown', (event) => {
  const drawer = document.getElementById('cartDrawer');
  if (event.key === 'Escape' && drawer && drawer.classList.contains('open')) toggleCartDrawer();
});

loadSavedCoupon();
renderCart();

// Category Tabs Navigation Listener
document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');

    const cat = tab.getAttribute('data-cat');
    const cards = document.querySelectorAll('.card');

    cards.forEach((card) => {
      if (cat === 'all' || card.getAttribute('data-category') === cat) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});
