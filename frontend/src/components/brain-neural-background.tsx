"use client";

import { useId } from "react";
import type { ParallaxOffset } from "@/lib/use-parallax";

type BrainNeuralBackgroundProps = {
  parallax: ParallaxOffset;
};

// Organic brain constellation node definitions
const NEURAL_NODES = [
  { id: "node-1", cx: 20, cy: 25, r: 6, label: "Emotional Grounding", depth: 1.2, color: "#557C72" },
  { id: "node-2", cx: 35, cy: 15, r: 4, label: "Uninterrupted Pause", depth: 0.8, color: "#A79BC8" },
  { id: "node-3", cx: 50, cy: 28, r: 7, label: "Voice Memory Core", depth: 1.5, color: "#557C72" },
  { id: "node-4", cx: 65, cy: 18, r: 5, label: "Context Continuity", depth: 1.0, color: "#D6A86A" },
  { id: "node-5", cx: 80, cy: 30, r: 6, label: "Reflective Space", depth: 1.3, color: "#A79BC8" },
  { id: "node-6", cx: 15, cy: 55, r: 5, label: "Empathy Engine", depth: 0.9, color: "#DCE8E8" },
  { id: "node-7", cx: 30, cy: 45, r: 8, label: "Mental Health Mode", depth: 1.6, color: "#557C72" },
  { id: "node-8", cx: 48, cy: 58, r: 6, label: "Active Synthesis", depth: 1.1, color: "#A79BC8" },
  { id: "node-9", cx: 70, cy: 50, r: 7, label: "Turn State Logic", depth: 1.4, color: "#557C72" },
  { id: "node-10", cx: 85, cy: 62, r: 4, label: "Safe Expression", depth: 0.7, color: "#D6A86A" },
  { id: "node-11", cx: 25, cy: 80, r: 5, label: "Thought Continuity", depth: 1.0, color: "#A79BC8" },
  { id: "node-12", cx: 42, cy: 85, r: 6, label: "Mindful Listening", depth: 1.2, color: "#557C72" },
  { id: "node-13", cx: 60, cy: 78, r: 5, label: "Prior Session Memory", depth: 0.9, color: "#DCE8E8" },
  { id: "node-14", cx: 78, cy: 82, r: 6, label: "Calm Cadence", depth: 1.1, color: "#557C72" },
];

// Synaptic axon connections between nodes
const SYNAPSE_CONNECTIONS = [
  { from: 0, to: 1, path: "M 20 25 Q 28 18, 35 15" },
  { from: 1, to: 2, path: "M 35 15 Q 42 20, 50 28" },
  { from: 2, to: 3, path: "M 50 28 Q 58 20, 65 18" },
  { from: 3, to: 4, path: "M 65 18 Q 72 24, 80 30" },
  { from: 0, to: 5, path: "M 20 25 Q 15 40, 15 55" },
  { from: 1, to: 6, path: "M 35 15 Q 32 30, 30 45" },
  { from: 2, to: 6, path: "M 50 28 Q 38 38, 30 45" },
  { from: 2, to: 7, path: "M 50 28 Q 49 42, 48 58" },
  { from: 3, to: 8, path: "M 65 18 Q 68 35, 70 50" },
  { from: 4, to: 9, path: "M 80 30 Q 82 45, 85 62" },
  { from: 5, to: 6, path: "M 15 55 Q 22 50, 30 45" },
  { from: 6, to: 7, path: "M 30 45 Q 38 52, 48 58" },
  { from: 7, to: 8, path: "M 48 58 Q 58 54, 70 50" },
  { from: 8, to: 9, path: "M 70 50 Q 78 56, 85 62" },
  { from: 5, to: 10, path: "M 15 55 Q 18 68, 25 80" },
  { from: 6, to: 10, path: "M 30 45 Q 26 62, 25 80" },
  { from: 7, to: 11, path: "M 48 58 Q 45 72, 42 85" },
  { from: 8, to: 12, path: "M 70 50 Q 64 65, 60 78" },
  { from: 9, to: 13, path: "M 85 62 Q 80 72, 78 82" },
  { from: 10, to: 11, path: "M 25 80 Q 34 82, 42 85" },
  { from: 11, to: 12, path: "M 42 85 Q 50 82, 60 78" },
  { from: 12, to: 13, path: "M 60 78 Q 69 80, 78 82" },
];

