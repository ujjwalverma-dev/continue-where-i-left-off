"use client";

import type { VoiceState } from "@/types/task";

type VoiceOrbProps = {
  state?: VoiceState;
  size?: "sm" | "md" | "lg";
  offsetY?: number;
  offsetX?: number;
  interactive?: boolean;
  onClick?: () => void;
};

export function VoiceOrb({
  state = "idle",
  size = "md",
  offsetY = 0,
  offsetX = 0,
  interactive = false,
  onClick,
}: VoiceOrbProps) {
  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-40 h-40 md:w-52 md:h-52",
    lg: "w-56 h-56 md:w-72 md:h-72",
  }[size];

  const getStateClasses = () => {
    switch (state) {
      case "listening":
        return "orb-listening";
      case "processing":
        return "orb-processing";
      case "speaking":
        return "orb-speaking";
      case "error":
        return "orb-error";
      case "review":
        return "orb-review";
      default:
        return "orb-idle";
    }
  };

  const transformStyle = {
    transform: `translate3d(${offsetX}px, ${offsetY}px, 0)`,
  };

  return (
    <div
      className={`voice-orb-container relative flex items-center justify-center ${getStateClasses()}`}
      style={transformStyle}
      onClick={interactive ? onClick : undefined}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? "Voice interaction orb" : undefined}
    >
      {/* Outer ambient aura glow layer */}
      <div className={`voice-orb-aura absolute rounded-full ${sizeClasses}`} />

      {/* Secondary pulse ripple layer */}
      <div className={`voice-orb-ripple absolute rounded-full ${sizeClasses}`} />

      {/* Main core sphere layer */}
      <div className={`voice-orb-core relative rounded-full ${sizeClasses} flex items-center justify-center shadow-xl`}>
        <div className="voice-orb-inner rounded-full w-2/3 h-2/3 backdrop-blur-sm" />
      </div>
    </div>
  );
}
