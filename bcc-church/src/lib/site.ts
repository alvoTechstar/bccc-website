import type { SyntheticEvent } from "react";

/**
 * Central site configuration.
 * - API base URL (env override via VITE_API_URL)
 * - YouTube sermon videos (paste video IDs from the church channel)
 * - Dominion Summit + theme-of-the-year (set every year at the summit)
 * - Local photo manifest (drop the 6 church photos into src/assets/photos/)
 */

export const site = {
  name: "BCC Church",
  fullName: "Beautiful Courts Christian Church",
  apiBase: (
    (import.meta.env.VITE_API_URL as string | undefined) ??
    "https://bccc-website-backend.onrender.com"
  ).replace(/\/$/, ""),
  contact: {
    phone: "+254 720 123 456",
    email: "info@bccchurch.co.ke",
    address: "Nakuru, Mawanga Kwa Budaa, Nakuru County, Kenya",
  },
  services: [
    { time: "8:30 AM", label: "First Service" },
    { time: "10:30 AM", label: "Second Service" },
  ],
};

/** The Dominion Summit sets the theme for the entire year — update these each December. */
export const summit = {
  name: "Dominion Summit",
  edition: 19,
  year: 2026,
  /** The 2027 theme will be proclaimed at this summit — revealed live, Dec 2026. */
  yearTheme: "",
  nextThemeYear: 2027,
  dates: "7TH–11TH DEC 2026",
  venue: "Mawanga, Kwa Buda Church Headquarters",
  convenor: "JB. Tajeu",
  poster: "/photos/dominion-summit-2026.jpg",
};

/** 21 Days of Ascend — prayer & fasting programme. */
export const ascend = {
  name: "21 Days of Ascend",
  subtitle: "Prayer 'n Fasting",
  dates: "9TH–29TH NOV 2026",
  venue: "Mawanga, Kwa Buda Church Grounds",
  fasting: "6AM–6PM",
  sessions: [
    { name: "Morning Glory", time: "5:45 A.M" },
    { name: "Evening Prayers", time: "5:00 P.M" },
    { name: "Midnight Prayers", time: "11 P.M – 12 A.M" },
  ],
  poster: "/photos/ascend-fasting-2026.jpg",
};

/**
 * Church YouTube — paste the video IDs from https://www.youtube.com/@<channel>/videos
 * The sermons page embeds these. Add newest first (max ~9 shown).
 */
export const sermonVideos: { id: string; title: string; preacher?: string }[] = [
  // Example: { id: "dQw4w9WgXcQ", title: "The Mandate to Be Fruitful", preacher: "Bishop JB Tajeu" },
];

export const bishopFacebook = "https://www.facebook.com/pstjb.tajeu";
export const churchFacebook = "https://www.facebook.com/beautifulcourtschristianchurch";

export const youtubeChannelId = "UCX8Az4S9Rq-oVqh_MNUxsuA";
export const youtubeChannelUrl = `https://www.youtube.com/channel/${youtubeChannelId}`;
/** Auto-generated uploads playlist — always plays the channel's latest videos, no API key needed. */
export const youtubeUploadsPlaylistId = `UU${youtubeChannelId.slice(2)}`;
export const youtubePlaylistEmbed = `https://www.youtube.com/embed?listType=playlist&list=${youtubeUploadsPlaylistId}&rel=0`;

/** Local church photos. NOTE: current building exterior photo still missing. */
export const photos = {
  /** New sanctuary 3D render (building vision). */
  sanctuaryRender: "/photos/sanctuary-render.jpg",
  /** Sunday service wide shot, bishop preaching. */
  congregation: "/photos/congregation.jpg",
  /** 21 Days of Ascend prayer & fasting poster. */
  ascendPoster: "/photos/ascend-fasting-2026.jpg",
  /** Bishop JB Tajeu, founder. */
  bishop: "/photos/bishop-jb-tajeu.jpg",
  /** 19th Annual Dominion Summit poster. */
  summitPoster: "/photos/dominion-summit-2026.jpg",
};

/** Fallback (Unsplash) shown if a local photo is missing — swap in real photos to replace. */
export const fallbackPhotos = {
  sanctuaryRender:
    "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  congregation:
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
  ascendPoster:
    "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  bishop:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  summitPoster:
    "https://images.unsplash.com/photo-1478147427282-58a87a120781?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
};

/** Google Maps directions link for any destination query. */
export function mapsDir(query: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}

/** Embeddable map (no API key needed) for the headquarters. */
export const mapsEmbed =
  "https://www.google.com/maps?q=Mawanga,+Kwa+Buda,+Nakuru,+Kenya&z=14&output=embed";

/** Image props that gracefully fall back when a local photo file is missing. */
export function photoProps(src: string, fallback: string, alt: string) {
  return {
    src,
    alt,
    onError: (e: SyntheticEvent<HTMLImageElement>) => {
      const el = e.currentTarget;
      if (el.src !== fallback) el.src = fallback;
    },
  };
}
