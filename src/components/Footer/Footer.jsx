import React from "react";
import { Link } from "react-router-dom";
import Logo from "../Logo";

function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-zinc-900 bottom-0">
      <div className="flex flex-col items-center justify-center gap-4 px-6 py-10">
        
        {/* Logo */}
        <Link to="/" className="opacity-90 hover:opacity-100 transition">
          <Logo width="90px" />
        </Link>

        {/* Copyright */}
        <p className="text-xs text-gray-500 text-center">
          © {new Date().getFullYear()} DevUI. All rights reserved.
        </p>

      </div>
    </footer>
  );
}

export default Footer;
