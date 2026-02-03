import React from "react";
import { useSelector } from "react-redux";
import { Logo } from "./index";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function HeroSection() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  const handlePrimaryCTA = () => {
    if (authStatus) {
      navigate("/add-post"); // logged in → write
    } else {
      navigate("/login"); // logged out → login
    }
  };

  const handleSecondaryCTA = () => {
    if (authStatus) {
      navigate("/my-posts"); // logged in → my posts
    } else {
      navigate("/signup"); // logged out → signup
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black w-full">
      {/* NAV */}
      <nav className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4">
        <Logo />

        <button
          onClick={handlePrimaryCTA}
          className="hidden rounded-full bg-white px-5 py-2 text-sm font-semibold text-black hover:bg-gray-200 sm:block"
        >
          {authStatus ? "Write new post" : "Get started"}
        </button>
      </nav>

      {/* HERO CONTENT */}
      <div className="relative flex min-h-[20vh] flex-col items-center justify-center">
        <div className="relative top-24 sm:top-32 max-w-3xl flex flex-col items-center justify-center text-center">
          <h1 className="text-[42px] leading-tight font-extrabold sm:text-7xl text-white">
            Read smarter. Think deeper. Write freely.
          </h1>

          <p className="my-6 font-medium text-sm sm:text-lg max-w-xl text-zinc-300">
            Readora is a calm, focused space for meaningful reading and writing —
            built for people who value depth over noise.
          </p>

          {/* CTA BUTTONS */}
          <div className=" z-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handlePrimaryCTA}
              className="rounded-xl bg-yellow-400 px-12 py-3 text-sm font-semibold text-white hover:opacity-90 transition"
            >
              {authStatus ? "Write new post" : "Get started"}
            </button>

            <button
              onClick={handleSecondaryCTA}
              className="rounded-xl bg-white px-12 py-3 text-sm font-semibold text-black hover:bg-gray-200 transition"
            >
              {authStatus ? "My posts" : "Create account"}
            </button>
          </div>
        </div>
      </div>

      {/* DECORATIVE IMAGE */}
      <div className="relative top-[70vh] max-w-full sm:top-0 ">
        <div className="absolute w-full object-contain">
          <img src="/image.png" alt="" className="relative  object-fill" />
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
