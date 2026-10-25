import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../ui/button";
import { type UniversalErrorType } from "./universalError.utils";
import animationUrl from "./Lonely 404.json?url";

type LottieSvgComponent = typeof import("lottie-react").LottieSvg;

interface UniversalErrorProps {
  type: UniversalErrorType;
  onRetry?: () => void;
}

const errorContent: Record<
  UniversalErrorType,
  { title: string; description: string }
> = {
  network: {
    title: "Connection problem",
    description:
      "Unable to connect. Please check your internet connection and try again.",
  },
  server: {
    title: "Server unavailable",
    description: "Something went wrong on our server. Please try again shortly.",
  },
  "not-found": {
    title: "Page not found",
    description: "The page you're looking for could not be found.",
  },
  unknown: {
    title: "Something went wrong",
    description: "Something went wrong. Please try again.",
  },
};

export function UniversalError({ type, onRetry }: UniversalErrorProps) {
  const navigate = useNavigate();
  const [LottieSvg, setLottieSvg] = useState<LottieSvgComponent | null>(null);
  const [animationUnavailable, setAnimationUnavailable] = useState(false);
  const content = errorContent[type];

  useEffect(() => {
    let active = true;

    void import("lottie-react")
      .then((module) => {
        if (active) {
          setLottieSvg(() => module.LottieSvg);
        }
      })
      .catch(() => {
        if (active) {
          setAnimationUnavailable(true);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main
      className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center px-6 py-12 text-center"
      role="alert"
    >
      {!animationUnavailable && LottieSvg ? (
        <LottieSvg
          src={animationUrl}
          className="aspect-[7/4] w-full max-w-[min(28rem,80vw)]"
          autoplay
          loop
          aria-hidden="true"
          subscriptions={{
            error: () => setAnimationUnavailable(true),
          }}
        />
      ) : (
        <div
          aria-hidden="true"
          className="mb-6 flex size-40 items-center justify-center rounded-full bg-muted text-5xl font-bold text-muted-foreground sm:size-56"
        >
          !
        </div>
      )}
      <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
        {content.title}
      </h1>
      <p className="mt-3 max-w-lg text-muted-foreground">
        {content.description}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {onRetry && (
          <Button onClick={onRetry} type="button">
            Try again
          </Button>
        )}
        <Button
          onClick={() => navigate("/")}
          type="button"
          variant={onRetry ? "outline" : "default"}
        >
          Home
        </Button>
      </div>
    </main>
  );
}
