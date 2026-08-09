"use client";

import { useEffect, useRef } from "react";

type AudioPlaybackProps = {
  source: Blob | string | null;
};

export function AudioPlayback({ source }: AudioPlaybackProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !source) {
      return;
    }

    const audioUrl = typeof source === "string" ? source : URL.createObjectURL(source);
    audio.src = audioUrl;
    audio.load();

    return () => {
      if (typeof source !== "string") {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [source]);

  if (!source) {
    return null;
  }

  return (
    <div className="recording-playback">
      <p className="response-label">Latest recording</p>
      <audio ref={audioRef} controls>
        Your browser does not support audio playback.
      </audio>
    </div>
  );
}
