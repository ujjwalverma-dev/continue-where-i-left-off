"use client";

import { useEffect, useRef } from "react";

type AudioPlaybackProps = {
  source: Blob | null;
  autoPlay?: boolean;
  onAutoplayBlocked?: () => void;
  onEnded?: () => void;
};

export function AudioPlayback({ source, autoPlay = false, onAutoplayBlocked, onEnded }: AudioPlaybackProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !source) {
      return;
    }

    const audioUrl = URL.createObjectURL(source);
    audio.src = audioUrl;
    audio.load();

    if (autoPlay) {
      void audio.play().catch(() => onAutoplayBlocked?.());
    }

    return () => {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      URL.revokeObjectURL(audioUrl);
    };
  }, [autoPlay, onAutoplayBlocked, source]);

  if (!source) {
    return null;
  }

  return (
    <div className="recording-playback">
      <p className="response-label">Interviewer audio</p>
      <audio ref={audioRef} controls onEnded={onEnded}>
        Your browser does not support audio playback.
      </audio>
    </div>
  );
}