export function BrainNeuralBackground({ parallax }: BrainNeuralBackgroundProps) {
  const gradientId = useId();
  const glowFilterId = useId();

  const mx = parallax.isReducedMotion ? 0 : parallax.mouseX;
  const my = parallax.isReducedMotion ? 0 : parallax.mouseY;
  const progress = parallax.isReducedMotion ? 0 : parallax.scrollProgress;

  return (
    <div className="parallax-canvas fixed inset-0 pointer-events-none select-none z-[1] overflow-hidden" aria-hidden="true">
      {/* LAYER 1: Ambient Mindful Aura Orbs (Deep Background Depth) */}
      <div
        className="ambient-shape shape-sage-brain absolute rounded-full blur-[100px] opacity-40 will-change-transform transition-transform duration-700 ease-out"
        style={{
          width: "550px",
          height: "550px",
          top: "-5%",
          right: "-5%",
          background: "radial-gradient(circle, #557C72 0%, rgba(85, 124, 114, 0.12) 70%)",
          transform: `translate3d(${mx * -25}px, ${my * -25 - progress * 80}px, 0) scale(${1 + progress * 0.15})`,
        }}
      />
      <div
        className="ambient-shape shape-lavender-brain absolute rounded-full blur-[110px] opacity-35 will-change-transform transition-transform duration-700 ease-out"
        style={{
          width: "600px",
          height: "600px",
          top: "35%",
          left: "-10%",
          background: "radial-gradient(circle, #A79BC8 0%, rgba(167, 155, 200, 0.15) 70%)",
          transform: `translate3d(${mx * 30}px, ${my * 20 + progress * 60}px, 0)`,
        }}
      />
      <div
        className="ambient-shape shape-mist-brain absolute rounded-full blur-[90px] opacity-45 will-change-transform transition-transform duration-700 ease-out"
        style={{
          width: "480px",
          height: "480px",
          bottom: "5%",
          right: "10%",
          background: "radial-gradient(circle, #DCE8E8 0%, rgba(220, 232, 232, 0.25) 70%)",
          transform: `translate3d(${mx * -18}px, ${my * -15 - progress * 50}px, 0)`,
        }}
      />

      {/* LAYER 2: Mindful Breathing Aura Pulse */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        <div className="w-[80vw] h-[80vw] max-w-[900px] max-h-[900px] rounded-full border border-[#557C72]/20 animate-[mindful-breathe_14s_ease-in-out_infinite_alternate]" />
        <div className="absolute w-[60vw] h-[60vw] max-w-[650px] max-h-[650px] rounded-full border border-[#A79BC8]/25 animate-[mindful-breathe_18s_ease-in-out_infinite_alternate-reverse]" />
      </div>

      {/* LAYER 3: Synaptic Neural Network Constellation (SVG Overlay) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-60 transition-transform duration-300 ease-out will-change-transform"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{
          transform: `translate3d(${mx * 12}px, ${my * 12 - progress * 30}px, 0)`,
        }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#557C72" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#A79BC8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#DCE8E8" stopOpacity="0.3" />
          </linearGradient>

          <filter id={glowFilterId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Axon / Synapse Connecting Curves */}
        <g filter={`url(#${glowFilterId})`}>
          {SYNAPSE_CONNECTIONS.map((conn, idx) => (
            <path
              key={idx}
              d={conn.path}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth="0.25"
              strokeDasharray="1 1.5"
              className="animate-[synapse-pulse_8s_linear_infinite]"
              style={{ animationDelay: `${idx * 0.4}s` }}
            />
          ))}
        </g>

        {/* Synaptic Brain Nodes */}
        {NEURAL_NODES.map((node) => {
          const offsetX = mx * node.depth * 1.5;
          const offsetY = my * node.depth * 1.5 - progress * node.depth * 8;
          return (
            <g
              key={node.id}
              className="transition-transform duration-500 ease-out"
              style={{ transform: `translate(${offsetX}px, ${offsetY}px)` }}
            >
              {/* Outer Glowing Pulsing Aura */}
              <circle
                cx={node.cx}
                cy={node.cy}
                r={node.r * 0.4}
                fill={node.color}
                opacity="0.2"
                className="animate-[node-pulse_4s_ease-in-out_infinite_alternate]"
              />
              {/* Core Node Circle */}
              <circle
                cx={node.cx}
                cy={node.cy}
                r={node.r * 0.18}
                fill={node.color}
                opacity="0.85"
              />
            </g>
          );
        })}
      </svg>

      {/* LAYER 4: Floating Mindful Thought Sparks & Memory Badges */}
      <div className="absolute inset-0 pointer-events-none">
        {NEURAL_NODES.slice(0, 6).map((node, idx) => {
          const offsetX = mx * node.depth * 25;
          const offsetY = my * node.depth * 25 - progress * 100;
          return (
            <div
              key={node.id}
              className="absolute text-[10px] font-extrabold uppercase tracking-widest text-[#557C72]/40 backdrop-blur-xs px-2 py-0.5 rounded-full border border-[#557C72]/15 bg-white/40 hidden md:block will-change-transform transition-transform duration-300"
              style={{
                left: `${node.cx}%`,
                top: `${node.cy}%`,
                transform: `translate3d(${offsetX}px, ${offsetY}px, 0)`,
                animationDelay: `${idx * 0.7}s`,
              }}
            >
              {node.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
