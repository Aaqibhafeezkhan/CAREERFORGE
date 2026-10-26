document.addEventListener('DOMContentLoaded', () => {
  console.log('Aetheria Agency Studio loaded successfully');
});

// ---------------------------------------------------------------
// Project scope estimator
// ---------------------------------------------------------------
const PROJECT_TYPES = [
  { id: 'branding', label: 'Branding', base: 6000, weeks: 4, note: 'Logo, palette, type system' },
  { id: 'webapp', label: 'Web App', base: 18000, weeks: 10, note: 'Design plus full-stack build' },
  { id: 'uiux', label: 'UI/UX Design', base: 9000, weeks: 6, note: 'Research, flows, hi-fi screens' }
];

// price multiplies the cost, pace multiplies the delivery time
const URGENCY = [
  { label: 'Relaxed', price: 0.9, pace: 1.3, hint: 'Flexible schedule: 10% discount, about 30% longer.' },
  { label: 'Standard', price: 1, pace: 1, hint: 'Our normal delivery pace, no adjustment.' },
  { label: 'Fast', price: 1.25, pace: 0.75, hint: 'Parallel teams: 25% rush fee, about 25% quicker.' },
  { label: 'Rush', price: 1.5, pace: 0.6, hint: 'All hands on deck: 50% rush fee, about 40% quicker.' }
];

const ADDONS = [
  { id: 'guidelines', label: 'Brand guidelines', cost: 1200, weeks: 1 },
  { id: 'cms', label: 'CMS integration', cost: 3500, weeks: 2 },
  { id: 'motion', label: 'Motion design', cost: 2800, weeks: 2 },
  { id: 'seo', label: 'SEO setup', cost: 1500, weeks: 1 },
  { id: 'analytics', label: 'Analytics dashboard', cost: 2400, weeks: 1 }
];

const RANGE_LOW = 0.9; // estimate shown as 90% to 115% of the point value
const RANGE_HIGH = 1.15;

const estState = { type: 'webapp', urgency: 1, addons: new Set() };

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

function roundTo100(n) { return Math.round(n / 100) * 100; }

function calculateEstimate(state) {
  const type = PROJECT_TYPES.find((t) => t.id === state.type);
  const urgency = URGENCY[state.urgency];
  const addons = ADDONS.filter((a) => state.addons.has(a.id));
  const addonCost = addons.reduce((sum, a) => sum + a.cost, 0);
  const addonWeeks = addons.reduce((sum, a) => sum + a.weeks, 0);
  const subtotal = type.base + addonCost;
  const total = Math.round(subtotal * urgency.price);
  const adjustment = total - subtotal;
  const weeks = (type.weeks + addonWeeks) * urgency.pace;
  return {
    type, urgency, addons, subtotal, adjustment, total,
    low: roundTo100(total * RANGE_LOW),
    high: roundTo100(total * RANGE_HIGH),
    weeksLow: Math.max(1, Math.ceil(weeks * 0.9)),
    weeksHigh: Math.max(1, Math.ceil(weeks * 1.2))
  };
}

function estEl(tag, props, ...children) {
  const node = document.createElement(tag);
  Object.entries(props || {}).forEach(([k, v]) => {
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else node.setAttribute(k, v);
  });
  children.forEach((c) => node.append(c));
  return node;
}

function buildPill(input, title, sub) {
  const text = estEl('span', { class: 'pill-text' }, estEl('span', { class: 'pill-title', text: title }), estEl('span', { class: 'pill-sub', text: sub }));
  return estEl('label', { class: 'pill' }, input, text);
}

function buildEstimatorControls() {
  const types = document.getElementById('typeOptions');
  PROJECT_TYPES.forEach((t) => {
    const input = estEl('input', { type: 'radio', name: 'projectType', value: t.id });
    if (t.id === estState.type) input.checked = true;
    input.addEventListener('change', () => { estState.type = t.id; renderEstimate(); });
    types.append(buildPill(input, t.label, `${usd.format(t.base)} / ${t.weeks} wks`));
  });

  const addons = document.getElementById('addonOptions');
  ADDONS.forEach((a) => {
    const input = estEl('input', { type: 'checkbox', name: 'addon', value: a.id });
    input.addEventListener('change', () => {
      if (input.checked) estState.addons.add(a.id);
      else estState.addons.delete(a.id);
      renderEstimate();
    });
    addons.append(buildPill(input, a.label, `+${usd.format(a.cost)} / +${a.weeks} wk${a.weeks > 1 ? 's' : ''}`));
  });

  const ticks = document.getElementById('urgencyTicks');
  URGENCY.forEach((u) => ticks.append(estEl('span', { text: u.label })));

  document.getElementById('urgency').addEventListener('input', (event) => {
    estState.urgency = Number(event.target.value);
    renderEstimate();
  });
}

function addRow(tbody, label, value, cls) {
  const tr = estEl('tr', cls ? { class: cls } : {}, estEl('th', { scope: 'row', text: label }), estEl('td', { text: value }));
  tbody.append(tr);
}

function renderEstimate() {
  const e = calculateEstimate(estState);
  const slider = document.getElementById('urgency');
  slider.setAttribute('aria-valuetext', e.urgency.label);
  document.getElementById('urgencyLabel').textContent = e.urgency.label;
  document.getElementById('urgencyHint').textContent = e.urgency.hint;

  document.getElementById('invRange').textContent = `${usd.format(e.low)} to ${usd.format(e.high)}`;
  document.getElementById('invWeeks').textContent = `Estimated delivery: ${e.weeksLow} to ${e.weeksHigh} weeks`;

  const rows = document.getElementById('invRows');
  rows.replaceChildren();
  addRow(rows, `${e.type.label} base`, usd.format(e.type.base));
  e.addons.forEach((a) => addRow(rows, a.label, `+${usd.format(a.cost)}`));
  addRow(rows, 'Subtotal', usd.format(e.subtotal), 'sub');
  const sign = e.adjustment < 0 ? '-' : '+';
  addRow(rows, `${e.urgency.label} timeline (x${e.urgency.price})`, `${sign}${usd.format(Math.abs(e.adjustment))}`);
  document.getElementById('invTotal').textContent = usd.format(e.total);
  return e;
}

function specSummary(e) {
  const addons = e.addons.length ? e.addons.map((a) => a.label).join(', ') : 'no add-ons';
  return `${e.type.label}, ${e.urgency.label.toLowerCase()} timeline, ${addons}: ${usd.format(e.low)} to ${usd.format(e.high)} over ${e.weeksLow} to ${e.weeksHigh} weeks.`;
}

(function initEstimator() {
  if (!document.getElementById('estForm')) return;
  buildEstimatorControls();
  renderEstimate();

  const btn = document.getElementById('quoteBtn');
  const box = document.getElementById('quoteBox');
  btn.addEventListener('click', () => {
    const open = box.hidden;
    box.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    if (open) document.getElementById('quoteEmail').focus();
  });

  document.getElementById('quoteForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('quoteEmail');
    const msg = document.getElementById('quoteMsg');
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    msg.classList.toggle('error', !valid);
    if (!valid) {
      email.setAttribute('aria-invalid', 'true');
      msg.textContent = 'Enter a valid email address so we can reply.';
      email.focus();
      return;
    }
    email.removeAttribute('aria-invalid');
    // Demo only: nothing is sent anywhere.
    msg.textContent = `Request noted for ${email.value.trim()}. Spec: ${specSummary(calculateEstimate(estState))}`;
  });
})();
