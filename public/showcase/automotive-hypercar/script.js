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

/* ===== Virtual Wind Tunnel (issue #99) START ===== */
(function () {
  'use strict';

  // ---- All simulation constants live in this one block ----
  var AIR_DENSITY = 1.225;        // kg/m^3, sea level, 15 C
  var FRONTAL_AREA = 2.0;         // m^2, assumed frontal area of the car
  var MPH_TO_MS = 0.44704;        // metres per second per mph
  var GRAVITY = 9.80665;          // m/s^2, to turn newtons into kg of force
  var SPEED_MIN = 100;            // mph
  var SPEED_MAX = 300;            // mph
  var SPEED_DEFAULT = 200;        // mph
  var FLOW_PX_PER_MPH = 3;        // animation: canvas px per second for each mph of wind
  // Per wing state: cd = drag coefficient, cl = downforce coefficient (both made-up demo values).
  // wingY / wingAngle describe the drawn wing; wake is how turbulent the air behind the car looks.
  var STATES = {
    retract:  { label: 'Retract',  note: 'Wing flat, lowest drag',      cd: 0.28, cl: 0.15, wingY: 186, wingAngle: 0,  wake: 2 },
    deploy:   { label: 'Deploy',   note: 'Wing up, more downforce',     cd: 0.36, cl: 0.75, wingY: 168, wingAngle: 14, wake: 5 },
    airbrake: { label: 'Airbrake', note: 'Wing steep, maximum braking', cd: 0.50, cl: 0.95, wingY: 160, wingAngle: 55, wake: 12 }
  };
  var DEFAULT_STATE = 'retract';

  // ---- Pure physics ----
  function mphToMs(mph) { return mph * MPH_TO_MS; }

  function calcAero(stateKey, mph) {
    var s = STATES[stateKey];
    var v = mphToMs(mph);
    var q = 0.5 * AIR_DENSITY * v * v;            // dynamic pressure in pascals
    var dragN = q * s.cd * FRONTAL_AREA;           // drag = 0.5 * rho * v^2 * Cd * A
    var downN = q * s.cl * FRONTAL_AREA;           // downforce uses the same form with Cl
    return { v: v, q: q, cd: s.cd, dragN: dragN, downN: downN, downKg: downN / GRAVITY, powerKw: dragN * v / 1000 };
  }

  // ---- Car shape (canvas units, the canvas is 800 x 320) ----
  var W = 800, H = 320, GROUND = 284;
  var BODY_TOP = [[150, 232], [175, 214], [250, 198], [320, 170], [380, 148], [450, 146], [520, 168], [580, 184], [620, 190], [650, 198]];
  var WHEELS = [[240, 254], [560, 254]];
  var WING_X = 585, WING_LEN = 70;
  var LINES_Y0 = [200, 170, 140, 110, 80, 50];   // streamline resting heights, lowest first
  var STEP = 4;                                   // px between precomputed streamline samples
  var N_SAMPLES = Math.floor(W / STEP) + 1;
  var PARTICLES_PER_LINE = 12;

  var state = { key: DEFAULT_STATE, mph: SPEED_DEFAULT, paused: false };
  var wing = { y: STATES[DEFAULT_STATE].wingY, angle: STATES[DEFAULT_STATE].wingAngle };
  var els = {};
  var ctx = null, rafId = 0, lastT = 0, clock = 0;
  var particles = [];
  var ys = [];                                    // ys[line][sample]

  function bodyTopAt(x) {
    if (x < BODY_TOP[0][0] || x > BODY_TOP[BODY_TOP.length - 1][0]) return Infinity;
    for (var i = 1; i < BODY_TOP.length; i++) {
      if (x <= BODY_TOP[i][0]) {
        var a = BODY_TOP[i - 1], b = BODY_TOP[i];
        return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]);
      }
    }
    return Infinity;
  }

  function wingTopAt(x) {
    var rad = wing.angle * Math.PI / 180;
    var x1 = WING_X + WING_LEN * Math.cos(rad);
    if (x < WING_X || x > x1) return Infinity;
    return wing.y - (x - WING_X) * Math.tan(rad);
  }

  function smoothstep(t) { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); }

  function computeStreamlines() {
    var wake = STATES[state.key].wake;
    ys = LINES_Y0.map(function (y0, k) {
      var gap = 8 + 12 * k;
      var raw = [];
      for (var i = 0; i < N_SAMPLES; i++) {
        var x = i * STEP;
        var obstacle = Math.min(bodyTopAt(x), wingTopAt(x));
        raw.push(Math.min(y0, obstacle - gap));
      }
      var out = raw;
      for (var pass = 0; pass < 2; pass++) {          // two box blurs make the bends smooth
        var next = [];
        for (var j = 0; j < N_SAMPLES; j++) {
          var sum = 0, n = 0;
          for (var d = -6; d <= 6; d++) {
            var idx = j + d;
            if (idx >= 0 && idx < N_SAMPLES) { sum += out[idx]; n++; }
          }
          next.push(sum / n);
        }
        out = next;
      }
      for (var m = 0; m < N_SAMPLES; m++) {              // turbulence behind the tail, strongest near the body
        var xx = m * STEP;
        var ramp = smoothstep((xx - 650) / 90) * Math.max(0, 1 - k / 3);
        out[m] += wake * ramp * Math.sin(xx * 0.07 - clock * 9);
      }
      return out;
    });
  }

  function yAt(line, x) {
    var f = Math.max(0, Math.min(N_SAMPLES - 1, x / STEP));
    var i = Math.floor(f);
    var j = Math.min(i + 1, N_SAMPLES - 1);
    return ys[line][i] + (ys[line][j] - ys[line][i]) * (f - i);
  }

  function initParticles() {
    particles = [];
    for (var k = 0; k < LINES_Y0.length; k++) {
      for (var i = 0; i < PARTICLES_PER_LINE; i++) {
        particles.push({ line: k, x: (i / PARTICLES_PER_LINE) * W + k * 17 });
      }
    }
  }

  function flowSpeed() { return state.mph * FLOW_PX_PER_MPH; }   // canvas px per second

  // ---- Drawing ----
  function drawCar() {
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(BODY_TOP[0][0], BODY_TOP[0][1]);
    for (var i = 1; i < BODY_TOP.length; i++) ctx.lineTo(BODY_TOP[i][0], BODY_TOP[i][1]);
    ctx.lineTo(650, 226); ctx.lineTo(640, 246); ctx.lineTo(160, 246); ctx.lineTo(150, 234);
    ctx.closePath();
    ctx.fillStyle = '#14080a';
    ctx.fill();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = 'rgba(239,68,68,0.6)';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;
    // canopy
    ctx.beginPath();
    ctx.moveTo(335, 170); ctx.lineTo(382, 153); ctx.lineTo(448, 151); ctx.lineTo(500, 170); ctx.closePath();
    ctx.fillStyle = 'rgba(34,211,238,0.14)';
    ctx.fill();
    WHEELS.forEach(function (w) {
      ctx.beginPath(); ctx.arc(w[0], w[1], 30, 0, Math.PI * 2);
      ctx.fillStyle = '#0a0a0a'; ctx.fill();
      ctx.strokeStyle = '#6b7280'; ctx.lineWidth = 3; ctx.stroke();
      ctx.beginPath(); ctx.arc(w[0], w[1], 12, 0, Math.PI * 2);
      ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2; ctx.stroke();
    });
    // wing: pylon + blade
    var rad = wing.angle * Math.PI / 180;
    var x1 = WING_X + WING_LEN * Math.cos(rad);
    var y1 = wing.y - WING_LEN * Math.sin(rad);
    ctx.beginPath(); ctx.moveTo(WING_X + 14, 192); ctx.lineTo(WING_X + 14, wing.y + 2);
    ctx.strokeStyle = '#6b7280'; ctx.lineWidth = 3; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(WING_X, wing.y); ctx.lineTo(x1, y1);
    ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.shadowColor = 'rgba(239,68,68,0.8)'; ctx.shadowBlur = 8; ctx.stroke();
    ctx.shadowBlur = 0; ctx.lineCap = 'butt';
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0b0b0d';
    ctx.fillRect(0, GROUND, W, H - GROUND);
    ctx.beginPath(); ctx.moveTo(0, GROUND); ctx.lineTo(W, GROUND);
    ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 1; ctx.stroke();

    // faint guide lines
    ctx.strokeStyle = 'rgba(34,211,238,0.10)';
    ctx.lineWidth = 1;
    for (var k = 0; k < ys.length; k++) {
      ctx.beginPath();
      for (var i = 0; i < N_SAMPLES; i++) {
        if (i === 0) ctx.moveTo(0, ys[k][0]); else ctx.lineTo(i * STEP, ys[k][i]);
      }
      ctx.stroke();
    }

    drawCar();

    // moving streaks, length grows with speed
    var len = 14 + flowSpeed() * 0.05;
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(34,211,238,0.9)';
    ctx.shadowColor = 'rgba(34,211,238,0.9)';
    ctx.shadowBlur = 6;
    for (var p = 0; p < particles.length; p++) {
      var pt = particles[p];
      var tail = pt.x - len;
      ctx.beginPath();
      ctx.moveTo(tail, yAt(pt.line, tail));
      for (var x = tail + STEP; x < pt.x; x += STEP) ctx.lineTo(x, yAt(pt.line, x));
      ctx.lineTo(pt.x, yAt(pt.line, pt.x));
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
    ctx.lineCap = 'butt';
  }

  function step(ts) {
    var dt = lastT ? Math.min((ts - lastT) / 1000, 0.05) : 0;
    lastT = ts;
    clock += dt;
    var target = STATES[state.key];
    var k = Math.min(1, dt * 8);
    wing.y += (target.wingY - wing.y) * k;
    wing.angle += (target.wingAngle - wing.angle) * k;
    var move = flowSpeed() * dt;
    for (var i = 0; i < particles.length; i++) {
      particles[i].x += move;
      if (particles[i].x - 120 > W) particles[i].x -= W + 120;
    }
    computeStreamlines();
    draw();
    rafId = requestAnimationFrame(step);
  }

  function renderStatic() {                      // used when paused: snap the wing and draw one frame
    wing.y = STATES[state.key].wingY;
    wing.angle = STATES[state.key].wingAngle;
    computeStreamlines();
    draw();
  }

  function startLoop() { if (!rafId) { lastT = 0; rafId = requestAnimationFrame(step); } }
  function stopLoop() { if (rafId) { cancelAnimationFrame(rafId); rafId = 0; } }

  // ---- Readouts ----
  function fmt(n) { return Math.round(n).toLocaleString('en-US'); }

  function updateReadouts() {
    var r = calcAero(state.key, state.mph);
    var s = STATES[state.key];
    var base = calcAero(DEFAULT_STATE, state.mph);
    els.cd.textContent = s.cd.toFixed(2);
    els.drag.textContent = fmt(r.dragN) + ' N';
    els.down.textContent = fmt(r.downKg) + ' kg';
    els.power.textContent = fmt(r.powerKw) + ' kW';
    els.speedOut.textContent = state.mph + ' mph';
    els.speed.setAttribute('aria-valuetext', state.mph + ' miles per hour');
    els.formula.textContent = 'Drag = 0.5 × ' + AIR_DENSITY + ' kg/m³ × (' + r.v.toFixed(1) + ' m/s)² × ' +
      s.cd.toFixed(2) + ' × ' + FRONTAL_AREA.toFixed(1) + ' m² = ' + fmt(r.dragN) + ' N';
    if (state.key === DEFAULT_STATE) {
      els.delta.textContent = 'Baseline setup: wing retracted.';
    } else {
      var pct = (r.dragN / base.dragN - 1) * 100;
      els.delta.textContent = 'Versus a retracted wing at ' + state.mph + ' mph: drag +' + pct.toFixed(1) + '% (+' +
        fmt(r.dragN - base.dragN) + ' N), downforce +' + fmt(r.downKg - base.downKg) + ' kg.';
    }
    els.caption.textContent = s.label.toUpperCase() + ' | ' + state.mph + ' MPH | AIRFLOW ' + Math.round(flowSpeed()) + ' PX/S';
    els.canvas.dataset.flowSpeed = String(flowSpeed());
    els.canvas.setAttribute('aria-label', 'Side view of the hypercar in an airflow tunnel, wing ' + s.label.toLowerCase() +
      ', wind ' + state.mph + ' miles per hour. Drag ' + fmt(r.dragN) + ' newtons, downforce ' + fmt(r.downKg) + ' kilograms.');
  }

  function announce() {
    var r = calcAero(state.key, state.mph);
    els.live.textContent = STATES[state.key].label + ' at ' + state.mph + ' mph: Cd ' + r.cd.toFixed(2) +
      ', drag ' + fmt(r.dragN) + ' newtons, downforce ' + fmt(r.downKg) + ' kilograms.';
  }

  function refresh() {
    updateReadouts();
    if (state.paused) renderStatic();
  }

  function setPaused(p) {
    state.paused = p;
    els.pause.setAttribute('aria-pressed', String(p));
    els.pause.textContent = p ? 'Play airflow' : 'Pause airflow';
    if (p) { stopLoop(); renderStatic(); } else { startLoop(); }
  }

  function buildStateControls() {
    Object.keys(STATES).forEach(function (key) {
      var s = STATES[key];
      var wrap = document.createElement('div');
      wrap.className = 'wt-state';
      var input = document.createElement('input');
      input.type = 'radio';
      input.name = 'wt-state';
      input.id = 'wt-state-' + key;
      input.value = key;
      input.checked = key === state.key;
      var label = document.createElement('label');
      label.htmlFor = input.id;
      var strong = document.createElement('strong');
      strong.textContent = s.label;
      var span = document.createElement('span');
      span.textContent = s.note + ' (Cd ' + s.cd.toFixed(2) + ')';
      label.appendChild(strong);
      label.appendChild(span);
      wrap.appendChild(input);
      wrap.appendChild(label);
      els.states.appendChild(wrap);
      input.addEventListener('change', function () {
        state.key = key;
        refresh();
        announce();
      });
    });
  }

  function init() {
    els.canvas = document.getElementById('wt-canvas');
    if (!els.canvas || !els.canvas.getContext) return;
    ['states', 'speed', 'pause', 'cd', 'drag', 'down', 'power', 'formula', 'delta', 'live', 'caption', 'note'].forEach(function (k) {
      els[k] = document.getElementById('wt-' + k);
    });
    els.speedOut = document.getElementById('wt-speed-out');

    els.speed.min = SPEED_MIN;
    els.speed.max = SPEED_MAX;
    els.speed.value = SPEED_DEFAULT;
    els.note.textContent = 'Approximate demo model: air density ' + AIR_DENSITY + ' kg/m³, frontal area ' + FRONTAL_AREA.toFixed(1) +
      ' m², and the Cd / downforce coefficients are made-up values chosen for illustration.';

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    els.canvas.width = W * dpr;
    els.canvas.height = H * dpr;
    ctx = els.canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    buildStateControls();
    els.speed.addEventListener('input', function () { state.mph = Number(els.speed.value); refresh(); });
    els.speed.addEventListener('change', announce);
    els.pause.addEventListener('click', function () { setPaused(!state.paused); });

    initParticles();
    updateReadouts();
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setPaused(!!reduce);
    if (!reduce) startLoop();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
/* ===== Virtual Wind Tunnel (issue #99) END ===== */
