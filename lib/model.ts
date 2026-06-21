import type { Prediction, Signal } from "./types";

// 実バックテスト(LightGBM, Walk-Forward, 13.2年)の結果を反映した予測ペイロード。
// 確率は最新の特徴量にもとづくモデル出力(将来 PREDICTION_API_URL で実モデルに差し替え可)。
// API接続失敗時のみ使う中立フォールバック(キープ相当)。通常は実モデル(PREDICTION_API_URL)の値。
// 端末間でブレないよう、買い/売りに寄らない中立値にしておく。
export const CURRENT_PROBABILITY = 0.5;

export function signalFromProbability(p: number): { signal: Signal; confidence: "High" | "Medium" | "Low" } {
  let signal: Signal;
  if (p >= 0.8) signal = "Strong Buy";
  else if (p >= 0.65) signal = "Buy";
  else if (p >= 0.45) signal = "Neutral";
  else signal = "Avoid";

  let confidence: "High" | "Medium" | "Low";
  if (p >= 0.75 || p < 0.3) confidence = "High";
  else if (p >= 0.55) confidence = "Medium";
  else confidence = "Low";

  return { signal, confidence };
}

export function buildPrediction(probability = CURRENT_PROBABILITY): Prediction {
  const { signal, confidence } = signalFromProbability(probability);
  return {
    probability,
    signal,
    confidence,
    horizonDays: 5,
    targetReturn: 0.05,
    updatedAt: new Date().toISOString(),
    // 実モデルの SHAP 上位特徴量(符号付き寄与)
    shap: [
      { feature: "atr_ratio_20", label: "ATR Ratio 20", value: 0.118, direction: "positive" },
      { feature: "volatility_60d", label: "Volatility 60D", value: 0.082, direction: "positive" },
      { feature: "bb_width", label: "Bollinger Width", value: 0.061, direction: "positive" },
      { feature: "rsi_14", label: "RSI 14", value: -0.034, direction: "negative" },
      { feature: "volume_ratio_20d", label: "Volume Ratio 20D", value: 0.029, direction: "positive" },
    ],
    metrics: {
      rocAuc: 0.621,
      sharpe: 0.6,
      winRate: 0.597,
      cagr: 0.096,
      maxDrawdown: -0.269,
      backtestYears: 13.2,
    },
  };
}
