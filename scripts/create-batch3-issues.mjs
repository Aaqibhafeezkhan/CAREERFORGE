import { Octokit } from "@octokit/rest";
import { execSync } from "child_process";

// Get token from gh CLI
const token = execSync("gh auth token", { encoding: "utf-8" }).trim();
const octokit = new Octokit({ auth: token });
const owner = "Pratyush-Panda-2006";
const repo = "CAREERFORGE";

const issues = [
  // 1. cybersecurity-sentinel (Level 3 - 10 pts)
  {
    project: "cybersecurity-sentinel",
    level: "level3",
    points: "10 Points",
    labels: ["nsoc26", "level3", "enhancement"],
    title: "[cybersecurity-sentinel] Implement interactive live global cyber threat attack map with animated missile vectors",
    description: "Build an interactive SVG/Canvas world threat map displaying real-time simulated cyber attack vectors (DDoS, Ransomware, SQLi) streaming across continents with origin/destination lat-long coords and an attack log console.",
    suggestions: [
      "In `public/showcase/cybersecurity-sentinel/index.html`, add a dedicated Global Threat Map viewport section.",
      "In `script.js`, create an animated attack particle simulation using HTML5 Canvas or SVG `<path>` curves showing attack trajectories.",
      "Add a live attack telemetry ticker at the bottom of the map displaying Country Origin, Target Port, and Attack Type.",
      "Style with neon cyber radar aesthetics (radar sweep animation, glowing dots) in `styles.css`."
    ]
  },

  // 2. crypto-exchange-pro (Level 3 - 10 pts)
  {
    project: "crypto-exchange-pro",
    level: "level3",
    points: "10 Points",
    labels: ["nsoc26", "level3", "enhancement"],
    title: "[crypto-exchange-pro] Implement DeFi liquidity pool staking and yield farming rewards calculator",
    description: "Build an interactive DeFi Staking / Yield Farming module where users can simulate depositing LP tokens (e.g. ETH/USDC, SOL/USDT), select lockup periods (30, 90, 365 days), and dynamically calculate APY % and daily/monthly token reward projections.",
    suggestions: [
      "In `public/showcase/crypto-exchange-pro/index.html`, create a 'Yield Farming & Staking' dashboard tab or section.",
      "In `script.js`, compute dynamic APY formulas, reward tier multipliers, and simulate claimable rewards ticking upward in real-time.",
      "In `styles.css`, style with glowing card borders, reward claim button animations, and APY percentage pill badges."
    ]
  },

  // 3. automotive-hypercar (Level 3 - 10 pts)
  {
    project: "automotive-hypercar",
    level: "level3",
    points: "10 Points",
    labels: ["nsoc26", "level3", "enhancement"],
    title: "[automotive-hypercar] Build interactive aerodynamic virtual wind tunnel visualizer with drag coefficient simulator",
    description: "Create an interactive aerodynamic simulation where users can toggle active aero wings (Deploy / Retract / Airbrake), adjust virtual wind speeds (100 - 300 mph), and see dynamic drag coefficient (Cd) calculations and animated airflow stream lines.",
    suggestions: [
      "In `public/showcase/automotive-hypercar/index.html`, create a Virtual Wind Tunnel section with vehicle silhouette and wind speed slider.",
      "In `script.js`, animate particle flow lines across the car body and calculate simulated downforce (kg) and drag resistance.",
      "In `styles.css`, style aerodynamic streamlines with neon blue/cyan particles and telemetry readouts."
    ]
  },

  // 4. edtech-academy (Level 2 - 5 pts)
  {
    project: "edtech-academy",
    level: "level2",
    points: "5 Points",
    labels: ["nsoc26", "level2", "enhancement"],
    title: "[edtech-academy] Build interactive spaced-repetition coding flashcards trainer with flip card animations",
    description: "Add an interactive learning flashcard deck for web concepts (JavaScript, CSS, TypeScript). Users can click cards to flip between question and code solution, rate difficulty (Easy, Medium, Hard), and track mastery progress.",
    suggestions: [
      "In `public/showcase/edtech-academy/index.html`, add a Flashcard Training section with 3D flip card markup.",
      "In `styles.css`, implement 3D CSS card flip using `transform-style: preserve-3d` and `transform: rotateY(180deg)`.",
      "In `script.js`, manage flashcard deck state, randomize questions, and track score/mastery percentage."
    ]
  },

  // 5. culinary-bistro (Level 2 - 5 pts)
  {
    project: "culinary-bistro",
    level: "level2",
    points: "5 Points",
    labels: ["nsoc26", "level2", "enhancement"],
    title: "[culinary-bistro] Build interactive digital sommelier wine pairing recommendation finder",
    description: "Create an interactive wine pairing assistant where diners select their chosen entrée (Steak Frites, Duck Confit, Truffle Risotto, Salmon) and the sommelier assistant displays paired wine notes (vintage, tasting notes, grape varietal, tasting intensity rating).",
    suggestions: [
      "In `public/showcase/culinary-bistro/index.html`, add a 'Sommelier Wine Pairings' interactive card or tab.",
      "In `script.js`, build a wine pairing dictionary that reactively displays recommended bottles and flavor profiles based on selected dishes.",
      "In `styles.css`, style with rich burgundy/gold bistro accents, wine bottle badges, and aroma tag chips."
    ]
  },

  // 6. gaming-esports-hub (Level 3 - 10 pts)
  {
    project: "gaming-esports-hub",
    level: "level3",
    points: "10 Points",
    labels: ["nsoc26", "level3", "enhancement"],
    title: "[gaming-esports-hub] Implement interactive fantasy esports dream team builder with salary cap management",
    description: "Build an interactive Fantasy Esports Roster builder where users draft 5 pro players across roles (Duelist, Initiator, Controller, Sentinel, IGL) within a $50,000 salary cap, computing projected team synergy and fantasy points.",
    suggestions: [
      "In `public/showcase/gaming-esports-hub/index.html`, create a Fantasy Roster Builder interface with role slots and player bench.",
      "In `script.js`, manage drafted roster state, enforce the $50k salary budget, calculate team synergy score, and save team to `localStorage`.",
      "In `styles.css`, style with glowing role icons, salary progress meter, and cyber esports cards."
    ]
  },

  // 7. luxury-realms (Level 2 - 5 pts)
  {
    project: "luxury-realms",
    level: "level2",
    points: "5 Points",
    labels: ["nsoc26", "level2", "enhancement"],
    title: "[luxury-realms] Build private jet charter fleet explorer with cabin interior walkthrough modal",
    description: "Create a private aviation fleet showcase (Heavy Jet, Midsize, Light Jet) with interactive range map overlays, passenger capacity pills, cruising speed specs, and a high-resolution cabin interior photo tour modal.",
    suggestions: [
      "In `public/showcase/luxury-realms/index.html`, add a Private Fleet Showcase section with aircraft cards.",
      "In `script.js`, bind fleet cards to open a photo modal with thumbnail switcher and cabin amenities checklist.",
      "In `styles.css`, style with elegant gold luxury accents, smooth lightbox transitions, and flight range badges."
    ]
  },

  // 8. nonprofit-impact (Level 2 - 5 pts)
  {
    project: "nonprofit-impact",
    level: "level2",
    points: "5 Points",
    labels: ["nsoc26", "level2", "enhancement"],
    title: "[nonprofit-impact] Build interactive global reforestation project explorer with biome filter tabs",
    description: "Build an interactive global conservation project directory where supporters can filter by biome (Rainforest, Coral Reefs, Boreal Forest, Savanna), view project coordinates, hectares restored, and click to view tree species planted.",
    suggestions: [
      "In `public/showcase/nonprofit-impact/index.html`, add a Conservation Projects Directory with biome filter buttons.",
      "In `script.js`, filter project cards dynamically and animate statistics (survival rate, native species count).",
      "In `styles.css`, style with lush natural earth tones, leaf badge iconography, and clean responsive grids."
    ]
  },

  // 9. developer-portfolio (Level 1 - 3 pts)
  {
    project: "developer-portfolio",
    level: "level1",
    points: "3 Points",
    labels: ["nsoc26", "level1", "good first issue"],
    title: "[developer-portfolio] Add interactive tech stack skill matrix with proficiency progress bars and filter tags",
    description: "Enhance the skills section of the developer portfolio by grouping skills into categories (Frontend, Backend, DevOps, Systems) with smooth animated proficiency progress indicators and technology logo badges.",
    suggestions: [
      "In `public/showcase/developer-portfolio/index.html`, create a structured Skills Matrix section with category filter pills.",
      "In `script.js`, filter visible skills by category and trigger width animation on progress bars when scrolled into view.",
      "In `styles.css`, style skill cards with terminal borders, monospace labels, and neon accent bars."
    ]
  },

  // 10. agency-studio (Level 1 - 3 pts)
  {
    project: "agency-studio",
    level: "level1",
    points: "3 Points",
    labels: ["nsoc26", "level1", "good first issue"],
    title: "[agency-studio] Add interactive client awards & recognitions showcase ticker with animated counter",
    description: "Add an awards & recognition showcase section highlighting design industry accolades (Awwwards Site of the Day, FWA, Red Dot Design, Webby Nominee) with trophy icons and annual award badges.",
    suggestions: [
      "In `public/showcase/agency-studio/index.html`, add an Awards & Honors showcase grid or continuous marquee ticker.",
      "In `styles.css`, style award cards with refined glassmorphism, gold medal accents, and hover elevation.",
      "Ensure clean responsive layout on mobile screens under 640px."
    ]
  }
];

