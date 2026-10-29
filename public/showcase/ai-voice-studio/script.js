// Sonora AI Voice Studio & Neural Tuner Engine
// Real-time Pitch, Speed & Emotion Modulation

const VOICE_MODELS = {
  aria: {
    id: 'aria',
    name: 'Aria',
    tagline: 'Studio Warmth • Conversational',
    lang: 'en-US',
    basePitch: 1.0,
    baseSpeed: 1.0,
    baseFreq: 220,
    sampleText: 'Hello! I am Aria. You are listening to real-time neural synthesis with custom pitch and pacing.'
  },
  marcus: {
    id: 'marcus',
    name: 'Marcus',
    tagline: 'Deep Broadcast • Narration',
    lang: 'en-GB',
    basePitch: 0.85,
    baseSpeed: 0.95,
    baseFreq: 130,
    sampleText: 'Greetings. This is Marcus. Delivering broadcast authority, deep vocal formants, and resonance.'
  },
  elena: {
    id: 'elena',
    name: 'Elena',
    tagline: 'Cybernetic Synth • AI Assistant',
    lang: 'en-US',
    basePitch: 1.15,
    baseSpeed: 1.05,
    baseFreq: 280,
    sampleText: 'System operational. Elena neural synth online, calibrated for ultra-crisp phonetic clarity.'
  },
  leo: {
    id: 'leo',
    name: 'Leo',
    tagline: 'Energetic Streamer • Dynamic',
    lang: 'en-US',
    basePitch: 1.25,
    baseSpeed: 1.20,
    baseFreq: 260,
    sampleText: "What's up! Leo here, running at maximum throttle with high-energy dynamic inflection!"
  }
};

const EMOTION_PRESETS = {
  neutral: {
    pitch: 1.00,
    speed: 1.00,
    title: 'Neutral 😐',
    feedback: 'Neutral emotion applied: balanced fundamental frequency and natural conversational pacing.'
  },
  cheerful: {
    pitch: 1.25,
    speed: 1.15,
    title: 'Cheerful 😊',
    feedback: 'Cheerful emotion applied: +3.9 semitone pitch contour and bright, uplifted tempo.'
  },
  professional: {
    pitch: 0.90,
    speed: 0.95,
    title: 'Professional 👔',
    feedback: 'Professional emotion applied: measured cadence with authoritative, grounded acoustic resonance.'
  },
  energetic: {
    pitch: 1.35,
    speed: 1.30,
    title: 'Energetic ⚡',
    feedback: 'Energetic emotion applied: high-impact pitch shift with rapid, dynamic speech rhythm.'
  }
};

// Global preview sample trigger
window.playVoiceSample = function playVoiceSample() {
  const previewBtn = document.getElementById('btnPreviewTunedVoice');
  if (previewBtn) {
    previewBtn.click();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initVoiceStudioTuner();
  initTtsStudio();
});

