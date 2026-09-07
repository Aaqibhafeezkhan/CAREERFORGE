import { Link } from 'react-router-dom';
import { GitBranch, ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 w-full border-t border-white/10 mt-auto bg-black/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-6 sm:py-8 flex flex-col lg:flex-row items-center justify-between gap-5 sm:gap-6 text-sm text-zinc-400">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
          <Link
            to="/"
            className="text-white font-bold tracking-widest uppercase hover:opacity-90 transition-opacity text-sm sm:text-base"
          >
            CARRERFORGE
          </Link>
          <span className="hidden sm:inline text-white/20">•</span>
          <span className="text-[11px] sm:text-xs font-mono text-zinc-400">
            Open Source Contribution Ecosystem &copy; {currentYear}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-3.5 sm:gap-x-5 gap-y-2 text-[11px] sm:text-xs font-mono">
          <Link to="/projects" className="hover:text-white transition-colors py-1">
            Projects
          </Link>
          <Link to="/leaderboard" className="hover:text-white transition-colors py-1">
            Leaderboard
          </Link>
          <Link to="/certificates" className="hover:text-white transition-colors py-1">
            Certificates
          </Link>
          <span className="text-white/20 hidden md:inline">•</span>
          <Link to="/privacy" className="hover:text-white transition-colors py-1">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-white transition-colors py-1">
            Terms of Service
          </Link>
          <span className="text-white/20 hidden md:inline">•</span>
          <a
            href="https://github.com/Pratyush-Panda-2006/CAREERFORGE"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors py-1"
          >
            <GitBranch size={13} className="text-emerald-400" />
            <span>GitHub</span>
            <ExternalLink size={11} className="text-zinc-500" />
          </a>
        </div>
      </div>
    </footer>
  );
}
