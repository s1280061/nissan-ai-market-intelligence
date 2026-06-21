import type { NewsItem } from "./types";

// NEWS_API_KEY 未設定時のフォールバック。
export const MOCK_NEWS: NewsItem[] = [
  {
    id: "n1",
    title: "Nissan accelerates EV roadmap with new solid-state battery pilot line",
    summary:
      "日産は全固体電池のパイロットラインを稼働させ、2028年の量産化目標を再確認。航続距離と急速充電性能の大幅改善を見込む。",
    source: "Automotive News",
    url: "https://www.automotivenews.com/",
    publishedAt: new Date(Date.now() - 3 * 3600e3).toISOString(),
    category: "EV",
  },
  {
    id: "n2",
    title: "BOJ holds rates, yen volatility keeps exporters in focus",
    summary:
      "日銀は金利を据え置き。円相場のボラティリティが続く中、自動車を含む輸出企業の採算に市場の関心が集まる。",
    source: "Reuters",
    url: "https://www.reuters.com/",
    publishedAt: new Date(Date.now() - 6 * 3600e3).toISOString(),
    category: "Economy",
  },
  {
    id: "n3",
    title: "Generative AI demand drives record data-center capex across Asia",
    summary:
      "生成AI需要を背景に、アジア圏のデータセンター投資が過去最高に。半導体・電力関連のサプライチェーンに波及。",
    source: "Bloomberg",
    url: "https://www.bloomberg.com/",
    publishedAt: new Date(Date.now() - 9 * 3600e3).toISOString(),
    category: "AI",
  },
  {
    id: "n4",
    title: "Global automakers brace for new EV tariff landscape",
    summary:
      "EVを巡る関税環境の変化に世界の自動車メーカーが備える。生産拠点の再配置やサプライチェーン見直しの動き。",
    source: "Financial Times",
    url: "https://www.ft.com/",
    publishedAt: new Date(Date.now() - 14 * 3600e3).toISOString(),
    category: "Automotive",
  },
  {
    id: "n5",
    title: "Geopolitical tensions lift safe-haven demand, VIX ticks higher",
    summary:
      "地政学的緊張の高まりで安全資産需要が増加。VIXが上昇し、リスク資産にショートタームの警戒感。",
    source: "CNBC",
    url: "https://www.cnbc.com/",
    publishedAt: new Date(Date.now() - 20 * 3600e3).toISOString(),
    category: "Geopolitics",
  },
  {
    id: "n6",
    title: "Nissan and partner expand autonomous driving trials in Yokohama",
    summary:
      "日産はパートナーと横浜での自動運転実証を拡大。AIによる都市部走行データの収集を強化する。",
    source: "Nikkei Asia",
    url: "https://asia.nikkei.com/",
    publishedAt: new Date(Date.now() - 26 * 3600e3).toISOString(),
    category: "Automotive",
  },
];