// ---------- Voice Studio Tuner Engine ----------
function initVoiceStudioTuner() {
  const tunerSection = document.getElementById('studioTuner');
  if (!tunerSection) return;

  const pitchInput = document.getElementById('tunerPitch');
  const speedInput = document.getElementById('tunerSpeed');
  const pitchVal = document.getElementById('tunerPitchVal');
  const speedVal = document.getElementById('tunerSpeedVal');
  const pitchSemitoneBadge = document.getElementById('pitchSemitoneBadge');
  const speedWpmBadge = document.getElementById('speedWpmBadge');
  const emotionBtns = document.querySelectorAll('.emotion-btn');
  const modelCards = document.querySelectorAll('.voice-model-card');
  const activeModelNameEl = document.getElementById('activeModelName');
  const activeEmotionNameEl = document.getElementById('activeEmotionName');
  const telemetryFreqEl = document.getElementById('telemetryFreq');
  const visualizerEl = document.getElementById('telemetryVisualizer');
  const previewBtn = document.getElementById('btnPreviewTunedVoice');
  const syncBtn = document.getElementById('btnSyncWithTTS');
  const resetBtn = document.getElementById('btnResetTuner');
  const feedbackEl = document.getElementById('tunerFeedback');

  let currentModelId = 'aria';
  let currentEmotion = 'neutral';
  let isPlayingAudio = false;

  // Update slider fill and telemetry readouts
  function updateSliderDisplay() {
    const pitch = parseFloat(pitchInput.value);
    const speed = parseFloat(speedInput.value);
    const model = VOICE_MODELS[currentModelId] || VOICE_MODELS.aria;

    // Pitch readouts
    pitchVal.textContent = pitch.toFixed(2) + 'x';
    // Semitones: 12 * log2(pitch)
    const semitones = 12 * (Math.log(pitch) / Math.LN2);
    pitchSemitoneBadge.textContent = (semitones >= 0 ? '+' : '') + semitones.toFixed(1) + ' st';

    // Speed readouts
    speedVal.textContent = speed.toFixed(2) + 'x';
    const estimatedWpm = Math.round(150 * speed);
    speedWpmBadge.textContent = estimatedWpm + ' WPM';

    // Telemetry frequency estimation
    const estimatedFreq = Math.round(model.baseFreq * pitch);
    telemetryFreqEl.textContent = estimatedFreq + ' Hz';

    // Custom track gradients
    const pitchPct = ((pitch - 0.5) / 1.5) * 100;
    pitchInput.style.background = `linear-gradient(to right, #06b6d4 0%, #3b82f6 ${pitchPct}%, #1e293b ${pitchPct}%, #1e293b 100%)`;

    const speedPct = ((speed - 0.5) / 1.5) * 100;
    speedInput.style.background = `linear-gradient(to right, #06b6d4 0%, #3b82f6 ${speedPct}%, #1e293b ${speedPct}%, #1e293b 100%)`;

    // Reactive visual feedback on active model card
    triggerCardReactiveFeedback(pitch, speed);
  }

  // Reactive feedback on model cards
  function triggerCardReactiveFeedback(pitch, speed) {
    const activeCard = document.querySelector(`.voice-model-card[data-model-id="${currentModelId}"]`);
    if (!activeCard) return;

    const waveBars = activeCard.querySelectorAll('.model-wave-anim i');
    waveBars.forEach((bar, idx) => {
      // Dynamic height based on pitch and bar index
      const baseHeight = 25 + (pitch - 0.5) * 40;
      const waveSpread = (idx % 2 === 0 ? 1 : 1.3);
      bar.style.height = Math.min(100, Math.max(15, baseHeight * waveSpread)) + '%';
      // Speed impacts animation duration
      bar.style.animationDuration = (0.9 / speed).toFixed(2) + 's';
    });
  }

  // Model Selection
  function selectModel(modelId) {
    if (!VOICE_MODELS[modelId]) return;
    currentModelId = modelId;
    const model = VOICE_MODELS[modelId];

    modelCards.forEach((card) => {
      const isCurrent = card.dataset.modelId === modelId;
      card.classList.toggle('active', isCurrent);
      const btn = card.querySelector('.select-model-btn');
      if (btn) {
        btn.textContent = isCurrent ? 'Selected' : 'Select Model';
      }
    });

    activeModelNameEl.textContent = `${model.name} (${model.tagline.split('•')[0].trim()})`;
    feedbackEl.textContent = `Active voice model switched to ${model.name}. Adjust Pitch and Speed sliders to calibrate voice output.`;

    updateSliderDisplay();
  }

  modelCards.forEach((card) => {
    card.addEventListener('click', () => {
      // Don't duplicate if clicking the button inside
      const modelId = card.dataset.modelId;
      if (modelId) selectModel(modelId);
    });

    const btn = card.querySelector('.select-model-btn');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const modelId = card.dataset.modelId;
        if (modelId) selectModel(modelId);
      });
    }
  });

  // Sliders Input Listeners
  pitchInput.addEventListener('input', () => {
    // If manually adjusted, clear active emotion button highlight if it doesn't match
    checkCustomEmotionState();
    updateSliderDisplay();
  });

  speedInput.addEventListener('input', () => {
    checkCustomEmotionState();
    updateSliderDisplay();
  });

  function checkCustomEmotionState() {
    const p = parseFloat(pitchInput.value);
    const s = parseFloat(speedInput.value);
    let matched = false;

    emotionBtns.forEach((btn) => {
      const ep = parseFloat(btn.dataset.pitch);
      const es = parseFloat(btn.dataset.speed);
      if (Math.abs(p - ep) < 0.02 && Math.abs(s - es) < 0.02) {
        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');
        currentEmotion = btn.dataset.emotion;
        activeEmotionNameEl.textContent = EMOTION_PRESETS[currentEmotion].title;
        matched = true;
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-checked', 'false');
      }
    });

    if (!matched) {
      currentEmotion = 'custom';
      activeEmotionNameEl.textContent = 'Custom 🎛️';
    }
  }

  // Emotion Preset Selection
  emotionBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const emotionKey = btn.dataset.emotion;
      const preset = EMOTION_PRESETS[emotionKey];
      if (!preset) return;

      currentEmotion = emotionKey;

      emotionBtns.forEach((b) => {
        const isActive = b === btn;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-checked', isActive ? 'true' : 'false');
      });

      // Smooth slider update
      pitchInput.value = preset.pitch.toFixed(2);
      speedInput.value = preset.speed.toFixed(2);

      activeEmotionNameEl.textContent = preset.title;
      feedbackEl.textContent = preset.feedback;

      updateSliderDisplay();
    });
  });

  // Audio synthesis helper for audio preview
  function playTunedAudio() {
    if (isPlayingAudio) return;

    const model = VOICE_MODELS[currentModelId] || VOICE_MODELS.aria;
    const pitch = parseFloat(pitchInput.value);
    const speed = parseFloat(speedInput.value);

    isPlayingAudio = true;
    previewBtn.disabled = true;
    visualizerEl.classList.add('active');
    feedbackEl.textContent = `Synthesizing ${model.name} [Pitch: ${pitch.toFixed(2)}x, Speed: ${speed.toFixed(2)}x, ${currentEmotion}]...`;

    // Attempt Web Speech API first
    if (window.speechSynthesis && window.SpeechSynthesisUtterance) {
      const synth = window.speechSynthesis;
      synth.cancel();

      const utter = new SpeechSynthesisUtterance(model.sampleText);
      const voices = synth.getVoices();

      // Find matching voice if available
      const voice = voices.find((v) => v.lang.startsWith(model.lang.slice(0, 2))) || voices[0];
      if (voice) utter.voice = voice;

      utter.pitch = Math.min(2, Math.max(0, pitch));
      utter.rate = Math.min(2, Math.max(0.5, speed));

      utter.onend = () => {
        isPlayingAudio = false;
        previewBtn.disabled = false;
        visualizerEl.classList.remove('active');
        feedbackEl.textContent = `Completed playback of ${model.name} sample.`;
      };

      utter.onerror = () => {
        fallbackOscillatorSynthesis(pitch, speed);
      };

      synth.speak(utter);
    } else {
      fallbackOscillatorSynthesis(pitch, speed);
    }
  }

  // Web Audio API harmonic synthesis fallback
  function fallbackOscillatorSynthesis(pitch, speed) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) throw new Error('No AudioContext');
      const ctx = new AudioCtx();

      const duration = 1.8 / speed;
      const baseFreq = (VOICE_MODELS[currentModelId]?.baseFreq || 220) * pitch;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.2, ctx.currentTime + duration * 0.5);
      osc.frequency.exponentialRampToValueAtTime(baseFreq, ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);

      setTimeout(() => {
        isPlayingAudio = false;
        previewBtn.disabled = false;
        visualizerEl.classList.remove('active');
        feedbackEl.textContent = `Synthetic waveform audition finished.`;
      }, duration * 1000);
    } catch {
      isPlayingAudio = false;
      previewBtn.disabled = false;
      visualizerEl.classList.remove('active');
      feedbackEl.textContent = `Audio audition finished.`;
    }
  }

  previewBtn.addEventListener('click', playTunedAudio);

  // Sync to TTS Studio Form below
  syncBtn.addEventListener('click', () => {
    const ttsRate = document.getElementById('tts-rate');
    const ttsPitch = document.getElementById('tts-pitch');

    if (ttsRate && ttsPitch) {
      ttsRate.value = speedInput.value;
      ttsPitch.value = pitchInput.value;

      // Dispatch event to trigger lower form readouts
      ttsRate.dispatchEvent(new Event('input', { bubbles: true }));
      ttsPitch.dispatchEvent(new Event('input', { bubbles: true }));

      feedbackEl.textContent = `✓ Tuner settings synced to Text-to-Speech Studio (Rate: ${speedInput.value}x, Pitch: ${pitchInput.value}x).`;

      // Smooth scroll down to TTS studio
      const studioSection = document.getElementById('studio');
      if (studioSection) {
        studioSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

  // Reset to Defaults
  resetBtn.addEventListener('click', () => {
    pitchInput.value = '1.0';
    speedInput.value = '1.0';
    selectModel('aria');

    const neutralBtn = document.querySelector('.emotion-btn[data-emotion="neutral"]');
    if (neutralBtn) neutralBtn.click();

    updateSliderDisplay();
    feedbackEl.textContent = `Tuner reset to default parameters (Pitch: 1.00x, Speed: 1.00x, Neutral).`;
  });

  // Initialize
  updateSliderDisplay();
}

// ---------- Existing Text-to-Speech Studio ----------
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

    const lang = (navigator.language || 'en-US').toLowerCase();
    const wanted = voices.find((v) => v.voiceURI === previous)
      || voices.find((v) => v.default)
      || voices.find((v) => v.lang.toLowerCase() === lang)
      || voices[0];
    voiceEl.value = wanted.voiceURI;
    voiceNote.textContent = voices.length + ' voice' + (voices.length === 1 ? '' : 's') + ' available on this device.';
  }

  populateVoices();
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
      if (ev.error === 'canceled' || ev.error === 'interrupted') return;
      setState('idle', 'Speech failed (' + (ev.error || 'unknown error') + ').');
    };

    current = utter;
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
    if (state === 'paused') synth.resume();
    synth.cancel();
    setState('idle', 'Stopped.');
  });

  [rateEl, pitchEl, voiceEl].forEach((el) => el.addEventListener('change', () => {
    if (state !== 'idle') statusEl.textContent = 'New settings apply the next time you press Play.';
  }));

  window.addEventListener('pagehide', () => synth.cancel());
  setState('idle');
}
