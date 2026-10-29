document.addEventListener('DOMContentLoaded', () => {
  console.log('Pulse Wave Festival Hub loaded');
  initTicketCalculator();
});

// All money is handled in cents so the totals never pick up float rounding errors.
const TIERS = {
  ga: { name: 'General Admission', cents: 14900 },
  vip: { name: 'VIP Access', cents: 34900 },
  ultra: { name: 'Ultra Platinum', cents: 79900 }
};
const ADDONS = {
  tent: { name: 'Tent Camping', cents: 6000 },
  locker: { name: 'Locker', cents: 2500 },
  fastpass: { name: 'Fast-Pass', cents: 4500 }
};
const MAX_PER_TIER = 10;
const GROUP_MIN_TICKETS = 5;
const GROUP_DISCOUNT = 0.10;
const SERVICE_FEE = 0.08;

function formatMoney(cents) {
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return sign + '$' + dollars + '.' + String(abs % 100).padStart(2, '0');
}

function clampQty(value) {
  const n = parseInt(value, 10);
  if (Number.isNaN(n) || n < 0) return 0;
  return Math.min(n, MAX_PER_TIER);
}

// Pure function: quantities + selected add-on keys in, itemised totals out.
function calculateOrder(quantities, selectedAddons) {
  const lines = [];
  let ticketCount = 0;
  let subtotal = 0;

  Object.keys(TIERS).forEach((key) => {
    const qty = quantities[key] || 0;
    if (qty > 0) {
      const amount = qty * TIERS[key].cents;
      lines.push({ label: TIERS[key].name + ' x ' + qty, cents: amount });
      ticketCount += qty;
      subtotal += amount;
    }
  });

  if (ticketCount > 0) {
    selectedAddons.forEach((key) => {
      if (!ADDONS[key]) return;
      const amount = ticketCount * ADDONS[key].cents;
      lines.push({ label: ADDONS[key].name + ' x ' + ticketCount, cents: amount });
      subtotal += amount;
    });
  }

  const discount = ticketCount >= GROUP_MIN_TICKETS ? Math.round(subtotal * GROUP_DISCOUNT) : 0;
  const fee = Math.round((subtotal - discount) * SERVICE_FEE);
  const total = subtotal - discount + fee;
  return { lines, ticketCount, subtotal, discount, fee, total };
}

function initTicketCalculator() {
  const form = document.getElementById('ticket-form');
  if (!form) return;

  const inputs = {};
  Object.keys(TIERS).forEach((key) => { inputs[key] = document.getElementById('qty-' + key); });
  const addonBoxes = Array.from(form.querySelectorAll('input[name="addon"]'));
  const linesEl = document.getElementById('order-lines');
  const checkoutBtn = document.getElementById('checkout-btn');
  const checkoutMsg = document.getElementById('checkout-msg');

  function render() {
    const quantities = {};
    Object.keys(inputs).forEach((key) => { quantities[key] = clampQty(inputs[key].value); });
    const selected = addonBoxes.filter((b) => b.checked).map((b) => b.value);
    const order = calculateOrder(quantities, selected);

    linesEl.textContent = '';
    if (order.lines.length === 0) {
      const empty = document.createElement('li');
      empty.className = 'order-empty';
      empty.textContent = 'No tickets selected yet.';
      linesEl.appendChild(empty);
    } else {
      order.lines.forEach((line) => {
        const li = document.createElement('li');
        const label = document.createElement('span');
        const price = document.createElement('span');
        label.textContent = line.label;
        price.textContent = formatMoney(line.cents);
        li.append(label, price);
        linesEl.appendChild(li);
      });
    }

    document.getElementById('t-subtotal').textContent = formatMoney(order.subtotal);
    document.getElementById('row-discount').hidden = order.discount === 0;
    document.getElementById('t-discount').textContent = formatMoney(-order.discount);
    document.getElementById('t-fee').textContent = formatMoney(order.fee);
    document.getElementById('t-total').textContent = formatMoney(order.total);

    const names = Object.keys(quantities).filter((k) => quantities[k] > 0).map((k) => TIERS[k].name.toUpperCase());
    document.getElementById('holo-tier').textContent = names.length ? names.join(' + ') : 'NO PASS SELECTED';
    document.getElementById('holo-count').textContent = order.ticketCount + (order.ticketCount === 1 ? ' ticket' : ' tickets');

    checkoutBtn.disabled = order.ticketCount === 0;
    checkoutMsg.textContent = '';
  }

  form.addEventListener('click', (e) => {
    const btn = e.target.closest('.step-btn');
    if (!btn) return;
    const input = btn.closest('.tier-card').querySelector('.qty');
    input.value = clampQty(clampQty(input.value) + parseInt(btn.dataset.step, 10));
    render();
  });
  form.addEventListener('input', render);
  form.addEventListener('change', (e) => {
    if (e.target.classList.contains('qty')) e.target.value = clampQty(e.target.value);
    render();
  });
  form.addEventListener('submit', (e) => e.preventDefault());

  checkoutBtn.addEventListener('click', () => {
    if (checkoutBtn.disabled) return;
    const total = document.getElementById('t-total').textContent;
    checkoutMsg.textContent = 'Demo only: no payment is taken. Your order total would be ' + total + '.';
  });

  render();
}
