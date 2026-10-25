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
    level: "level2",
    points: "5 Points",
    labels: ["nsoc26", "level2", "enhancement"],
    title: "[agency-studio] Build interactive project case study modal drawer with image gallery",
    description: "Create an interactive sliding modal drawer that opens when a user clicks 'View Case Study' on any portfolio item, displaying full project details, metrics, and client quotes.",
    suggestions: [
      "In `public/showcase/agency-studio/index.html`, add modal drawer markup with close button, image carousel, challenge/solution text, and results stats.",
      "In `styles.css`, style the drawer with a smooth slide-in transform (`translateX` or `translateY`), backdrop blur, and dark glassmorphic styling.",
      "In `script.js`, handle click events to populate and display the drawer with data-attributes from the clicked project card, and close on ESC or overlay click."
    ]
  },
  {
    project: "agency-studio",
    level: "level3",
    points: "10 Points",
    labels: ["nsoc26", "level3", "enhancement"],
    title: "[agency-studio] Implement interactive project cost estimator calculator with dynamic scope breakdown",
    description: "Build an interactive pricing/cost estimator where prospective clients can select project types (Branding, Web App, UI/UX), timeline urgency, and deliverable add-ons, calculating estimated budget and timeline in real-time.",
    suggestions: [
      "Add a 'Project Scope Estimator' section in `public/showcase/agency-studio/index.html` with selectable checkboxes, radio buttons, and timeline sliders.",
      "In `script.js`, write a stateful calculation engine that dynamically tallies base cost, complexity multipliers, and estimated delivery weeks.",
      "In `styles.css`, style the estimator with interactive glowing pill buttons, a summary invoice breakdown card, and a 'Request Quote with this Spec' action button."
    ]
  },

  // 2. ai-voice-studio
  {
    project: "ai-voice-studio",
    level: "level2",
    points: "5 Points",
    labels: ["nsoc26", "level2", "enhancement"],
    title: "[ai-voice-studio] Build interactive voice pitch, speed & emotion slider control panel",
    description: "Add a voice studio configuration panel with interactive range sliders for Pitch (0.5x - 2x), Speed (0.5x - 2x), and Emotion presets (Neutral, Cheerful, Professional, Energetic).",
    suggestions: [
      "In `public/showcase/ai-voice-studio/index.html`, create a Studio Tuner control card with custom sliders and value readouts.",
      "In `styles.css`, style custom slider tracks (`::-webkit-slider-thumb`) with neon accent colors and value chips.",
      "In `script.js`, attach input listeners that dynamically update value displays and trigger reactive visual feedback on voice model cards."
    ]
  },
  {
    project: "ai-voice-studio",
    level: "level3",
    points: "10 Points",
    labels: ["nsoc26", "level3", "enhancement"],
    title: "[ai-voice-studio] Implement client-side text-to-speech Web Speech API synthesizer preview engine",
    description: "Implement a live working voice synthesis studio using the browser's native `window.speechSynthesis` API, allowing users to type custom text, select an available browser voice, tune rate/pitch, and hear the speech live.",
    suggestions: [
      "Add a textarea and 'Synthesize Voice' button in `public/showcase/ai-voice-studio/index.html`.",
      "In `script.js`, populate available voices with `speechSynthesis.getVoices()`, configure `SpeechSynthesisUtterance`, and handle start/stop/pause states.",
      "Add animated visualizer equalizer bars in `styles.css` that pulse while speech synthesis is active."
    ]
  },

  // 3. automotive-hypercar
  {
    project: "automotive-hypercar",
    level: "level2",
    points: "5 Points",
    labels: ["nsoc26", "level2", "enhancement"],
    title: "[automotive-hypercar] Build a 360-degree vehicle colorway visualizer and wheel selector",
    description: "Provide an interactive car configurator section where users can switch between exterior paint finishes (e.g., Apex Stealth Black, Liquid Mercury, Hyper Orange, Racing Crimson) and wheel styles, updating the featured hypercar image and color name display.",
    suggestions: [
      "Add color swatch circles and wheel finish buttons in `public/showcase/automotive-hypercar/index.html`.",
      "In `script.js`, swap high-res vehicle imagery or apply coordinated SVG color overlay masks on click.",
      "In `styles.css`, style the color swatches with metallic gradients, active selection rings, and smooth image fade transitions."
    ]
  },
  {
    project: "automotive-hypercar",
    level: "level3",
    points: "10 Points",
    labels: ["nsoc26", "level3", "enhancement"],
    title: "[automotive-hypercar] Build an interactive race telemetries & performance comparison simulator",
    description: "Build an interactive head-to-head performance comparator where users can pit the Hypercar against top supercar benchmarks (e.g. Bugatti, Koenigsegg) across 0-60, Quarter Mile, Top Speed, and G-Force with animated comparative progress bars.",
    suggestions: [
      "In `public/showcase/automotive-hypercar/index.html`, add a comparator arena with car selector dropdowns and metric charts.",
      "In `script.js`, store specs data objects and dynamically animate metric bar widths when vehicles are chosen.",
      "Style with an authentic motorsport HUD aesthetic in `styles.css` using carbon fiber textures and telemetry grids."
    ]
  },

  // 4. crypto-exchange-pro
  {
    project: "crypto-exchange-pro",
    level: "level2",
    points: "5 Points",
    labels: ["nsoc26", "level2", "enhancement"],
    title: "[crypto-exchange-pro] Build quick swap order execution panel with slippage tolerance and fee breakdown",
    description: "Create an interactive DEX token swap interface where users can choose Pay/Receive tokens, enter amounts, adjust slippage tolerance (0.1%, 0.5%, 1.0%), and view gas fee estimations.",
    suggestions: [
      "Add token swap card markup in `public/showcase/crypto-exchange-pro/index.html` with swap direction flip button (⇄).",
      "In `script.js`, calculate estimated output tokens based on mock exchange rates and validate balance inputs.",
      "Style with glassmorphism, glowing inputs, and active slippage pill selectors in `styles.css`."
    ]
  },
  {
    project: "crypto-exchange-pro",
    level: "level3",
    points: "10 Points",
    labels: ["nsoc26", "level3", "enhancement"],
    title: "[crypto-exchange-pro] Implement simulated real-time candlestick chart engine with mock price ticker",
    description: "Build an interactive SVG or HTML Canvas candlestick/line market chart with interval selectors (1H, 24H, 1W, 1M) and an interval-driven mock price engine that animates updates to the orderbook and live ticker.",
    suggestions: [
      "In `public/showcase/crypto-exchange-pro/index.html`, add an SVG/Canvas viewport for market charts.",
      "In `script.js`, write a generator that creates realistic price time-series candles with moving averages and updates every 3 seconds.",
      "Add interactive mouse hover crosshairs displaying timestamp and price coordinates in `styles.css`."
    ]
  },

  // 5. culinary-bistro
  {
    project: "culinary-bistro",
    level: "level2",
    points: "5 Points",
    labels: ["nsoc26", "level2", "enhancement"],
    title: "[culinary-bistro] Build interactive multi-step table reservation booking wizard with time-slot selection",
    description: "Create a modern 3-step booking experience: Step 1 (Party size & date selection), Step 2 (Interactive time slots like 6:00 PM, 7:30 PM, 9:00 PM with availability chips), Step 3 (Guest details & special dietary notes).",
    suggestions: [
      "Add multi-step wizard container in `public/showcase/culinary-bistro/index.html` with step indicators.",
      "In `script.js`, handle step navigation, validate selections before proceeding, and display a booking voucher on completion.",
      "In `styles.css`, animate step transitions with cross-fade and style time slot pills with active/disabled states."
    ]
  },
  {
    project: "culinary-bistro",
    level: "level3",
    points: "10 Points",
    labels: ["nsoc26", "level3", "enhancement"],
    title: "[culinary-bistro] Implement online takeout order builder with cart calculation, tips, and item customization",
    description: "Build a complete client-side dining takeout ordering system where guests can click 'Order Online', customize dish cooking preferences/sides in a modal, see item subtotal and tip percentages (15%, 18%, 20%), and calculate final bill with taxes.",
    suggestions: [
      "Add dish customization modal markup and a floating checkout cart tray in `public/showcase/culinary-bistro/index.html`.",
      "In `script.js`, manage full cart state with item options, quantity adjustments, tax (8.5%), and tip percentage toggles.",
      "Style the slide-out checkout bill with elegant bistro typography, receipts styling, and order confirmation receipt in `styles.css`."
    ]
  },

  // 6. cybersecurity-sentinel
  {
    project: "cybersecurity-sentinel",
    level: "level2",
    points: "5 Points",
    labels: ["nsoc26", "level2", "enhancement"],
    title: "[cybersecurity-sentinel] Build live incident response filterable timeline feed with severity badges",
    description: "Create an interactive security incident activity feed where events (DDoS Mitigated, Brute Force Blocked, SSL Renewal, Zero-Day Patch) can be filtered by severity (Critical, High, Medium, Info).",
    suggestions: [
      "Add an incident timeline container with severity filter pills in `public/showcase/cybersecurity-sentinel/index.html`.",
      "In `script.js`, render timeline events and filter dynamically based on clicked severity tags.",
      "Style with cyber neon borders, monospace timestamps, and color-coded event indicators in `styles.css`."
    ]
  },
  {
    project: "cybersecurity-sentinel",
    level: "level3",
    points: "10 Points",
    labels: ["nsoc26", "level3", "enhancement"],
    title: "[cybersecurity-sentinel] Implement interactive password strength analyzer & entropy calculation visualizer",
    description: "Build a security tool widget that evaluates password complexity in real time, calculating cryptographic entropy (bits), crack-time estimation, and a checklist of security criteria (length, character variety, common pattern checks).",
    suggestions: [
      "In `public/showcase/cybersecurity-sentinel/index.html`, add an interactive password audit card with input and strength meter.",
      "In `script.js`, implement Shannon entropy calculation, brute-force duration algorithm, and dynamic requirements checklist updates.",
      "In `styles.css`, style an animated multi-segment strength progress bar that shifts from red to amber to green."
    ]
  },

  // 7. developer-portfolio
  {
    project: "developer-portfolio",
    level: "level1",
    points: "3 Points",
    labels: ["nsoc26", "level1", "good first issue"],
    title: "[developer-portfolio] Add comprehensive keyboard navigation cheat-sheet modal and shortcut listeners",
    description: "Add a 'Press ? for Keyboard Shortcuts' modal guide that lists global hotkeys (e.g. `T` for Theme, `C` for Clear Terminal, `H` for Home, `Esc` to Close) and attaches global keydown listeners.",
    suggestions: [
      "In `public/showcase/developer-portfolio/index.html`, add modal dialog markup showcasing hotkey badges (`<kbd>Ctrl+K</kbd>`).",
      "In `script.js`, add `window.addEventListener('keydown')` to trigger shortcut actions and open/close the help modal.",
      "Style keyboard shortcut keys with embossed terminal styling in `styles.css`."
    ]
  },
  {
    project: "developer-portfolio",
    level: "level3",
    points: "10 Points",
    labels: ["nsoc26", "level3", "enhancement"],
    title: "[developer-portfolio] Implement interactive terminal filesystem emulator with cd, ls, cat, and clear commands",
    description: "Turn the terminal into a functional virtual file system where visitors can run commands like `ls` (view project files), `cd projects` (navigate folders), `cat bio.txt` (read markdown content), and `theme dark/light`.",
    suggestions: [
      "In `public/showcase/developer-portfolio/script.js`, create a virtual JSON tree structure representing directories and files.",
      "Implement command parser handling `help`, `ls`, `cd`, `pwd`, `cat`, `clear`, `echo`, and error feedback for unknown commands.",
      "Format output with directory color coding (cyan for folders, green for executables) in `styles.css`."
    ]
  },

  // 8. docs-portal
  {
    project: "docs-portal",
    level: "level1",
    points: "3 Points",
    labels: ["nsoc26", "level1", "good first issue"],
    title: "[docs-portal] Add reading progress bar and estimated read-time indicator across documentation articles",
    description: "Add a top fixed reading progress bar that smoothly fills as the user scrolls through the doc article, along with a calculated '⏱️ 4 min read' badge.",
    suggestions: [
      "Add progress bar element `<div class='scroll-progress'></div>` at top of `public/showcase/docs-portal/index.html`.",
      "In `script.js`, calculate `(window.scrollY / (documentHeight - windowHeight)) * 100` and update bar width.",
      "In `styles.css`, style with a glowing gradient accent line."
    ]
  },
  {
    project: "docs-portal",
    level: "level3",
    points: "10 Points",
    labels: ["nsoc26", "level3", "enhancement"],
    title: "[docs-portal] Implement interactive live API request playground with method selector and simulated response",
    description: "Build an interactive API console widget (like Swagger / Postman) inside the documentation where users can choose HTTP methods (GET, POST), input custom query params or JSON payload, click 'Send Request', and see formatted JSON responses with status codes and response latency.",
    suggestions: [
      "In `public/showcase/docs-portal/index.html`, add request composer markup (method badge, endpoint input, tabbed params/body, 'Send' button, response console).",
      "In `script.js`, simulate request delays (200ms - 500ms), return realistic mock JSON responses, and display HTTP 200 OK badges.",
      "In `styles.css`, format response with syntax-highlighted dark theme code styling."
    ]
  },

  // 9. ecommerce-store
  {
    project: "ecommerce-store",
    level: "level2",
    points: "5 Points",
    labels: ["nsoc26", "level2", "enhancement"],
    title: "[ecommerce-store] Build product quick-view modal with thumbnail gallery and instant add-to-cart",
    description: "Add a 'Quick View' preview button on product cards that triggers a modal displaying product image gallery, variant selectors (size/color), detailed specifications, and add-to-cart action without leaving the catalog.",
    suggestions: [
      "In `public/showcase/ecommerce-store/index.html`, create modal container with image carousel, variant buttons, and quantity counter.",
      "In `script.js`, bind quick view buttons to load selected product details into the modal.",
      "In `styles.css`, add smooth zoom entrance animation and styling for option swatches."
    ]
  },
  {
    project: "ecommerce-store",
    level: "level3",
    points: "10 Points",
    labels: ["nsoc26", "level3", "enhancement"],
    title: "[ecommerce-store] Implement full client-side promo coupon discount engine and order summary state",
    description: "Build a complete discount coupon system (e.g. `CAREER20` for 20% off, `FREESHIP` for free delivery) that validates codes, applies progressive savings, updates subtotal/taxes/shipping in real time, and persists the applied promo in `localStorage`.",
    suggestions: [
      "Add coupon input field and 'Apply' button in cart drawer of `public/showcase/ecommerce-store/index.html`.",
      "In `script.js`, create a coupon validator dictionary, apply discounts with error messaging for invalid codes, and update totals.",
      "In `styles.css`, style active promo chips with a green checkmark and 'Remove' button."
    ]
  },

  // 10. edtech-academy
  {
    project: "edtech-academy",
    level: "level2",
    points: "5 Points",
    labels: ["nsoc26", "level2", "enhancement"],
    title: "[edtech-academy] Build interactive course curriculum syllabus accordion with lecture preview modals",
    description: "Create an expandable course syllabus accordion with lecture topics, lesson durations, and clickable 'Preview' badges that open a sample video/lesson modal.",
    suggestions: [
      "In `public/showcase/edtech-academy/index.html`, build module accordion items with lesson counts and expansion arrows.",
      "In `script.js`, handle expansion toggling and trigger lesson preview video modals on click.",
      "In `styles.css`, style the syllabus items with clean borders, hover highlights, and smooth height transitions."
    ]
  },
  {
    project: "edtech-academy",
    level: "level3",
    points: "10 Points",
    labels: ["nsoc26", "level3", "enhancement"],
    title: "[edtech-academy] Implement interactive quiz assessment engine with scoring, timer, and certificate modal",
    description: "Build a 5-question interactive coding knowledge quiz with multiple-choice questions, a 60-second countdown timer, immediate answer explanation feedback, and a personalized completion certificate display upon passing (>80%).",
    suggestions: [
      "In `public/showcase/edtech-academy/index.html`, add quiz container markup with question counter, timer, options, and certificate template.",
      "In `script.js`, implement question progression state, score calculation, timer countdown, and certificate name generator.",
      "Style with vibrant academy colors, answer select animations, and an elegant certificate card in `styles.css`."
    ]
  },

  // 11. festival-hub
  {
    project: "festival-hub",
    level: "level2",
    points: "5 Points",
    labels: ["nsoc26", "level2", "enhancement"],
    title: "[festival-hub] Build interactive custom schedule planner with save-to-favorites list",
    description: "Allow festival goers to click a heart/bookmark icon on any DJ/performer set time to build their own personalized festival timetable, accessible via a 'My Schedule' tab.",
    suggestions: [
      "In `public/showcase/festival-hub/index.html`, add favorite buttons to lineup set cards and a 'My Schedule' drawer tab.",
      "In `script.js`, manage saved artist IDs in `localStorage` and filter schedule view to only favorited artists.",
      "In `styles.css`, style active favorite hearts with pop animation and render custom schedule timetable."
    ]
  },
  {
    project: "festival-hub",
    level: "level3",
    points: "10 Points",
    labels: ["nsoc26", "level3", "enhancement"],
    title: "[festival-hub] Implement tiered festival pass ticket tier calculator with add-ons (camping, VIP, locker)",
    description: "Build a ticket selection and price calculator where attendees can choose ticket tiers (General Admission, VIP Access, Ultra Platinum), adjust ticket quantities, toggle optional add-ons (Tent Camping, Locker, Fast-Pass), and view dynamic price totals.",
    suggestions: [
      "Add ticket pricing tier cards and add-on checklist in `public/showcase/festival-hub/index.html`.",
      "In `script.js`, calculate itemized ticket totals, service fees, and group bundle discounts.",
      "Style with neon festival aesthetic, holographic ticket preview card, and 'Proceed to Checkout' action in `styles.css`."
    ]
  },

  // 12. fintech-vault
  {
    project: "fintech-vault",
    level: "level2",
    points: "5 Points",
    labels: ["nsoc26", "level2", "enhancement"],
    title: "[fintech-vault] Build filterable transaction history search with date range and category pills",
    description: "Create an interactive banking ledger table where users can search transactions by merchant name, filter by category (Investments, Transfers, Subscriptions, Dividends), and sort by date or amount.",
    suggestions: [
      "In `public/showcase/fintech-vault/index.html`, add search bar, category filter buttons, and sortable table headers.",
      "In `script.js`, filter mock transaction array dynamically based on keyword search and selected category pills.",
      "Style transaction rows with status badges (+ green for deposits, - white for withdrawals) in `styles.css`."
    ]
  },
  {
    project: "fintech-vault",
    level: "level3",
    points: "10 Points",
    labels: ["nsoc26", "level3", "enhancement"],
    title: "[fintech-vault] Implement compound interest retirement growth projection engine with dynamic SVG chart",
    description: "Build an interactive wealth growth simulator where users adjust Initial Deposit, Monthly Contribution, Annual Interest Rate (%), and Investment Horizon (years), rendering an interactive SVG area chart of total wealth vs total contributions.",
    suggestions: [
      "In `public/showcase/fintech-vault/index.html`, create calculator controls and an SVG chart container.",
      "In `script.js`, compute monthly compounding math and dynamically generate SVG path coordinates (`<path d='...'>`) for projection curves.",
      "In `styles.css`, style with glowing financial chart gradients, tooltips on hover, and clear milestone stat callouts."
    ]
  },

  // 13. gaming-esports-hub
  {
    project: "gaming-esports-hub",
    level: "level2",
    points: "5 Points",
    labels: ["nsoc26", "level2", "enhancement"],
    title: "[gaming-esports-hub] Build tournament knockout bracket visualizer with clickable matchup details",
    description: "Create an interactive esports tournament bracket (Quarterfinals -> Semifinals -> Grand Finals) with team logos, match scores, and clickable matchup cards opening post-match stat breakdown.",
    suggestions: [
      "In `public/showcase/gaming-esports-hub/index.html`, construct bracket tree markup with connecting bracket lines.",
      "In `styles.css`, style bracket connectors with glowing cyber borders and winner highlights.",
      "In `script.js`, add click interactions on matchups to display individual player KDA scores in a modal."
    ]
  },
  {
    project: "gaming-esports-hub",
    level: "level3",
    points: "10 Points",
    labels: ["nsoc26", "level3", "enhancement"],
    title: "[gaming-esports-hub] Implement pro player roster stats comparator tool with radar chart visualization",
    description: "Build an interactive head-to-head comparison tool where users can pick two pro esports players and compare their performance metrics (Aim Accuracy, Reaction Time, K/D Ratio, Clutch Rate, Win %) using a dynamic SVG radar/spider chart.",
    suggestions: [
      "Add player selection dropdowns and an SVG polygon container in `public/showcase/gaming-esports-hub/index.html`.",
      "In `script.js`, calculate radar polygon coordinates using trigonometric math (`sin`/`cos`) for each metric axis.",
      "In `styles.css`, style the overlapping radar charts with semi-transparent neon fills and data point markers."
    ]
  },

  // 14. health-vitality
  {
    project: "health-vitality",
    level: "level2",
    points: "5 Points",
    labels: ["nsoc26", "level2", "enhancement"],
    title: "[health-vitality] Build interactive macro nutrition calculator (Calories, Protein, Carbs, Fats)",
    description: "Add a fitness nutrition widget where users input weight, height, activity level, and goal (Weight Loss, Maintenance, Muscle Gain), calculating daily target caloric intake and macronutrient gram breakdowns.",
    suggestions: [
      "In `public/showcase/health-vitality/index.html`, add input form and macro results dashboard cards.",
      "In `script.js`, implement Mifflin-St Jeor formula to compute Basal Metabolic Rate (BMR) and macro splits.",
      "In `styles.css`, style macro breakdown cards with colored progress bars (Protein: Blue, Carbs: Amber, Fats: Rose)."
    ]
  },
  {
    project: "health-vitality",
    level: "level3",
    points: "10 Points",
    labels: ["nsoc26", "level3", "enhancement"],
    title: "[health-vitality] Implement dynamic biological age assessment test wizard with personalized recommendations",
    description: "Build an interactive 6-question longevity assessment quiz (sleep hours, exercise frequency, resting heart rate, stress levels) calculating estimated Biological Age vs Chronological Age with customized health optimization advice.",
    suggestions: [
      "Add question wizard container in `public/showcase/health-vitality/index.html` with step indicator.",
      "In `script.js`, calculate longevity score offset from inputs and display biological age difference badge (e.g. '-3.5 Years Younger').",
      "Style with clean biomedical aesthetic, animated score reveal dial, and recommendation action cards in `styles.css`."
    ]
  },

  // 15. luxury-realms
  {
    project: "luxury-realms",
    level: "level1",
    points: "3 Points",
    labels: ["nsoc26", "level1", "good first issue"],
    title: "[luxury-realms] Add curated amenity checklist cards with high-contrast luxury iconography",
    description: "Enhance private estate and island listing cards by adding elegant luxury amenity badges (Helipad, Private Dock, Michelin Chef, Infinity Pool, Wine Cellar) with refined gold-trimmed icons.",
    suggestions: [
      "In `public/showcase/luxury-realms/index.html`, add amenity badges to featured villas.",
      "In `styles.css`, style badges with gold foil borders (`#d4af37`), muted dark backgrounds, and subtle hover scale.",
      "Ensure icons are crisp and have proper alt/aria attributes."
    ]
  },
  {
    project: "luxury-realms",
    level: "level3",
    points: "10 Points",
    labels: ["nsoc26", "level3", "enhancement"],
    title: "[luxury-realms] Implement bespoke multi-destination itinerary builder with cost tally and export to PDF/print",
    description: "Build an exclusive travel curator experience where VIP guests can add destinations (Monaco, St. Barts, Aspen, Maldives), configure travel duration and yacht/jet options, calculating total package cost and offering a 'Print Itinerary' window.",
    suggestions: [
      "In `public/showcase/luxury-realms/index.html`, build itinerary builder layout with destination picker cards and summary sidebar.",
      "In `script.js`, handle adding/removing destinations, calculating cumulative cost, and triggering `window.print()` with print-optimized styles.",
      "In `styles.css`, create clean `@media print` rules and luxury digital invoice styling."
    ]
  },

  // 16. nonprofit-impact
  {
    project: "nonprofit-impact",
    level: "level2",
    points: "5 Points",
    labels: ["nsoc26", "level2", "enhancement"],
    title: "[nonprofit-impact] Build custom donation amount selector with one-time vs monthly recurring toggle",
    description: "Create an interactive donation widget with pre-set amount chips ($10, $25, $50, $100), custom amount input, One-time vs Monthly recurring impact toggle, and impact explanation (e.g. '$50 plants 25 trees').",
    suggestions: [
      "In `public/showcase/nonprofit-impact/index.html`, add donation card with frequency toggle, amount buttons, and custom input.",
      "In `script.js`, update selected amount state, calculate trees planted equivalency, and handle form submission feedback.",
      "In `styles.css`, style selected amount pills with glowing emerald borders and active elevation."
    ]
  },
  {
    project: "nonprofit-impact",
    level: "level3",
    points: "10 Points",
    labels: ["nsoc26", "level3", "enhancement"],
    title: "[nonprofit-impact] Implement carbon footprint calculation tool with actionable reduction suggestions",
    description: "Build a multi-factor carbon footprint estimator tool where visitors input commute type (Car, Transit, Flight hours), diet habits, and home energy consumption, calculating metric tons of CO2/year and suggesting offset contribution amounts.",
    suggestions: [
      "In `public/showcase/nonprofit-impact/index.html`, add carbon calculator form with interactive sliders and category icons.",
      "In `script.js`, implement carbon formula calculations and display comparative benchmark against global averages.",
      "Style with interactive gauge visualizer, eco-friendly green color palette, and 'Offset My Emissions' CTA in `styles.css`."
    ]
  },

  // 17. podcast-audio-stream
  {
    project: "podcast-audio-stream",
    level: "level2",
    points: "5 Points",
    labels: ["nsoc26", "level2", "enhancement"],
    title: "[podcast-audio-stream] Build persistent mini floating audio player bar with timeline scrubber and volume control",
    description: "Implement a persistent bottom dock audio player bar that appears when an episode is played, complete with play/pause button, track title, interactive timeline seeker bar, and volume slider.",
    suggestions: [
      "In `public/showcase/podcast-audio-stream/index.html`, create a sticky bottom audio dock element.",
      "In `script.js`, update current playback time on a timer, support scrubbing by clicking the seekbar, and adjust audio volume.",
      "In `styles.css`, style with sleek glassmorphism, responsive controls, and track thumbnail."
    ]
  },
  {
    project: "podcast-audio-stream",
    level: "level3",
    points: "10 Points",
    labels: ["nsoc26", "level3", "enhancement"],
    title: "[podcast-audio-stream] Implement episode transcript viewer with clickable timestamps that sync audio playback",
    description: "Add a full interactive transcript reader tab for podcast episodes where clicking any timestamp (e.g. `[04:22]`) jumps the audio player to that exact time and highlights the active transcript paragraph as playback progresses.",
    suggestions: [
      "In `public/showcase/podcast-audio-stream/index.html`, add an episode transcript tab with paragraph blocks and timestamp badges.",
      "In `script.js`, sync transcript highlights based on simulated playback timestamp and jump to position on timestamp click.",
      "In `styles.css`, style active transcript segment with subtle highlight background and smooth auto-scroll."
    ]
  },

  // 18. real-estate-luxe
  {
    project: "real-estate-luxe",
    level: "level2",
    points: "5 Points",
    labels: ["nsoc26", "level2", "enhancement"],
    title: "[real-estate-luxe] Build advanced property filter sidebar (Price slider, bedrooms, amenities, property type)",
    description: "Add a filter drawer / sidebar allowing prospective buyers to filter estate listings by price range ($1M - $25M+), minimum bedrooms, property type (Villa, Penthouse, Island, Châteaux), and special amenities.",
    suggestions: [
      "In `public/showcase/real-estate-luxe/index.html`, add filter sidebar markup with dual range sliders and checkboxes.",
      "In `script.js`, filter property listing cards dynamically and update the matching properties counter (e.g., 'Showing 4 of 12 Estates').",
      "In `styles.css`, style the filter panel with refined minimalist borders, luxury gold sliders, and reset button."
    ]
  },
  {
    project: "real-estate-luxe",
    level: "level3",
    points: "10 Points",
    labels: ["nsoc26", "level3", "enhancement"],
    title: "[real-estate-luxe] Implement comprehensive mortgage monthly payment calculator with amortization schedule",
    description: "Build an interactive real estate mortgage financing calculator allowing buyers to input Home Price, Down Payment (%), Loan Term (15/30 yrs), and Interest Rate, calculating monthly principal, property taxes, HOA fees, and home insurance.",
    suggestions: [
      "In `public/showcase/real-estate-luxe/index.html`, add mortgage calculation card and payment breakdown donut chart.",
      "In `script.js`, implement standard financial amortization calculation formula (`M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1]`).",
      "Style with sleek payment donut breakdown segments and itemized monthly fee tally in `styles.css`."
    ]
  },

  // 19. saas-launchpad
  {
    project: "saas-launchpad",
    level: "level1",
    points: "3 Points",
    labels: ["nsoc26", "level1", "good first issue"],
    title: "[saas-launchpad] Add interactive customer testimonial carousel with company logo badges and star ratings",
    description: "Enhance the social proof section by adding an auto-rotating / clickable customer testimonial slider with customer avatars, role badges, verified company logos, and 5-star rating stars.",
    suggestions: [
      "In `public/showcase/saas-launchpad/index.html`, add testimonial card slider with indicator dots and navigation arrows.",
      "In `script.js`, handle active slide transitions and optional 5-second auto-rotate timer.",
      "In `styles.css`, style review cards with glassmorphic glow and amber star rating icons."
    ]
  },
  {
    project: "saas-launchpad",
    level: "level3",
    points: "10 Points",
    labels: ["nsoc26", "level3", "enhancement"],
    title: "[saas-launchpad] Implement interactive ROI value calculator estimating hours and dollars saved per team size",
    description: "Build an interactive B2B SaaS ROI calculator where engineering leads select team size (5 - 500 devs) and average hourly rate, dynamically calculating annual engineering hours saved and projected dollar savings.",
    suggestions: [
      "In `public/showcase/saas-launchpad/index.html`, add team size slider, hourly rate input, and animated ROI savings banner.",
      "In `script.js`, calculate annual ROI metrics dynamically and animate counter numbers as slider changes.",
      "In `styles.css`, style with glowing stats cards and a 'Book a Demo with this ROI Report' CTA button."
    ]
  },

  // 20. travel-odyssey
  {
    project: "travel-odyssey",
    level: "level2",
    points: "5 Points",
    labels: ["nsoc26", "level2", "enhancement"],
    title: "[travel-odyssey] Build interactive day-by-day expedition timeline with collapsible waypoint cards",
    description: "Create an interactive travel itinerary timeline for featured expeditions (e.g. Antarctic Crossing, Silk Road) with collapsible Day 1 - Day 10 waypoint cards displaying coordinates, activity summaries, and elevation charts.",
    suggestions: [
      "In `public/showcase/travel-odyssey/index.html`, add vertical timeline structure with day nodes and expand/collapse cards.",
      "In `script.js`, add click handlers to toggle day details and highlight the current active waypoint on the timeline.",
      "In `styles.css`, style the vertical timeline with glowing line connectors and expedition coordinate chips."
    ]
  },
  {
    project: "travel-odyssey",
    level: "level3",
    points: "10 Points",
    labels: ["nsoc26", "level3", "enhancement"],
    title: "[travel-odyssey] Implement interactive expedition packing checklist builder with progress tracker and storage",
    description: "Build an interactive packing gear checklist tool categorized into Clothing, Navigation Gear, First Aid, and Photography Equipment. Users can check off items, see percentage readiness progress, add custom gear items, and persist the checklist in `localStorage`.",
    suggestions: [
      "In `public/showcase/travel-odyssey/index.html`, add checklist widget with category tabs, item checkboxes, and 'Add Item' form.",
      "In `script.js`, manage item check states in `localStorage`, calculate completion percentage, and support adding/deleting custom gear items.",
      "In `styles.css`, style completed items with strike-through and animate a circular readiness progress bar."
    ]
  }
];

