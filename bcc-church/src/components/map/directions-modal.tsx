import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LocateFixed, MapPin, Navigation, X } from "lucide-react";

export type Destination = { name: string; query: string } | null;

/**
 * In-app directions viewer — opens right here instead of a new tab.
 * Type a starting point (or use GPS) to preview the full route inline.
 */
export function DirectionsModal({ destination, onClose }: { destination: Destination; onClose: () => void }) {
  const [origin, setOrigin] = useState("");
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    setOrigin("");
  }, [destination?.query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setOrigin(`${pos.coords.latitude},${pos.coords.longitude}`);
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 8000 }
    );
  };

  const src = destination
    ? origin.trim()
      ? `https://maps.google.com/maps?saddr=${encodeURIComponent(origin.trim())}&daddr=${encodeURIComponent(destination.query)}&output=embed`
      : `https://maps.google.com/maps?q=${encodeURIComponent(destination.query)}&z=14&output=embed`
    : "";

  return (
    <AnimatePresence>
      {destination && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-primary/70 backdrop-blur-sm p-0 sm:p-6"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`Directions to ${destination.name}`}
        >
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="w-full max-w-3xl overflow-hidden rounded-t-3xl sm:rounded-3xl bg-background shadow-2xl max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 bg-primary px-5 sm:px-6 py-4 text-white">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                <Navigation size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-accent">Directions</p>
                <h3 className="font-serif text-lg font-bold leading-tight truncate">{destination.name}</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-white hover:text-accent hover:bg-white/10 shrink-0"
                onClick={onClose}
                aria-label="Close directions"
              >
                <X size={22} />
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 px-5 sm:px-6 py-4 border-b border-border bg-muted/50">
              <div className="relative flex-1">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="Starting point — e.g. Nakuru Town"
                  className="pl-9 bg-background"
                  data-testid="input-directions-origin"
                />
              </div>
              <Button
                variant="outline"
                onClick={useMyLocation}
                disabled={locating}
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground shrink-0"
              >
                <LocateFixed size={16} className="mr-2" />
                {locating ? "Locating…" : "Use my location"}
              </Button>
            </div>

            <div className="h-[52vh] sm:h-[46vh] bg-muted">
              <iframe
                key={src}
                src={src}
                title={`Map to ${destination.name}`}
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-3.5 border-t border-border">
              <p className="text-xs text-muted-foreground truncate">{destination.query}</p>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination.query)}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-accent hover:underline shrink-0"
              >
                Open in Maps app →
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
