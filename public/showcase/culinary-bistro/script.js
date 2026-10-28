function reserveTable() {
  alert('Table reservation system requested for Lumière Bistro!');
}

// ---------------------------------------------------------------
// Takeout order builder. All money is kept in cents.
// ---------------------------------------------------------------
const TAX_RATE = 0.085;
const DEFAULT_TIP = 18;

const DISHES = {
  wagyu: {
    name: 'Seared Wagyu Ribeye',
    price: 6800,
    blurb: 'Truffled potato puree, wild chanterelles, and aged Bordeaux reduction.',
    choices: [
      { id: 'cook', label: 'Cooking preference', options: [
        { label: 'Rare', price: 0 },
        { label: 'Medium rare', price: 0 },
        { label: 'Medium', price: 0 },
        { label: 'Well done', price: 0 }
      ], selected: 1 }
    ],
    sides: [
      { label: 'Haricots verts', price: 600 },
      { label: 'Roasted mushrooms', price: 800 },
      { label: 'Garden salad', price: 500 }
    ]
  },
  bisque: {
    name: 'Brittany Lobster Bisque',
    price: 3400,
    blurb: 'Cognac flambeed lobster foam, saffron tuile, and micro tarragon.',
    choices: [
      { id: 'spice', label: 'Seasoning', options: [
        { label: 'Mild', price: 0 },
        { label: 'Classic', price: 0 },
        { label: 'Extra pepper', price: 0 }
      ], selected: 1 },
      { id: 'bread', label: 'Bread', options: [
        { label: 'Baguette', price: 0 },
        { label: 'Gluten-free toast', price: 300 }
      ], selected: 0 }
    ],
    sides: [
      { label: 'Side salad', price: 500 },
      { label: 'Cheese gougeres', price: 700 }
    ]
  }
};

const order = { lines: [], tip: DEFAULT_TIP, placed: false };
const draft = { dishId: null, qty: 1, opener: null };
let openDialog = null; // the dialog element currently shown

function euro(cents) {
  return `€${(cents / 100).toFixed(2)}`;
}

function byId(id) { return document.getElementById(id); }

function el(tag, props, ...children) {
  const node = document.createElement(tag);
  Object.entries(props || {}).forEach(([k, v]) => {
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else node.setAttribute(k, v);
  });
  children.forEach((c) => c && node.append(c));
  return node;
}

function linePrice(line) {
  return (line.unit) * line.qty;
}

