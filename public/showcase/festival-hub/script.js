document.addEventListener("DOMContentLoaded", () => {
  const lineupView = document.getElementById("lineup-view");
  const scheduleView = document.getElementById("schedule-view");
  const lineupTab = document.getElementById("lineup-tab");
  const scheduleTab = document.getElementById("schedule-tab");
  const scheduleGrid = document.getElementById("schedule-grid");
  const emptySchedule = document.getElementById("empty-schedule");
  const favoriteCount = document.getElementById("favorite-count");
  const artistCards = document.querySelectorAll(".artist-card[data-artist-id]");
  const storageKey = "pulse-wave-favorites";

  let favorites = new Set();

  try {
    const savedFavorites = JSON.parse(localStorage.getItem(storageKey) || "[]");

    if (Array.isArray(savedFavorites)) {
      favorites = new Set(
        savedFavorites.filter((id) =>
          [...artistCards].some((card) => card.dataset.artistId === id),
        ),
      );
    }
  } catch (error) {
    console.warn("Could not load saved favorites:", error);
  }

  function updateFavoriteButton(card) {
    const artistId = card.dataset.artistId;
    const button = card.querySelector(".favorite-button");
    const isFavorite = favorites.has(artistId);
    const artistName = card.querySelector("h3").textContent.trim();

    button.classList.toggle("is-favorite", isFavorite);
    button.setAttribute("aria-pressed", String(isFavorite));
    button.setAttribute(
      "aria-label",
      `${isFavorite ? "Remove" : "Add"} ${artistName} ${
        isFavorite ? "from" : "to"
      } My Schedule`,
    );

    button.querySelector("span").textContent = isFavorite ? "♥" : "♡";
  }

  function saveFavorites() {
    try {
      localStorage.setItem(storageKey, JSON.stringify([...favorites]));
    } catch (error) {
      console.warn("Could not save favorites:", error);
    }
  }

  function renderSchedule() {
    scheduleGrid.replaceChildren();

    const savedCards = [...artistCards].filter((card) =>
      favorites.has(card.dataset.artistId),
    );

    savedCards.forEach((card) => {
      const scheduleCard = card.cloneNode(true);
      scheduleCard.querySelector(".favorite-button").remove();
      scheduleGrid.appendChild(scheduleCard);
    });

    emptySchedule.hidden = savedCards.length > 0;
    favoriteCount.textContent = favorites.size;
  }

  function showView(view) {
    const showSchedule = view === "schedule";

    lineupView.hidden = showSchedule;
    scheduleView.hidden = !showSchedule;

    lineupTab.classList.toggle("active", !showSchedule);
    scheduleTab.classList.toggle("active", showSchedule);

    lineupTab.setAttribute("aria-selected", String(!showSchedule));
    scheduleTab.setAttribute("aria-selected", String(showSchedule));

    if (showSchedule) {
      renderSchedule();
    }
  }

  artistCards.forEach((card) => {
    updateFavoriteButton(card);

    card.querySelector(".favorite-button").addEventListener("click", () => {
      const artistId = card.dataset.artistId;

      if (favorites.has(artistId)) {
        favorites.delete(artistId);
      } else {
        favorites.add(artistId);
      }

      saveFavorites();
      updateFavoriteButton(card);
      renderSchedule();
    });
  });

  lineupTab.addEventListener("click", () => showView("lineup"));
  scheduleTab.addEventListener("click", () => showView("schedule"));

  renderSchedule();

  console.log("Pulse Wave Festival Hub loaded");
});
