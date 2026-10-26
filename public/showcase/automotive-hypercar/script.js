/* ===== Performance Comparator (issue #52) START ===== */
(function () {
  'use strict';

  // ---- Data block. Every figure is approximate (see the note on the page). ----
  var CARS = {
    apex:   { name: 'Apex Zero (concept)',      cls: '',              zeroSixty: 1.74, quarterMile: 8.9, topSpeed: 258, gForce: 1.8 },
    chiron: { name: 'Bugatti Chiron Super Sport', cls: 'cmp-rival-a', zeroSixty: 2.4,  quarterMile: 9.5, topSpeed: 273, gForce: 1.5 },
    jesko:  { name: 'Koenigsegg Jesko',         cls: 'cmp-rival-b',   zeroSixty: 2.5,  quarterMile: 9.3, topSpeed: 300, gForce: 1.6 }
  };
  var HERO = 'apex';
  var RIVALS = ['chiron', 'jesko'];
  var ALL_RIVALS = 'both';
  var DEFAULT_RIVAL = 'chiron';

  // lowerIsBetter rows are inverted: the bar is best / value, so the best car always fills 100%.
  var METRICS = [
    { key: 'zeroSixty',   label: '0-60 MPH',     unit: ' s',   decimals: 2, lowerIsBetter: true },
    { key: 'quarterMile', label: 'QUARTER MILE', unit: ' s',   decimals: 1, lowerIsBetter: true },
    { key: 'topSpeed',    label: 'TOP SPEED',    unit: ' mph', decimals: 0, lowerIsBetter: false },
    { key: 'gForce',      label: 'PEAK G-FORCE', unit: ' g',   decimals: 1, lowerIsBetter: false }
  ];

  var els = {};
  var rowRefs = {};   // metric key -> { carId -> { wrap, fill, val, tag } }

  // ---- Pure helpers ----
  function activeCars(selection) {
    return selection === ALL_RIVALS ? [HERO].concat(RIVALS) : [HERO, selection];
  }

  function bestValue(metric, ids) {
    var values = ids.map(function (id) { return CARS[id][metric.key]; });
    return metric.lowerIsBetter ? Math.min.apply(null, values) : Math.max.apply(null, values);
  }

  // Bar width in percent, relative to the best value in the row.
  function barPercent(metric, value, best) {
    return (metric.lowerIsBetter ? best / value : value / best) * 100;
  }

  function fmt(metric, value) { return value.toFixed(metric.decimals) + metric.unit; }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  // ---- Build once, then only update widths so the bars animate between selections ----
  function build() {
    METRICS.forEach(function (m) {
      var row = el('li', 'cmp-row');
      var head = el('div', 'cmp-row-head');
      head.appendChild(el('span', 'cmp-metric', m.label));
      head.appendChild(el('span', 'cmp-hint', m.lowerIsBetter ? 'lower is better, bar inverted' : 'higher is better'));
      row.appendChild(head);
      rowRefs[m.key] = {};
      [HERO].concat(RIVALS).forEach(function (id) {
        var wrap = el('div', 'cmp-car ' + CARS[id].cls);
        wrap.appendChild(el('span', 'cmp-name', CARS[id].name));
        var track = el('span', 'cmp-track');
        track.setAttribute('aria-hidden', 'true');
        var fill = el('span', 'cmp-fill');
        track.appendChild(fill);
        wrap.appendChild(track);
        var val = el('span', 'cmp-val');
        var num = el('span', null, '');
        var tag = el('span', 'cmp-best', 'BEST');
        val.appendChild(num);
        val.appendChild(tag);
        wrap.appendChild(val);
        row.appendChild(wrap);
        rowRefs[m.key][id] = { wrap: wrap, fill: fill, num: num, tag: tag };
      });
      els.grid.appendChild(row);
    });
  }

  function update() {
    var selection = els.select.value;
    var ids = activeCars(selection);
    var wins = 0;
    METRICS.forEach(function (m) {
      var best = bestValue(m, ids);
      var refs = rowRefs[m.key];
      Object.keys(refs).forEach(function (id) {
        var r = refs[id];
        var shown = ids.indexOf(id) !== -1;
        r.wrap.hidden = !shown;
        if (!shown) return;
        var v = CARS[id][m.key];
        r.num.textContent = fmt(m, v);
        r.fill.style.width = barPercent(m, v, best).toFixed(1) + '%';
        r.tag.hidden = v !== best;
      });
      if (CARS[HERO][m.key] === best) wins++;
    });
    var rivalNames = ids.slice(1).map(function (id) { return CARS[id].name; }).join(' and ');
    els.summary.textContent = 'Apex Zero leads in ' + wins + ' of ' + METRICS.length + ' metrics against ' + rivalNames + '.';
    els.key.textContent = 'Bar length shows how close a car is to the best value in that row (100% is the best). 0-60 and quarter mile are inverted because a lower time is better.';
  }

  function init() {
    els.grid = document.getElementById('cmp-grid');
    if (!els.grid) return;
    els.select = document.getElementById('cmp-rival');
    els.summary = document.getElementById('cmp-summary');
    els.key = document.getElementById('cmp-key');

    RIVALS.forEach(function (id) {
      var o = document.createElement('option');
      o.value = id;
      o.textContent = CARS[id].name;
      els.select.appendChild(o);
    });
    var both = document.createElement('option');
    both.value = ALL_RIVALS;
    both.textContent = 'Both benchmarks (3-way)';
    els.select.appendChild(both);
    els.select.value = DEFAULT_RIVAL;

    build();
    update();   // first pass: bars sit at 0 until the next frame so they animate in
    var fills = els.grid.querySelectorAll('.cmp-fill');
    for (var i = 0; i < fills.length; i++) fills[i].style.width = '0%';
    requestAnimationFrame(function () { requestAnimationFrame(update); });
    els.select.addEventListener('change', update);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
/* ===== Performance Comparator (issue #52) END ===== */

function reserveHypercar() {
  alert('Apex Zero Hypercar Reservation Allocation Request Received!');
}