function calcBill(lines, tipPercent) {
  const subtotal = lines.reduce((sum, l) => sum + linePrice(l), 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const tip = Math.round(subtotal * (tipPercent / 100));
  return { subtotal, tax, tip, total: subtotal + tax + tip };
}

// ---------- dialog helpers (focus handling, Escape, simple focus trap)
const FOCUSABLE = 'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

function showDialog(dialog, opener, focusEl) {
  openDialog = dialog;
  dialog.hidden = false;
  byId('overlay').hidden = false;
  dialog._opener = opener;
  (focusEl || dialog.querySelector(FOCUSABLE)).focus();
}

function hideDialog(dialog) {
  dialog.hidden = true;
  byId('overlay').hidden = true;
  openDialog = null;
  const opener = dialog._opener;
  if (opener && document.contains(opener)) opener.focus();
}

document.addEventListener('keydown', (event) => {
  if (!openDialog) return;
  if (event.key === 'Escape') {
    hideDialog(openDialog);
    return;
  }
  if (event.key !== 'Tab') return;
  const items = [...openDialog.querySelectorAll(FOCUSABLE)].filter((n) => n.offsetParent !== null);
  if (!items.length) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});

// ---------- dish modal
function buildChoiceGroup(dishId, choice) {
  const fs = el('fieldset', { class: 'field-group' }, el('legend', { text: choice.label }));
  choice.options.forEach((opt, i) => {
    const input = el('input', { type: 'radio', name: `choice-${choice.id}`, value: String(i) });
    if (i === choice.selected) input.checked = true;
    const text = opt.price ? `${opt.label} (+${euro(opt.price)})` : opt.label;
    fs.append(el('label', { class: 'opt' }, input, el('span', { text })));
  });
  return fs;
}

function openDish(dishId, opener) {
  const dish = DISHES[dishId];
  draft.dishId = dishId;
  draft.qty = 1;
  byId('dishTitle').textContent = dish.name;
  byId('dishDesc').textContent = `${dish.blurb} ${euro(dish.price)} each.`;
  byId('dishNote').value = '';
  const box = byId('dishOptions');
  box.replaceChildren();
  dish.choices.forEach((c) => box.append(buildChoiceGroup(dishId, c)));
  const sides = el('fieldset', { class: 'field-group' }, el('legend', { text: 'Add a side (optional)' }));
  dish.sides.forEach((side, i) => {
    const input = el('input', { type: 'checkbox', name: 'side', value: String(i) });
    sides.append(el('label', { class: 'opt' }, input, el('span', { text: `${side.label} (+${euro(side.price)})` })));
  });
  box.append(sides);
  updateDishPrice();
  showDialog(byId('dishDialog'), opener, byId('dishForm').querySelector('input'));
}

function readDraft() {
  const dish = DISHES[draft.dishId];
  const form = byId('dishForm');
  let unit = dish.price;
  const picks = [];
  dish.choices.forEach((c) => {
    const chosen = form.querySelector(`input[name="choice-${c.id}"]:checked`);
    const opt = c.options[chosen ? Number(chosen.value) : c.selected];
    unit += opt.price;
    picks.push(opt.label);
  });
  const sideLabels = [];
  form.querySelectorAll('input[name="side"]:checked').forEach((box) => {
    const side = dish.sides[Number(box.value)];
    unit += side.price;
    sideLabels.push(side.label);
  });
  const note = byId('dishNote').value.trim().replace(/\s+/g, ' ');
  return { picks, sideLabels, note, unit };
}

function updateDishPrice() {
  const { unit } = readDraft();
  byId('dishQty').textContent = String(draft.qty);
  byId('dishAdd').textContent = `Add to order · ${euro(unit * draft.qty)}`;
}

function describeLine(line) {
  const parts = [...line.picks];
  if (line.sideLabels.length) parts.push(`with ${line.sideLabels.join(', ')}`);
  if (line.note) parts.push(`Note: ${line.note}`);
  return parts.join(' / ');
}

function addDraftToOrder() {
  const dish = DISHES[draft.dishId];
  const d = readDraft();
  const key = JSON.stringify([draft.dishId, d.picks, d.sideLabels, d.note]);
  const existing = order.lines.find((l) => l.key === key);
  if (existing) existing.qty = Math.min(20, existing.qty + draft.qty);
  else order.lines.push({ key, name: dish.name, picks: d.picks, sideLabels: d.sideLabels, note: d.note, unit: d.unit, qty: draft.qty });
  order.placed = false;
  renderOrder();
}

// ---------- cart rendering
function qtyButton(label, text, handler) {
  const b = el('button', { type: 'button', class: 'qty-btn', 'aria-label': label, text });
  b.addEventListener('click', handler);
  return b;
}

function renderOrder() {
  const bill = calcBill(order.lines, order.tip);
  const count = order.lines.reduce((n, l) => n + l.qty, 0);
  byId('trayCount').textContent = String(count);
  byId('trayTotal').textContent = euro(bill.total);
  byId('cartEmpty').hidden = order.lines.length > 0;
  byId('placeOrder').disabled = order.lines.length === 0;
  byId('billSubtotal').textContent = euro(bill.subtotal);
  byId('billTax').textContent = euro(bill.tax);
  byId('billTipLabel').textContent = `Tip (${order.tip}%)`;
  byId('billTip').textContent = euro(bill.tip);
  byId('billTotal').textContent = euro(bill.total);

  const list = byId('cartLines');
  list.replaceChildren();
  order.lines.forEach((line, idx) => {
    const info = el('div', { class: 'line-info' },
      el('div', { class: 'line-name', text: line.name }),
      el('div', { class: 'line-opts', text: describeLine(line) }),
      el('div', { class: 'line-price', text: `${euro(line.unit)} each = ${euro(linePrice(line))}` }));
    const qty = el('div', { class: 'qty', role: 'group', 'aria-label': `Quantity of ${line.name}` },
      qtyButton(`Decrease ${line.name}`, '-', () => changeQty(idx, -1)),
      el('output', { text: String(line.qty) }),
      qtyButton(`Increase ${line.name}`, '+', () => changeQty(idx, 1)));
    list.append(el('li', { class: 'cart-line' }, info, qty));
  });
}

function changeQty(idx, delta) {
  const line = order.lines[idx];
  if (!line) return;
  line.qty = Math.min(20, line.qty + delta);
  if (line.qty <= 0) order.lines.splice(idx, 1);
  renderOrder();
  // keep keyboard focus on a sensible button after the list rebuilds
  const target = order.lines[idx] ? byId('cartLines').children[idx].querySelector('.qty-btn') : byId('cartClose');
  if (target) target.focus();
}

function placeOrder() {
  if (!order.lines.length) return;
  const bill = calcBill(order.lines, order.tip);
  const no = `LB-${Date.now().toString(36).toUpperCase().slice(-5)}`;
  byId('receiptNo').textContent = `Order ${no}`;
  const lines = byId('receiptLines');
  lines.replaceChildren();
  order.lines.forEach((l) => {
    lines.append(el('li', {},
      el('span', { class: 'r-name', text: `${l.qty} x ${l.name}` }),
      el('span', { class: 'r-price', text: euro(linePrice(l)) }),
      el('span', { class: 'r-opts', text: describeLine(l) })));
  });
  const rb = byId('receiptBill');
  rb.replaceChildren();
  [['Subtotal', bill.subtotal], ['Tax (8.5%)', bill.tax], [`Tip (${order.tip}%)`, bill.tip], ['Total', bill.total]].forEach(([k, v], i) => {
    rb.append(el('div', { class: i === 3 ? 'bill-total' : '' }, el('dt', { text: k }), el('dd', { text: euro(v) })));
  });
  byId('cartView').hidden = true;
  byId('receipt').hidden = false;
  byId('cartTitle').textContent = 'Order confirmed';
  byId('receiptNo').focus();
  order.placed = true;
}

function newOrder() {
  order.lines = [];
  order.placed = false;
  order.tip = DEFAULT_TIP;
  document.querySelector('input[name="tip"][value="18"]').checked = true;
  byId('cartView').hidden = false;
  byId('receipt').hidden = true;
  byId('cartTitle').textContent = 'Your takeout order';
  renderOrder();
  hideDialog(byId('cartPanel'));
}

function openCart(opener) {
  if (order.placed) {
    // reopening after a confirmation shows the receipt again
    byId('cartView').hidden = true;
    byId('receipt').hidden = false;
  }
  showDialog(byId('cartPanel'), opener, byId('cartClose'));
}

(function initOrderBuilder() {
  if (!byId('dishDialog')) return;
  document.querySelectorAll('[data-order]').forEach((btn) => {
    btn.addEventListener('click', () => openDish(btn.dataset.order, btn));
  });
  byId('orderOnline').addEventListener('click', () => {
    const menu = byId('menu');
    menu.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const first = menu.querySelector('[data-order]');
    if (first) first.focus({ preventScroll: true });
  });
  byId('trayBtn').addEventListener('click', (e) => openCart(e.currentTarget));
  byId('overlay').addEventListener('click', () => { if (openDialog) hideDialog(openDialog); });
  byId('dishClose').addEventListener('click', () => hideDialog(byId('dishDialog')));
  byId('cartClose').addEventListener('click', () => hideDialog(byId('cartPanel')));

  byId('dishForm').addEventListener('change', updateDishPrice);
  byId('dishForm').addEventListener('submit', (event) => {
    event.preventDefault();
    addDraftToOrder();
    hideDialog(byId('dishDialog'));
    byId('trayBtn').focus();
  });
  byId('dishMinus').addEventListener('click', () => { draft.qty = Math.max(1, draft.qty - 1); updateDishPrice(); });
  byId('dishPlus').addEventListener('click', () => { draft.qty = Math.min(10, draft.qty + 1); updateDishPrice(); });

  byId('tipGroup').addEventListener('change', (event) => {
    if (event.target.name === 'tip') {
      order.tip = Number(event.target.value);
      renderOrder();
    }
  });
  byId('placeOrder').addEventListener('click', placeOrder);
  byId('newOrder').addEventListener('click', newOrder);
  renderOrder();
})();

/* ===== BEGIN issue #101: Digital Sommelier Wine Pairing Recommendation Finder ===== */
(function () {
  'use strict';

  var sommelierEl = document.getElementById('sommelier');
  if (!sommelierEl) return;

  var SOMMELIER_PAIRS = {
    'steak-frites': {
      id: 'steak-frites',
      name: 'Charred Wagyu Steak Frites',
      sauce: 'Bone Marrow Bordelaise & Pommes Frites',
      emoji: '🥩',
      profile: 'Prime Cut Marbling • High Umami • Charred Peppercorn Crust',
      target: 'Requires robust, structured tannins to cut through intramuscular beef fat and dark stone fruit to echo charred crust notes.',
      wines: [
        {
          id: 'margaux-2015',
          name: 'Château Margaux Premier Grand Cru Classé',
          vintage: '2015',
          tier: 'Premier Grand Cru',
          type: 'red',
          appellation: 'Margaux AOC, Bordeaux, France',
          varietal: '87% Cabernet Sauvignon, 10% Merlot, 3% Petit Verdot',
          intensity: 5,
          intensityLabel: '5 / 5 • Full-Bodied & Tannic',
          temp: '17°C (63°F)',
          aromas: ['#Blackberry', '#Cassis', '#FrenchOak', '#TobaccoLeaf', '#Graphite'],
          notes: 'Dense, architectural tannins effortlessly melt through the rich marbling of the prime ribeye, while fragrant cedar and dark cassis aromas harmonize with the smoky char.',
          price: 14500
        },
        {
          id: 'vieux-telegraphe-2018',
          name: 'Domaine du Vieux Télégraphe Châteauneuf-du-Pape',
          vintage: '2018',
          tier: 'Artisanal Terroir Discovery',
          type: 'red',
          appellation: 'La Crau, Southern Rhône AOC, France',
          varietal: '65% Grenache, 15% Syrah, 15% Mourvèdre, 5% Cinsault',
          intensity: 4,
          intensityLabel: '4.5 / 5 • Rich & Spiced',
          temp: '16°C (61°F)',
          aromas: ['#BlackCherry', '#HerbesDeProvence', '#Leather', '#CrackedPepper', '#Plum'],
          notes: 'Pungent garrigue wild lavender and crushed black pepper in this old-vine blend weave seamlessly into the peppercorn crust and savory bone marrow bordelaise.',
          price: 9800
        }
      ]
    },
    'duck-confit': {
      id: 'duck-confit',
      name: 'Crispy Duck Confit à l\'Orange',
      sauce: 'Blood Orange Gastrique & Braised Red Cabbage',
      emoji: '🍗',
      profile: 'Crisp Duck Skin • Sweet-Tart Citrus Glaze • Rich Savory Poultry',
      target: 'Requires bright red-berry acidity to lift duck richness or exotic spiced stone fruit whites that echo the blood orange gastrique.',
      wines: [
        {
          id: 'dujac-2019',
          name: 'Domaine Dujac Morey-Saint-Denis Pinot Noir',
          vintage: '2019',
          tier: 'Premier Grand Cru',
          type: 'red',
          appellation: 'Côte de Nuits, Burgundy AOC, France',
          varietal: '100% Pinot Noir',
          intensity: 3,
          intensityLabel: '3.5 / 5 • Silky & Earthy',
          temp: '15°C (59°F)',
          aromas: ['#WildRaspberry', '#ForestFloor', '#Truffle', '#Violets', '#Clove'],
          notes: 'The vibrant wild strawberry acidity and velvet tannins of Côte de Nuits Pinot Noir pierce the rendered duck fat, elevating the caramelized citrus gastrique.',
          price: 12000
        },
        {
          id: 'weinbach-2020',
          name: 'Domaine Weinbach Grand Cru Gewürztraminer',
          vintage: '2020',
          tier: 'Artisanal Terroir Discovery',
          type: 'white',
          appellation: 'Altenbourg, Alsace Grand Cru AOC, France',
          varietal: '100% Gewürztraminer',
          intensity: 3,
          intensityLabel: '3 / 5 • Aromatic & Exotic',
          temp: '12°C (54°F)',
          aromas: ['#Lychee', '#BloodOrange', '#RosePetal', '#Ginger', '#HoneyedApricot'],
          notes: 'An inspired pairing where the spiced candied orange peel and exotic lychee aromatics mirror the orange reduction while preserving exhilarating palate tension.',
          price: 7800
        }
      ]
    },
    'truffle-risotto': {
      id: 'truffle-risotto',
      name: 'Aged Carnaroli Black Truffle Risotto',
      sauce: 'Winter Black Truffles, 36-Mo Parmigiano & Cultured Butter',
      emoji: '🍚',
      profile: 'Earthy Périgord Truffles • Creamy Carnaroli Starch • Salty Parmigiano Umami',
      target: 'Needs an earthy, tertiary-aroma red such as Piedmont Nebbiolo or an opulent, toasted-hazelnut Burgundy Chardonnay.',
      wines: [
        {
          id: 'conterno-2016',
          name: 'Giacomo Conterno Barolo Cascina Francia',
          vintage: '2016',
          tier: 'Premier Grand Cru',
          type: 'red',
          appellation: 'Serralunga d\'Alba, Barolo DOCG, Italy',
          varietal: '100% Nebbiolo',
          intensity: 5,
          intensityLabel: '4.5 / 5 • Intense & Complex',
          temp: '18°C (64°F)',
          aromas: ['#WhiteTruffle', '#DriedRose', '#Tar', '#Anise', '#DriedCranberry'],
          notes: 'Nebbiolo\'s hallmark autumn forest floor aromatics, firm tannins, and chalky minerality produce an ethereal resonance with shaved black winter truffles.',
          price: 16000
        },
        {
          id: 'comtes-lafon-2020',
          name: 'Domaine des Comtes Lafon Meursault Premier Cru',
          vintage: '2020',
          tier: 'Artisanal Terroir Discovery',
          type: 'white',
          appellation: 'Charmes, Côte de Beaune, Burgundy AOC, France',
          varietal: '100% Chardonnay',
          intensity: 4,
          intensityLabel: '4 / 5 • Opulent & Mineral',
          temp: '13°C (55°F)',
          aromas: ['#ToastedBrioche', '#Hazelnut', '#FlintStone', '#MeyerLemon', '#BrownButter'],
          notes: 'Toasted brioche and brown butter nuances melt seamlessly into the creamy risotto, refreshed by vibrant limestone minerality.',
          price: 13500
        }
      ]
    },
    'salmon': {
      id: 'salmon',
      name: 'Pan-Seared Wild Atlantic Salmon',
      sauce: 'Dill Beurre Blanc & Oscietra Caviar',
      emoji: '🐟',
      profile: 'Crisp Pan-Seared Skin • Rich Omega Salmon Fats • Fresh Dill Emulsion',
      target: 'Demands laser-chiseled acidity and flint minerality to cut through rich beurre blanc without bruising delicate salmon flakes.',
      wines: [
        {
          id: 'cotat-2021',
          name: 'Domaine François Cotat Sancerre Les Monts Damnés',
          vintage: '2021',
          tier: 'Premier Grand Cru',
          type: 'white',
          appellation: 'Chavignol, Loire Valley AOC, France',
          varietal: '100% Sauvignon Blanc',
          intensity: 2,
          intensityLabel: '2.5 / 5 • Chiseled & Crisp',
          temp: '10°C (50°F)',
          aromas: ['#FlintMinerality', '#Chalk', '#Grapefruit', '#WhitePeach', '#FreshChervil'],
          notes: 'Steep Kimmeridgian chalk slopes yield an electric flint spine that slices through creamy dill beurre blanc, honoring the sea sweetness of the fish.',
          price: 7400
        },
        {
          id: 'drouhin-2021',
          name: 'Domaine Drouhin Roserock Pinot Noir',
          vintage: '2021',
          tier: 'Artisanal Terroir Discovery',
          type: 'red',
          appellation: 'Eola-Amity Hills, Willamette / French Heritage',
          varietal: '100% Pinot Noir',
          intensity: 3,
          intensityLabel: '3 / 5 • Refined & Vibrant',
          temp: '14°C (57°F)',
          aromas: ['#Pomegranate', '#WildStrawberry', '#RedCurrant', '#TeaLeaf', '#Spice'],
          notes: 'A celebrated culinary harmony: soft feather-weight tannins and bright red currants highlight the smoky crisp salmon skin without metal bitterness.',
          price: 6500
        }
      ]
    }
  };

  var somState = {
    selectedEntree: 'steak-frites',
    filterType: 'all' // 'all', 'red', 'white'
  };

  var entreeTabs = document.querySelectorAll('.entree-tab');
  var profileCard = document.getElementById('entreeProfileCard');
  var wineGrid = document.getElementById('wineCardsGrid');
  var filterBtns = document.querySelectorAll('.style-filter-btn');

  function renderProfile() {
    var item = SOMMELIER_PAIRS[somState.selectedEntree];
    if (!item) return;

    profileCard.innerHTML = '' +
      '<div class="profile-main">' +
      '  <span class="profile-badge">Dish Flavor Architecture</span>' +
      '  <h3 class="profile-title">' + item.emoji + ' ' + item.name + '</h3>' +
      '  <p class="profile-desc">' + item.target + '</p>' +
      '</div>' +
      '<div class="profile-attributes">' +
      '  <div class="attr-chip"><span>Sauce Reduction</span><strong>' + item.sauce.split(' & ')[0] + '</strong></div>' +
      '  <div class="attr-chip"><span>Primary Notes</span><strong>' + item.profile.split(' • ')[0] + '</strong></div>' +
      '  <div class="attr-chip"><span>Pairing Tier</span><strong>Grand Cru &amp; Terroir</strong></div>' +
      '</div>';
  }

  function renderIntensityDots(intensity) {
    var dots = '';
    for (var i = 1; i <= 5; i++) {
      var isFilled = i <= intensity;
      dots += '<span class="intensity-dot' + (isFilled ? ' filled' : '') + '"></span>';
    }
    return dots;
  }

  function renderWines() {
    wineGrid.textContent = '';
    var entree = SOMMELIER_PAIRS[somState.selectedEntree];
    if (!entree) return;

    var filtered = entree.wines.filter(function (w) {
      if (somState.filterType === 'all') return true;
      return w.type === somState.filterType;
    });

    if (filtered.length === 0) {
      var emptyMsg = document.createElement('p');
      emptyMsg.style.color = '#a8a29e';
      emptyMsg.style.padding = '20px';
      emptyMsg.textContent = 'No ' + somState.filterType + ' pairings currently in cellar for this dish. Try selecting "All Cellar".';
      wineGrid.appendChild(emptyMsg);
      return;
    }

    filtered.forEach(function (wine) {
      var card = document.createElement('article');
      card.className = 'wine-card';

      // Top row
      var topRow = document.createElement('div');
      topRow.className = 'wine-card-top';
      topRow.innerHTML = '' +
        '<div class="wine-vintage-pill"><span>🍷</span> ' + wine.tier + ' • ' + wine.vintage + '</div>' +
        '<span class="wine-type-badge ' + wine.type + '">' + (wine.type === 'red' ? 'Rouge • Red' : 'Blanc • White') + '</span>';

      // Title & varietal
      var titleWrap = document.createElement('div');
      titleWrap.className = 'wine-card-title';
      titleWrap.innerHTML = '' +
        '<h4>' + wine.name + '</h4>' +
        '<div class="wine-appellation">' + wine.appellation + '</div>' +
        '<div class="wine-varietal-pill">🍇 ' + wine.varietal + '</div>';

      // Sensory row
      var sensoryRow = document.createElement('div');
      sensoryRow.className = 'wine-sensory-row';
      sensoryRow.innerHTML = '' +
        '<div class="intensity-box">' +
        '  <span class="intensity-label">Tasting Intensity Rating</span>' +
        '  <div class="intensity-meter">' +
        renderIntensityDots(wine.intensity) +
        '    <span class="intensity-text">' + wine.intensityLabel + '</span>' +
        '  </div>' +
        '</div>' +
        '<div class="wine-temp-box">' +
        '  <span class="temp-label">Ideal Serving</span>' +
        '  <span class="temp-val">' + wine.temp + '</span>' +
        '</div>';

      // Aroma tags
      var aromaWrap = document.createElement('div');
      aromaWrap.className = 'aroma-chips-wrap';
      var aromaLabel = document.createElement('span');
      aromaLabel.className = 'aroma-label';
      aromaLabel.textContent = 'Sommelier Aroma Bouquet';
      aromaWrap.appendChild(aromaLabel);

      var chips = document.createElement('div');
      chips.className = 'aroma-chips';
      wine.aromas.forEach(function (aroma) {
        var chip = document.createElement('span');
        chip.className = 'aroma-chip';
        chip.textContent = aroma;
        chips.appendChild(chip);
      });
      aromaWrap.appendChild(chips);

      // Tasting notes
      var notesBox = document.createElement('div');
      notesBox.className = 'wine-pairing-notes';
      notesBox.innerHTML = '' +
        '<div class="notes-heading">Sommelier Pairing Rationale</div>' +
        '<p class="notes-body">"' + wine.notes + '"</p>';

      // Footer with price and order button
      var footer = document.createElement('div');
      footer.className = 'wine-card-footer';

      var priceWrap = document.createElement('div');
      priceWrap.className = 'wine-price-wrap';
      priceWrap.innerHTML = '<span class="wine-price-label">Cellar Bottle</span><span class="wine-price-val">€' + (wine.price / 100).toFixed(2) + '</span>';

      var orderBtn = document.createElement('button');
      orderBtn.type = 'button';
      orderBtn.className = 'wine-order-btn';
      orderBtn.textContent = 'Add Bottle to Order +';
      orderBtn.setAttribute('aria-label', 'Add ' + wine.name + ' to takeout order');

      orderBtn.addEventListener('click', function () {
        // Integrate seamlessly with Lumière cart
        if (typeof window.addWineBottleToCart === 'function') {
          window.addWineBottleToCart(wine, entree);
        }
        orderBtn.textContent = '✓ Bottle Added';
        orderBtn.classList.add('added');
        setTimeout(function () {
          orderBtn.textContent = 'Add Bottle to Order +';
          orderBtn.classList.remove('added');
        }, 2000);
      });

      footer.appendChild(priceWrap);
      footer.appendChild(orderBtn);

      card.appendChild(topRow);
      card.appendChild(titleWrap);
      card.appendChild(sensoryRow);
      card.appendChild(aromaWrap);
      card.appendChild(notesBox);
      card.appendChild(footer);

      wineGrid.appendChild(card);
    });
  }

  // Hook into Bistro cart
  window.addWineBottleToCart = function (wine, entree) {
    if (typeof order !== 'undefined' && Array.isArray(order.lines)) {
      var key = JSON.stringify(['wine-' + wine.id, wine.vintage, entree.id]);
      var existing = order.lines.find(function (l) { return l.key === key; });
      if (existing) {
        existing.qty = Math.min(20, existing.qty + 1);
      } else {
        order.lines.push({
          key: key,
          name: wine.name + ' (' + wine.vintage + ')',
          picks: ['Sommelier pairing for ' + entree.name],
          sideLabels: [wine.tier, wine.appellation],
          note: 'Sommelier cellar bottle selection',
          unit: wine.price,
          qty: 1
        });
      }
      order.placed = false;
      if (typeof renderOrder === 'function') {
        renderOrder();
      }
    }
  };

  // Event handlers
  entreeTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      entreeTabs.forEach(function (t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      somState.selectedEntree = tab.getAttribute('data-entree');
      renderProfile();
      renderWines();
    });
  });

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');
      somState.filterType = btn.getAttribute('data-filter');
      renderWines();
    });
  });

  // Initial render
  renderProfile();
  renderWines();
})();
/* ===== END issue #101 ===== */

