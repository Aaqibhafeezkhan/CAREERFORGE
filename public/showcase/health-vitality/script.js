// VitalityAI Longevity Assessment & Biological Age Wizard Engine
const TOTAL_STEPS = 6;
let currentStep = 1;

const STEP_CATEGORIES = [
  'Biographical Baseline',
  'Circadian & Sleep Architecture',
  'Aerobic Capacity & Conditioning',
  'Cardiovascular Autonomic Tone',
  'Cortisol & Stress Resilience',
  'Metabolic & Dietary Protocols'
];

const CIRCUMFERENCE = 2 * Math.PI * 62; // ~389.557 for r=62

function updateWizardStep(step) {
  currentStep = Math.min(Math.max(step, 1), TOTAL_STEPS);

  // Update step indicator & category
  const stepLabel = document.getElementById('step-label');
  if (stepLabel) stepLabel.textContent = `Question ${currentStep} of ${TOTAL_STEPS}`;

  const stepCat = document.getElementById('step-category');
  if (stepCat) stepCat.textContent = STEP_CATEGORIES[currentStep - 1];

  // Update progress bar
  const progressBar = document.getElementById('wizard-progress-bar');
  if (progressBar) {
    const pct = (currentStep / TOTAL_STEPS) * 100;
    progressBar.style.width = `${pct}%`;
  }

  // Toggle active step slide
  document.querySelectorAll('.wizard-step').forEach(slide => {
    const sNum = parseInt(slide.dataset.step, 10);
    slide.classList.toggle('active', sNum === currentStep);
  });

  // Toggle Previous button
  const prevBtn = document.getElementById('btn-prev');
  if (prevBtn) prevBtn.disabled = currentStep === 1;

  // Next / Submit button text
  const nextBtn = document.getElementById('btn-next');
  if (nextBtn) {
    nextBtn.textContent = currentStep === TOTAL_STEPS ? 'Calculate Bio Age ✨' : 'Next Step →';
  }
}

function calculateBiologicalAge() {
  const ageSlider = document.getElementById('chronological-age-slider');
  const chronoAge = parseInt(ageSlider ? ageSlider.value : 35, 10);

  // Get selected values from radio groups
  const sleepVal = parseFloat(getSelectedRadio('sleep') || -2.2);
  const exerciseVal = parseFloat(getSelectedRadio('exercise') || -1.8);
  const rhrVal = parseFloat(getSelectedRadio('rhr') || -1.2);
  const stressVal = parseFloat(getSelectedRadio('stress') || 0.0);
  const nutritionVal = parseFloat(getSelectedRadio('nutrition') || -2.5);

  const totalOffset = sleepVal + exerciseVal + rhrVal + stressVal + nutritionVal;
  const rawBioAge = chronoAge + totalOffset;
  const bioAge = parseFloat(Math.max(rawBioAge, 18).toFixed(1));
  const diff = parseFloat((bioAge - chronoAge).toFixed(1));

  renderResults(chronoAge, bioAge, diff, {
    sleepVal,
    exerciseVal,
    rhrVal,
    stressVal,
    nutritionVal
  });
}

function getSelectedRadio(name) {
  const checked = document.querySelector(`input[name="${name}"]:checked`);
  return checked ? checked.value : null;
}