function generateBody(item) {
  const suggestionsList = item.suggestions.map(s => `- ${s}`).join("\n");
  return `### 🎯 Task Overview
- **Project Directory:** \`public/showcase/${item.project}/\`
- **Difficulty:** \`${item.level}\` (${item.points})
- **Track:** Nexus Spring of Code 2026 (\`nsoc26\`)
- **Category:** Open-Source Feature & UI Enhancement

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
   - **Do not** modify \`src/\`, root configuration, or workflow files (PRs violating this will be auto-closed by our PR Gatekeeper).
3. 🚀 **Submitting your Pull Request:**
   - Test locally with \`npm run dev\` and open \`http://localhost:5173/showcase/${item.project}/index.html\`.
   - In your PR description, include **\`Closes #<this-issue-number>\`** (e.g. \`Closes #47\`).
   - Both \`nsoc26\` and difficulty level labels will be verified automatically!

Happy Coding! 🌸`;
}

async function run() {
  console.log(`Starting creation of ${issues.length} multi-level contributor issues across 20 showcase projects...`);

  for (let i = 0; i < issues.length; i++) {
    const item = issues[i];
    const body = generateBody(item);

    try {
      const res = await octokit.rest.issues.create({
        owner,
        repo,
        title: item.title,
        body,
        labels: item.labels
      });

      console.log(`[${i + 1}/${issues.length}] Created Issue #${res.data.number} (${item.level}): ${item.title}`);
    } catch (err) {
      console.error(`[${i + 1}/${issues.length}] Failed to create "${item.title}":`, err.message);
    }

    // Delay 1.2s to prevent GitHub secondary rate limits
    await new Promise(r => setTimeout(r, 1200));
  }

  console.log("All 40 multi-level issues created successfully!");
}

run();
