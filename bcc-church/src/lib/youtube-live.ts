import { useQuery } from "@tanstack/react-query";
import { youtubeChannelId, youtubeUploadsPlaylistId } from "@/lib/site";

/**
 * Live-stream detection for the church YouTube channel.
 *
 * Needs a YouTube Data API v3 key in `VITE_YOUTUBE_API_KEY`
 * (see .env.example). Without a key the hook reports
 * `isConfigured: false` and every consumer renders nothing —
 * the site keeps working exactly as before.
 *
 * Quota-cheap by design (~2 units per poll, every 2 minutes ≈
 * under 1.5k units/day — well inside the free 10k/day quota):
 *   1. playlistItems on the uploads playlist → newest video ids
 *   2. videos.list (liveStreamingDetails) → which one is `live`
 */

const API_KEY = (import.meta.env.VITE_YOUTUBE_API_KEY as string | undefined)?.trim();

export interface LiveBroadcast {
  /** A key exists, so detection is active. */
  isConfigured: boolean;
  /** The channel is live right now. */
  isLive: boolean;
  /** Live video id (when live). */
  videoId: string | null;
  /** Live video title (when live). */
  title: string | null;
  /** Embed URL that plays the live stream on our site. */
  embedUrl: string | null;
  /** Watch URL if the user prefers YouTube itself. */
  watchUrl: string | null;
}

interface PlaylistItemsResponse {
  items?: { contentDetails?: { videoId?: string } }[];
}

interface VideosListResponse {
  items?: {
    id?: string;
    snippet?: { title?: string; liveBroadcastContent?: string };
  }[];
}

async function fetchLiveBroadcast(): Promise<
  Pick<LiveBroadcast, "isLive" | "videoId" | "title">
> {
  const none = { isLive: false, videoId: null, title: null };
  // Newest uploads first — a live stream shows up here while live.
  const pl = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${youtubeUploadsPlaylistId}&maxResults=5&key=${API_KEY}`
  );
  if (!pl.ok) throw new Error(`playlist: ${pl.status}`);
  const plData = (await pl.json()) as PlaylistItemsResponse;
  const ids = (plData.items ?? [])
    .map((it) => it.contentDetails?.videoId)
    .filter((id): id is string => Boolean(id));
  if (ids.length === 0) return none;

  const vs = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,liveStreamingDetails&id=${ids.join(",")}&key=${API_KEY}`
  );
  if (!vs.ok) throw new Error(`videos: ${vs.status}`);
  const vsData = (await vs.json()) as VideosListResponse;
  const live = (vsData.items ?? []).find(
    (v) => v.snippet?.liveBroadcastContent === "live"
  );
  if (!live?.id) return none;
  return { isLive: true, videoId: live.id, title: live.snippet?.title ?? "Live service" };
}

/** Poll the channel for a live broadcast. Shared cache across all consumers. */
export function useLiveBroadcast(): LiveBroadcast {
  const { data } = useQuery({
    queryKey: ["youtube-live", youtubeChannelId],
    queryFn: fetchLiveBroadcast,
    enabled: Boolean(API_KEY),
    staleTime: 90_000,
    refetchInterval: 120_000,
    refetchOnWindowFocus: true,
    retry: 1,
  });

  const videoId = data?.videoId ?? null;
  return {
    isConfigured: Boolean(API_KEY),
    isLive: data?.isLive ?? false,
    videoId,
    title: data?.title ?? null,
    embedUrl: videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1` : null,
    watchUrl: videoId ? `https://www.youtube.com/watch?v=${videoId}` : null,
  };
}