function renderResults(chronoAge, bioAge, diff, answers) {
  const formEl = document.getElementById('wizard-form');
  const resultsEl = document.getElementById('results-dashboard');
  const progressWrap = document.querySelector('.wizard-progress-wrap');

  if (formEl) formEl.style.display = 'none';
  if (progressWrap) progressWrap.style.display = 'none';
  if (resultsEl) resultsEl.style.display = 'block';

  // Update numbers
  const bioAgeNum = document.getElementById('bio-age-num');
  if (bioAgeNum) bioAgeNum.textContent = bioAge.toFixed(1);

  const resChrono = document.getElementById('res-chrono-age');
  if (resChrono) resChrono.textContent = `${chronoAge} Years`;

  const resBio = document.getElementById('res-bio-age');
  if (resBio) resBio.textContent = `${bioAge.toFixed(1)} Years`;

  // Update Difference Badge & Tier Text
  const diffBadge = document.getElementById('diff-badge');
  const tierText = document.getElementById('bio-tier-text');
  const dialFill = document.getElementById('dial-fill');

  let strokeOffset = 0;

  if (diff < 0) {
    const absDiff = Math.abs(diff).toFixed(1);
    if (diffBadge) {
      diffBadge.textContent = `-${absDiff} Years Younger 🌟`;
      diffBadge.className = 'diff-badge badge-younger';
    }
    if (tierText) {
      tierText.textContent = `Exceptional! Your cellular repair pathways and metabolic fitness indicate a biological age ${absDiff} years younger than your calendar age.`;
    }
    if (dialFill) {
      dialFill.style.stroke = '#10b981';
      strokeOffset = CIRCUMFERENCE * 0.25; // 75% full
    }
  } else if (diff > 0) {
    if (diffBadge) {
      diffBadge.textContent = `+${diff.toFixed(1)} Years Older ⚠️`;
      diffBadge.className = 'diff-badge badge-older';
    }
    if (tierText) {
      tierText.textContent = `Attention needed: Elevated biomarker wear suggests accelerated cellular aging. Targeted protocols below can rapidly reverse this gap.`;
    }
    if (dialFill) {
      dialFill.style.stroke = '#f59e0b';
      strokeOffset = CIRCUMFERENCE * 0.55; // 45% full
    }
  } else {
    if (diffBadge) {
      diffBadge.textContent = 'Aligned with Chronological Baseline ✨';
      diffBadge.className = 'diff-badge badge-neutral';
    }
    if (tierText) {
      tierText.textContent = 'Your biological aging rate is closely matched to your chronological baseline with strong optimization potential.';
    }
    if (dialFill) {
      dialFill.style.stroke = '#14b8a6';
      strokeOffset = CIRCUMFERENCE * 0.4;
    }
  }

  // Animate dial circle
  if (dialFill) {
    dialFill.style.strokeDasharray = CIRCUMFERENCE;
    dialFill.style.strokeDashoffset = CIRCUMFERENCE;
    setTimeout(() => {
      dialFill.style.strokeDashoffset = strokeOffset;
    }, 100);
  }

  // Populate Recommendations
  renderRecommendations(answers);

  // Smooth scroll results into view
  resultsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function renderRecommendations(answers) {
  const container = document.getElementById('recs-grid');
  if (!container) return;

  const recs = [];

  // Sleep
  if (answers.sleepVal > 0) {
    recs.push({
      icon: '🌙',
      title: 'Circadian Sleep Optimization',
      tag: 'High Priority',
      desc: 'Extend slow-wave deep sleep with 400mg Magnesium Glycinate, zero screen exposure 60 mins before bed, and strict 10 PM circadian timing.'
    });
  } else {
    recs.push({
      icon: '🌙',
      title: 'Sleep Architecture Maintenance',
      tag: 'Optimized',
      desc: 'Maintain consistent sleep-wake cycles and morning outdoor sunlight exposure (10 mins) to lock in natural melatonin suppression.'
    });
  }

  // Exercise
  if (answers.exerciseVal > 0) {
    recs.push({
      icon: '🏃',
      title: 'Zone 2 Mitochondrial Biogenesis',
      tag: 'High Priority',
      desc: 'Introduce 150 minutes of conversational-pace Zone 2 aerobic cardio weekly to expand cellular mitochondrial density and boost VO2 max.'
    });
  } else {
    recs.push({
      icon: '🏃',
      title: 'Strength & Power Maintenance',
      tag: 'Optimized',
      desc: 'Incorporate eccentric resistance training twice a week to maintain bone mineral density and myofibrillar protein synthesis.'
    });
  }

  // Autonomic / RHR
  if (answers.rhrVal > 0) {
    recs.push({
      icon: '❤️',
      title: 'Vagal Tone & Resting Heart Rate',
      tag: 'Cardio Focus',
      desc: 'Incorporate 2-minute cold water immersion post-workout and daily resonance frequency breathwork (6 breaths/min) to elevate HRV.'
    });
  } else {
    recs.push({
      icon: '❤️',
      title: 'Cardiovascular Autonomic Conditioning',
      tag: 'Optimized',
      desc: 'Excellent stroke volume. Sustain high HRV with periodic high-intensity sprint intervals (HIIT) once every 10 days.'
    });
  }

  // Stress
  if (answers.stressVal > 0) {
    recs.push({
      icon: '⚡',
      title: 'Cortisol Modulation Protocol',
      tag: 'Stress Resilience',
      desc: 'Mitigate systemic inflammation with Ashwagandha KSM-66 (600mg) and midday non-sleep deep rest (NSDR) audio protocols.'
    });
  } else {
    recs.push({
      icon: '⚡',
      title: 'Epigenetic Stress Buffering',
      tag: 'Optimized',
      desc: 'Your autonomic balance shields telomeres from oxidative stress. Continue routine sauna thermogenesis (20 mins at 80°C).'
    });
  }

  // Nutrition
  if (answers.nutritionVal > 0) {
    recs.push({
      icon: '🥗',
      title: 'Anti-Inflammatory Autophagy Protocol',
      tag: 'Nutrition Focus',
      desc: 'Transition to 16:8 time-restricted feeding and eliminate refined seed oils in favor of extra-virgin olive oil and wild-caught omega-3s.'
    });
  } else {
    recs.push({
      icon: '🥗',
      title: 'Metabolic Flexibility Protocol',
      tag: 'Optimized',
      desc: 'Outstanding nutritional biomarkers. Support cellular sirtuin activation with dark berries, resveratrol, and green tea polyphenols.'
    });
  }

  container.innerHTML = recs.map(r => `
    <div class="rec-card">
      <div class="rec-top">
        <span class="rec-icon">${r.icon}</span>
        <span class="rec-tag">${escapeHtml(r.tag)}</span>
      </div>
      <h4>${escapeHtml(r.title)}</h4>
      <p>${escapeHtml(r.desc)}</p>
    </div>
  `).join('');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

window.startAssessment = function() {
  const section = document.getElementById('assessment-section');
  if (section) section.scrollIntoView({ behavior: 'smooth' });
};

window.retakeAssessment = function() {
  currentStep = 1;
  const formEl = document.getElementById('wizard-form');
  const resultsEl = document.getElementById('results-dashboard');
  const progressWrap = document.querySelector('.wizard-progress-wrap');

  if (formEl) formEl.style.display = 'block';
  if (progressWrap) progressWrap.style.display = 'block';
  if (resultsEl) resultsEl.style.display = 'none';

  updateWizardStep(1);
  const card = document.getElementById('wizard-card');
  if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
};

document.addEventListener('DOMContentLoaded', () => {
  // Chronological Age Slider
  const ageSlider = document.getElementById('chronological-age-slider');
  const ageDisplay = document.getElementById('age-display');
  if (ageSlider && ageDisplay) {
    ageSlider.addEventListener('input', (e) => {
      ageDisplay.textContent = `${e.target.value} Years Old`;
    });
  }

  // Next / Previous buttons
  const nextBtn = document.getElementById('btn-next');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentStep < TOTAL_STEPS) {
        updateWizardStep(currentStep + 1);
      } else {
        calculateBiologicalAge();
      }
    });
  }

  const prevBtn = document.getElementById('btn-prev');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentStep > 1) {
        updateWizardStep(currentStep - 1);
      }
    });
  }

  // Auto-advance on option card click (optional friendly UX)
  document.querySelectorAll('.wizard-step').forEach(stepSlide => {
    stepSlide.addEventListener('change', (e) => {
      if (e.target.type === 'radio') {
        // highlight selected card
        stepSlide.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
        const card = e.target.closest('.option-card');
        if (card) card.classList.add('selected');
      }
    });
  });

  updateWizardStep(1);
  console.log('VitalityAI Biological Age Assessment Wizard ready');
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("nutrition-form");

  if (!form) return;

  const errorMessage = document.getElementById("nutrition-error");

  const output = {
    calories: document.getElementById("nutrition-calories"),
    protein: document.getElementById("nutrition-protein"),
    carbs: document.getElementById("nutrition-carbs"),
    fats: document.getElementById("nutrition-fats"),
    bmr: document.getElementById("nutrition-bmr"),
    maintenance: document.getElementById("nutrition-maintenance"),
    proteinCalories: document.getElementById("protein-calories"),
    carbsCalories: document.getElementById("carbs-calories"),
    fatsCalories: document.getElementById("fats-calories"),
    proteinProgress: document.getElementById("protein-progress"),
    carbsProgress: document.getElementById("carbs-progress"),
    fatsProgress: document.getElementById("fats-progress"),
  };

  const formatNumber = (number) =>
    Math.round(number).toLocaleString("en-US");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    errorMessage.hidden = true;
    errorMessage.textContent = "";

    const age = Number(document.getElementById("nutrition-age").value);
    const weight = Number(
      document.getElementById("nutrition-weight").value
    );
    const height = Number(
      document.getElementById("nutrition-height").value
    );
    const sex = document.getElementById("nutrition-sex").value;
    const activity = Number(
      document.getElementById("nutrition-activity").value
    );
    const goal = form.querySelector(
      'input[name="nutrition-goal"]:checked'
    )?.value;

    if (
      !Number.isFinite(age) ||
      !Number.isFinite(weight) ||
      !Number.isFinite(height) ||
      age < 18 ||
      age > 100 ||
      weight < 20 ||
      weight > 350 ||
      height < 100 ||
      height > 250 ||
      !Number.isFinite(activity) ||
      !goal
    ) {
      errorMessage.textContent =
        "Please enter valid profile details and select a goal.";
      errorMessage.hidden = false;
      return;
    }

    // Mifflin-St Jeor equation
    const bmr =
      10 * weight +
      6.25 * height -
      5 * age +
      (sex === "male" ? 5 : -161);

    const maintenance = bmr * activity;

    const goalAdjustments = {
      loss: -300,
      maintain: 0,
      gain: 250,
    };

    const calories = Math.max(
      1200,
      Math.round(maintenance + goalAdjustments[goal])
    );

    const macroRatios = {
      loss: { protein: 0.30, carbs: 0.40, fats: 0.30 },
      maintain: { protein: 0.25, carbs: 0.45, fats: 0.30 },
      gain: { protein: 0.25, carbs: 0.50, fats: 0.25 },
    };

    const ratios = macroRatios[goal];

    const proteinCalories = calories * ratios.protein;
    const carbsCalories = calories * ratios.carbs;
    const fatsCalories = calories * ratios.fats;

    const protein = proteinCalories / 4;
    const carbs = carbsCalories / 4;
    const fats = fatsCalories / 9;

    output.calories.textContent = formatNumber(calories);
    output.protein.textContent = formatNumber(protein);
    output.carbs.textContent = formatNumber(carbs);
    output.fats.textContent = formatNumber(fats);

    output.bmr.textContent = `${formatNumber(bmr)} kcal`;
    output.maintenance.textContent = `${formatNumber(maintenance)} kcal`;

    output.proteinCalories.textContent =
      `${formatNumber(proteinCalories)} kcal`;
    output.carbsCalories.textContent =
      `${formatNumber(carbsCalories)} kcal`;
    output.fatsCalories.textContent =
      `${formatNumber(fatsCalories)} kcal`;

    output.proteinProgress.style.width = `${ratios.protein * 100}%`;
    output.carbsProgress.style.width = `${ratios.carbs * 100}%`;
    output.fatsProgress.style.width = `${ratios.fats * 100}%`;

    document.querySelector(
      ".nutrition-results-heading p"
    ).textContent = "Your estimated daily targets are ready.";
  });
});

