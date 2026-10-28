const STORAGE_KEY = 'odyssey_expedition_checklist';

const DEFAULT_GEAR = [
  // Clothing
  { id: 'c1', name: 'Thermal Base Layer (Merino Wool)', category: 'Clothing', checked: true },
  { id: 'c2', name: 'Gore-Tex Waterproof Mountain Shell', category: 'Clothing', checked: true },
  { id: 'c3', name: 'Insulated Down Parka (-20°C Rated)', category: 'Clothing', checked: false },
  { id: 'c4', name: 'Extreme Weather Glacier Gloves', category: 'Clothing', checked: false },

  // Navigation Gear
  { id: 'n1', name: 'Garmin InReach Satellite Messenger', category: 'Navigation Gear', checked: true },
  { id: 'n2', name: 'Topographic Map & Prismatic Compass', category: 'Navigation Gear', checked: true },
  { id: 'n3', name: 'Solar Expedition Power Bank (24000mAh)', category: 'Navigation Gear', checked: false },
  { id: 'n4', name: 'High-Precision Altimeter & Barometer', category: 'Navigation Gear', checked: false },

  // First Aid
  { id: 'f1', name: 'Wilderness Trauma & Hemostatic Kit', category: 'First Aid', checked: true },
  { id: 'f2', name: 'Blister Care & Hydrocolloid Dressings', category: 'First Aid', checked: false },
  { id: 'f3', name: 'Water Purification Tablets & Filter Straw', category: 'First Aid', checked: false },
  { id: 'f4', name: 'High-Altitude Sickness Acclimatization Pills', category: 'First Aid', checked: false },

  // Photography Equipment
  { id: 'p1', name: 'Weather-Sealed Mirrorless Camera Body', category: 'Photography Equipment', checked: true },
  { id: 'p2', name: 'Ultra-Wide Expedition Lens (16-35mm f/2.8)', category: 'Photography Equipment', checked: false },
  { id: 'p3', name: 'Carbon Fiber Lightweight Travel Tripod', category: 'Photography Equipment', checked: false },
  { id: 'p4', name: 'Cold-Resistant Battery Packs & Memory Vault', category: 'Photography Equipment', checked: false }
];

let gearList = [];
let activeCategory = 'all';

// Circle circumference for r=42: 2 * Math.PI * 42 = ~263.894
const CIRCUMFERENCE = 2 * Math.PI * 42;

function loadGear() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      gearList = JSON.parse(saved);
      if (!Array.isArray(gearList) || gearList.length === 0) {
        gearList = JSON.parse(JSON.stringify(DEFAULT_GEAR));
      }
    } else {
      gearList = JSON.parse(JSON.stringify(DEFAULT_GEAR));
    }
  } catch (e) {
    console.error('Error loading checklist from localStorage:', e);
    gearList = JSON.parse(JSON.stringify(DEFAULT_GEAR));
  }
}

function saveGear() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gearList));
  } catch (e) {
    console.error('Error saving checklist to localStorage:', e);
  }
}

function updateProgress() {
  const total = gearList.length;
  const packed = gearList.filter(item => item.checked).length;
  const percent = total === 0 ? 0 : Math.round((packed / total) * 100);

  // Update text
  const percentEl = document.getElementById('readiness-percent');
  if (percentEl) percentEl.textContent = `${percent}%`;

  const countEl = document.getElementById('readiness-count');
  if (countEl) countEl.textContent = `${packed} of ${total} items packed`;

  const statusEl = document.getElementById('readiness-status');
  if (statusEl) {
    if (percent === 100) {
      statusEl.textContent = '🎉 Mission Ready!';
      statusEl.style.color = '#10b981';
    } else if (percent >= 75) {
      statusEl.textContent = '🚀 Final Preparations';
      statusEl.style.color = '#38bdf8';
    } else if (percent >= 40) {
      statusEl.textContent = '🧭 Packing in Progress';
      statusEl.style.color = '#38bdf8';
    } else if (percent > 0) {
      statusEl.textContent = '🎒 Gear Gathering';
      statusEl.style.color = '#94a3b8';
    } else {
      statusEl.textContent = '⚠️ Preparation Needed';
      statusEl.style.color = '#f59e0b';
    }
  }

  // Animate circular SVG stroke
  const circleEl = document.getElementById('progress-circle');
  if (circleEl) {
    const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;
    circleEl.style.strokeDashoffset = offset;
    circleEl.style.stroke = percent === 100 ? '#10b981' : '#38bdf8';
  }

  // Update tab badge counts
  updateCategoryBadges();
}

