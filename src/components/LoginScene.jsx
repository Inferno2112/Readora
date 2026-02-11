import React from "react";

export default function LoginScene() {
  return (
    <div className="h-full w-full min-h-[480px] bg-black flex items-center justify-center p-8 lg:p-12">
      <div
        className="w-full max-w-2xl rounded-2xl border border-white/10 p-10 text-center min-h-[520px] flex flex-col items-center justify-center ml-20"
        style={{
          background: "rgba(255, 255, 255, 0.04)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        }}
      >
        <h1 className="font-bebas text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white">
          Readora
        </h1>
        <p className="mt-4 text-sm text-zinc-400">
          Read smarter. Think deeper. Write freely.
        </p>
      </div>
    </div>
  );
}
