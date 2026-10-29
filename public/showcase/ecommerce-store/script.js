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

/* ===== BEGIN issue #63: Product Quick-View Modal Logic ===== */
const PRODUCT_CATALOG = {
  p1: {
    id: 'p1',
    name: 'CyberDeck Pro Mechanical',
    category: 'keyboards',
    categoryLabel: 'KEYBOARDS',
    price: 249.00,
    badge: 'HOT',
    stockText: 'In Stock',
    stockClass: 'in-stock',
    desc: 'Wireless split ergonomic keyboard engineered with hot-swappable sockets, south-facing RGB matrix, customizable OLED telemetry screen, and CNC anodized aluminum chassis.',
    thumbs: [
      { icon: '⌨️', label: 'Front Split', title: 'Ergonomic Split Layout' },
      { icon: '🖲️', label: '7° Tent', title: 'Integrated Tent Stand' },
      { icon: '🔌', label: 'PCB Matrix', title: 'Hot-Swap Sockets' },
      { icon: '📦', label: 'Unboxing', title: 'Braided Cable & Case' }
    ],
    colors: [
      { id: 'stealth', name: 'Stealth Matte Black', hex: '#18181b' },
      { id: 'synthwave', name: 'Synthwave Violet', hex: '#7c3aed' },
      { id: 'glacier', name: 'Glacier Aluminum', hex: '#e2e8f0' }
    ],
    options: {
      label: 'Switch Mechanism',
      choices: [
        { id: 'linear', name: 'Gateron Oil King (Linear 55g)', priceDelta: 0 },
        { id: 'tactile', name: 'Holy Panda X (Tactile 62g)', priceDelta: 15.00 },
        { id: 'silent', name: 'Silent Aliaz Pro (Silent 60g)', priceDelta: 20.00 }
      ]
    },
    specs: [
      { icon: '⚡', text: 'Tri-Mode: 2.4G / BT 5.2 / USB-C' },
      { icon: '🔋', text: '4,000 mAh Li-ion (200 hrs)' },
      { icon: '⚙️', text: 'QMK & VIA Fully Programmable' },
      { icon: '🛡️', text: 'Poron Gasket Acoustic Mount' }
    ]
  },
  p2: {
    id: 'p2',
    name: 'Acoustic Pulse ANC Headset',
    category: 'audio',
    categoryLabel: 'AUDIO & MONITORING',
    price: 199.00,
    badge: 'NEW',
    stockText: 'Only 3 Left',
    stockClass: 'low-stock',
    desc: 'Audiophile active noise-canceling studio headphones with ultra-low latency lossy spatial audio, custom 50mm beryllium biocellulose drivers, and broadcast-grade microphone.',
    thumbs: [
      { icon: '🎧', label: 'Studio Front', title: 'Studio Acoustic Profile' },
      { icon: '🎒', label: 'Folded', title: 'Foldable Travel Shell' },
      { icon: '🔊', label: 'Beryllium', title: '50mm Drivers' },
      { icon: '🎙️', label: 'Broadcast', title: 'Detachable Boom Mic' }
    ],
    colors: [
      { id: 'onyx', name: 'Midnight Onyx Black', hex: '#0f172a' },
      { id: 'silver', name: 'Gunmetal Silver', hex: '#64748b' },
      { id: 'cyan', name: 'Pulse Kinetic Cyan', hex: '#06b6d4' }
    ],
    options: {
      label: 'Ear Cushion Material',
      choices: [
        { id: 'cooling', name: 'Cooling-Gel Memory Foam', priceDelta: 0 },
        { id: 'leather', name: 'Perforated Lambskin Leather', priceDelta: 18.00 },
        { id: 'velour', name: 'Acoustic Studio Velour', priceDelta: 12.00 }
      ]
    },
    specs: [
      { icon: '🔇', text: '40dB Hybrid Active Noise Cancel' },
      { icon: '⏱️', text: '55-Hour Continuous Playback' },
      { icon: '📶', text: 'Lossless 2.4GHz + Dual BT 5.3' },
      { icon: '🎛️', text: 'Built-in 32-bit Quad DAC' }
    ]
  },
  p3: {
    id: 'p3',
    name: 'Horizon 32" Curved OLED',
    category: 'displays',
    categoryLabel: 'DISPLAYS & MONITORS',
    price: 899.00,
    badge: 'PRO',
    stockText: 'In Stock',
    stockClass: 'in-stock',
    desc: 'Immersive 1800R curved 4K UHD Quantum-Dot OLED display calibrated with 240Hz refresh rate, 0.03ms response time, 99% DCI-P3 gamut, and 90W USB-C single-cable dock.',
    thumbs: [
      { icon: '🖥️', label: '1800R Front', title: 'Panoramic 1800R Curve' },
      { icon: '✨', label: 'Aura Halo', title: 'Ambient RGB Backlight' },
      { icon: '📐', label: '4.5mm Slim', title: 'Razor-Thin OLED Panel' },
      { icon: '⚡', label: '90W Hub', title: 'Single-Cable USB-C Hub' }
    ],
    colors: [
      { id: 'titanium', name: 'Space Gray Titanium', hex: '#94a3b8' },
      { id: 'obsidian', name: 'Matte Obsidian Black', hex: '#020617' }
    ],
    options: {
      label: 'Mounting Stand Architecture',
      choices: [
        { id: 'desk', name: 'Heavy Anodized Desktop Stand', priceDelta: 0 },
        { id: 'arm', name: 'Ergonomic Gas-Spring VESA Arm', priceDelta: 45.00 }
      ]
    },
    specs: [
      { icon: '🎯', text: '3840 x 2160 UHD @ 240Hz' },
      { icon: '⚡', text: '0.03ms (GtG) Pixel Response' },
      { icon: '🎨', text: '99% DCI-P3 & Delta E < 1' },
      { icon: '🔌', text: '90W USB-C + Dual HDMI 2.1' }
    ]
  }
};

