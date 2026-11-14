import { Link } from "wouter";
import { Play, Radio } from "lucide-react";
import { useLiveBroadcast } from "@/lib/youtube-live";

/**
 * Site-wide "we are live" notice. Renders nothing unless the channel
 * is actually live — one tap takes you to /sermons where the stream
 * plays right on the website.
 */
export default function LiveBanner() {
  const { isLive, title } = useLiveBroadcast();
  if (!isLive) return null;

  return (
    <div
      className="bg-red-600 text-white"
      data-testid="banner-live-now"
    >
      <div className="container mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 py-2.5 text-center">
        <span className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
          </span>
          <Radio size={15} />
          Live now{title ? ` — ${title}` : ""}
        </span>
        <Link href="/sermons">
          <span
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-sm font-bold text-red-700 transition-transform hover:scale-105"
            data-testid="button-banner-watch-live"
          >
            <Play size={14} className="fill-current" /> Watch live here
          </span>
        </Link>
      </div>
    </div>
  );
}
