const speeds = [1, 1.25, 1.5, 2];
let currentSpeedIndex = 0;

function toggleSpeed() {
  currentSpeedIndex = (currentSpeedIndex + 1) % speeds.length;
  const currentSpeed = speeds[currentSpeedIndex];
  const speedBtn = document.getElementById('speed-btn');
  if (speedBtn) {
    speedBtn.textContent = `${currentSpeed}x`;
    speedBtn.setAttribute('aria-label', `Playback speed: ${currentSpeed}x`);
  }
  const audio = document.querySelector('audio');
  if (audio) {
    audio.playbackRate = currentSpeed;
  }
  return currentSpeed;
}

function playEpisode(epName) {
  alert(`Playing ${epName} in Waveform Audio Player!`);
}
