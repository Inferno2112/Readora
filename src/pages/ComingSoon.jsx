import React, { useState } from "react";
import { Sidebar, RightSidebar, PageHeader } from "../components";

function ComingSoon({ title = "This feature" }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-black w-full overflow-x-hidden">
      <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      <main className="flex-1 min-w-0 w-full lg:w-[630px] lg:shrink-0 lg:ml-[400px] xl:mr-[400px] border-x border-zinc-800 min-h-screen overflow-y-auto overflow-x-hidden scrollbar-hide">
        <PageHeader onMenuOpen={() => setMobileMenuOpen(true)} title={title} centerReadora={false} />

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
