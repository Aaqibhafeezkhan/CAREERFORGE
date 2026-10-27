document.addEventListener('DOMContentLoaded', () => {
  console.log('VortexDEX Exchange Pro engine ready');
});

/* ===== BEGIN issue #98: DeFi staking / yield farming simulator ===== */
(function () {
  'use strict';
  var form = document.getElementById('yf-form');
  if (!form) return;

  // Made-up demo numbers. APR is the nominal yearly rate, APY is what daily compounding turns it into.
  var POOLS = {
    'eth-usdc': { name: 'ETH / USDC', baseApr: 0.12 },
    'sol-usdt': { name: 'SOL / USDT', baseApr: 0.18 }
  };
  var LOCKS = { 30: 0.0, 90: 0.025, 365: 0.06 }; // lockup bonus added to the pool APR
  var MIN_AMOUNT = 1;
  var MAX_AMOUNT = 1e9;

  var usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
  var els = {
    amount: document.getElementById('yf-amount'),
    msg: document.getElementById('yf-amount-msg'),
    apy: document.getElementById('yf-apy'),
    apr: document.getElementById('yf-apr'),
    daily: document.getElementById('yf-daily'),
    monthly: document.getElementById('yf-monthly'),
    total: document.getElementById('yf-total'),
    totalLabel: document.getElementById('yf-total-label'),
    end: document.getElementById('yf-end'),
    note: document.getElementById('yf-note'),
    compare: document.getElementById('yf-compare')
  };

  function checked(name) {
    var el = form.querySelector('input[name="' + name + '"]:checked');
    return el ? el.value : null;
  }
  function pct(x) { return (x * 100).toFixed(2) + '%'; }

  // Pure math helpers.
  function apyFromApr(apr) { return Math.pow(1 + apr / 365, 365) - 1; }
  function reward(principal, apr, days, mode) {
    if (mode === 'simple') return principal * apr * days / 365;
    return principal * (Math.pow(1 + apr / 365, days) - 1);
  }

  function readAmount() {
    var raw = els.amount.value.trim();
    var n = Number(raw);
    if (raw === '' || !isFinite(n)) return { error: 'Enter a number, for example 10000.' };
    if (n < MIN_AMOUNT) return { error: 'Minimum deposit is ' + usd.format(MIN_AMOUNT) + '.' };
    if (n > MAX_AMOUNT) return { error: 'Maximum for this simulator is ' + usd.format(MAX_AMOUNT) + '.' };
    return { value: n };
  }

  function clearOutput() {
    ['apy', 'apr', 'daily', 'monthly', 'total', 'end'].forEach(function (k) { els[k].textContent = '--'; });
    els.note.textContent = '';
    els.compare.textContent = '';
  }

  function cell(tag, text) {
    var c = document.createElement(tag);
    c.textContent = text;
    return c;
  }

  function render() {
    var pool = POOLS[checked('yf-pool')];
    var lock = checked('yf-lock');
    var mode = checked('yf-mode');
    var amt = readAmount();

    if (amt.error) {
      els.msg.textContent = amt.error;
      els.amount.setAttribute('aria-invalid', 'true');
      clearOutput();
      return;
    }
    els.msg.textContent = '';
    els.amount.removeAttribute('aria-invalid');

    var P = amt.value;
    var days = Number(lock);
    var apr = pool.baseApr + LOCKS[lock];
    var total = reward(P, apr, days, mode);

    els.apy.textContent = pct(apyFromApr(apr)) + ' APY';
    els.apr.textContent = 'APR ' + pct(apr) + ' (' + pct(pool.baseApr) + ' base + ' + pct(LOCKS[lock]) + ' lockup bonus)';
    els.daily.textContent = usd.format(reward(P, apr, 1, mode));
    els.monthly.textContent = usd.format(reward(P, apr, 30, mode));
    els.totalLabel.textContent = 'Total reward over ' + days + ' days';
    els.total.textContent = usd.format(total);
    els.end.textContent = usd.format(P + total);
    els.note.textContent = (mode === 'compound'
      ? 'Compounding: each day\'s reward is added to the stake, so the daily figure shown is for day 1.'
      : 'Simple: the reward is the same every day because it is never re-staked.')
      + ' Simulated figures for ' + pool.name + ', not real earnings.';

    els.compare.textContent = '';
    Object.keys(LOCKS).forEach(function (d) {
      var a = pool.baseApr + LOCKS[d];
      var tr = document.createElement('tr');
      if (d === lock) tr.className = 'yf-active';
      tr.appendChild(cell('th', d + ' days')).setAttribute('scope', 'row');
      tr.appendChild(cell('td', pct(a)));
      tr.appendChild(cell('td', pct(apyFromApr(a))));
      tr.appendChild(cell('td', usd.format(reward(P, a, Number(d), mode))));
      els.compare.appendChild(tr);
    });
  }

  form.addEventListener('input', render);
  form.addEventListener('change', render);
  form.addEventListener('submit', function (e) { e.preventDefault(); });
  render();
})();
/* ===== END issue #98 ===== */
