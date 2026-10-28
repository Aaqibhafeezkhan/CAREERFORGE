function inquireConcierge() {
  alert('Aura Realms VIP Concierge Booking desk notified!');
}

/* ===== BEGIN issue #76: travel curator and printable itinerary ===== */
(function () {
  'use strict';
  var cardsEl = document.getElementById('lr-cards');
  if (!cardsEl) return;

  // Illustrative demo prices in USD.
  var YACHT_PER_NIGHT = 6000;
  var JET_FLAT = 28000; // return flight for the party, per destination
  var NIGHT_CHOICES = [3, 5, 7, 10, 14];
  var DESTINATIONS = [
    { id: 'monaco', name: 'Monaco', icon: '🎰', blurb: 'Harbour-view suite above the Grand Prix circuit.', rate: 2400, yacht: true },
    { id: 'st-barts', name: 'St. Barts', icon: '⛵', blurb: 'Clifftop villa with a private beach in Gustavia.', rate: 3200, yacht: true },
    { id: 'aspen', name: 'Aspen', icon: '🏔️', blurb: 'Slopeside chalet with ski-in access and a chef.', rate: 2800, yacht: false },
    { id: 'maldives', name: 'Maldives', icon: '🏝️', blurb: 'Overwater estate on its own lagoon.', rate: 4500, yacht: true }
  ];

  var usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  var els = {
    lines: document.getElementById('lr-lines'),
    body: document.getElementById('lr-lines-body'),
    empty: document.getElementById('lr-empty'),
    total: document.getElementById('lr-total'),
    print: document.getElementById('lr-print'),
    guest: document.getElementById('lr-guest'),
    guestPrint: document.getElementById('lr-guest-print'),
    date: document.getElementById('lr-date')
  };
  // Insertion order of the picks, so the itinerary reads in the order the guest chose.
  var state = {}; // id -> { added, nights, yacht, jet }
  var order = [];
  var refs = {};

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  function buildCard(d) {
    state[d.id] = { added: false, nights: 5, yacht: false, jet: false };
    var card = el('article', 'lr-card');
    var icon = el('div', 'lr-icon', d.icon);
    icon.setAttribute('aria-hidden', 'true');
    var h = el('h3', null, d.name);
    var rate = el('p', 'lr-rate', usd.format(d.rate));
    rate.appendChild(el('span', null, ' / night'));

    var fs = el('fieldset', 'lr-opts');
    fs.disabled = true;
    fs.appendChild(el('legend', 'lr-sr', d.name + ' options'));

    var nightsLabel = el('label', 'lr-nights', 'Nights ');
    var sel = document.createElement('select');
    sel.id = 'lr-nights-' + d.id;
    NIGHT_CHOICES.forEach(function (n) {
      var o = document.createElement('option');
      o.value = String(n);
      o.textContent = n + ' nights';
      if (n === state[d.id].nights) o.selected = true;
      sel.appendChild(o);
    });
    nightsLabel.setAttribute('for', sel.id);
    fs.appendChild(nightsLabel);
    fs.appendChild(sel);

    var yacht = addOn('yacht-' + d.id, 'Yacht charter', '+' + usd.format(YACHT_PER_NIGHT) + ' / night', !d.yacht);
    var jet = addOn('jet-' + d.id, 'Private jet', '+' + usd.format(JET_FLAT) + ' return', false);
    fs.appendChild(yacht.label);
    fs.appendChild(jet.label);
    if (!d.yacht) fs.appendChild(el('p', 'lr-hint', 'Yacht not offered here (inland).'));

    var btn = el('button', 'lr-toggle', 'Add to itinerary');
    btn.type = 'button';
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('aria-label', 'Add ' + d.name + ' to itinerary');

    card.appendChild(icon);
    card.appendChild(h);
    card.appendChild(el('p', 'lr-blurb', d.blurb));
    card.appendChild(rate);
    card.appendChild(fs);
    card.appendChild(btn);
    cardsEl.appendChild(card);

    refs[d.id] = { card: card, fs: fs, btn: btn };

    btn.addEventListener('click', function () {
      var s = state[d.id];
      s.added = !s.added;
      if (s.added) { if (order.indexOf(d.id) === -1) order.push(d.id); }
      else order = order.filter(function (x) { return x !== d.id; });
      fs.disabled = !s.added;
      card.classList.toggle('lr-on', s.added);
      btn.textContent = s.added ? 'Remove from itinerary' : 'Add to itinerary';
      btn.setAttribute('aria-pressed', String(s.added));
      btn.setAttribute('aria-label', (s.added ? 'Remove ' : 'Add ') + d.name + (s.added ? ' from itinerary' : ' to itinerary'));
      render();
    });
    sel.addEventListener('change', function () { state[d.id].nights = Number(sel.value); render(); });
    yacht.input.addEventListener('change', function () { state[d.id].yacht = yacht.input.checked; render(); });
    jet.input.addEventListener('change', function () { state[d.id].jet = jet.input.checked; render(); });
  }

  function addOn(id, name, price, unavailable) {
    var label = el('label', 'lr-addon');
    var input = document.createElement('input');
    input.type = 'checkbox';
    input.id = 'lr-' + id;
    input.disabled = !!unavailable;
    label.appendChild(input);
    label.appendChild(el('span', null, name));
    label.appendChild(el('small', null, price));
    return { label: label, input: input };
  }

  function lineRow(text, amount, cls) {
    var tr = el('tr', cls || '');
    tr.appendChild(el('td', null, text));
    tr.appendChild(el('td', 'lr-num', amount === null ? '' : usd.format(amount)));
    return tr;
  }

  function calc(d, s) {
    var lines = [{ text: s.nights + ' nights × ' + usd.format(d.rate), amount: s.nights * d.rate }];
    if (s.yacht && d.yacht) lines.push({ text: 'Yacht charter, ' + s.nights + ' nights × ' + usd.format(YACHT_PER_NIGHT), amount: s.nights * YACHT_PER_NIGHT });
    if (s.jet) lines.push({ text: 'Private jet, return', amount: JET_FLAT });
    return lines;
  }

  function render() {
    els.body.textContent = '';
    var total = 0;
    order.forEach(function (id) {
      var d = DESTINATIONS.filter(function (x) { return x.id === id; })[0];
      var lines = calc(d, state[id]);
      var head = el('tr', 'lr-dest');
      var th = el('th', null, d.name);
      th.colSpan = 2;
      th.scope = 'rowgroup';
      head.appendChild(th);
      els.body.appendChild(head);
      lines.forEach(function (l) { els.body.appendChild(lineRow(l.text, l.amount)); total += l.amount; });
    });
    els.total.textContent = usd.format(total);
    var has = order.length > 0;
    els.lines.hidden = !has;
    els.empty.hidden = has;
    els.print.disabled = !has;
  }

  function updateGuest() {
    var name = els.guest.value.trim();
    els.guestPrint.textContent = name ? 'Prepared for ' + name : '';
    els.guestPrint.hidden = !name;
  }

  DESTINATIONS.forEach(buildCard);
  els.guest.addEventListener('input', updateGuest);
  els.print.addEventListener('click', function () {
    els.date.textContent = 'Issued ' + new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    window.print();
  });
  els.date.textContent = 'Issued ' + new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  render();
})();
/* ===== END issue #76 ===== */
