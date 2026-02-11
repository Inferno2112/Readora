import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { CometCard } from "../ui/comet-card";

function HeroSection() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  const handlePrimaryCTA = () => {
    if (authStatus) {
      navigate("/add-post");
    } else {
      navigate("/login");
    }
  };

  const handleSecondaryCTA = () => {
    if (authStatus) {
      navigate("/my-posts");
    } else {
      navigate("/signup");
    }
  };

  const handleDiscover = () => {
    navigate("/all-posts");
  };

  return (
    <div className="relative min-h-screen w-full bg-black overflow-x-hidden">
      <Navbar />
      <div className="relative z-10 flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-3 pt-20 sm:px-6 sm:pt-24 lg:px-8">
        <h1 className="text-2xl sm:text-lg md:text-xl lg:text-3xl xl:text-3xl font-extrabold text-white text-center mb-3 sm:mb-4 max-w-4xl md:mt-20 sm:mt-10">
          Read smarter. Think deeper. Write freely.
        </h1>
        <p className="text-zinc-400 text-center text-sm sm:text-base mb-6 sm:mb-10 px-2 max-w-xl">
          Stay up-to-date with our latest blog posts.
        </p>

        {/* Single merged card: image + insight content */}
        <div className="w-full max-w-5xl mx-auto px-0 sm:px-2">
          <CometCard className="w-full max-w-full">
            <div className="flex flex-col lg:flex-row w-full min-h-[360px] sm:min-h-[400px] border-2 border-white/5 rounded-xl sm:rounded-2xl overflow-hidden">
              <div className="flex-1 min-h-[220px] sm:min-h-[280px] lg:min-h-0 bg-zinc-900/80 rounded-t-xl sm:rounded-t-2xl lg:rounded-r-none lg:rounded-l-2xl overflow-hidden">
                <img
                  src="/taskstar-dashboard.png"
                  alt="Readora"
                  className="block w-full h-full min-h-[200px] sm:min-h-[260px] object-cover object-top"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between rounded-b-xl sm:rounded-b-2xl lg:rounded-l-none lg:rounded-r-2xl p-4 sm:p-6 lg:p-8 bg-linear-to-br from-[#000000] via-[#05020b] to-[#000000] border-t lg:border-t-0 lg:border-l border-white/5">
                <div>
                  <span className="inline-flex w-fit rounded-full bg-[#3d2a6a] px-3 py-1 text-xs font-medium text-white mb-4">
                    All
                  </span>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white leading-tight mb-2">
                    10 Tips for Successful Blogging
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 mb-4 sm:mb-6">
                    Learn how to create engaging blog content that drives traffic.
                  </p>
                  <div className="flex items-center gap-2 mb-4 sm:mb-6">
                    <button
                      type="button"
                      onClick={handleDiscover}
                      className="rounded-lg bg-orange-500 px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
                    >
                      Discover Now
                    </button>
                    <button
                      type="button"
                      onClick={handleDiscover}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                      aria-label="Discover"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="border-t border-zinc-600/80 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-zinc-600 flex items-center justify-center text-xs font-medium text-zinc-400 shrink-0">
                      JD
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">John Doe</p>
                      <p className="text-xs text-zinc-500">11 Jan 2022</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>5 min read</span>
                  </div>
                </div>
              </div>
            </div>
          </CometCard>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
