function runSecurityScan() {
  alert('Sentinel Vulnerability Scanner Engine active! Scanning ports & SSL certificates...');
}

// ---------------------------------------------------------------
// Password strength analyzer
// ---------------------------------------------------------------
const OFFLINE_RATE = 1e10; // guesses per second, fast hash on a GPU rig
const ONLINE_RATE = 100; // guesses per second against a rate limited login
const SECONDS_PER_YEAR = 31557600;

const COMMON_PASSWORDS = new Set([
  'password', 'passw0rd', 'password1', 'password123', '123456', '1234567', '12345678', '123456789',
  '1234567890', '12345', '1234', '111111', '000000', '123123', '654321', 'qwerty', 'qwerty123',
  'qwertyuiop', 'abc123', 'letmein', 'monkey', 'dragon', 'iloveyou', 'admin', 'welcome', 'login',
  'football', 'baseball', 'master', 'sunshine', 'princess', 'trustno1', '1q2w3e4r', 'zaq12wsx',
  'qazwsx', 'hello', 'freedom', 'whatever', 'shadow', 'superman', 'batman', 'starwars', 'changeme',
  'secret', 'access', 'flower', 'mustang', 'soccer', 'hockey', 'killer', 'test', 'guest', 'root',
  'asdfgh', 'asdfghjkl', 'zxcvbnm', 'pass', 'default', 'computer', 'internet', 'cheese', 'summer'
]);

const KEYBOARD_ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm', '1234567890'];