function generateBody(item) {
  const suggestionsList = item.suggestions.map(s => `- ${s}`).join("\n");
  return `### 🎯 Task Overview
- **Project Directory:** \`public/showcase/${item.project}/\`
- **Difficulty:** \`${item.level}\` (${item.points})
- **Track:** Nexus Spring of Code 2026 (\`nsoc26\`)
- **Category:** Feature Implementation & Showcase Expansion

---

### 📝 Issue Description
${item.description}

---

### 💡 Suggested Implementation Steps
${suggestionsList}

---

### 🛡️ Contribution Guidelines & Avoiding Merge Conflicts:
1. ⏳ **How to Claim:**
   - Reply with **\`/claim\`** in the comments below.
   - Our automation bot will assign you and start your **3-day timer (72 hours)**.
2. 🔄 **Avoid Merge Conflicts:**
   - Always make sure your branch is up to date with the latest \`main\` before submitting your PR:
     \`\`\`bash
     git remote add upstream https://github.com/Pratyush-Panda-2006/CAREERFORGE.git
     git fetch upstream
     git rebase upstream/main  # or git merge upstream/main
     \`\`\`
   - If git flags a conflict, resolve the conflict markers in your files, test locally, and push!
3. 🔒 **Showcase Scope Policy:**
   - All code changes must strictly reside inside **\`public/showcase/${item.project}/\`**.
   - **Do not** modify \`src/\`, root configuration, or workflow files.
4. 🚀 **Submitting your Pull Request:**
   - Test locally with \`npm run dev\` and verify \`http://localhost:5173/showcase/${item.project}/index.html\`.
   - In your PR description, include **\`Closes #<this-issue-number>\`** (e.g. \`Closes #97\`).
   - Our PR Gatekeeper will automatically validate your code scope and copy the matching \`nsoc26\` and difficulty labels to your PR!

Happy Coding! 🌸`;
}

async function run() {
  console.log(`Starting creation of 10 new showcase feature issues...`);

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

  console.log("All 10 new issues created successfully!");
}

run();
