document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const skillCards = document.querySelectorAll(".skill-card");
  const progressBars = document.querySelectorAll(".progress-fill");
  const emptyMessage = document.querySelector(".skills-empty");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedCategory = button.dataset.filter;

      filterButtons.forEach((filterButton) => {
        const isActive = filterButton === button;

        filterButton.classList.toggle("active", isActive);
        filterButton.setAttribute("aria-pressed", String(isActive));
      });

      let visibleCount = 0;

      skillCards.forEach((card) => {
        const shouldShow =
          selectedCategory === "all" ||
          card.dataset.category === selectedCategory;

        card.hidden = !shouldShow;

        if (shouldShow) {
          visibleCount += 1;
        }
      });

      if (emptyMessage) {
        emptyMessage.hidden = visibleCount > 0;
      }

      progressBars.forEach((bar) => {
        const card = bar.closest(".skill-card");

        if (card && !card.hidden) {
          bar.style.width = "0";

          requestAnimationFrame(() => {
            bar.style.width = `${bar.dataset.level}%`;
          });
        }
      });
    });
  });

  const skillsSection = document.querySelector(".skills-section");

  if ("IntersectionObserver" in window && skillsSection) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            progressBars.forEach((bar) => {
              const card = bar.closest(".skill-card");

              if (card && !card.hidden) {
                bar.style.width = `${bar.dataset.level}%`;
              }
            });

            currentObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );

    observer.observe(skillsSection);
  } else {
    progressBars.forEach((bar) => {
      bar.style.width = `${bar.dataset.level}%`;
    });
  }

  console.log("Developer Portfolio initialized");
});
