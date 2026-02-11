import React, { useState } from "react";
import { Sidebar, RightSidebar } from "../components";

function ComingSoon({ title = "This feature" }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-black w-full overflow-x-hidden">
      <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      <main className="flex-1 min-w-0 w-full lg:w-[630px] lg:shrink-0 lg:ml-[400px] xl:mr-[400px] border-x border-zinc-800 min-h-screen overflow-y-auto overflow-x-hidden scrollbar-hide">
        <div className="sticky top-0 z-10 bg-black/60 backdrop-blur-xl border-b border-zinc-800/50 px-3 py-2.5 sm:px-4 sm:py-3">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-1 rounded-full hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors touch-manipulation"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-white">{title}</h1>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-20 sm:py-28 px-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center mb-6">
            <span className="text-4xl sm:text-5xl">🚀</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2 text-center">
            This feature coming soon
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base text-center max-w-sm">
            We're working on it. Check back later for updates.
          </p>
        </div>
      </main>

      <RightSidebar />
    </div>
  );
}

export default ComingSoon;