function updateCategoryBadges() {
  const totalCount = gearList.length;
  const clothingCount = gearList.filter(i => i.category === 'Clothing').length;
  const navCount = gearList.filter(i => i.category === 'Navigation Gear').length;
  const firstAidCount = gearList.filter(i => i.category === 'First Aid').length;
  const photoCount = gearList.filter(i => i.category === 'Photography Equipment').length;

  const bAll = document.getElementById('badge-all');
  if (bAll) bAll.textContent = totalCount;

  const bClothing = document.getElementById('badge-clothing');
  if (bClothing) bClothing.textContent = clothingCount;

  const bNav = document.getElementById('badge-navigation');
  if (bNav) bNav.textContent = navCount;

  const bFirstAid = document.getElementById('badge-firstaid');
  if (bFirstAid) bFirstAid.textContent = firstAidCount;

  const bPhoto = document.getElementById('badge-photo');
  if (bPhoto) bPhoto.textContent = photoCount;
}

function getCategoryIcon(cat) {
  switch (cat) {
    case 'Clothing': return '🧥';
    case 'Navigation Gear': return '🧭';
    case 'First Aid': return '🩹';
    case 'Photography Equipment': return '📷';
    default: return '🎒';
  }
}

function renderList() {
  const listEl = document.getElementById('checklist-items');
  const emptyStateEl = document.getElementById('empty-state');
  if (!listEl) return;

  listEl.innerHTML = '';

  const filtered = activeCategory === 'all'
    ? gearList
    : gearList.filter(item => item.category === activeCategory);

  if (filtered.length === 0) {
    if (emptyStateEl) emptyStateEl.style.display = 'block';
  } else {
    if (emptyStateEl) emptyStateEl.style.display = 'none';

    filtered.forEach(item => {
      const li = document.createElement('li');
      li.className = `checklist-item ${item.checked ? 'completed' : ''}`;
      li.id = `item-${item.id}`;

      li.innerHTML = `
        <label class="item-checkbox-label">
          <input type="checkbox" class="item-checkbox" data-id="${item.id}" ${item.checked ? 'checked' : ''} />
          <span class="custom-checkbox">
            <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3.5 8.5 6.5 11.5 12.5 4.5"></polyline>
            </svg>
          </span>
          <span class="item-text-group">
            <span class="item-label">${escapeHtml(item.name)}</span>
            <span class="item-cat-badge">${getCategoryIcon(item.category)} ${escapeHtml(item.category)}</span>
          </span>
        </label>
        <button type="button" class="delete-btn" data-id="${item.id}" title="Remove item" aria-label="Remove ${escapeHtml(item.name)}">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      `;

      listEl.appendChild(li);
    });
  }

  // Update list filter heading
  const headingEl = document.getElementById('current-filter-heading');
  if (headingEl) {
    headingEl.textContent = activeCategory === 'all'
      ? 'All Gear Items'
      : `${getCategoryIcon(activeCategory)} ${activeCategory}`;
  }

  updateProgress();
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function toggleItem(id) {
  const item = gearList.find(i => String(i.id) === String(id));
  if (item) {
    item.checked = !item.checked;
    saveGear();
    
    // Smooth inline class update
    const el = document.getElementById(`item-${id}`);
    if (el) {
      if (item.checked) {
        el.classList.add('completed');
      } else {
        el.classList.remove('completed');
      }
    }
    updateProgress();
  }
}

function deleteItem(id) {
  gearList = gearList.filter(i => String(i.id) !== String(id));
  saveGear();
  renderList();
}

function addItem(name, category) {
  const trimmed = name.trim();
  if (!trimmed) return;

  const newItem = {
    id: 'custom-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    name: trimmed,
    category: category,
    checked: false,
    isCustom: true
  };

  gearList.push(newItem);
  saveGear();

  // If user is filtering on another category, optionally switch to the added category or stay
  if (activeCategory !== 'all' && activeCategory !== category) {
    activeCategory = category;
    document.querySelectorAll('.cat-tab').forEach(t => {
      t.classList.toggle('active', t.getAttribute('data-category') === category);
      t.setAttribute('aria-selected', t.getAttribute('data-category') === category);
    });
  }

  renderList();
}

function checkAllCurrent() {
  const currentCategory = activeCategory;
  gearList.forEach(item => {
    if (currentCategory === 'all' || item.category === currentCategory) {
      item.checked = true;
    }
  });
  saveGear();
  renderList();
}

function uncheckAllCurrent() {
  const currentCategory = activeCategory;
  gearList.forEach(item => {
    if (currentCategory === 'all' || item.category === currentCategory) {
      item.checked = false;
    }
  });
  saveGear();
  renderList();
}

function resetDefaults() {
  if (confirm('Reset checklist back to expedition standard defaults? Custom items will be reset.')) {
    gearList = JSON.parse(JSON.stringify(DEFAULT_GEAR));
    saveGear();
    renderList();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initDestinationFilters();
  // Initialize ring circle stroke properties
  const circleEl = document.getElementById('progress-circle');
  if (circleEl) {
    circleEl.style.strokeDasharray = CIRCUMFERENCE;
    circleEl.style.strokeDashoffset = CIRCUMFERENCE;
  }

  loadGear();
  renderList();

  // Event Delegation for checkbox & delete button
  const listEl = document.getElementById('checklist-items');
  if (listEl) {
    listEl.addEventListener('click', (e) => {
      const checkbox = e.target.closest('.item-checkbox');
      if (checkbox) {
        toggleItem(checkbox.dataset.id);
        return;
      }

      const delBtn = e.target.closest('.delete-btn');
      if (delBtn) {
        e.stopPropagation();
        deleteItem(delBtn.dataset.id);
      }
    });
  }

  // Category Tab Clicks
  const tabsWrap = document.getElementById('category-tabs');
  if (tabsWrap) {
    tabsWrap.addEventListener('click', (e) => {
      const tab = e.target.closest('.cat-tab');
      if (!tab) return;

      document.querySelectorAll('.cat-tab').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      activeCategory = tab.getAttribute('data-category');
      renderList();
    });
  }

  // Add Gear Form Submit
  const formEl = document.getElementById('add-gear-form');
  if (formEl) {
    formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('gear-name-input');
      const select = document.getElementById('gear-category-select');
      if (input && select) {
        addItem(input.value, select.value);
        input.value = '';
        input.focus();
      }
    });
  }

  // Actions
  const checkAllBtn = document.getElementById('check-all-btn');
  if (checkAllBtn) checkAllBtn.addEventListener('click', checkAllCurrent);

  const uncheckAllBtn = document.getElementById('uncheck-all-btn');
  if (uncheckAllBtn) uncheckAllBtn.addEventListener('click', uncheckAllCurrent);

  const resetDefaultBtn = document.getElementById('reset-default-btn');
  if (resetDefaultBtn) resetDefaultBtn.addEventListener('click', resetDefaults);
});

function initDestinationFilters() {
  const destinations = document.querySelector('.destinations');
  if (!destinations) return;
  const buttons = destinations.querySelectorAll('[data-region-filter]');
  const cards = destinations.querySelectorAll('.card[data-region]');
  const status = document.getElementById('destination-filter-status');

  function selectRegion(selected) {
    const region = selected.dataset.regionFilter;
    let visibleCount = 0;
    cards.forEach(card => {
      card.hidden = region !== 'all' && card.dataset.region !== region;
      if (!card.hidden) visibleCount += 1;
    });
    buttons.forEach(button => {
      const active = button === selected;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (status) {
      status.textContent = visibleCount === 0
        ? 'No voyages available in this region yet.'
        : `Showing ${region === 'all' ? 'all ' : ''}${visibleCount} ${visibleCount === 1 ? 'voyage' : 'voyages'}.`;
    }
  }

  buttons.forEach(button => button.addEventListener('click', () => selectRegion(button)));
}
