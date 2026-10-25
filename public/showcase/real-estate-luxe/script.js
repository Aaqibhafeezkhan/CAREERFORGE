// Vanguard Real Estate Mortgage Calculator & Amortization Engine
const CIRCUMFERENCE = 2 * Math.PI * 65; // ~408.407 for r=65

let currentLoanYears = 30;

function formatCurrency(val) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(Math.round(val));
}

function formatShortCurrency(val) {
  if (val >= 1000000) {
    return '$' + (val / 1000000).toFixed(1) + 'M';
  } else if (val >= 1000) {
    return '$' + (val / 1000).toFixed(0) + 'K';
  }
  return '$' + Math.round(val);
}

function calculateMortgage() {
  const homePriceInput = document.getElementById('home-price-input');
  const downPaymentRange = document.getElementById('down-payment-range');
  const interestRateInput = document.getElementById('interest-rate-input');
  const taxRateInput = document.getElementById('tax-rate-input');
  const insRateInput = document.getElementById('ins-rate-input');
  const hoaInput = document.getElementById('hoa-input');

  const homePrice = Math.max(parseFloat(homePriceInput.value) || 0, 10000);
  const downPct = Math.min(Math.max(parseFloat(downPaymentRange.value) || 0, 0), 100);
  const interestRate = Math.max(parseFloat(interestRateInput.value) || 0, 0.01);
  const taxRate = Math.max(parseFloat(taxRateInput.value) || 0, 0);
  const insRate = Math.max(parseFloat(insRateInput.value) || 0, 0);
  const hoaFees = Math.max(parseFloat(hoaInput.value) || 0, 0);

  // Calculations
  const downPaymentAmount = homePrice * (downPct / 100);
  const loanPrincipal = Math.max(homePrice - downPaymentAmount, 0);
  const numberOfPayments = currentLoanYears * 12;
  const monthlyRate = (interestRate / 100) / 12;

  // Monthly Principal & Interest: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1]
  let monthlyPI = 0;
  if (monthlyRate > 0 && loanPrincipal > 0) {
    const compound = Math.pow(1 + monthlyRate, numberOfPayments);
    monthlyPI = loanPrincipal * ((monthlyRate * compound) / (compound - 1));
  } else if (numberOfPayments > 0) {
    monthlyPI = loanPrincipal / numberOfPayments;
  }

  // Monthly Escrow components
  const monthlyTax = (homePrice * (taxRate / 100)) / 12;
  const monthlyIns = (homePrice * (insRate / 100)) / 12;
  const monthlyHOA = hoaFees;

  const totalMonthly = monthlyPI + monthlyTax + monthlyIns + monthlyHOA;

  // Update Input Badges
  const hpBadge = document.getElementById('home-price-badge');
  if (hpBadge) hpBadge.textContent = formatCurrency(homePrice);

  const dpPctBadge = document.getElementById('down-payment-pct-badge');
  if (dpPctBadge) dpPctBadge.textContent = `${downPct}%`;

  const dpDollars = document.getElementById('down-payment-dollars');
  if (dpDollars) dpDollars.textContent = formatCurrency(downPaymentAmount);

  const irBadge = document.getElementById('interest-rate-badge');
  if (irBadge) irBadge.textContent = `${interestRate.toFixed(2)}%`;

  // Update Total Monthly Output
  const totalMonthlyEl = document.getElementById('total-monthly-payment');
  if (totalMonthlyEl) totalMonthlyEl.textContent = formatCurrency(totalMonthly);

  const donutLoanVal = document.getElementById('donut-loan-val');
  if (donutLoanVal) donutLoanVal.textContent = formatShortCurrency(loanPrincipal);

  // Update Legend Values & Percentages
  const piPct = totalMonthly > 0 ? (monthlyPI / totalMonthly) * 100 : 0;
  const taxPct = totalMonthly > 0 ? (monthlyTax / totalMonthly) * 100 : 0;
  const insPct = totalMonthly > 0 ? (monthlyIns / totalMonthly) * 100 : 0;
  const hoaPct = totalMonthly > 0 ? (monthlyHOA / totalMonthly) * 100 : 0;

  updateElementText('legend-principal-val', formatCurrency(monthlyPI));
  updateElementText('legend-principal-pct', `${piPct.toFixed(1)}%`);

  updateElementText('legend-taxes-val', formatCurrency(monthlyTax));
  updateElementText('legend-taxes-pct', `${taxPct.toFixed(1)}%`);

  updateElementText('legend-insurance-val', formatCurrency(monthlyIns));
  updateElementText('legend-insurance-pct', `${insPct.toFixed(1)}%`);

  updateElementText('legend-hoa-val', formatCurrency(monthlyHOA));
  updateElementText('legend-hoa-pct', `${hoaPct.toFixed(1)}%`);

  // Update SVG Donut Segments
  updateDonutChart(piPct, taxPct, insPct, hoaPct);

  // Update Amortization Schedule
  generateAmortizationSchedule(loanPrincipal, monthlyRate, monthlyPI, numberOfPayments, downPaymentAmount);
}

