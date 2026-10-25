import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useQueryClient } from "@tanstack/react-query";

function subscribeToInitialQueries(
  onStoreChange: () => void,
  queryClient: ReturnType<typeof useQueryClient>,
): () => void {
  return queryClient.getQueryCache().subscribe(onStoreChange);
}

function hasPendingInitialQueries(
  queryClient: ReturnType<typeof useQueryClient>,
): boolean {
  return queryClient.getQueryCache().getAll().some((query) => {
    return (
      query.getObserversCount() > 0 &&
      query.state.fetchStatus === "fetching" &&
      query.state.data === undefined
    );
  });
}

export function UniversalLoader() {
  const queryClient = useQueryClient();
  const isLoading = useSyncExternalStore(
    (onStoreChange) => subscribeToInitialQueries(onStoreChange, queryClient),
    () => hasPendingInitialQueries(queryClient),
    () => false,
  );

  return isLoading ? <LoaderOverlay /> : null;
}

function LoaderOverlay() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUnavailable, setVideoUnavailable] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let active = true;
    const playback = video.play();

    void playback.catch(() => {
      if (active) {
        setVideoUnavailable(true);
      }
    });

    return () => {
      active = false;
      document.body.style.overflow = previousOverflow;
      video.pause();
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex h-[100dvh] items-center justify-center overflow-hidden bg-background"
      role="status"
      aria-label="Loading page content"
    >
      {!videoUnavailable ? (
        <video
          ref={videoRef}
          className="h-full w-full object-contain"
          src="/Loader.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          onError={() => setVideoUnavailable(true)}
        />
      ) : (
        <span
          aria-hidden="true"
          className="size-10 animate-spin rounded-full border-4 border-muted border-t-foreground"
        />
      )}
      <span className="sr-only">Loading page content...</span>
    </div>
  );
}
