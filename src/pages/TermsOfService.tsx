import { Scale, CheckCircle2, AlertTriangle, Award, FileCode2, ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TermsOfService() {
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
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
            <Scale size={20} />
          </div>
          <span className="text-[11px] sm:text-xs font-mono text-cyan-400 uppercase tracking-widest">
            // USER AGREEMENT &amp; TERMS
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-3 sm:mb-4 break-words">
          Terms of Service
        </h1>
        <p className="text-zinc-300 text-xs sm:text-sm md:text-base max-w-3xl leading-relaxed font-light">
          Welcome to <strong className="text-white font-medium">CARRERFORGE</strong>. These Terms of Service govern your access to and participation within our open-source developer ecosystem, showcase projects, leaderboards, and certificate verification programs.
        </p>
        <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-2 sm:gap-4 text-[11px] sm:text-xs font-mono text-zinc-400 border-t border-white/10 pt-4">
          <span>Effective Date: {lastUpdated}</span>
          <span className="text-white/20 hidden xs:inline">•</span>
          <span>Version: 2.0 (Open Source Contributor Standard)</span>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-10 text-zinc-300 font-light leading-relaxed">
        {/* Section 1: Acceptance & Contributor Eligibility */}
        <section className="liquid-glass p-6 sm:p-8 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="text-cyan-400" size={20} />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              1. Acceptance &amp; Contributor Eligibility
            </h2>
          </div>
          <p className="mb-4 text-sm sm:text-base">
            By accessing CARRERFORGE, cloning repositories, opening issues, or submitting pull requests, you confirm that you have read, understood, and agreed to be bound by these Terms.
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
              <span>You have the legal capacity to enter into binding agreements in your jurisdiction.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
              <span>You possess an active, legitimate GitHub account in good standing.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
              <span>You agree to uphold principles of respectful collaboration and adhere to the project's Code of Conduct.</span>
            </li>
          </ul>
        </section>

        {/* Section 2: Code Contributions & Open Source Licensing */}
        <section className="liquid-glass p-6 sm:p-8 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <FileCode2 className="text-cyan-400" size={20} />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              2. Code Contributions &amp; Licensing
            </h2>
          </div>
          <p className="mb-4 text-sm sm:text-base">
            CARRERFORGE is committed to the open-source community. All software contributions made via GitHub Pull Requests are subject to the following terms:
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
              <span>
                <strong className="text-white font-medium">Original Work Warranty:</strong> You represent and warrant that any code, documentation, or assets you submit are your original creation or that you possess the explicit right to license them under the repository's open-source license.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
              <span>
                <strong className="text-white font-medium">License Grant:</strong> By submitting a Pull Request to CARRERFORGE repositories, you grant CARRERFORGE and all downstream users an irrevocable, worldwide, royalty-free license to use, reproduce, modify, merge, and distribute the contribution.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
              <span>
                <strong className="text-white font-medium">No Proprietary Encumbrances:</strong> You must not submit code subject to restrictive non-disclosure agreements (NDAs) or third-party proprietary trade secrets.
              </span>
            </li>
          </ul>
        </section>

        {/* Section 3: Leaderboard Fair Play & Anti-Abuse Rules */}
        <section className="liquid-glass p-6 sm:p-8 rounded-2xl border border-rose-500/20 bg-rose-500/[0.02]">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="text-rose-400" size={20} />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              3. Fair Play &amp; Anti-Abuse Rules
            </h2>
          </div>
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 mb-4 text-rose-200 text-sm">
            <strong>Zero Tolerance for Gaming:</strong> Contributor rankings must reflect authentic, peer-reviewed engineering work.
          </div>
          <p className="mb-4 text-sm sm:text-base">
            The following activities are strictly prohibited and will result in immediate disqualification and removal from the leaderboard:
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 flex-shrink-0" />
              <span>Submitting frivolous, micro-PRs (e.g. whitespace changes, spam typos) intended solely to inflate PR counts.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 flex-shrink-0" />
              <span>Deploying automated bots or fake GitHub accounts to manipulate leaderboard statistics.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 flex-shrink-0" />
              <span>Plagiarizing code from other contributors or unlicensed external sources.</span>
            </li>
          </ul>
        </section>

        {/* Section 4: Certificates & Credentialing Terms */}
        <section className="liquid-glass p-6 sm:p-8 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <Award className="text-cyan-400" size={20} />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              4. Certificates &amp; Proof-of-Work Credentials
            </h2>
          </div>
          <p className="mb-4 text-sm sm:text-base">
            CARRERFORGE provides verifiable digital achievement certificates based on confirmed merged pull requests:
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
              <span>
                <strong className="text-white font-medium">Verification Criteria:</strong> Certificates are issued only upon completion of verified contribution milestones at the conclusion of official contribution events.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
              <span>
                <strong className="text-white font-medium">No Employment Guarantee:</strong> Certificates recognize open-source effort and technical skill demonstration. They do not constitute formal university accredited degrees or guarantees of employment.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
              <span>
                <strong className="text-white font-medium">Revocation Right:</strong> CARRERFORGE reserves the right to invalidate or revoke credentials if a recipient is found to have engaged in fraud or academic dishonesty.
              </span>
            </li>
          </ul>
        </section>

        {/* Section 5: Disclaimer of Warranties & Limitation of Liability */}
        <section className="liquid-glass p-6 sm:p-8 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <ShieldAlert className="text-cyan-400" size={20} />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              5. Disclaimer of Warranties &amp; Limitation of Liability
            </h2>
          </div>
          <p className="text-sm sm:text-base mb-4 uppercase text-xs font-mono text-zinc-400 tracking-wider">
            PROVIDED "AS IS" AND "AS AVAILABLE"
          </p>
          <p className="text-sm sm:text-base">
            THE PLATFORM, REPOSITORIES, AND SHOWCASE CODE TEMPLATES ARE PROVIDED WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. IN NO EVENT SHALL CARRERFORGE, ITS MAINTAINERS, OR AFFILIATES BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OF THE PLATFORM.
          </p>
        </section>

        {/* Section 6: Inquiries & Governance */}
        <section className="liquid-glass p-6 sm:p-8 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="text-white font-semibold text-base block mb-1">
              Questions Regarding Terms?
            </span>
            <p className="text-xs text-zinc-400">
              For legal clarification, licensing questions, or governance guidelines, open an official inquiry.
            </p>
          </div>
          <a
            href="https://github.com/Pratyush-Panda-2006/CAREERFORGE/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-white text-black text-xs font-semibold hover:bg-gray-200 transition-colors flex-shrink-0"
          >
            Contact Maintainers
          </a>
        </section>
      </div>
    </div>
  );
}
