import React from "react";
import { Link } from "react-router-dom";
import Logo from "../Logo";

function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-zinc-900/70 backdrop-blur-xl bottom-0">
      <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 px-4 sm:px-6 py-6 sm:py-8 lg:py-10">
        
        {/* Logo */}
        <Link to="/" className="opacity-90 hover:opacity-100 transition">
          <Logo width="90px" className="w-16 sm:w-20 md:w-24" />
        </Link>

        {/* Copyright */}
        <p className="text-xs sm:text-sm text-gray-500 text-center px-4">
          © {new Date().getFullYear()} DevUI. All rights reserved.
        </p>

      </div>
    </footer>
  );
}

export default Footer;