function poolSize(pw) {
  let pool = 0;
  if (/[a-z]/.test(pw)) pool += 26;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/[0-9]/.test(pw)) pool += 10;
  if (/[ !-\/:-@\[-`{-~]/.test(pw)) pool += 33;
  if (/[^\x00-\x7F]/.test(pw)) pool += 100; // rough allowance for non-ASCII characters
  return pool;
}

function shannonPerChar(pw) {
  if (!pw) return 0;
  const counts = {};
  for (const ch of pw) counts[ch] = (counts[ch] || 0) + 1;
  const len = [...pw].length;
  let h = 0;
  Object.values(counts).forEach((n) => {
    const p = n / len;
    h -= p * Math.log2(p);
  });
  return h;
}

function isKeyboardRun(a, b, c) {
  const trio = (a + b + c).toLowerCase();
  const rev = trio.split('').reverse().join('');
  return KEYBOARD_ROWS.some((row) => row.includes(trio) || row.includes(rev));
}

// Number of characters that are predictable: the third+ character of a run
// of one repeated character, or of an ascending/descending/keyboard run.
function countPredictable(chars) {
  let n = 0;
  for (let i = 1; i < chars.length; i++) {
    if (i >= 2 && chars[i] === chars[i - 1] && chars[i] === chars[i - 2]) { n++; continue; }
    if (i >= 2) {
      const d1 = chars[i].charCodeAt(0) - chars[i - 1].charCodeAt(0);
      const d2 = chars[i - 1].charCodeAt(0) - chars[i - 2].charCodeAt(0);
      const stepRun = Math.abs(d1) === 1 && d1 === d2;
      if (stepRun || isKeyboardRun(chars[i - 2], chars[i - 1], chars[i])) n++;
    }
  }
  return n;
}

function isCommonPassword(pw) {
  const lower = pw.toLowerCase();
  const unleet = (str) => str.replace(/@/g, 'a').replace(/\$/g, 's').replace(/0/g, 'o').replace(/3/g, 'e').replace(/!/g, 'i');
  const stripped = (str) => str.replace(/[0-9!@#$%^&*._-]+$/, '');
  const base = stripped(lower);
  return [lower, unleet(lower), base, unleet(base)].some((c) => c && COMMON_PASSWORDS.has(c));
}

function analyzePassword(pw) {
  const chars = [...pw];
  const length = chars.length;
  const pool = poolSize(pw);
  const predictable = countPredictable(chars);
  const common = isCommonPassword(pw);

  const checks = {
    length: length >= 12,
    lower: /[a-z]/.test(pw),
    upper: /[A-Z]/.test(pw),
    digit: /[0-9]/.test(pw),
    symbol: /[^A-Za-z0-9]/.test(pw),
    common: length > 0 && !common,
    pattern: length > 0 && predictable === 0
  };

  // Entropy: each unpredictable character is worth log2(pool) bits.
  // A password found in a leaked list is guessed in the first few
  // hundred tries, so its entropy is capped at about 10 bits.
  let bits = pool > 0 ? (length - predictable) * Math.log2(pool) : 0;
  if (common) bits = Math.min(bits, 10);

  const guesses = Math.pow(2, bits) / 2; // on average half the space is searched
  const level = length === 0 ? 0 : bits < 28 ? 1 : bits < 36 ? 2 : bits < 60 ? 3 : bits < 80 ? 4 : 5;

  return {
    length, pool, predictable, common, checks, bits, level,
    shannon: shannonPerChar(pw),
    offlineSeconds: guesses / OFFLINE_RATE,
    onlineSeconds: guesses / ONLINE_RATE
  };
}

function formatDuration(seconds) {
  if (!(seconds >= 1)) return 'Instantly';
  const round = (n) => (n >= 100 ? Math.round(n) : Math.round(n * 10) / 10);
  if (seconds < 60) return `${round(seconds)} seconds`;
  if (seconds < 3600) return `${round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${round(seconds / 3600)} hours`;
  if (seconds < SECONDS_PER_YEAR) return `${round(seconds / 86400)} days`;
  const years = seconds / SECONDS_PER_YEAR;
  if (years < 1e3) return `${round(years)} years`;
  if (years < 1e6) return `${round(years / 1e3)} thousand years`;
  if (years < 1e9) return `${round(years / 1e6)} million years`;
  if (years < 1e12) return `${round(years / 1e9)} billion years`;
  return 'More than a trillion years';
}

const LEVEL_LABELS = ['No password yet', 'Very weak', 'Weak', 'Fair', 'Strong', 'Very strong'];

function renderAnalysis(pw) {
  const r = analyzePassword(pw);
  const meter = document.getElementById('strengthMeter');
  meter.dataset.level = String(r.level);
  meter.querySelectorAll('.seg').forEach((seg, i) => seg.classList.toggle('on', i < r.level));

  const verdict = document.getElementById('verdict');
  verdict.textContent = r.length === 0
    ? 'Type a password to begin the audit.'
    : `${LEVEL_LABELS[r.level]}: about ${Math.round(r.bits)} bits of entropy.`;

  document.getElementById('statEntropy').textContent = `${r.bits.toFixed(1)} bits`;
  document.getElementById('statShannon').textContent = `${r.shannon.toFixed(2)} bits`;
  document.getElementById('statLength').textContent = String(r.length);
  document.getElementById('statPool').textContent = String(r.pool);
  document.getElementById('statOffline').textContent = r.length ? formatDuration(r.offlineSeconds) : '-';
  document.getElementById('statOnline').textContent = r.length ? formatDuration(r.onlineSeconds) : '-';

  document.querySelectorAll('#passwordAudit .checklist li').forEach((li) => {
    const ok = Boolean(r.checks[li.dataset.rule]);
    li.classList.toggle('pass', ok);
    li.querySelector('.mark').textContent = ok ? '✓' : '✕';
    li.querySelector('.status-text').textContent = ok ? ' (met)' : ' (not met)';
  });
  return r;
}

(function initPasswordAudit() {
  const input = document.getElementById('pwInput');
  const toggle = document.getElementById('pwToggle');
  if (!input || !toggle) return;
  input.addEventListener('input', () => renderAnalysis(input.value));
  toggle.addEventListener('click', () => {
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    toggle.textContent = show ? 'Hide' : 'Show';
    toggle.setAttribute('aria-pressed', String(show));
  });
  renderAnalysis('');
})();
