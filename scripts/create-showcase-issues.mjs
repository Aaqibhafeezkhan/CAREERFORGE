import { Octokit } from "@octokit/rest";
import { execSync } from "child_process";

// Get token from gh CLI
const token = execSync("gh auth token", { encoding: "utf-8" }).trim();
const octokit = new Octokit({ auth: token });
const owner = "Pratyush-Panda-2006";
const repo = "CAREERFORGE";

const issues = [
  // 1. agency-studio
  {
    project: "agency-studio",
    title: "[agency-studio] Add smooth hover lift and subtle glow to service cards",
    description: "Enhance the visual polish of the agency portfolio cards by adding a subtle transform scale/lift and a soft glowing border transition on hover.",
    suggestions: [
      "Locate the service/portfolio cards in `public/showcase/agency-studio/index.html` and `styles.css`.",
      "Add a `:hover` rule with `transform: translateY(-4px);` and a subtle box-shadow / border-color transition.",
      "Ensure the animation is smooth using `transition: transform 0.25s ease, box-shadow 0.25s ease;`."
    ]
  },
  {
    project: "agency-studio",
    title: "[agency-studio] Add keyboard accessibility and focus rings to navigation buttons",
    description: "Improve web accessibility (a11y) across the agency template by ensuring all buttons and links have visible focus states for keyboard navigation.",
    suggestions: [
      "Review interactive elements in `public/showcase/agency-studio/index.html`.",
      "Add `:focus-visible` styles with an outline or ring in `styles.css`.",
      "Add `aria-label` attributes to icon-only buttons if any exist."
    ]
  },

  // 2. ai-voice-studio
  {
    project: "ai-voice-studio",
    title: "[ai-voice-studio] Add active state indicator and tooltip to voice sample play buttons",
    description: "Make the audio preview experience more intuitive by adding a visual playing indicator (e.g. an equalizer pulse or 'Playing...' state) to voice sample buttons.",
    suggestions: [
      "In `public/showcase/ai-voice-studio/index.html`, locate the voice sample preview play buttons.",
      "Update `script.js` so clicking a sample toggles a 'playing' class and pauses other playing samples.",
      "Add matching pulsing styles in `styles.css`."
    ]
  },
  {
    project: "ai-voice-studio",
    title: "[ai-voice-studio] Improve mobile layout padding and table responsiveness",
    description: "Fix horizontal scrolling and text overflow issues on smaller viewports in the AI voice model comparison section.",
    suggestions: [
      "Test `public/showcase/ai-voice-studio/index.html` at 375px mobile width.",
      "Add responsive flex-wrap or horizontal scroll wrapping for cards/tables in `styles.css`.",
      "Ensure typography scales down gracefully on screens under 640px."
    ]
  },

  // 3. automotive-hypercar
  {
    project: "automotive-hypercar",
    title: "[automotive-hypercar] Add interactive badge counter and pulse effect to technical specs",
    description: "Add dynamic visual flair to the hypercar specification metrics (0-60 mph, horsepower, top speed) with animated badges and glowing accents.",
    suggestions: [
      "Locate the specs container in `public/showcase/automotive-hypercar/index.html`.",
      "Style stat values in `styles.css` with a bold monospace font and subtle ambient glow.",
      "Add a smooth hover effect that brightens the metric card."
    ]
  },
  {
    project: "automotive-hypercar",
    title: "[automotive-hypercar] Implement smooth scroll behavior for 'Explore Hypercar' anchor links",
    description: "Ensure navigation links like 'Specifications', 'Aerodynamics', and 'Order' smoothly scroll to their respective sections on the page.",
    suggestions: [
      "Add `html { scroll-behavior: smooth; }` in `public/showcase/automotive-hypercar/styles.css`.",
      "Verify section IDs match navigation href attributes (e.g., `#specs`, `#aero`).",
      "Account for fixed header offset if applicable."
    ]
  },

  // 4. crypto-exchange-pro
  {
    project: "crypto-exchange-pro",
    title: "[crypto-exchange-pro] Add color-coded ticker chips (+ green / - red) for 24h market stats",
    description: "Display 24h market percentage changes with clear color badges (emerald green for gains, rose red for losses) with arrow indicators (▲ / ▼).",
    suggestions: [
      "Find the market ticker bar in `public/showcase/crypto-exchange-pro/index.html`.",
      "Add utility classes or styles in `styles.css` for `.positive-change` and `.negative-change`.",
      "Ensure badges have high contrast and good legibility against dark backgrounds."
    ]
  },
  {
    project: "crypto-exchange-pro",
    title: "[crypto-exchange-pro] Improve orderbook table contrast and alignment for mobile screens",
    description: "Optimize the buy/sell orderbook table layout on narrow screens so numbers remain aligned and don't wrap awkwardly.",
    suggestions: [
      "Inspect the orderbook markup in `public/showcase/crypto-exchange-pro/index.html`.",
      "In `styles.css`, use tabular figures (`font-variant-numeric: tabular-nums`) for numeric alignment.",
      "Adjust padding and font size for viewports under 480px."
    ]
  },

  // 5. culinary-bistro
  {
    project: "culinary-bistro",
    title: "[culinary-bistro] Add dietary badge icons (Vegan, Gluten-Free, Chef Special) to menu items",
    description: "Allow restaurant guests to easily identify dietary options by adding neat pill badges (🌱 Vegan, 🌾 Gluten-Free, ⭐ Chef Special) next to menu item titles.",
    suggestions: [
      "Add dietary badge spans to menu items in `public/showcase/culinary-bistro/index.html`.",
      "Define clean pill styles in `styles.css` with rounded corners and subtle background tints.",
      "Ensure font sizes are compact (approx 11px-12px) so they don't overpower dish names."
    ]
  },
  {
    project: "culinary-bistro",
    title: "[culinary-bistro] Add reservation form client-side input validation feedback",
    description: "Provide immediate visual feedback when users fill in the reservation booking form (name, email, date, guests).",
    suggestions: [
      "In `public/showcase/culinary-bistro/script.js`, attach an `onsubmit` handler to the reservation form.",
      "Check that required fields are filled and the selected date is in the future.",
      "Show a stylish success banner or modal message when submitted successfully."
    ]
  },

  // 6. cybersecurity-sentinel
  {
    project: "cybersecurity-sentinel",
    title: "[cybersecurity-sentinel] Add pulsing status indicator light (Threat Level Normal) to header",
    description: "Enhance the SOC / security dashboard feel by adding a live pulsing green status dot indicating 'All Systems Operational / Threat Level: Green'.",
    suggestions: [
      "Add a status badge element in the top navigation of `public/showcase/cybersecurity-sentinel/index.html`.",
      "Create a CSS `@keyframes pulse` animation with box-shadow in `styles.css`.",
      "Include a monospace label for authentic cyber-ops aesthetic."
    ]
  },
  {
    project: "cybersecurity-sentinel",
    title: "[cybersecurity-sentinel] Add copy-to-clipboard button with visual confirmation for API token",
    description: "Allow users to click a copy icon next to sample API tokens or command lines and see an instant 'Copied!' tooltip.",
    suggestions: [
      "Add a 'Copy' button element next to code/token snippets in `public/showcase/cybersecurity-sentinel/index.html`.",
      "In `script.js`, use `navigator.clipboard.writeText()` to copy the content.",
      "Temporarily change the button text to 'Copied! ✓' for 2 seconds before reverting."
    ]
  },

  // 7. developer-portfolio
  {
    project: "developer-portfolio",
    title: "[developer-portfolio] Add terminal command auto-completion hint or help prompt below shell",
    description: "Make the terminal portfolio interactive and beginner-friendly by showing available commands (`help`, `skills`, `projects`, `contact`, `clear`) as clickable pills.",
    suggestions: [
      "In `public/showcase/developer-portfolio/index.html`, add a command shortcut bar below the terminal.",
      "Style shortcut pills with terminal borders and monospace font in `styles.css`.",
      "Clicking a pill should automatically execute or insert the command into the terminal prompt in `script.js`."
    ]
  },
  {
    project: "developer-portfolio",
    title: "[developer-portfolio] Add social link hover effects and security attributes (rel='noopener')",
    description: "Ensure all external portfolio links (GitHub, LinkedIn, Twitter/X) open safely in new tabs with hover transitions.",
    suggestions: [
      "Verify all `<a>` tags in `public/showcase/developer-portfolio/index.html` contain `target=\"_blank\" rel=\"noopener noreferrer\"`.",
      "Add hover color changes and icon glow in `styles.css`.",
      "Ensure tooltip or accessible text exists for screen readers."
    ]
  },

  // 8. docs-portal
  {
    project: "docs-portal",
    title: "[docs-portal] Add instant client-side filter input for sidebar documentation navigation",
    description: "Implement a lightweight search filter at the top of the sidebar navigation to quickly filter doc topics as the user types.",
    suggestions: [
      "Add an `<input type=\"search\" placeholder=\"Filter topics...\">` in `public/showcase/docs-portal/index.html`.",
      "In `script.js`, filter visible navigation `<li>` items based on matching input text.",
      "Style the search box with keyboard shortcut indicator (`/` or `Ctrl+K`) in `styles.css`."
    ]
  },
  {
    project: "docs-portal",
    title: "[docs-portal] Add copy code snippet button with toast feedback to code blocks",
    description: "Add a 'Copy' button to the top-right corner of all `<pre><code>` blocks with smooth feedback.",
    suggestions: [
      "In `public/showcase/docs-portal/script.js`, iterate over all `pre` blocks and inject a copy button.",
      "Position the button absolutely in `styles.css` with a sleek semi-transparent background.",
      "Trigger a checkmark icon or toast feedback when copied."
    ]
  },

  // 9. ecommerce-store
  {
    project: "ecommerce-store",
    title: "[ecommerce-store] Add stock availability pill badge ('In Stock' / 'Low Stock') to product cards",
    description: "Give products higher retail realism by showing stock status badges (green for In Stock, amber for Only 3 Left).",
    suggestions: [
      "Locate product cards in `public/showcase/ecommerce-store/index.html`.",
      "Add stock pill badges in each product card header.",
      "Style badges in `styles.css` with small uppercase font and badge background."
    ]
  },
  {
    project: "ecommerce-store",
    title: "[ecommerce-store] Add empty cart state message with 'Continue Shopping' CTA button",
    description: "When the shopping cart has 0 items, display an attractive empty state illustration or icon with a button to return to products.",
    suggestions: [
      "In `public/showcase/ecommerce-store/script.js`, check if cart items length is 0.",
      "Render an empty cart UI with shopping bag icon and 'Your cart is empty' text.",
      "Add a 'Browse Products' button that closes the cart drawer and scrolls to the product grid."
    ]
  },

  // 10. edtech-academy
  {
    project: "edtech-academy",
    title: "[edtech-academy] Add course duration and difficulty tags (Beginner / Intermediate / Advanced)",
    description: "Provide key learning metrics on course cards by adding duration badges (e.g. '8 Weeks', 'Beginner Friendly').",
    suggestions: [
      "Add meta badges for level and hours in `public/showcase/edtech-academy/index.html`.",
      "Style the tags in `styles.css` with color-coded difficulty indicators.",
      "Ensure badges stay neatly aligned in multi-column grid layouts."
    ]
  },
  {
    project: "edtech-academy",
    title: "[edtech-academy] Add animated progress bar component for course completion milestones",
    description: "Include an interactive course progress preview bar that animates from 0% to the target percentage when scrolled into view.",
    suggestions: [
      "Add a progress bar container in the featured course section of `public/showcase/edtech-academy/index.html`.",
      "Style the track and animated fill bar in `styles.css` with a smooth gradient.",
      "Add percentage label text aligned with the bar."
    ]
  },

  // 11. festival-hub
  {
    project: "festival-hub",
    title: "[festival-hub] Add live event countdown timer component leading up to festival start date",
    description: "Add an energetic hero countdown timer (Days, Hours, Minutes, Seconds) ticking down to the festival launch date.",
    suggestions: [
      "Add a 4-column countdown display in `public/showcase/festival-hub/index.html` hero section.",
      "Write a simple 1-second interval timer in `script.js` that computes remaining days, hours, minutes, seconds.",
      "Style the numeric boxes in `styles.css` with neon festival borders and bold numbers."
    ]
  },
  {
    project: "festival-hub",
    title: "[festival-hub] Add artist stage filter pills (Main Stage, Neon Arena, Bass Vault) to lineup list",
    description: "Allow festival attendees to filter lineup artists by stage using interactive pill buttons.",
    suggestions: [
      "Add stage filter buttons above the artist lineup in `public/showcase/festival-hub/index.html`.",
      "In `script.js`, add click handlers that show/hide artist cards matching the selected stage `data-stage` attribute.",
      "Highlight the active filter pill in `styles.css`."
    ]
  },

  // 12. fintech-vault
  {
    project: "fintech-vault",
    title: "[fintech-vault] Add currency selector toggle (USD, EUR, GBP) to savings calculation calculator",
    description: "Allow global users to toggle currency symbols ($ USD, € EUR, £ GBP) in the interest / yield projection calculator.",
    suggestions: [
      "Add a 3-way toggle button group in `public/showcase/fintech-vault/index.html`.",
      "Update `script.js` so switching currencies updates the display prefix and recalculated interest values.",
      "Style the active currency button in `styles.css` with high contrast."
    ]
  },
  {
    project: "fintech-vault",
    title: "[fintech-vault] Add privacy toggle button to mask / unmask vault balance digits (••••)",
    description: "Add a banking-style eye icon button next to total balance that toggles hiding the balance numbers with bullet dots (`••••••••`).",
    suggestions: [
      "Add an eye toggle icon button next to the account balance in `public/showcase/fintech-vault/index.html`.",
      "In `script.js`, store the balance in a variable and toggle between formatted number and `••••••••`.",
      "Ensure tooltip or aria-label updates between 'Hide balance' and 'Show balance'."
    ]
  },

  // 13. gaming-esports-hub
  {
    project: "gaming-esports-hub",
    title: "[gaming-esports-hub] Add match status badge ('Live Now' with pulsing red dot / 'Upcoming') to tournament cards",
    description: "Make tournament matchups clear by adding live badges with animated red pulse indicator for active matches and clock icons for upcoming ones.",
    suggestions: [
      "Locate the match fixture cards in `public/showcase/gaming-esports-hub/index.html`.",
      "Add `.badge-live` with a pulsing red keyframe dot in `styles.css`.",
      "Ensure match schedule dates are clearly formatted."
    ]
  },
  {
    project: "gaming-esports-hub",
    title: "[gaming-esports-hub] Add team logo hover scale transition and win-loss ratio chip",
    description: "Improve team roster visual feedback with subtle hover scaling and a win rate percentage badge.",
    suggestions: [
      "Style team avatar images in `public/showcase/gaming-esports-hub/styles.css` with `transition: transform 0.2s ease`.",
      "Add a win/loss record badge (e.g., '14W - 2L | 87%') to team summary cards.",
      "Ensure colors contrast well against the dark esports theme."
    ]
  },

  // 14. health-vitality
  {
    project: "health-vitality",
    title: "[health-vitality] Add water intake daily tracker card with increment / decrement buttons",
    description: "Add an interactive daily hydration counter card where users can click '+' or '-' to log water glasses (e.g., '6 / 8 Glasses').",
    suggestions: [
      "Add a hydration tracker card widget in `public/showcase/health-vitality/index.html`.",
      "In `script.js`, maintain the glass count state and update the display on button clicks.",
      "Add a visual cup or bar indicator that fills up as count increases in `styles.css`."
    ]
  },
  {
    project: "health-vitality",
    title: "[health-vitality] Add sleep score circular progress ring with color status indicators",
    description: "Render a sleek circular SVG progress ring displaying the user's sleep quality score (e.g., '88 Optimal').",
    suggestions: [
      "Add an SVG circle ring in `public/showcase/health-vitality/index.html`.",
      "Use `stroke-dasharray` and `stroke-dashoffset` in `styles.css` to animate the score ring.",
      "Color code the ring (emerald for >85, amber for 70-84, rose for <70)."
    ]
  },

  // 15. luxury-realms
  {
    project: "luxury-realms",
    title: "[luxury-realms] Add currency format toggle and price breakdown tooltip to private charter cards",
    description: "Add subtle pricing tooltips explaining inclusions (crew, fuel, catering) when hovering over hourly / daily rates.",
    suggestions: [
      "Add an info icon or tooltip trigger to charter pricing in `public/showcase/luxury-realms/index.html`.",
      "Style an elegant gold-bordered tooltip popup in `styles.css`.",
      "Ensure tooltip positioning doesn't clip on mobile screen edges."
    ]
  },
  {
    project: "luxury-realms",
    title: "[luxury-realms] Add concierge inquiry modal form with instant submission confirmation",
    description: "Allow guests to click 'Inquire Concierge' and fill out a bespoke inquiry modal (dates, guests, destination).",
    suggestions: [
      "Create a sleek glassmorphic modal overlay in `public/showcase/luxury-realms/index.html`.",
      "Add JavaScript logic in `script.js` to open/close the modal with ESC key and backdrop click support.",
      "Show a confirmation message upon form submission."
    ]
  },

  // 16. nonprofit-impact
  {
    project: "nonprofit-impact",
    title: "[nonprofit-impact] Add dynamic 'Trees Planted' animated milestone counter",
    description: "Add an inspiring animated milestone counter that counts up to the total trees planted / hectares protected metric.",
    suggestions: [
      "Add impact metric numbers in `public/showcase/nonprofit-impact/index.html`.",
      "Write a lightweight JavaScript counter animation in `script.js` that counts up on page load.",
      "Style stat cards in `styles.css` with earth-toned green accents and subtle borders."
    ]
  },
  {
    project: "nonprofit-impact",
    title: "[nonprofit-impact] Add volunteer signup modal with simple form fields and success badge",
    description: "Add a 'Join the Movement' volunteer modal with name, email, and preferred cause selection.",
    suggestions: [
      "Add volunteer button and dialog markup in `public/showcase/nonprofit-impact/index.html`.",
      "In `script.js`, validate email input and display a thank-you confirmation card.",
      "Style with clean, accessible input fields in `styles.css`."
    ]
  },

  // 17. podcast-audio-stream
  {
    project: "podcast-audio-stream",
    title: "[podcast-audio-stream] Add episode playback speed selector button (1x, 1.25x, 1.5x, 2x)",
    description: "Add a playback speed controller to the podcast audio player bar so listeners can cycle speeds.",
    suggestions: [
      "Add a speed toggle button in the player controls of `public/showcase/podcast-audio-stream/index.html`.",
      "In `script.js`, cycle through speeds `[1, 1.25, 1.5, 2]` on click and update the button label.",
      "Style the button with a sleek compact pill appearance in `styles.css`."
    ]
  },
  {
    project: "podcast-audio-stream",
    title: "[podcast-audio-stream] Add episode duration badge and audio waveform visualizer placeholder",
    description: "Display duration pills (e.g. '48 min') and stylized CSS animated equalizer bars on featured episode cards.",
    suggestions: [
      "Add duration spans to each episode item in `public/showcase/podcast-audio-stream/index.html`.",
      "Create a 4-bar CSS equalizer animation in `styles.css` that animates when playing.",
      "Ensure layout stays clean across mobile and desktop."
    ]
  },

  // 18. real-estate-luxe
  {
    project: "real-estate-luxe",
    title: "[real-estate-luxe] Add property feature badges (Bedrooms, Bathrooms, Sq Ft) with minimalist icons",
    description: "Include clean, consistent property spec badges (🛏️ 4 Beds, 🛁 3 Baths, 📐 3,800 sqft) on all listing cards.",
    suggestions: [
      "Review listing cards in `public/showcase/real-estate-luxe/index.html`.",
      "Add a flex container with property spec icons and labels.",
      "Style badges in `styles.css` with muted borders and refined typography."
    ]
  },
  {
    project: "real-estate-luxe",
    title: "[real-estate-luxe] Add interactive photo carousel navigation dots and arrow buttons",
    description: "Allow visitors to browse property photos with next/prev arrows and indicator dots.",
    suggestions: [
      "In `public/showcase/real-estate-luxe/index.html`, add prev/next buttons and dot navigation to the featured hero listing.",
      "In `script.js`, switch image source or active slide index on click.",
      "Style navigation controls with semi-transparent backdrop blur in `styles.css`."
    ]
  },

  // 19. saas-launchpad
  {
    project: "saas-launchpad",
    title: "[saas-launchpad] Add Monthly / Annual billing toggle with 20% discount badge to pricing cards",
    description: "Add an interactive billing toggle switch above the pricing plans with an eye-catching 'Save 20%' badge.",
    suggestions: [
      "Add a toggle switch container in `public/showcase/saas-launchpad/index.html` pricing section.",
      "In `script.js`, toggle between monthly and discounted annual prices on click.",
      "Add a highlighted 'Save 20%' pill badge with emerald gradient in `styles.css`."
    ]
  },
  {
    project: "saas-launchpad",
    title: "[saas-launchpad] Add FAQ accordion component with smooth expand / collapse toggle",
    description: "Organize frequently asked questions into a sleek accordion where clicking a question smoothly reveals the answer.",
    suggestions: [
      "Add FAQ items with question buttons and answer containers in `public/showcase/saas-launchpad/index.html`.",
      "In `script.js`, handle click events to expand active item and collapse others.",
      "Animate expansion with CSS `max-height` and rotate chevron icons in `styles.css`."
    ]
  },

  // 20. travel-odyssey
  {
    project: "travel-odyssey",
    title: "[travel-odyssey] Add destination filter tabs (Europe, Asia, Americas, Polar Expeditions)",
    description: "Allow travelers to filter destination cards by geographic region using tab buttons.",
    suggestions: [
      "Add category tab buttons above the destinations grid in `public/showcase/travel-odyssey/index.html`.",
      "In `script.js`, filter cards with matching `data-region` attributes when a tab is clicked.",
      "Style active tab with an underline indicator and bold text in `styles.css`."
    ]
  },
  {
    project: "travel-odyssey",
    title: "[travel-odyssey] Add travel difficulty rating badge (Easy, Moderate, Extreme) to adventure cards",
    description: "Provide quick adventure clarity by adding difficulty rating chips with visual color indicators.",
    suggestions: [
      "Add difficulty badge elements to trip cards in `public/showcase/travel-odyssey/index.html`.",
      "Style `.badge-easy` (emerald), `.badge-moderate` (amber), and `.badge-extreme` (rose) in `styles.css`.",
      "Ensure text is crisp and accessible on image overlays."
    ]
  }
];

