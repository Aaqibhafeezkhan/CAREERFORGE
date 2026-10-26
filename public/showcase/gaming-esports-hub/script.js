function watchStream() {
  alert('Connecting to Vortex Esports Twitch stream feed...');
}

document.addEventListener('DOMContentLoaded', initComparator);

// Demo roster (made-up numbers).
const PLAYERS = [
  { id: 'nova',   name: 'NOVA',   team: 'Team Cyber',     aim: 94, reaction: 148, kd: 1.92, clutch: 58, win: 71 },
  { id: 'specter', name: 'SPECTER', team: 'Phantom Squad', aim: 89, reaction: 136, kd: 1.64, clutch: 49, win: 66 },
  { id: 'blaze',  name: 'BLAZE',  team: 'Neon Riders',    aim: 91, reaction: 162, kd: 1.78, clutch: 41, win: 62 },
  { id: 'titan',  name: 'TITAN',  team: 'Apex Titans',    aim: 82, reaction: 171, kd: 1.31, clutch: 63, win: 74 },
  { id: 'hex',    name: 'HEX',    team: 'Team Cyber',     aim: 86, reaction: 154, kd: 1.47, clutch: 37, win: 58 },
  { id: 'ryo',    name: 'RYO',    team: 'Phantom Squad',  aim: 97, reaction: 142, kd: 2.05, clutch: 44, win: 69 },
  { id: 'vex',    name: 'VEX',    team: 'Neon Riders',    aim: 78, reaction: 189, kd: 1.12, clutch: 52, win: 55 },
  { id: 'echo',   name: 'ECHO',   team: 'Apex Titans',    aim: 84, reaction: 158, kd: 1.38, clutch: 66, win: 72 }
];

// One entry per radar axis. `min`/`max` map the raw value onto 0..1 for the chart.
// Reaction time is inverted (lower ms is better), so its range runs from the slow end to the fast end.
const STATS = [
  { key: 'aim',      label: 'Aim Accuracy',  unit: '%',  decimals: 0, higherIsBetter: true,  min: 50,  max: 100 },
  { key: 'reaction', label: 'Reaction Time', unit: ' ms', decimals: 0, higherIsBetter: false, min: 220, max: 120 },
  { key: 'kd',       label: 'K/D Ratio',     unit: '',   decimals: 2, higherIsBetter: true,  min: 0.5, max: 2.5 },
  { key: 'clutch',   label: 'Clutch Rate',   unit: '%',  decimals: 0, higherIsBetter: true,  min: 0,   max: 80 },
  { key: 'win',      label: 'Win %',         unit: '%',  decimals: 0, higherIsBetter: true,  min: 30,  max: 90 }
];

// Raw value -> 0..1 (clamped). Works for inverted stats because min > max there.
function normalize(stat, value) {
  const t = (value - stat.min) / (stat.max - stat.min);
  return Math.min(Math.max(t, 0), 1);
}

// Vertex of the radar polygon for axis `i` of `n` at fraction `t` of the radius.
// Axis 0 points straight up, the rest go clockwise.
function radarPoint(i, n, t, cx, cy, radius) {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
  return { x: cx + radius * t * Math.cos(angle), y: cy + radius * t * Math.sin(angle) };
}

// Which side wins a stat: 'a', 'b' or 'tie'.
function betterSide(stat, a, b) {
  if (a === b) return 'tie';
  const aWins = stat.higherIsBetter ? a > b : a < b;
  return aWins ? 'a' : 'b';
}

function formatStat(stat, value) {
  return value.toFixed(stat.decimals) + stat.unit;
}

function svgNode(name, attrs, text) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', name);
  Object.keys(attrs || {}).forEach((k) => el.setAttribute(k, attrs[k]));
  if (text !== undefined) el.textContent = text;
  return el;
}

