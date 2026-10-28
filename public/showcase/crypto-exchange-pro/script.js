document.addEventListener('DOMContentLoaded', () => {
  console.log('VortexDEX Exchange Pro engine ready');
  initMarket();
});

/* ------------------------------------------------------------------
   Mock market engine. Everything is simulated: a seeded PRNG drives the
   candle history and the once-per-second live ticks, so the same pair and
   interval always start from the same history.
------------------------------------------------------------------- */

const PAIRS = {
  btc: { label: 'BTC-PERP', base: 94250, changePct: 4.82, vol: 0.0016, decimals: 2, seed: 101 },
  eth: { label: 'ETH-PERP', base: 3840.5, changePct: 6.15, vol: 0.0022, decimals: 2, seed: 202 },
  sol: { label: 'SOL-PERP', base: 214.8, changePct: 12.4, vol: 0.0035, decimals: 2, seed: 303 }
};

// stepMs = candle length. rollTicks = how many one-second ticks until a new candle opens
// (accelerated on purpose so the demo visibly rolls candles).
const INTERVALS = {
  '1H': { candles: 60, stepMs: 60 * 1000, rollTicks: 10, volMul: 1 },
  '24H': { candles: 96, stepMs: 15 * 60 * 1000, rollTicks: 15, volMul: 2.2 },
  '1W': { candles: 84, stepMs: 2 * 60 * 60 * 1000, rollTicks: 20, volMul: 4.5 },
  '1M': { candles: 120, stepMs: 6 * 60 * 60 * 1000, rollTicks: 25, volMul: 8 }
};

const VIEW_W = 800;
const VIEW_H = 380;
const PAD = { left: 10, right: 78, top: 14, bottom: 30 };
const SVG_NS = 'http://www.w3.org/2000/svg';

