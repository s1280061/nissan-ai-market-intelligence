// 予測確率 P(5営業日以内に+5%上昇) を 5段階シグナルに変換する。

export type Level5 = "StrongBuy" | "Buy" | "Hold" | "Sell" | "StrongSell";

export interface SignalInfo {
  level: Level5;
  jp: string; // めっちゃ買い 等
  en: string;
  color: string; // アクセント色
  glow: string; // グロー用 rgba
  mood: Mood;
  blurb: string;
}

export type Mood = "ecstatic" | "happy" | "neutral" | "worried" | "panic";

export function fiveLevel(p: number): SignalInfo {
  if (p >= 0.8)
    return {
      level: "StrongBuy",
      jp: "めっちゃ買い",
      en: "Strong Buy",
      color: "#16e0a8",
      glow: "rgba(22,224,168,0.55)",
      mood: "ecstatic",
      blurb: "上昇確率が非常に高い局面。AIは強い買いサイン。",
    };
  if (p >= 0.65)
    return {
      level: "Buy",
      jp: "買い",
      en: "Buy",
      color: "#4ade80",
      glow: "rgba(74,222,128,0.45)",
      mood: "happy",
      blurb: "上昇確率が高め。AIは買い寄り。",
    };
  if (p >= 0.45)
    return {
      level: "Hold",
      jp: "キープ",
      en: "Hold",
      color: "#e6b450",
      glow: "rgba(230,180,80,0.4)",
      mood: "neutral",
      blurb: "中立。様子見が妥当なゾーン。",
    };
  if (p >= 0.3)
    return {
      level: "Sell",
      jp: "売り",
      en: "Sell",
      color: "#ff9f43",
      glow: "rgba(255,159,67,0.4)",
      mood: "worried",
      blurb: "上昇確率が低め。AIは売り寄り。",
    };
  return {
    level: "StrongSell",
    jp: "めっちゃ売り",
    en: "Strong Sell",
    color: "#ff4d5e",
    glow: "rgba(255,77,94,0.5)",
    mood: "panic",
    blurb: "上昇確率が非常に低い局面。AIは強い売りサイン。",
  };
}

// 5段階のメーター表示順（左=売り 右=買い）
export const LEVEL_ORDER: Level5[] = ["StrongSell", "Sell", "Hold", "Buy", "StrongBuy"];
export const LEVEL_META: Record<Level5, { jp: string; color: string }> = {
  StrongSell: { jp: "めっちゃ売り", color: "#ff4d5e" },
  Sell: { jp: "売り", color: "#ff9f43" },
  Hold: { jp: "キープ", color: "#e6b450" },
  Buy: { jp: "買い", color: "#4ade80" },
  StrongBuy: { jp: "めっちゃ買い", color: "#16e0a8" },
};