function initComparator() {
  const selA = document.getElementById('player-a');
  const selB = document.getElementById('player-b');
  if (!selA || !selB) return;

  const svg = document.getElementById('radar');
  const CX = 220;
  const CY = 200;
  const R = 118;
  const RINGS = 4;

  [selA, selB].forEach((sel) => {
    PLAYERS.forEach((p) => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.name + ' (' + p.team + ')';
      sel.appendChild(opt);
    });
  });
  selA.value = 'nova';
  selB.value = 'titan';

  const byId = (id) => PLAYERS.find((p) => p.id === id);

  function drawStatic() {
    // Everything the chart needs besides the two polygons, drawn once.
    const frame = svgNode('g', { id: 'radar-frame' });
    for (let ring = 1; ring <= RINGS; ring++) {
      const pts = STATS.map((_, i) => {
        const p = radarPoint(i, STATS.length, ring / RINGS, CX, CY, R);
        return p.x.toFixed(1) + ',' + p.y.toFixed(1);
      }).join(' ');
      frame.appendChild(svgNode('polygon', { points: pts, class: 'radar-ring' }));
    }
    STATS.forEach((stat, i) => {
      const end = radarPoint(i, STATS.length, 1, CX, CY, R);
      frame.appendChild(svgNode('line', { x1: CX, y1: CY, x2: end.x.toFixed(1), y2: end.y.toFixed(1), class: 'radar-axis' }));
      const lab = radarPoint(i, STATS.length, 1.2, CX, CY, R);
      const anchor = Math.abs(lab.x - CX) < 4 ? 'middle' : lab.x > CX ? 'start' : 'end';
      frame.appendChild(svgNode('text', { x: lab.x.toFixed(1), y: (lab.y + 4).toFixed(1), 'text-anchor': anchor, class: 'radar-label' }, stat.label));
    });
    svg.appendChild(frame);
    svg.appendChild(svgNode('g', { id: 'radar-data' }));
  }
  drawStatic();

  function drawPlayer(group, player, cls) {
    const pts = STATS.map((stat, i) => radarPoint(i, STATS.length, normalize(stat, player[stat.key]), CX, CY, R));
    group.appendChild(svgNode('polygon', {
      points: pts.map((p) => p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' '),
      class: 'radar-shape ' + cls
    }));
    pts.forEach((p, i) => {
      const dot = svgNode('circle', { cx: p.x.toFixed(1), cy: p.y.toFixed(1), r: 4.5, class: 'radar-dot ' + cls });
      dot.appendChild(svgNode('title', {}, player.name + ' - ' + STATS[i].label + ': ' + formatStat(STATS[i], player[STATS[i].key])));
      group.appendChild(dot);
    });
  }

  function setText(id, text) { document.getElementById(id).textContent = text; }

  function render() {
    const a = byId(selA.value);
    const b = byId(selB.value);

    setText('team-a', a.team);
    setText('team-b', b.team);
    setText('legend-a', a.name);
    setText('legend-b', b.name);
    setText('th-a', a.name);
    setText('th-b', b.name);

    const data = document.getElementById('radar-data');
    data.textContent = '';
    drawPlayer(data, a, 'series-a');
    drawPlayer(data, b, 'series-b');

    const body = document.getElementById('compare-body');
    body.textContent = '';
    let winsA = 0;
    let winsB = 0;
    STATS.forEach((stat) => {
      const side = betterSide(stat, a[stat.key], b[stat.key]);
      if (side === 'a') winsA++;
      if (side === 'b') winsB++;

      const tr = document.createElement('tr');
      const th = document.createElement('th');
      th.scope = 'row';
      th.textContent = stat.label + (stat.higherIsBetter ? '' : ' (lower is better)');
      tr.appendChild(th);

      [['a', a], ['b', b]].forEach(([key, player]) => {
        const td = document.createElement('td');
        td.textContent = formatStat(stat, player[stat.key]);
        if (side === key) {
          td.className = 'better better-' + key;
          const tag = document.createElement('span');
          tag.className = 'better-tag';
          tag.textContent = ' ✓';
          const sr = document.createElement('span');
          sr.className = 'sr-only';
          sr.textContent = ' (better)';
          td.append(tag, sr);
        }
        tr.appendChild(td);
      });
      body.appendChild(tr);
    });

    let summary;
    if (a.id === b.id) summary = 'Same player picked twice, so every stat is a tie. Pick someone else to compare.';
    else if (winsA === winsB) summary = a.name + ' and ' + b.name + ' are level: ' + winsA + ' stat wins each.';
    else summary = (winsA > winsB ? a.name : b.name) + ' leads, winning ' + Math.max(winsA, winsB) + ' of ' + STATS.length + ' stats.';
    setText('compare-summary', summary);

    setText('radar-desc', a.name + ' versus ' + b.name + ' across ' + STATS.map((s) => s.label).join(', ') + '. ' + summary);
  }

  selA.addEventListener('change', render);
  selB.addEventListener('change', render);
  render();
}