function updateElementText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function updateDonutChart(piPct, taxPct, insPct, hoaPct) {
  const segPI = document.getElementById('seg-principal');
  const segTax = document.getElementById('seg-taxes');
  const segIns = document.getElementById('seg-insurance');
  const segHOA = document.getElementById('seg-hoa');

  if (!segPI || !segTax || !segIns || !segHOA) return;

  const lenPI = (piPct / 100) * CIRCUMFERENCE;
  const lenTax = (taxPct / 100) * CIRCUMFERENCE;
  const lenIns = (insPct / 100) * CIRCUMFERENCE;
  const lenHOA = (hoaPct / 100) * CIRCUMFERENCE;

  // Segment 1 (PI)
  segPI.style.strokeDasharray = `${lenPI} ${CIRCUMFERENCE - lenPI}`;
  segPI.style.strokeDashoffset = `0`;

  // Segment 2 (Tax)
  let offset = -lenPI;
  segTax.style.strokeDasharray = `${lenTax} ${CIRCUMFERENCE - lenTax}`;
  segTax.style.strokeDashoffset = `${offset}`;

  // Segment 3 (Insurance)
  offset -= lenTax;
  segIns.style.strokeDasharray = `${lenIns} ${CIRCUMFERENCE - lenIns}`;
  segIns.style.strokeDashoffset = `${offset}`;

  // Segment 4 (HOA)
  offset -= lenIns;
  segHOA.style.strokeDasharray = `${lenHOA} ${CIRCUMFERENCE - lenHOA}`;
  segHOA.style.strokeDashoffset = `${offset}`;
}

function generateAmortizationSchedule(principal, monthlyRate, monthlyPayment, totalMonths, initialDownPayment) {
  const tbody = document.getElementById('amortization-tbody');
  if (!tbody) return;

  tbody.innerHTML = '';

  let balance = principal;
  let cumulativeInterest = 0;
  let cumulativePrincipal = 0;

  const totalYears = Math.min(currentLoanYears, Math.ceil(totalMonths / 12));

  for (let year = 1; year <= totalYears; year++) {
    let yearPrincipalPaid = 0;
    let yearInterestPaid = 0;

    for (let month = 1; month <= 12; month++) {
      if (balance <= 0) break;
      const interestForMonth = balance * monthlyRate;
      let principalForMonth = monthlyPayment - interestForMonth;

      if (principalForMonth > balance) {
        principalForMonth = balance;
      }

      balance -= principalForMonth;
      yearPrincipalPaid += principalForMonth;
      yearInterestPaid += interestForMonth;
      cumulativeInterest += interestForMonth;
      cumulativePrincipal += principalForMonth;
    }

    const yearTotalPaid = yearPrincipalPaid + yearInterestPaid;
    const equityBuilt = initialDownPayment + cumulativePrincipal;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td><span class="year-badge">Year ${year}</span></td>
      <td class="text-gold">${formatCurrency(yearPrincipalPaid)}</td>
      <td class="text-blue">${formatCurrency(yearInterestPaid)}</td>
      <td>${formatCurrency(yearTotalPaid)}</td>
      <td class="text-dim">${formatCurrency(Math.max(balance, 0))}</td>
      <td class="text-emerald"><strong>${formatCurrency(equityBuilt)}</strong></td>
    `;
    tbody.appendChild(row);
  }
}

// Global hook for Estate Card buttons
window.applyEstatePrice = function(price) {
  const homePriceInput = document.getElementById('home-price-input');
  if (homePriceInput) {
    homePriceInput.value = price;
  }

  // Update active chips
  document.querySelectorAll('.quick-price-chips .chip').forEach(c => {
    c.classList.toggle('active', c.getAttribute('onclick')?.includes(String(price)));
  });

  calculateMortgage();

  const calcSection = document.getElementById('mortgage-calculator');
  if (calcSection) {
    calcSection.scrollIntoView({ behavior: 'smooth' });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Setup inputs
  const inputs = [
    'home-price-input',
    'down-payment-range',
    'interest-rate-input',
    'tax-rate-input',
    'ins-rate-input',
    'hoa-input'
  ];

  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', calculateMortgage);
    }
  });

  // Term Toggles (15 vs 30)
  const term30Btn = document.getElementById('term-30-btn');
  const term15Btn = document.getElementById('term-15-btn');
  const scheduleBtnText = document.getElementById('schedule-btn-text');

  function setLoanTerm(years) {
    currentLoanYears = years;
    if (term30Btn) term30Btn.classList.toggle('active', years === 30);
    if (term15Btn) term15Btn.classList.toggle('active', years === 15);
    if (scheduleBtnText) {
      scheduleBtnText.textContent = `View ${years}-Year Amortization Schedule`;
    }
    calculateMortgage();
  }

  if (term30Btn) term30Btn.addEventListener('click', () => setLoanTerm(30));
  if (term15Btn) term15Btn.addEventListener('click', () => setLoanTerm(15));

  // Amortization Table Drawer Toggle
  const toggleScheduleBtn = document.getElementById('toggle-schedule-btn');
  const drawer = document.getElementById('amortization-drawer');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const toggleIcon = document.getElementById('schedule-toggle-icon');

  function toggleDrawer() {
    if (!drawer) return;
    const isHidden = drawer.style.display === 'none';
    drawer.style.display = isHidden ? 'block' : 'none';
    if (toggleIcon) toggleIcon.textContent = isHidden ? '↑' : '↓';
    if (isHidden) {
      drawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  if (toggleScheduleBtn) toggleScheduleBtn.addEventListener('click', toggleDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', toggleDrawer);

  // Initialize
  calculateMortgage();
  console.log('Vanguard Real Estate Mortgage Calculator Engine loaded');
});