const qvState = {
  productId: 'p1',
  thumbIdx: 0,
  colorIdx: 0,
  optionIdx: 0,
  qty: 1
};

function openQuickView(productId) {
  const product = PRODUCT_CATALOG[productId];
  if (!product) return;

  qvState.productId = productId;
  qvState.thumbIdx = 0;
  qvState.colorIdx = 0;
  qvState.optionIdx = 0;
  qvState.qty = 1;

  // Populate basic text
  const setText = (id, txt) => {
    const el = document.getElementById(id);
    if (el) el.textContent = txt;
  };

  setText('qvBadge', product.badge);
  setText('qvCategory', product.categoryLabel);
  setText('qvTitle', product.name);
  setText('qvDesc', product.desc);

  const stockEl = document.getElementById('qvStock');
  if (stockEl) {
    stockEl.className = `stock-badge ${product.stockClass}`;
    stockEl.textContent = product.stockText;
  }

  // Populate Thumbnails
  const thumbsContainer = document.getElementById('qvThumbs');
  if (thumbsContainer) {
    thumbsContainer.innerHTML = '';
    product.thumbs.forEach((th, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `qv-thumb-btn ${idx === 0 ? 'active' : ''}`;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', String(idx === 0));
      btn.setAttribute('aria-label', th.title);
      btn.innerHTML = `<span class="qv-thumb-icon">${th.icon}</span><span class="qv-thumb-text">${th.label}</span>`;
      btn.addEventListener('click', () => selectQuickViewThumb(idx));
      thumbsContainer.appendChild(btn);
    });
  }

  // Populate Color Swatches
  const colorGroup = document.getElementById('qvColorGroup');
  const swatchesContainer = document.getElementById('qvColorSwatches');
  if (product.colors && product.colors.length > 0) {
    colorGroup.hidden = false;
    swatchesContainer.innerHTML = '';
    product.colors.forEach((col, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `qv-swatch-btn ${idx === 0 ? 'active' : ''}`;
      btn.style.backgroundColor = col.hex;
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', String(idx === 0));
      btn.setAttribute('aria-label', col.name);
      btn.addEventListener('click', () => selectQuickViewColor(idx));
      swatchesContainer.appendChild(btn);
    });
    setText('qvColorName', product.colors[0].name);
  } else {
    colorGroup.hidden = true;
  }

  // Populate Option Pills
  const optionGroup = document.getElementById('qvOptionGroup');
  const pillsContainer = document.getElementById('qvOptionPills');
  if (product.options && product.options.choices.length > 0) {
    optionGroup.hidden = false;
    setText('qvOptionLabel', product.options.label);
    pillsContainer.innerHTML = '';
    product.options.choices.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `qv-pill-btn ${idx === 0 ? 'active' : ''}`;
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', String(idx === 0));
      const deltaText = opt.priceDelta > 0 ? ` (+${formatMoney(opt.priceDelta)})` : '';
      btn.textContent = `${opt.name}${deltaText}`;
      btn.addEventListener('click', () => selectQuickViewOption(idx));
      pillsContainer.appendChild(btn);
    });
    setText('qvOptionValue', product.options.choices[0].name);
  } else {
    optionGroup.hidden = true;
  }

  // Populate Specs Matrix
  const specsContainer = document.getElementById('qvSpecsMatrix');
  if (specsContainer) {
    specsContainer.innerHTML = '';
    product.specs.forEach((spec) => {
      const item = document.createElement('div');
      item.className = 'qv-spec-item';
      item.innerHTML = `<span>${spec.icon}</span><span>${spec.text}</span>`;
      specsContainer.appendChild(item);
    });
  }

  updateQuickViewDisplay();

  // Show modal and backdrop
  const modal = document.getElementById('quickViewModal');
  const backdrop = document.getElementById('quickViewBackdrop');
  if (modal && backdrop) {
    modal.hidden = false;
    // trigger animation frame
    requestAnimationFrame(() => {
      modal.classList.add('open');
      backdrop.classList.add('open');
    });
    document.body.style.overflow = 'hidden';
    const closeBtn = document.getElementById('qvCloseBtn');
    if (closeBtn) closeBtn.focus();
  }
}

