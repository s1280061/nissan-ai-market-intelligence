"use client";

import type { Mood } from "@/lib/signal";

const ANIM: Record<Mood, string> = {
  ecstatic: "animate-mascot-bounce",
  happy: "animate-mascot-bob",
  neutral: "animate-mascot-idle",
  worried: "animate-mascot-shake",
  panic: "animate-mascot-tremble",
};

/**
 * AIマスコット。確率に応じた5つの表情を、CSSアニメで“GIFのように”動かす。
 * 外部アセット不要のインラインSVG（スケーラブル・常に高画質）。
 */
export function SignalCharacter({
  mood,
  color,
  size = 150,
}: {
  mood: Mood;
  color: string;
  size?: number;
}) {
  return (
    <div
      className={ANIM[mood]}
      style={{ width: size, height: size, filter: `drop-shadow(0 8px 24px ${color}55)` }}
    >
      <svg viewBox="0 0 120 120" width={size} height={size}>
        <defs>
          <radialGradient id={`face-${mood}`} cx="50%" cy="38%" r="70%">
            <stop offset="0%" stopColor={lighten(color)} />
            <stop offset="100%" stopColor={color} />
          </radialGradient>
        </defs>

        {/* グロー */}
        <circle cx="60" cy="60" r="46" fill={color} opacity="0.18" />
        {/* 顔本体 */}
        <circle cx="60" cy="60" r="40" fill={`url(#face-${mood})`} stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />

        {/* 表情 */}
        <Face mood={mood} />

        {/* アクセサリー */}
        {mood === "ecstatic" && <Sparkles />}
        {mood === "panic" && <Sweat />}
        {mood === "worried" && <SweatSmall />}
      </svg>
    </div>
  );
}

function Face({ mood }: { mood: Mood }) {
  const dark = "rgba(5,7,10,0.85)";
  switch (mood) {
    case "ecstatic":
      return (
        <g fill={dark}>
          {/* スター目 */}
          <Star x={46} y={52} />
          <Star x={74} y={52} />
          {/* 大きな笑顔 */}
          <path d="M44 68 Q60 88 76 68 Q60 80 44 68 Z" fill={dark} />
          <path d="M44 68 Q60 78 76 68" fill="#fff" opacity="0.25" />
        </g>
      );
    case "happy":
      return (
        <g fill={dark}>
          <circle cx="48" cy="54" r="4.5" />
          <circle cx="72" cy="54" r="4.5" />
          <path d="M46 66 Q60 80 74 66" stroke={dark} strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
      );
    case "neutral":
      return (
        <g fill={dark}>
          <circle cx="48" cy="55" r="4.5" />
          <circle cx="72" cy="55" r="4.5" />
          <line x1="48" y1="72" x2="72" y2="72" stroke={dark} strokeWidth="4" strokeLinecap="round" />
        </g>
      );
    case "worried":
      return (
        <g fill={dark}>
          <circle cx="48" cy="56" r="4" />
          <circle cx="72" cy="56" r="4" />
          {/* 眉 */}
          <line x1="42" y1="46" x2="54" y2="50" stroke={dark} strokeWidth="3" strokeLinecap="round" />
          <line x1="78" y1="46" x2="66" y2="50" stroke={dark} strokeWidth="3" strokeLinecap="round" />
          <path d="M46 76 Q60 66 74 76" stroke={dark} strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
      );
    case "panic":
      return (
        <g fill={dark}>
          {/* 見開いた目 */}
          <circle cx="48" cy="55" r="6.5" fill="#fff" />
          <circle cx="48" cy="56" r="3" />
          <circle cx="72" cy="55" r="6.5" fill="#fff" />
          <circle cx="72" cy="56" r="3" />
          {/* 大きく開いた口 */}
          <ellipse cx="60" cy="78" rx="8" ry="6" fill={dark} />
        </g>
      );
  }
}

function Star({ x, y }: { x: number; y: number }) {
  return (
    <path
      transform={`translate(${x - 60} ${y - 55})`}
      d="M60 47 l2.6 5.3 5.8 .8 -4.2 4.1 1 5.8 -5.2 -2.7 -5.2 2.7 1 -5.8 -4.2 -4.1 5.8 -.8 z"
    />
  );
}

function Sparkles() {
  return (
    <g className="animate-sparkle" fill="#fff">
      <path d="M98 30 l1.5 4 4 1.5 -4 1.5 -1.5 4 -1.5 -4 -4 -1.5 4 -1.5 z" />
      <path d="M22 34 l1 3 3 1 -3 1 -1 3 -1 -3 -3 -1 3 -1 z" opacity="0.8" />
      <path d="M96 70 l1 3 3 1 -3 1 -1 3 -1 -3 -3 -1 3 -1 z" opacity="0.7" />
    </g>
  );
}

function Sweat() {
  return (
    <g className="animate-sweat" fill="#7dd3fc">
      <path d="M86 44 q5 8 0 12 q-5 -4 0 -12 z" />
    </g>
  );
}

function SweatSmall() {
  return (
    <g className="animate-sweat" fill="#7dd3fc">
      <path d="M82 48 q3.5 5.5 0 8.5 q-3.5 -3 0 -8.5 z" />
    </g>
  );
}

function lighten(hex: string): string {
  const c = hex.replace("#", "");
  const r = Math.min(255, parseInt(c.slice(0, 2), 16) + 60);
  const g = Math.min(255, parseInt(c.slice(2, 4), 16) + 60);
  const b = Math.min(255, parseInt(c.slice(4, 6), 16) + 60);
  return `rgb(${r},${g},${b})`;
}
