import React from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Clock } from "lucide-react";

export function InsightCard({
  category = "All",
  title = "10 Tips for Successful Blogging",
  description = "Learn how to create engaging blog content that drives traffic.",
  ctaText = "Discover Now",
  authorName = "John Doe",
  authorDate = "11 Jan 2022",
  readTime = "5 min read",
  authorAvatarUrl,
  onDiscover,
  className,
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl p-6 sm:p-8 min-h-[420px]",
        "bg-linear-to-br from-[#1a0f2e] via-[#2d1b4e] to-[#3d2a5c]",
        "shadow-xl shadow-black/30",
        "border border-white/5",
        className
      )}
      style={{
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.05), 0 25px 50px -12px rgba(0,0,0,0.5)",
      }}
    >
      {/* Category tag */}
      <span className="inline-flex w-fit rounded-full bg-[#3d2a6a] px-3 py-1 text-xs font-medium text-white mb-4">
        {category}
      </span>

      {/* Title */}
      <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-zinc-400 mb-6 flex-1">
        {description}
      </p>

      {/* CTA */}
      <div className="flex items-center gap-2 mb-6">
        <button
          type="button"
          onClick={onDiscover}
          className="rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 transition-colors"
        >
          {ctaText}
        </button>
        <button
          type="button"
          onClick={onDiscover}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-white hover:bg-amber-600 transition-colors"
          aria-label="Discover"
        >
          <ArrowUpRight className="h-5 w-5" />
        </button>
      </div>

      {/* Separator */}
      <div className="border-t border-zinc-600/80 mb-4" />

      {/* Author + Read time */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-zinc-600 overflow-hidden shrink-0">
            {authorAvatarUrl ? (
              <img
                src={authorAvatarUrl}
                alt={authorName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xs font-medium text-zinc-400">
                {authorName.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{authorName}</p>
            <p className="text-xs text-zinc-500">{authorDate}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Clock className="h-4 w-4" />
          <span>{readTime}</span>
        </div>
      </div>
    </div>
  );
}
