function enrollNow() {
  alert('Synapse Academy Enrollment Modal Triggered!');
}

// ---------------------------------------------------------------
// Interactive quiz
// ---------------------------------------------------------------
const QUIZ_SECONDS = 60;
const PASS_PERCENT = 80;

const QUESTIONS = [
  {
    q: 'During autoregressive LLM decoding, what does the KV cache store?',
    options: [
      'The model weights for each layer',
      'Attention keys and values of tokens already processed',
      'The tokenizer vocabulary',
      'Gradients from the last training step'
    ],
    answer: 1,
    why: 'The KV cache keeps the attention keys and values of earlier tokens, so each new token only computes its own instead of redoing the whole prompt.'
  },
  {
    q: 'A database keeps accepting writes on both sides of a network partition and merges them later. Which CAP trade-off is that?',
    options: [
      'CP: consistency over availability',
      'CA: no partition tolerance',
      'AP: availability over consistency',
      'None, partitions cannot be handled'
    ],
    answer: 2,
    why: 'Staying available during a partition and reconciling afterwards gives up strict consistency, which is the AP side of CAP.'
  },
  {
    q: 'What does the Rust borrow checker mainly prevent?',
    options: [
      'Use-after-free and data races, at compile time',
      'Slow network calls',
      'Integer overflow at runtime',
      'Unused imports'
    ],
    answer: 0,
    why: 'Ownership and borrowing rules are checked at compile time, which rules out dangling references and data races in safe Rust.'
  },
  {
    q: 'What is eBPF mainly used for?',
    options: [
      'Compiling Rust to WebAssembly',
      'Encrypting disk volumes',
      'Replacing the Linux scheduler with user threads',
      'Running verified sandboxed programs inside the kernel'
    ],
    answer: 3,
    why: 'eBPF programs are checked by the kernel verifier and then run in-kernel for tracing, networking and security, with no kernel module needed.'
  },
  {
    q: 'What is the main effect of quantizing a model from FP16 to INT8?',
    options: [
      'Higher numeric precision',
      'Smaller memory footprint and faster inference, with a small accuracy cost',
      'Longer context windows for free',
      'It removes the need for a GPU'
    ],
    answer: 1,
    why: 'INT8 weights take half the memory of FP16 and move through memory faster, usually costing a little accuracy.'
  }
];

const quizState = {
  index: 0,
  score: 0,
  answered: false,
  remainingMs: QUIZ_SECONDS * 1000,
  lastTick: 0,
  timerId: null,
  active: false
};

function qs(id) { return document.getElementById(id); }

function formatClock(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

function showPanel(name) {
  ['quizIntro', 'quizPlay', 'quizResult'].forEach((id) => {
    qs(id).hidden = id !== name;
  });
}

function renderTimer() {
  qs('quizTimer').textContent = formatClock(quizState.remainingMs);
  const fill = qs('timerFill');
  fill.style.width = `${(quizState.remainingMs / (QUIZ_SECONDS * 1000)) * 100}%`;
  const low = quizState.remainingMs <= 10000;
  fill.classList.toggle('low', low);
  qs('quizTimer').classList.toggle('low', low);
}

function stopTimer() {
  if (quizState.timerId) clearInterval(quizState.timerId);
  quizState.timerId = null;
}

function startTimer() {
  stopTimer();
  quizState.lastTick = Date.now();
  quizState.timerId = setInterval(() => {
    const now = Date.now();
    // the clock only runs while a question is waiting for an answer
    if (!quizState.answered) quizState.remainingMs -= now - quizState.lastTick;
    quizState.lastTick = now;
    if (quizState.remainingMs <= 0) {
      quizState.remainingMs = 0;
      renderTimer();
      finishQuiz(true);
      return;
    }
    renderTimer();
  }, 200);
}

function startQuiz() {
  quizState.index = 0;
  quizState.score = 0;
  quizState.answered = false;
  quizState.remainingMs = QUIZ_SECONDS * 1000;
  quizState.active = true;
  showPanel('quizPlay');
  renderQuestion();
  renderTimer();
  startTimer();
}

function renderQuestion() {
  const item = QUESTIONS[quizState.index];
  quizState.answered = false;
  qs('quizCounter').textContent = `Question ${quizState.index + 1} of ${QUESTIONS.length}`;
  qs('quizQuestion').textContent = item.q;
  qs('quizFeedback').textContent = '';
  qs('quizFeedback').className = 'quiz-feedback';
  qs('quizNext').hidden = true;

  const list = qs('quizOptions');
  list.replaceChildren();
  item.options.forEach((text, i) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'quiz-option';
    btn.dataset.index = String(i);
    const key = document.createElement('span');
    key.className = 'opt-key';
    key.setAttribute('aria-hidden', 'true');
    key.textContent = String(i + 1);
    const label = document.createElement('span');
    label.textContent = text;
    btn.append(key, label);
    btn.addEventListener('click', () => chooseOption(i));
    li.appendChild(btn);
    list.appendChild(li);
  });
  qs('quizQuestion').focus();
}

