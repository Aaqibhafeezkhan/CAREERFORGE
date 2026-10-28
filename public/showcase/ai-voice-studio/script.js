function playVoiceSample() {
  alert('Playing Sonora AI Voice Sample demo audio!');
}

document.addEventListener('DOMContentLoaded', initTtsStudio);

function initTtsStudio() {
  const form = document.getElementById('tts-form');
  if (!form) return;

  const textEl = document.getElementById('tts-text');
  const countEl = document.getElementById('tts-count');
  const voiceEl = document.getElementById('tts-voice');
  const voiceNote = document.getElementById('tts-voice-note');
  const rateEl = document.getElementById('tts-rate');
  const pitchEl = document.getElementById('tts-pitch');
  const rateOut = document.getElementById('tts-rate-out');
  const pitchOut = document.getElementById('tts-pitch-out');
  const playBtn = document.getElementById('tts-play');
  const pauseBtn = document.getElementById('tts-pause');
  const stopBtn = document.getElementById('tts-stop');
  const eq = document.getElementById('tts-eq');
  const statusEl = document.getElementById('tts-status');
  const unsupportedEl = document.getElementById('tts-unsupported');

  form.addEventListener('submit', (e) => e.preventDefault());

  // Slider read-outs and character counter work even without speech support.
  function updateReadouts() {
    rateOut.textContent = Number(rateEl.value).toFixed(1) + 'x';
    pitchOut.textContent = Number(pitchEl.value).toFixed(1);
  }
  function updateCount() {
    countEl.textContent = textEl.value.length + ' / ' + textEl.maxLength;
  }
  rateEl.addEventListener('input', updateReadouts);
  pitchEl.addEventListener('input', updateReadouts);
  textEl.addEventListener('input', updateCount);
  updateReadouts();
  updateCount();

  const supported = Boolean(window.speechSynthesis && window.SpeechSynthesisUtterance);
  if (!supported) {
    unsupportedEl.hidden = false;
    [textEl, voiceEl, rateEl, pitchEl, playBtn, pauseBtn, stopBtn].forEach((el) => { el.disabled = true; });
    statusEl.textContent = 'Speech synthesis is unavailable in this browser.';
    const opt = document.createElement('option');
    opt.textContent = 'No voices available';
    voiceEl.appendChild(opt);
    return;
  }

  const synth = window.speechSynthesis;
  let voices = [];
  let state = 'idle'; // idle | speaking | paused
  let current = null; // the utterance we started most recently

  // ---- voices -----------------------------------------------------
  function populateVoices() {
    voices = synth.getVoices();
    const previous = voiceEl.value;
    voiceEl.textContent = '';

    if (!voices.length) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = 'Browser default voice';
      voiceEl.appendChild(opt);
      voiceNote.textContent = 'No voice list yet. The browser default will be used; the list fills in if voices load later.';
      return;
    }

    voices.forEach((v) => {
      const opt = document.createElement('option');
      opt.value = v.voiceURI;
      opt.textContent = v.name + ' (' + v.lang + ')' + (v.default ? ' - default' : '');
      voiceEl.appendChild(opt);
    });

    // Keep the user's pick if it still exists, otherwise prefer the browser default,
    // then a voice matching the page language.
    const lang = (navigator.language || 'en-US').toLowerCase();
    const wanted = voices.find((v) => v.voiceURI === previous)
      || voices.find((v) => v.default)
      || voices.find((v) => v.lang.toLowerCase() === lang)
      || voices[0];
    voiceEl.value = wanted.voiceURI;
    voiceNote.textContent = voices.length + ' voice' + (voices.length === 1 ? '' : 's') + ' available on this device.';
  }

  populateVoices();
  // Chrome and some others load voices asynchronously and fire this event when ready.
  if (typeof synth.addEventListener === 'function') synth.addEventListener('voiceschanged', populateVoices);
  else synth.onvoiceschanged = populateVoices;

  // ---- state / UI ----------------------------------------------------
  function setState(next, message) {
    state = next;
    eq.classList.toggle('active', next === 'speaking');
    playBtn.textContent = next === 'paused' ? 'Resume' : 'Play';
    pauseBtn.disabled = next !== 'speaking';
    stopBtn.disabled = next === 'idle';
    playBtn.disabled = next === 'speaking';
    if (message) statusEl.textContent = message;
  }

  function speak() {
    if (state === 'paused') {
      synth.resume();
      setState('speaking', 'Speaking...');
      return;
    }
    const text = textEl.value.trim();
    if (!text) {
      statusEl.textContent = 'Type some text first, then press Play.';
      textEl.focus();
      return;
    }

    synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const chosen = voices.find((v) => v.voiceURI === voiceEl.value);
    if (chosen) { utter.voice = chosen; utter.lang = chosen.lang; }
    utter.rate = parseFloat(rateEl.value);
    utter.pitch = parseFloat(pitchEl.value);

    utter.onstart = () => setState('speaking', 'Speaking...');
    utter.onend = () => { if (current === utter) setState('idle', 'Finished.'); };
    utter.onerror = (ev) => {
      if (current !== utter) return;
      // 'canceled' / 'interrupted' just mean Stop was pressed or a new utterance replaced this one.
      if (ev.error === 'canceled' || ev.error === 'interrupted') return;
      setState('idle', 'Speech failed (' + (ev.error || 'unknown error') + ').');
    };

    current = utter;
    // Set the UI right away: some browsers are slow to fire "start".
    setState('speaking', 'Speaking...');
    synth.speak(utter);
  }

  playBtn.addEventListener('click', speak);

  pauseBtn.addEventListener('click', () => {
    if (state !== 'speaking') return;
    synth.pause();
    setState('paused', 'Paused. Press Resume to continue.');
  });

  stopBtn.addEventListener('click', () => {
    current = null;
    // Some browsers stay stuck in the paused state after cancel() unless resumed first.
    if (state === 'paused') synth.resume();
    synth.cancel();
    setState('idle', 'Stopped.');
  });

  // Rate and pitch only apply to the next utterance.
  [rateEl, pitchEl, voiceEl].forEach((el) => el.addEventListener('change', () => {
    if (state !== 'idle') statusEl.textContent = 'New settings apply the next time you press Play.';
  }));

  window.addEventListener('pagehide', () => synth.cancel());
  setState('idle');
}
