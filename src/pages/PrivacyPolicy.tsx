import { Shield, Lock, Eye, Cpu, Database, RefreshCw, Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  const lastUpdated = 'September 7, 2026';

  return (
    <div className="w-full relative z-10 px-4 sm:px-6 md:px-12 pt-8 sm:pt-14 pb-24 max-w-5xl mx-auto">
      {/* Back Navigation */}
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full"
        >
          <ArrowLeft size={14} />
          <span>Back to Overview</span>
        </Link>
      </div>

      {/* Hero Header */}
      <div className="liquid-glass p-5 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl border border-white/15 shadow-2xl mb-8 sm:mb-12">
        <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 flex-shrink-0">
            <Shield size={20} />
          </div>
          <span className="text-[11px] sm:text-xs font-mono text-amber-400 uppercase tracking-widest">
            // LEGAL &amp; COMPLIANCE
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-3 sm:mb-4 break-words">
          Privacy Policy
        </h1>
        <p className="text-zinc-300 text-xs sm:text-sm md:text-base max-w-3xl leading-relaxed font-light">
          At <strong className="text-white font-medium">CARRERFORGE</strong>, we are committed to transparent, privacy-first practices. This Privacy Policy details how we collect, process, and protect developer data, our strict stance on AI data training, and your rights across our open-source ecosystem.
        </p>
        <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-2 sm:gap-4 text-[11px] sm:text-xs font-mono text-zinc-400 border-t border-white/10 pt-4">
          <span>Effective Date: {lastUpdated}</span>
          <span className="text-white/20 hidden xs:inline">•</span>
          <span>Version: 2.1 (GDPR &amp; CCPA Aligned)</span>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-10 text-zinc-300 font-light leading-relaxed">
        {/* Section 1: Overview & Data We Collect */}
        <section className="liquid-glass p-6 sm:p-8 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="text-amber-400" size={20} />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              1. Information We Collect
            </h2>
          </div>
          <p className="mb-4 text-sm sm:text-base">
            CARRERFORGE is structured to minimize data collection. We only process information essential to operating our open-source contribution platform and calculating verifiable leaderboard achievements:
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
              <span>
                <strong className="text-white font-medium">Public GitHub Contributor Data:</strong> Public usernames, profile avatars, repository contributions, and merged pull request metadata publicly accessible via the GitHub REST API.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
              <span>
                <strong className="text-white font-medium">Technical &amp; Network Telemetry:</strong> Standard edge server logs including IP addresses, browser user agent strings, and request timestamps strictly used for load balancing, network security, and DDoS prevention.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
              <span>
                <strong className="text-white font-medium">Local Browser State:</strong> Ephemeral UI preferences (such as filter selections or showcase demo interactions) stored locally on your device via browser memory.
              </span>
            </li>
          </ul>
        </section>

        {/* Section 2: AI Data Usage & Processing Clause */}
        <section className="liquid-glass p-6 sm:p-8 rounded-2xl border border-amber-400/20 bg-amber-500/[0.02]">
          <div className="flex items-center gap-3 mb-4">
            <Cpu className="text-amber-400" size={20} />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              2. AI Data Usage &amp; Processing Clause
            </h2>
          </div>
          <div className="p-4 rounded-xl bg-amber-400/10 border border-amber-400/20 mb-4 text-amber-200 text-sm">
            <strong>Key Commitment:</strong> CARRERFORGE does <u>not</u> use, sell, or license any user code, prompts, or submissions to train third-party foundation or generative AI models.
          </div>
          <p className="mb-4 text-sm sm:text-base">
            When interacting with any integrated AI tools, automated code-linting bots, or AI showcase templates within CARRERFORGE:
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
              <span>
                <strong className="text-white font-medium">No Model Training:</strong> Any developer queries, issue comments, or code reviews are excluded from foundation model training datasets (including models by OpenAI, Anthropic, or Google).
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
              <span>
                <strong className="text-white font-medium">Ephemeral Inference:</strong> Automated workflows process prompts ephemerally in volatile memory. No private prompts or inputs are permanently indexed by external LLMs.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
              <span>
                <strong className="text-white font-medium">Explicit Consent:</strong> Any future opt-in AI evaluation tools will require affirmative, cryptographic or profile-level consent before processing.
              </span>
            </li>
          </ul>
        </section>

        {/* Section 3: Third-Party SDKs & Infrastructure */}
        <section className="liquid-glass p-6 sm:p-8 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="text-amber-400" size={20} />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              3. Third-Party Services &amp; Infrastructure
            </h2>
          </div>
          <p className="mb-4 text-sm sm:text-base">
            We operate a clean infrastructure stack without invasive tracking pixels or commercial ad networks. Below are the verified third-party technical providers utilized by CARRERFORGE:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="text-white font-bold block mb-1">GitHub REST API</span>
              <span className="text-zinc-400">Used strictly to verify public pull request merges and calculate contributor rankings.</span>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="text-white font-bold block mb-1">Amazon CloudFront CDN</span>
              <span className="text-zinc-400">Distributes optimized media and cinematic streaming assets globally with high availability.</span>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="text-white font-bold block mb-1">Google Fonts CDN</span>
              <span className="text-zinc-400">Serves typography styling without cross-site tracking cookies.</span>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="text-white font-bold block mb-1">Edge Static Hosting</span>
              <span className="text-zinc-400">Delivers encrypted HTTPS distribution, caching, and infrastructure-level DDoS resilience.</span>
            </div>
          </div>
        </section>

        {/* Section 4: Data Retention & Permanent Deletion */}
        <section className="liquid-glass p-6 sm:p-8 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <Database className="text-amber-400" size={20} />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              4. Data Retention &amp; Permanent Deletion
            </h2>
          </div>
          <p className="mb-4 text-sm sm:text-base">
            We enforce strict data lifecycle rules aligned with global data protection regulations (including GDPR and CCPA):
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
              <span>
                <strong className="text-white font-medium">Cached Leaderboard Snapshots:</strong> Contributor rankings are recalculated on automated 24-hour cycles. Stale cache records are replaced and expunged automatically.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
              <span>
                <strong className="text-white font-medium">Right to Erasure (Right to be Forgotten):</strong> Any contributor may request complete removal of their handle, avatar, and historical points from public leaderboard displays by submitting an issue or contacting our privacy team.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
              <span>
                <strong className="text-white font-medium">Open Source Code Retention:</strong> Pull requests submitted directly to the public GitHub repository remain governed by the repository's open-source license and GitHub's independent Terms of Service.
              </span>
            </li>
          </ul>
        </section>

        {/* Section 5: Cookies & Local Storage */}
        <section className="liquid-glass p-6 sm:p-8 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <RefreshCw className="text-amber-400" size={20} />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              5. Cookies &amp; Local Storage Policy
            </h2>
          </div>
          <p className="text-sm sm:text-base">
            CARRERFORGE does <u>not</u> set third-party marketing, targeting, or commercial advertising cookies. Any client-side persistence is limited to strictly necessary functional tokens (such as active theme state or temporary demo inputs in showcase playgrounds).
          </p>
        </section>

        {/* Section 6: Contact Channel */}
        <section className="liquid-glass p-6 sm:p-8 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-white font-semibold text-base mb-1">
              <Mail size={18} className="text-amber-400" />
              <span>Privacy Enquiries &amp; Data Rights</span>
            </div>
            <p className="text-xs text-zinc-400">
              For privacy audits, data deletion requests, or compliance questions, reach out directly.
            </p>
          </div>
          <a
            href="https://github.com/Pratyush-Panda-2006/CAREERFORGE/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-white text-black text-xs font-semibold hover:bg-gray-200 transition-colors flex-shrink-0"
          >
            Submit Privacy Request
          </a>
        </section>
      </div>
    </div>
  );
}