function chooseOption(i) {
  if (!quizState.active || quizState.answered) return;
  const item = QUESTIONS[quizState.index];
  quizState.answered = true;
  const correct = i === item.answer;
  if (correct) quizState.score += 1;

  qs('quizOptions').querySelectorAll('.quiz-option').forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === item.answer) btn.classList.add('correct');
    else if (idx === i) btn.classList.add('wrong');
  });

  const fb = qs('quizFeedback');
  fb.className = `quiz-feedback ${correct ? 'good' : 'bad'}`;
  fb.textContent = `${correct ? 'Correct.' : 'Not quite.'} ${item.why}`;

  const last = quizState.index === QUESTIONS.length - 1;
  const next = qs('quizNext');
  next.textContent = last ? 'See results' : 'Next question';
  next.hidden = false;
  next.focus();
}

function nextQuestion() {
  if (!quizState.active) return;
  if (quizState.index >= QUESTIONS.length - 1) {
    finishQuiz(false);
    return;
  }
  quizState.index += 1;
  renderQuestion();
}

function finishQuiz(timedOut) {
  stopTimer();
  quizState.active = false;
  const total = QUESTIONS.length;
  const percent = Math.round((quizState.score / total) * 100);
  const passed = percent >= PASS_PERCENT;
  const unanswered = timedOut ? total - quizState.index - (quizState.answered ? 1 : 0) : 0;

  showPanel('quizResult');
  qs('resultHeading').textContent = timedOut ? "Time's up" : passed ? 'Quiz passed' : 'Quiz complete';
  qs('resultScore').textContent = `${quizState.score} / ${total} (${percent}%)`;
  let detail = passed
    ? 'Nice work, you cleared the 80% mark. Add your name to get your certificate.'
    : 'You need 80% or more for the certificate. Have another go.';
  if (timedOut) detail = `The 60 seconds ran out with ${unanswered} question${unanswered === 1 ? '' : 's'} unanswered. ${detail}`;
  qs('resultDetail').textContent = detail;

  qs('certForm').hidden = !passed;
  qs('certificate').hidden = true;
  qs('resultHeading').focus();
}

function showCertificate(name) {
  const clean = name.trim().replace(/\s+/g, ' ');
  if (!clean) return false;
  qs('certNameOut').textContent = clean;
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const percent = Math.round((quizState.score / QUESTIONS.length) * 100);
  qs('certMeta').textContent = `Score ${quizState.score}/${QUESTIONS.length} (${percent}%) on ${date}`;
  qs('certificate').hidden = false;
  return true;
}

(function initQuiz() {
  if (!qs('quiz')) return;
  qs('quizStart').addEventListener('click', startQuiz);
  qs('quizNext').addEventListener('click', nextQuestion);
  qs('quizRetry').addEventListener('click', () => {
    qs('certName').value = '';
    showPanel('quizIntro');
    qs('quizStart').focus();
  });
  qs('certForm').addEventListener('submit', (event) => {
    event.preventDefault();
    if (!showCertificate(qs('certName').value)) {
      qs('certName').focus();
      return;
    }
    qs('certificate').scrollIntoView({ block: 'nearest' });
  });
  document.addEventListener('keydown', (event) => {
    if (!quizState.active || quizState.answered) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const n = Number(event.key);
    if (n >= 1 && n <= QUESTIONS[quizState.index].options.length) chooseOption(n - 1);
  });
})();