// mulberry32: tiny seeded PRNG returning floats in [0, 1)
function makeRng(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Roughly normal noise in about [-1, 1] (sum of uniforms).
function noise(rng) {
  return (rng() + rng() + rng() - 1.5) / 1.5;
}

// Build a candle history that ends exactly at `endPrice`.
function generateCandles(pair, intervalKey, endPrice, nowMs) {
  const cfg = INTERVALS[intervalKey];
  const p = PAIRS[pair];
  const seedBase = p.seed * 1000 + Object.keys(INTERVALS).indexOf(intervalKey) * 17;
  const rng = makeRng(seedBase);
  const vol = p.vol * cfg.volMul;
  const stepMs = cfg.stepMs;
  const lastStart = Math.floor(nowMs / stepMs) * stepMs;

  const raw = [];
  let price = 100;
  let drift = 0;
  for (let i = 0; i < cfg.candles; i++) {
    drift = drift * 0.9 + noise(rng) * vol * 0.4;
    const open = price;
    const close = open * (1 + drift + noise(rng) * vol);
    const high = Math.max(open, close) * (1 + rng() * vol * 0.8);
    const low = Math.min(open, close) * (1 - rng() * vol * 0.8);
    raw.push({ open, high, low, close });
    price = close;
  }
  const scale = endPrice / raw[raw.length - 1].close;
  return raw.map((c, i) => ({
    t: lastStart - (cfg.candles - 1 - i) * stepMs,
    open: c.open * scale,
    high: c.high * scale,
    low: c.low * scale,
    close: c.close * scale
  }));
}

function movingAverage(candles, period) {
  return candles.map((_, i) => {
    if (i < period - 1) return null;
    let sum = 0;
    for (let k = i - period + 1; k <= i; k++) sum += candles[k].close;
    return sum / period;
  });
}

function formatPrice(v, decimals) {
  return v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function formatTime(ms, intervalKey) {
  const opts = intervalKey === '1H' || intervalKey === '24H'
    ? { timeZone: 'UTC', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false }
    : { timeZone: 'UTC', day: '2-digit', month: 'short', hour: '2-digit', hour12: false };
  return new Date(ms).toLocaleString('en-GB', opts) + ' UTC';
}

function svgEl(name, attrs, text) {
  const el = document.createElementNS(SVG_NS, name);
  Object.keys(attrs || {}).forEach((k) => el.setAttribute(k, attrs[k]));
  if (text !== undefined) el.textContent = text;
  return el;
}

function initMarket() {
  const svg = document.getElementById('chart');
  if (!svg) return;
  const wrap = document.getElementById('chart-wrap');
  const tip = document.getElementById('chart-tip');
  const status = document.getElementById('chart-status');

  const state = {
    pair: 'btc',
    interval: '24H',
    hover: null, // { index, y } in svg coordinates, or null
    tick: 0
  };

  // One live engine per pair: current price, its own seeded RNG, 24h reference price.
  const engines = {};
  Object.keys(PAIRS).forEach((key) => {
    const p = PAIRS[key];
    engines[key] = {
      price: p.base,
      ref: p.base / (1 + p.changePct / 100),
      rng: makeRng(p.seed * 7919)
    };
  });

  let candles = [];
  let asks = [];
  let bids = [];
  let obRng = makeRng(4242);

  function buildSeries() {
    candles = generateCandles(state.pair, state.interval, engines[state.pair].price, Date.now());
  }

  function buildBook() {
    const mid = engines[state.pair].price;
    const tickSize = mid * 0.00012;
    asks = [];
    bids = [];
    for (let i = 0; i < 8; i++) {
      asks.push({ price: mid + tickSize * (i + 1), size: 0.2 + obRng() * 3 });
      bids.push({ price: mid - tickSize * (i + 1), size: 0.2 + obRng() * 3 });
    }
  }

  // ---- live tick: runs once per second -------------------------------
  function tickEngines() {
    state.tick++;
    Object.keys(PAIRS).forEach((key) => {
      const e = engines[key];
      const p = PAIRS[key];
      const step = noise(e.rng) * p.vol * 0.9;
      e.price = Math.max(e.price * (1 + step), 0.01);
    });

    const price = engines[state.pair].price;
    const cfg = INTERVALS[state.interval];
    const last = candles[candles.length - 1];
    if (state.tick % cfg.rollTicks === 0) {
      candles.push({ t: last.t + cfg.stepMs, open: last.close, high: Math.max(last.close, price), low: Math.min(last.close, price), close: price });
      candles.shift();
    } else {
      last.close = price;
      last.high = Math.max(last.high, price);
      last.low = Math.min(last.low, price);
    }
    buildBook();
    renderAll();
  }

  // ---- rendering -----------------------------------------------------
  function renderTicker() {
    Object.keys(PAIRS).forEach((key) => {
      const e = engines[key];
      const p = PAIRS[key];
      const priceEl = document.getElementById('tick-' + key + '-price');
      const changeEl = document.getElementById('tick-' + key + '-change');
      const pct = ((e.price - e.ref) / e.ref) * 100;
      if (priceEl) priceEl.textContent = '$' + formatPrice(e.price, p.decimals);
      if (changeEl) {
        changeEl.textContent = (pct >= 0 ? '+' : '') + pct.toFixed(2) + '%';
        changeEl.setAttribute('data-dir', pct >= 0 ? 'up' : 'down');
      }
    });
  }

  function renderStats() {
    const p = PAIRS[state.pair];
    const e = engines[state.pair];
    const pct = ((e.price - e.ref) / e.ref) * 100;
    const hi = Math.max(...candles.map((c) => c.high));
    const lo = Math.min(...candles.map((c) => c.low));
    document.getElementById('stat-last').textContent = '$' + formatPrice(e.price, p.decimals);
    const ch = document.getElementById('stat-change');
    ch.textContent = (pct >= 0 ? '+' : '') + pct.toFixed(2) + '%';
    ch.setAttribute('data-dir', pct >= 0 ? 'up' : 'down');
    document.getElementById('stat-high').textContent = '$' + formatPrice(hi, p.decimals);
    document.getElementById('stat-low').textContent = '$' + formatPrice(lo, p.decimals);
  }

  function fillBookBody(tbody, rows, cls, maxTotal, decimals) {
    tbody.textContent = '';
    let running = 0;
    const withTotals = rows.map((r) => { running += r.size; return { price: r.price, size: r.size, total: running }; });
    withTotals.forEach((r) => {
      const tr = document.createElement('tr');
      tr.className = cls;
      tr.style.setProperty('--depth', Math.round((r.total / maxTotal) * 100) + '%');
      [formatPrice(r.price, decimals), r.size.toFixed(3), r.total.toFixed(3)].forEach((txt, i) => {
        const td = document.createElement('td');
        td.textContent = txt;
        if (i === 0) td.className = 'ob-price';
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  function renderBook() {
    const p = PAIRS[state.pair];
    const maxTotal = Math.max(asks.reduce((a, r) => a + r.size, 0), bids.reduce((a, r) => a + r.size, 0));
    // asks are shown with the highest price on top so the best ask sits next to the mid price
    fillBookBody(document.querySelector('#ob-asks tbody'), asks, 'ob-ask', maxTotal, p.decimals);
    const askRows = document.querySelector('#ob-asks tbody');
    Array.from(askRows.children).reverse().forEach((tr) => askRows.appendChild(tr));
    fillBookBody(document.querySelector('#ob-bids tbody'), bids, 'ob-bid', maxTotal, p.decimals);
    const mid = document.getElementById('ob-mid');
    mid.textContent = '$' + formatPrice(engines[state.pair].price, p.decimals);
    const first = candles[0].open;
    mid.setAttribute('data-dir', engines[state.pair].price >= first ? 'up' : 'down');
  }

  function renderChart() {
    const p = PAIRS[state.pair];
    const n = candles.length;
    const plotW = VIEW_W - PAD.left - PAD.right;
    const plotH = VIEW_H - PAD.top - PAD.bottom;
    const slot = plotW / n;
    const bodyW = Math.max(slot * 0.62, 1.5);

    let hi = -Infinity;
    let lo = Infinity;
    candles.forEach((c) => { hi = Math.max(hi, c.high); lo = Math.min(lo, c.low); });
    const padPx = (hi - lo) * 0.08 || hi * 0.01;
    hi += padPx;
    lo -= padPx;
    const yOf = (v) => PAD.top + ((hi - v) / (hi - lo)) * plotH;
    const xOf = (i) => PAD.left + slot * i + slot / 2;
    const priceAt = (y) => hi - ((y - PAD.top) / plotH) * (hi - lo);

    svg.textContent = '';

    // grid + price axis
    for (let g = 0; g <= 5; g++) {
      const v = lo + ((hi - lo) * g) / 5;
      const y = yOf(v);
      svg.appendChild(svgEl('line', { x1: PAD.left, x2: VIEW_W - PAD.right, y1: y, y2: y, class: 'grid-line' }));
      svg.appendChild(svgEl('text', { x: VIEW_W - PAD.right + 6, y: y + 4, class: 'axis-label' }, formatPrice(v, p.decimals)));
    }
    // time axis
    for (let g = 0; g < 5; g++) {
      const idx = Math.round(((n - 1) * g) / 4);
      const label = formatTime(candles[idx].t, state.interval).replace(' UTC', '');
      const anchor = g === 0 ? 'start' : g === 4 ? 'end' : 'middle';
      svg.appendChild(svgEl('text', { x: xOf(idx), y: VIEW_H - 10, class: 'axis-label', 'text-anchor': anchor }, label));
    }

    // candles
    candles.forEach((c, i) => {
      const up = c.close >= c.open;
      const cls = up ? 'candle-up' : 'candle-down';
      const x = xOf(i);
      svg.appendChild(svgEl('line', { x1: x, x2: x, y1: yOf(c.high), y2: yOf(c.low), class: 'wick ' + cls }));
      const top = yOf(Math.max(c.open, c.close));
      const h = Math.max(Math.abs(yOf(c.open) - yOf(c.close)), 1);
      svg.appendChild(svgEl('rect', { x: x - bodyW / 2, y: top, width: bodyW, height: h, class: 'body ' + cls }));
    });

    // moving averages
    [[7, 'ma7'], [25, 'ma25']].forEach(([period, cls]) => {
      const ma = movingAverage(candles, period);
      const pts = [];
      ma.forEach((v, i) => { if (v !== null) pts.push(xOf(i).toFixed(1) + ',' + yOf(v).toFixed(1)); });
      if (pts.length > 1) svg.appendChild(svgEl('polyline', { points: pts.join(' '), class: 'ma-line ' + cls }));
    });

    // last price marker
    const lastY = yOf(candles[n - 1].close);
    svg.appendChild(svgEl('line', { x1: PAD.left, x2: VIEW_W - PAD.right, y1: lastY, y2: lastY, class: 'last-line' }));
    svg.appendChild(svgEl('rect', { x: VIEW_W - PAD.right, y: lastY - 9, width: PAD.right, height: 18, class: 'last-tag' }));
    svg.appendChild(svgEl('text', { x: VIEW_W - PAD.right + 6, y: lastY + 4, class: 'last-tag-text' }, formatPrice(candles[n - 1].close, p.decimals)));

    // crosshair + tooltip
    if (state.hover && state.hover.index >= 0 && state.hover.index < n) {
      const c = candles[state.hover.index];
      const x = xOf(state.hover.index);
      const y = Math.min(Math.max(state.hover.y, PAD.top), PAD.top + plotH);
      svg.appendChild(svgEl('line', { x1: x, x2: x, y1: PAD.top, y2: PAD.top + plotH, class: 'crosshair' }));
      svg.appendChild(svgEl('line', { x1: PAD.left, x2: VIEW_W - PAD.right, y1: y, y2: y, class: 'crosshair' }));
      svg.appendChild(svgEl('rect', { x: VIEW_W - PAD.right, y: y - 9, width: PAD.right, height: 18, class: 'cross-tag' }));
      svg.appendChild(svgEl('text', { x: VIEW_W - PAD.right + 6, y: y + 4, class: 'cross-tag-text' }, formatPrice(priceAt(y), p.decimals)));
      showTip(c, x);
    } else {
      tip.hidden = true;
    }
  }

  function showTip(c, svgX) {
    const p = PAIRS[state.pair];
    const chg = ((c.close - c.open) / c.open) * 100;
    tip.textContent = '';
    const head = document.createElement('div');
    head.className = 'tip-time';
    head.textContent = formatTime(c.t, state.interval);
    tip.appendChild(head);
    [['O', c.open], ['H', c.high], ['L', c.low], ['C', c.close]].forEach(([k, v]) => {
      const row = document.createElement('div');
      row.className = 'tip-row';
      const a = document.createElement('span');
      const b = document.createElement('span');
      a.textContent = k;
      b.textContent = formatPrice(v, p.decimals);
      row.append(a, b);
      tip.appendChild(row);
    });
    const ch = document.createElement('div');
    ch.className = 'tip-chg';
    ch.setAttribute('data-dir', chg >= 0 ? 'up' : 'down');
    ch.textContent = (chg >= 0 ? '+' : '') + chg.toFixed(2) + '%';
    tip.appendChild(ch);
    tip.hidden = false;
    // keep the tooltip inside the wrapper: flip to the left of the crosshair on the right half
    const ratio = svgX / VIEW_W;
    tip.style.left = ratio < 0.55 ? 'calc(' + (ratio * 100) + '% + 14px)' : 'auto';
    tip.style.right = ratio < 0.55 ? 'auto' : 'calc(' + ((1 - ratio) * 100) + '% + 14px)';
  }

  function renderAll() {
    renderTicker();
    renderStats();
    renderBook();
    renderChart();
  }

  // ---- interaction ---------------------------------------------------
  function setPressed(groupId, attr, value) {
    document.querySelectorAll('#' + groupId + ' .toggle').forEach((b) => {
      b.setAttribute('aria-pressed', String(b.getAttribute(attr) === value));
    });
  }

  function announce() {
    status.textContent = PAIRS[state.pair].label + ' chart, interval ' + state.interval + ', ' + candles.length + ' candles.';
  }

  document.getElementById('interval-group').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-interval]');
    if (!btn || btn.dataset.interval === state.interval) return;
    state.interval = btn.dataset.interval;
    state.hover = null;
    state.tick = 0;
    setPressed('interval-group', 'data-interval', state.interval);
    buildSeries();
    renderAll();
    announce();
  });

  document.getElementById('pair-group').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-pair]');
    if (!btn || btn.dataset.pair === state.pair) return;
    state.pair = btn.dataset.pair;
    state.hover = null;
    state.tick = 0;
    setPressed('pair-group', 'data-pair', state.pair);
    buildSeries();
    buildBook();
    renderAll();
    announce();
  });

  function pointerToHover(e) {
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * VIEW_W;
    const y = ((e.clientY - rect.top) / rect.height) * VIEW_H;
    const slot = (VIEW_W - PAD.left - PAD.right) / candles.length;
    const index = Math.floor((x - PAD.left) / slot);
    if (index < 0 || index >= candles.length) return null;
    return { index, y };
  }

  svg.addEventListener('pointermove', (e) => { state.hover = pointerToHover(e); renderChart(); });
  svg.addEventListener('pointerleave', () => { state.hover = null; renderChart(); });
  svg.addEventListener('pointerdown', (e) => { state.hover = pointerToHover(e); renderChart(); });

  svg.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Escape') return;
    e.preventDefault();
    if (e.key === 'Escape') { state.hover = null; renderChart(); return; }
    const last = candles.length - 1;
    const cur = state.hover ? state.hover.index : last + (e.key === 'ArrowLeft' ? 1 : -1);
    const next = Math.min(Math.max(cur + (e.key === 'ArrowRight' ? 1 : -1), 0), last);
    state.hover = { index: next, y: 0 };
    // park the horizontal crosshair on the candle close
    const hi = Math.max(...candles.map((c) => c.high));
    const lo = Math.min(...candles.map((c) => c.low));
    const padPx = (hi - lo) * 0.08 || hi * 0.01;
    const plotH = VIEW_H - PAD.top - PAD.bottom;
    state.hover.y = PAD.top + ((hi + padPx - candles[next].close) / (hi - lo + 2 * padPx)) * plotH;
    renderChart();
  });
  svg.addEventListener('blur', () => { state.hover = null; renderChart(); });

  buildSeries();
  buildBook();
  renderAll();
  announce();

  setInterval(() => { if (!document.hidden) tickEngines(); }, 1000);
}
