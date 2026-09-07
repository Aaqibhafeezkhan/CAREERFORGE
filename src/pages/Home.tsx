import { Link } from 'react-router-dom';
import {
  Code2,
  Trophy,
  ArrowRight,
  ShieldCheck,
  Star,
  ExternalLink,
  Flame,
  GitBranch,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="w-full relative z-10 flex flex-col gap-10 sm:gap-14 md:gap-20 px-4 sm:px-6 md:px-12 pt-0 sm:pt-4 md:pt-6 pb-20">
      {/* SECTION 1: CINEMATIC HERO SECTION */}
      <section className="pt-1 sm:pt-6 md:pt-10 flex flex-col items-center text-center max-w-5xl mx-auto w-full">

        {/* Main Cinematic Headline */}
        <h1
          className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] sm:leading-[0.95] tracking-tight sm:tracking-[-2.46px] font-normal animate-blur-fade-up text-white break-words"
          style={{ fontFamily: "'Instrument Serif', serif", animationDelay: '250ms' }}
        >
          Where <em className="italic text-white/70">dreams</em> rise{' '}
          <em className="italic text-white/70">through the silence.</em>
        </h1>

        {/* Subtitle Copy */}
        <p
          className="text-zinc-300 text-sm sm:text-base md:text-xl max-w-2xl mt-6 sm:mt-8 leading-relaxed font-light animate-blur-fade-up px-2 sm:px-0"
          style={{ animationDelay: '350ms' }}
        >
          Bridge the gap between learning and production. Contribute to real-world open-source projects, solve curated GitHub issues, climb the live contributor leaderboard, and earn verifiable credentials to forge your engineering career.
        </p>

        {/* Action Buttons */}
        <div
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-10 animate-blur-fade-up w-full sm:w-auto px-2 sm:px-0"
          style={{ animationDelay: '450ms' }}
        >
          <Link to="/projects" className="w-full sm:w-auto">
            <Button
              variant="liquid-glass"
              className="w-full sm:w-auto rounded-full px-6 sm:px-8 py-3.5 text-sm sm:text-base text-white hover:scale-[1.03] cursor-pointer h-auto font-normal flex items-center justify-center gap-2.5 min-h-[46px]"
            >
              <Code2 size={18} />
              <span>Browse Open Projects</span>
              <ArrowRight size={16} />
            </Button>
          </Link>

          <Link to="/leaderboard" className="w-full sm:w-auto">
            <Button
              variant="liquid-glass"
              className="w-full sm:w-auto rounded-full px-6 sm:px-8 py-3.5 text-sm sm:text-base text-white hover:scale-[1.03] cursor-pointer h-auto font-normal flex items-center justify-center gap-2.5 min-h-[46px]"
            >
              <Trophy size={18} className="text-amber-400" />
              <span>View Leaderboard</span>
            </Button>
          </Link>
        </div>
      </section>

      {/* SECTION 2: FEATURED REPOSITORIES SPOTLIGHT */}
      <section className="max-w-7xl mx-auto w-full pt-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mb-2">
              // FEATURED SHOWCASE TEMPLATES
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Featured Showcase Projects
            </h2>
          </div>
          <Link
            to="/projects"
            className="text-amber-400 hover:text-amber-300 text-sm font-medium flex items-center gap-1 transition-colors"
          >
            <span>View All Showcase Templates</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: E-Commerce Storefront */}
          <div className="liquid-glass rounded-2xl p-6 border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded text-xs font-mono bg-amber-400/10 text-amber-300 border border-amber-400/20">
                  E-COMMERCE
                </span>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  3 Active Issues
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">showcase/ecommerce-store</h3>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed font-light">
                Standalone glassmorphic tech gear e-commerce website template with interactive cart counter and product category filtering.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                <span className="px-2 py-0.5 rounded text-xs font-mono bg-white/5 text-gray-300 border border-white/10">HTML5</span>
                <span className="px-2 py-0.5 rounded text-xs font-mono bg-white/5 text-gray-300 border border-white/10">Vanilla CSS</span>
                <span className="px-2 py-0.5 rounded text-xs font-mono bg-white/5 text-gray-300 border border-white/10">JavaScript ES6</span>
              </div>
            </div>
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
              <a
                href="/showcase/ecommerce-store/index.html"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-1/2 bg-amber-400 hover:bg-amber-300 text-black text-center px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                <span>View Live Preview</span>
                <ExternalLink size={14} />
              </a>
              <a
                href="https://github.com/Pratyush-Panda-2006/CAREERFORGE/issues"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-1/2 liquid-glass text-white hover:bg-white/10 text-center px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-white/10 active:scale-95 cursor-pointer"
              >
                <span>Contribute / Submit PR</span>
                <GitBranch size={14} className="text-amber-400" />
              </a>
            </div>
          </div>

          {/* Card 2: Agency & Creative Studio */}
          <div className="liquid-glass rounded-2xl p-6 border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded text-xs font-mono bg-cyan-400/10 text-cyan-300 border border-cyan-400/20">
                  AGENCY &amp; PORTFOLIO
                </span>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  2 Active Issues
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">showcase/agency-studio</h3>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed font-light">
                Fluid design agency &amp; creative studio landing page with portfolio showcase grids, smooth scroll, and dark glassmorphism.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                <span className="px-2 py-0.5 rounded text-xs font-mono bg-white/5 text-gray-300 border border-white/10">HTML5</span>
                <span className="px-2 py-0.5 rounded text-xs font-mono bg-white/5 text-gray-300 border border-white/10">CSS Variables</span>
                <span className="px-2 py-0.5 rounded text-xs font-mono bg-white/5 text-gray-300 border border-white/10">JavaScript ES6</span>
              </div>
            </div>
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
              <a
                href="/showcase/agency-studio/index.html"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-1/2 bg-amber-400 hover:bg-amber-300 text-black text-center px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                <span>View Live Preview</span>
                <ExternalLink size={14} />
              </a>
              <a
                href="https://github.com/Pratyush-Panda-2006/CAREERFORGE/issues"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-1/2 liquid-glass text-white hover:bg-white/10 text-center px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-white/10 active:scale-95 cursor-pointer"
              >
                <span>Contribute / Submit PR</span>
                <GitBranch size={14} className="text-amber-400" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: HIGHLIGHTS & CERTIFICATE CREDENTIALS */}
      <section className="max-w-7xl mx-auto w-full pt-4">
        <div className="liquid-glass rounded-3xl p-6 sm:p-10 md:p-12 border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center lg:text-left">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mb-2">
              // VERIFIABLE CREDENTIALS
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
              Earn Verified Open Source Certificates
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 font-light">
              Every merged pull request and completed bounty accumulates toward official contributor credentials. Share your verified digital certificate on LinkedIn, GitHub, or your resume.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <Link
                to="/certificates"
                className="bg-white text-black font-medium px-6 py-3 rounded-full text-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors min-h-[44px]"
              >
                <ShieldCheck size={18} />
                <span>Verify a Certificate</span>
              </Link>
              <Link
                to="/leaderboard"
                className="liquid-glass text-white font-medium px-6 py-3 rounded-full text-sm flex items-center justify-center gap-2 hover:bg-white/10 transition-colors min-h-[44px]"
              >
                <Flame size={18} className="text-amber-400" />
                <span>Hall of Fame</span>
              </Link>
            </div>
          </div>

          {/* Mini Preview Graphic */}
          <div className="w-full max-w-md bg-black/60 border border-amber-400/30 p-5 sm:p-6 rounded-2xl text-center relative shadow-2xl">
            <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-2">VERIFIED CONTRIBUTOR</div>
            <div className="text-lg sm:text-xl font-bold text-white mb-1">Alex Rivera</div>
            <div className="text-xs text-gray-400 font-mono mb-4">Lead Project Contributor • 6,420 PTS</div>
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 py-1.5 px-3 rounded-full mx-auto w-fit">
              <Star size={14} className="fill-emerald-400" />
              <span>CERT-2026-8942</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
