import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Feat {
  name: string;
  formula: string;
  desc: string;
}
interface Group {
  title: string;
  tag: string;
  variant: "accent" | "up" | "gold" | "down" | "neutral";
  intro: string;
  feats: Feat[];
}

const GROUPS: Group[] = [
  {
    title: "リターン（モメンタム）",
    tag: "Momentum",
    variant: "up",
    intro: "過去n営業日の価格変化率。直近の勢い（トレンドの強さ・方向）を捉える。",
    feats: [
      { name: "ret_1d / 3d / 5d / 10d / 20d", formula: "close / close.shift(n) − 1", desc: "n日前比の騰落率。複数の時間軸でモメンタムを表現。" },
    ],
  },
  {
    title: "移動平均からの乖離",
    tag: "Trend",
    variant: "accent",
    intro: "現在値が移動平均からどれだけ離れているか。トレンドからの行き過ぎ／押し目を測る。",
    feats: [
      { name: "ma5_diff / ma20_diff / ma60_diff", formula: "close / SMA(n) − 1", desc: "短期(5)・中期(20)・長期(60)の移動平均に対する乖離率。" },
    ],
  },
  {
    title: "ボラティリティ",
    tag: "Volatility ★",
    variant: "gold",
    intro: "値動きの大きさ。本モデルで最も重要な特徴群（SHAP上位を独占）。大きな+5%上昇は高ボラ局面で起きやすい。",
    feats: [
      { name: "volatility_5d / 20d / 60d", formula: "std( daily_return, n )", desc: "日次リターンの標準偏差。期間別の変動性。" },
      { name: "atr_14 / atr_20", formula: "mean( TrueRange, n )", desc: "True Range（ギャップ込みの値幅）の平均。ATR。" },
      { name: "atr_ratio_14 / atr_ratio_20", formula: "ATR(n) / close", desc: "価格水準で正規化したATR。銘柄間でも比較可能。" },
    ],
  },
  {
    title: "ボリンジャーバンド",
    tag: "Volatility",
    variant: "gold",
    intro: "20日移動平均 ±2σ のバンド。相対的な位置と幅で行き過ぎ・収縮拡大を捉える。",
    feats: [
      { name: "bb_width", formula: "(upper − lower) / SMA20", desc: "バンド幅。ボラの収縮（スクイーズ）／拡大を表す。" },
      { name: "bb_position", formula: "(close − lower) / (upper − lower)", desc: "バンド内での相対位置（0=下限, 1=上限）。" },
    ],
  },
  {
    title: "出来高",
    tag: "Volume",
    variant: "neutral",
    intro: "売買の活発さ。急増は転換やイベントの予兆になりやすい。",
    feats: [
      { name: "volume_ratio_5d / 20d", formula: "volume / mean(volume, n)", desc: "平常時に対する出来高の比。" },
      { name: "volume_spike_2x / 3x", formula: "volume > k × MA20(volume)", desc: "出来高が平均の2倍/3倍を超えたフラグ（0/1）。" },
    ],
  },
  {
    title: "オシレーター",
    tag: "Oscillator",
    variant: "accent",
    intro: "買われ過ぎ・売られ過ぎや、トレンドの転換を測る古典的テクニカル。",
    feats: [
      { name: "rsi_14", formula: "100 − 100/(1 + 平均上昇/平均下落)", desc: "相対力指数。70↑買われ過ぎ・30↓売られ過ぎ。" },
      { name: "macd / macd_signal / macd_hist", formula: "EMA12 − EMA26, その EMA9, 差分", desc: "トレンドの方向と勢い。ヒストグラムは加速/減速。" },
    ],
  },
  {
    title: "ローソク足の形状",
    tag: "Price Action",
    variant: "up",
    intro: "1本のローソクの形から、当日の需給バランス（買い圧/売り圧）を読む。",
    feats: [
      { name: "high_low_range", formula: "(high − low) / close", desc: "日中の値幅。ボラの当日版。" },
      { name: "body_size", formula: "(close − open) / open", desc: "実体の大きさと方向（陽線/陰線の強さ）。" },
      { name: "upper_shadow", formula: "(high − max(open,close)) / close", desc: "上ヒゲ。上値の重さ（売り圧）。" },
      { name: "lower_shadow", formula: "(min(open,close) − low) / close", desc: "下ヒゲ。下値の堅さ（買い支え）。" },
    ],
  },
  {
    title: "高値・安値からの経過日数",
    tag: "Position",
    variant: "neutral",
    intro: "直近レンジの中で“いつ”高値/安値を付けたか。ブレイクや底打ちのタイミング情報。",
    feats: [
      { name: "days_since_20d_high / 60d_high", formula: "n − 1 − argmax(close, n)", desc: "直近n日の高値を付けてからの経過日数。" },
      { name: "days_since_20d_low / 60d_low", formula: "n − 1 − argmin(close, n)", desc: "直近n日の安値を付けてからの経過日数。" },
    ],
  },
  {
    title: "外部マクロ指標",
    tag: "External",
    variant: "down",
    intro: "市場全体・為替の地合い。米国系(S&P500/VIX)は東京の引け後に確定するため1営業日ラグしてリークを防止。",
    feats: [
      { name: "sp500_ret_1d", formula: "S&P500 前日比（1日ラグ）", desc: "米国株の地合い。" },
      { name: "nikkei_ret_1d", formula: "日経225 前日比", desc: "日本株全体の地合い（同時刻なのでラグ不要）。" },
      { name: "usdjpy_ret_1d", formula: "USD/JPY 前日比", desc: "為替。輸出企業の日産は感応度が高い。" },
      { name: "vix_level / vix_ret_1d", formula: "VIX 水準と前日比（1日ラグ）", desc: "恐怖指数。市場のリスク許容度。" },
    ],
  },
];