function generateBody(item) {
  const suggestionsList = item.suggestions.map(s => `- ${s}`).join("\n");
  return `### 🎯 Task Overview
- **Project Directory:** \`public/showcase/${item.project}/\`
- **Difficulty:** \`level1\` (3 Points)
- **Track:** Nexus Spring of Code 2026 (\`nsoc26\`)
- **Type:** Minor UI & Polish Enhancement

---

### 📝 Issue Description
${item.description}

---

### 💡 Suggested Implementation Steps
${suggestionsList}

---

### 🛡️ Contribution Guidelines & Rules
1. ⏳ **How to Claim:**
   - Reply with **\`/claim\`** in the comments below.
   - Our automation bot will assign you and start your **3-day timer (72 hours)**.
2. 🔒 **Showcase Scope Policy:**
   - All code changes must strictly reside inside **\`public/showcase/${item.project}/\`**.
   - **Do not** touch \`src/\`, root configuration, or workflows (PRs violating this will be auto-closed by our PR Gatekeeper).
3. 🚀 **Submitting your Pull Request:**
   - Test locally with \`npm run dev\` and open \`http://localhost:5173/showcase/${item.project}/index.html\`.
   - In your PR description, include **\`Closes #<this-issue-number>\`** (e.g. \`Closes #12\`).
   - Both \`nsoc26\` and difficulty labels will be validated automatically!

Happy Coding! 🌸`;
}

async function run() {
  console.log(`Starting creation of ${issues.length} minor contributor issues across 20 showcase projects...`);

  for (let i = 0; i < issues.length; i++) {
    const item = issues[i];
    const body = generateBody(item);

    try {
      const res = await octokit.rest.issues.create({
        owner,
        repo,
        title: item.title,
        body,
        labels: ["nsoc26", "level1", "good first issue"]
      });

      console.log(`[${i + 1}/${issues.length}] Created Issue #${res.data.number}: ${item.title}`);
    } catch (err) {
      console.error(`[${i + 1}/${issues.length}] Failed to create "${item.title}":`, err.message);
    }

    // Delay 1.2s to prevent GitHub secondary rate limits
    await new Promise(r => setTimeout(r, 1200));
  }

  console.log("All 40 issues created successfully!");
}

run();