//Hydration Tracker
document.addEventListener("DOMContentLoaded", () => {
  const waterCount = document.getElementById("water-count");
  const waterProgress = document.getElementById("water-progress");
  const progressTrack = document.getElementById("water-progress-track");
  const waterStatus = document.getElementById("water-status");
  const waterMessage = document.getElementById("water-message");
  const decreaseButton = document.getElementById("water-decrease");
  const increaseButton = document.getElementById("water-increase");
  const glasses = document.querySelectorAll(".water-glass");

  // Stop safely if the tracker is not present on the page.
  if (
    !waterCount ||
    !waterProgress ||
    !progressTrack ||
    !waterStatus ||
    !waterMessage ||
    !decreaseButton ||
    !increaseButton ||
    glasses.length === 0
  ) {
    return;
  }

  const DAILY_GOAL = glasses.length;
  let count = 0;

  function updateWaterTracker() {
    const percentage = (count / DAILY_GOAL) * 100;

    waterCount.textContent = count;
    waterProgress.style.width = `${percentage}%`;

    progressTrack.setAttribute("aria-valuenow", count);

    decreaseButton.disabled = count === 0;
    increaseButton.disabled = count === DAILY_GOAL;

    glasses.forEach((glass, index) => {
      glass.classList.toggle("filled", index < count);
    });

    if (count === 0) {
      waterStatus.textContent = "Let's get started!";
      waterMessage.textContent = "Every glass counts. 💚";
    } else if (count === DAILY_GOAL) {
      waterStatus.textContent = "Daily goal reached! 🎉";
      waterMessage.textContent =
        "Great job! You've reached your daily glass goal.";
    } else {
      waterStatus.textContent = `${Math.round(percentage)}% completed`;
      waterMessage.textContent =
        `${DAILY_GOAL - count} more ${
          DAILY_GOAL - count === 1 ? "glass" : "glasses"
        } to reach your goal.`;
    }
  }

  increaseButton.addEventListener("click", () => {
    if (count < DAILY_GOAL) {
      count++;
      updateWaterTracker();
    }
  });

  decreaseButton.addEventListener("click", () => {
    if (count > 0) {
      count--;
      updateWaterTracker();
    }
  });

  updateWaterTracker();
});
