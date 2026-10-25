document.addEventListener('DOMContentLoaded', () => {
  console.log('CloudPulse SaaS Launchpad initialized');

  // Carousel Elements
  const track = document.getElementById('testimonialsTrack');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('prevTestimonialBtn');
  const nextBtn = document.getElementById('nextTestimonialBtn');
  const indicators = document.querySelectorAll('.indicator-dot');
  const counter = document.getElementById('slideCounter');
  const autoRotateToggle = document.getElementById('autoRotateToggle');
  const toggleIcon = document.getElementById('toggleIcon');
  const toggleLabel = document.getElementById('toggleLabel');
  const timerProgressFill = document.getElementById('timerProgressFill');
  const viewport = document.getElementById('testimonialsViewport');
  const carouselWrapper = document.querySelector('.testimonial-carousel-wrapper');

  if (!track || slides.length === 0) return;

  const totalSlides = slides.length;
  let currentIndex = 0;
  const ROTATION_INTERVAL_MS = 5000;
  const PROGRESS_TICK_MS = 50;
  let elapsedMs = 0;
  let isAutoplayActive = true;
  let isHovered = false;
  let timerInterval = null;

  // Format counter (e.g., 01 / 05)
  function updateCounter() {
    if (counter) {
      const currentFormatted = String(currentIndex + 1).padStart(2, '0');
      const totalFormatted = String(totalSlides).padStart(2, '0');
      counter.textContent = `${currentFormatted} / ${totalFormatted}`;
    }
  }

  // Update Slide Position and Active States
  function updateSlider(animate = true) {
    if (!animate) {
      track.style.transition = 'none';
    } else {
      track.style.transition = 'transform 0.55s cubic-bezier(0.33, 1, 0.68, 1)';
    }

    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    slides.forEach((slide, idx) => {
      const isActive = idx === currentIndex;
      slide.classList.toggle('active', isActive);
      slide.setAttribute('aria-hidden', !isActive);
      if (isActive) {
        slide.removeAttribute('inert');
      } else {
        slide.setAttribute('inert', '');
      }
    });

    indicators.forEach((dot, idx) => {
      const isActive = idx === currentIndex;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    updateCounter();
    resetProgressBar();
  }

  // Go to specific slide
  function goToSlide(index) {
    currentIndex = (index + totalSlides) % totalSlides;
    updateSlider();
  }

  // Next / Prev functions
  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  // Reset Progress Bar
  function resetProgressBar() {
    elapsedMs = 0;
    if (timerProgressFill) {
      timerProgressFill.style.width = '0%';
    }
  }

  // Timer Tick Function for 5s Auto-rotation
  function startAutoplayTimer() {
    stopAutoplayTimer();
    timerInterval = setInterval(() => {
      if (!isAutoplayActive || isHovered) {
        return;
      }

      elapsedMs += PROGRESS_TICK_MS;
      const progressPercent = Math.min((elapsedMs / ROTATION_INTERVAL_MS) * 100, 100);

      if (timerProgressFill) {
        timerProgressFill.style.width = `${progressPercent}%`;
      }

      if (elapsedMs >= ROTATION_INTERVAL_MS) {
        nextSlide();
      }
    }, PROGRESS_TICK_MS);
  }

  function stopAutoplayTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  // Toggle Autoplay State
  function toggleAutoplay() {
    isAutoplayActive = !isAutoplayActive;
    if (isAutoplayActive) {
      if (toggleIcon) toggleIcon.textContent = '⏸';
      if (toggleLabel) toggleLabel.textContent = 'Auto-rotate (5s)';
      autoRotateToggle.setAttribute('aria-label', 'Pause 5-second auto-rotation');
      resetProgressBar();
      startAutoplayTimer();
    } else {
      if (toggleIcon) toggleIcon.textContent = '▶';
      if (toggleLabel) toggleLabel.textContent = 'Paused';
      autoRotateToggle.setAttribute('aria-label', 'Resume 5-second auto-rotation');
      if (timerProgressFill) timerProgressFill.style.width = '0%';
    }
  }

  // Event Listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
    });
  }

  indicators.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      goToSlide(idx);
    });
  });

  if (autoRotateToggle) {
    autoRotateToggle.addEventListener('click', toggleAutoplay);
  }

  // Pause on hover / pointerenter, resume on pointerleave
  if (carouselWrapper) {
    carouselWrapper.addEventListener('mouseenter', () => {
      isHovered = true;
    });

    carouselWrapper.addEventListener('mouseleave', () => {
      isHovered = false;
    });
  }

  // Keyboard navigation when user is focused on or interacting with carousel
  document.addEventListener('keydown', (e) => {
    if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
      return;
    }

    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  });

  // Touch Swipe Support for Mobile Screens
  let touchStartX = 0;
  let touchEndX = 0;
  const SWIPE_THRESHOLD = 50;

  if (viewport) {
    viewport.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      isHovered = true;
    }, { passive: true });

    viewport.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      isHovered = false;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      if (diff > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }
  }

  // Initial State Setup
  updateSlider(false);
  startAutoplayTimer();
});