function closeQuickView() {
  const modal = document.getElementById('quickViewModal');
  const backdrop = document.getElementById('quickViewBackdrop');
  if (modal && backdrop) {
    modal.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => {
      modal.hidden = true;
    }, 300);
  }
}

function selectQuickViewThumb(idx) {
  qvState.thumbIdx = idx;
  const product = PRODUCT_CATALOG[qvState.productId];
  if (!product) return;

  const thumbs = document.querySelectorAll('.qv-thumb-btn');
  thumbs.forEach((t, i) => {
    t.classList.toggle('active', i === idx);
    t.setAttribute('aria-selected', String(i === idx));
  });

  const visualEl = document.getElementById('qvMainVisual');
  const labelEl = document.getElementById('qvViewLabel');
  if (visualEl && product.thumbs[idx]) {
    visualEl.textContent = product.thumbs[idx].icon;
  }
  if (labelEl && product.thumbs[idx]) {
    labelEl.textContent = product.thumbs[idx].title;
  }
}

function selectQuickViewColor(idx) {
  qvState.colorIdx = idx;
  const product = PRODUCT_CATALOG[qvState.productId];
  if (!product || !product.colors[idx]) return;

  const swatches = document.querySelectorAll('.qv-swatch-btn');
  swatches.forEach((s, i) => {
    s.classList.toggle('active', i === idx);
    s.setAttribute('aria-checked', String(i === idx));
  });

  const nameEl = document.getElementById('qvColorName');
  if (nameEl) nameEl.textContent = product.colors[idx].name;
}

function selectQuickViewOption(idx) {
  qvState.optionIdx = idx;
  const product = PRODUCT_CATALOG[qvState.productId];
  if (!product || !product.options.choices[idx]) return;

  const pills = document.querySelectorAll('.qv-pill-btn');
  pills.forEach((p, i) => {
    p.classList.toggle('active', i === idx);
    p.setAttribute('aria-checked', String(i === idx));
  });

  const valEl = document.getElementById('qvOptionValue');
  if (valEl) valEl.textContent = product.options.choices[idx].name;

  updateQuickViewDisplay();
}

function adjustQuickViewQty(delta) {
  qvState.qty = Math.max(1, Math.min(10, qvState.qty + delta));
  updateQuickViewDisplay();
}

function getQuickViewUnitPrice() {
  const product = PRODUCT_CATALOG[qvState.productId];
  if (!product) return 0;
  const optDelta = product.options && product.options.choices[qvState.optionIdx]
    ? product.options.choices[qvState.optionIdx].priceDelta
    : 0;
  return product.price + optDelta;
}

function updateQuickViewDisplay() {
  const unit = getQuickViewUnitPrice();
  const total = unit * qvState.qty;

  const countEl = document.getElementById('qvQtyCount');
  if (countEl) countEl.textContent = qvState.qty;

  const priceEl = document.getElementById('qvPrice');
  if (priceEl) priceEl.textContent = formatMoney(unit);

  const addTotalEl = document.getElementById('qvAddTotal');
  if (addTotalEl) addTotalEl.textContent = formatMoney(total);

  selectQuickViewThumb(qvState.thumbIdx);
}

function addQuickViewToCart() {
  const product = PRODUCT_CATALOG[qvState.productId];
  if (!product) return;

  const color = product.colors && product.colors[qvState.colorIdx] ? product.colors[qvState.colorIdx].name : '';
  const opt = product.options && product.options.choices[qvState.optionIdx] ? product.options.choices[qvState.optionIdx].name : '';
  const unitPrice = getQuickViewUnitPrice();

  // Create or add into cart
  const itemKey = `${product.id}-${qvState.colorIdx}-${qvState.optionIdx}`;
  const customTitle = `${product.name} (${color ? color.split(' ')[0] : ''}${opt ? ', ' + opt.split(' ')[0] : ''})`;

  if (!cart[itemKey]) {
    cart[itemKey] = {
      id: itemKey,
      name: customTitle,
      price: unitPrice,
      qty: qvState.qty,
      img: product.thumbs[0].icon
    };
  } else {
    cart[itemKey].qty = Math.min(20, cart[itemKey].qty + qvState.qty);
  }

  renderCart();
  showToast(`Added ${qvState.qty}x ${product.name} to cart!`);

  // Visual feedback on the button
  const btn = document.getElementById('qvAddToCartBtn');
  if (btn) {
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<span>✓ Added to Cart!</span>';
    btn.style.backgroundColor = '#22c55e';
    setTimeout(() => {
      btn.innerHTML = originalContent;
      btn.style.backgroundColor = '';
    }, 1500);
  }
}

function openCartFromQuickView() {
  closeQuickView();
  setTimeout(() => {
    toggleCartDrawer();
  }, 250);
}

// Escape key closes Quick View modal
document.addEventListener('keydown', (event) => {
  const modal = document.getElementById('quickViewModal');
  if (event.key === 'Escape' && modal && !modal.hidden) {
    closeQuickView();
  }
});
/* ===== END issue #63 ===== */