export function FeatureDocs() {
  return (
    <div className="space-y-6">
      {/* 設計思想 */}
      <Card>
        <CardHeader>
          <CardTitle>設計思想 — Why these features?</CardTitle>
          <Badge variant="accent">33 technical + 5 external</Badge>
        </CardHeader>
        <ul className="grid gap-2 text-sm text-white/65 sm:grid-cols-2">
          <li className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-3">
            <b className="text-white/85">価格そのものは使わない。</b> すべて「変化率・比率・形状」に正規化し、時代や価格水準に依存しない設計。
          </li>
          <li className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-3">
            <b className="text-white/85">リーク厳禁。</b> 各特徴量は“その日の終値時点で確定する情報”のみ。米国指標は1営業日ラグ。
          </li>
          <li className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-3">
            <b className="text-white/85">ボラティリティ中心。</b> +5%の大きな上昇は高ボラ局面に集中するため、ボラ系を厚く設計（SHAPでも最重要）。
          </li>
          <li className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-3">
            <b className="text-white/85">マルチ時間軸。</b> 1/3/5/10/20/60日と複数の窓を併用し、短期と中期の文脈を同時に捉える。
          </li>
        </ul>
      </Card>

      {/* 特徴量グループ */}
      <div className="grid gap-5 lg:grid-cols-2">
        {GROUPS.map((g) => (
          <Card key={g.title}>
            <CardHeader>
              <CardTitle>{g.title}</CardTitle>
              <Badge variant={g.variant}>{g.tag}</Badge>
            </CardHeader>
            <p className="mb-3 text-xs leading-relaxed text-white/45">{g.intro}</p>
            <div className="space-y-2">
              {g.feats.map((f) => (
                <div key={f.name} className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-3">
                  <div className="font-mono text-xs font-semibold text-white/85">{f.name}</div>
                  <div className="mt-1 font-mono text-[11px] text-accent/80">{f.formula}</div>
                  <div className="mt-1 text-xs text-white/50">{f.desc}</div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* ターゲット */}
      <Card>
        <CardHeader>
          <CardTitle>予測ターゲット</CardTitle>
          <Badge variant="up">Target</Badge>
        </CardHeader>
        <div className="rounded-lg border border-up/20 bg-up/[0.05] p-4">
          <div className="font-mono text-sm text-up">
            target = ( close.shift(−5) / close − 1 ≥ +5% ) ? 1 : 0
          </div>
          <p className="mt-2 text-xs leading-relaxed text-white/55">
            「5営業日後の終値が現在より +5% 以上高いか」の二値分類。稀少イベント（正例 約11%）のため
            <code className="mx-1 rounded bg-white/10 px-1">class_weight=&quot;balanced&quot;</code>
            で不均衡対策。評価は PR-AUC を主指標とし、Walk-Forward Validation（TimeSeriesSplit 5-fold）でリークなく検証。
          </p>
        </div>
      </Card>
    </div>
  );
}
