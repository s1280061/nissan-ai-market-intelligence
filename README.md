# Nissan AI Market Intelligence

日産自動車(7201.T)の **AI株価予測・説明可能性(SHAP)・世界情勢ニュース・マクロ指標** を
統合した、近未来的ダークテーマの投資ダッシュボード。

> 対象ユーザー: 個人投資家 / 研究者 / AIエンジニア
> 予測は研究目的であり、投資助言ではありません。

![tech](https://img.shields.io/badge/Next.js-15-black) ![ts](https://img.shields.io/badge/TypeScript-5-blue) ![tw](https://img.shields.io/badge/Tailwind-3-38bdf8)

## ✨ 特徴

- **リアルタイム株価** — Yahoo Finance から日産株を取得、1D〜5Y のインタラクティブチャート
- **AI予測** — 「5営業日以内に +5% 上昇する確率」を円形ゲージで表示。Strong Buy / Buy / Neutral / Avoid 判定
- **Explainable AI** — SHAP Top5 をプラス要因／マイナス要因に分離表示
- **Global Macro** — S&P500 / NASDAQ / USD/JPY / VIX / Nikkei225 をスパークライン付きで
- **Market News** — NewsAPI 連携（カテゴリ・検索）。キー未設定でもモックで動作
- **Portfolio / Research** — 仮想ポートフォリオ損益、モデル情報・バックテスト結果
- **UI** — Tesla / Bloomberg Terminal / Apple / TradingView を参考にしたガラスモーフィズム・ダークUI、アニメーション、レスポンシブ、ローディングスケルトン、エラーハンドリング

## 🧱 技術スタック

| 領域 | 採用 |
|---|---|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS |
| UI | shadcn/ui スタイルの自作コンポーネント, Lucide Icons |
| Charts | Recharts |
| Backend | Next.js API Routes (Node.js runtime) |
| Data | Yahoo Finance (`yahoo-finance2`), NewsAPI |
| Deploy | Vercel |

## 📁 フォルダ構成

```
nissan-ai-market-intelligence/
├─ app/
│  ├─ layout.tsx              # ルートレイアウト + ナビ/フッター
│  ├─ globals.css             # ダークテーマ・ガラスUI
│  ├─ page.tsx                # TOP(ヒーロー + 概要)
│  ├─ dashboard/page.tsx      # 株価 + AI予測 + SHAP
│  ├─ news/page.tsx           # ニュース(検索・カテゴリ)
│  ├─ macro/page.tsx          # マクロ指標
│  ├─ portfolio/page.tsx      # 仮想ポートフォリオ
│  ├─ research/page.tsx       # モデル情報・バックテスト
│  └─ api/
│     ├─ stock/route.ts       # 株価(quote + candles)
│     ├─ prediction/route.ts  # 予測 + SHAP + 指標
│     ├─ market/route.ts      # 指数
│     └─ news/route.ts        # ニュース
├─ components/                # Hero, StockChart, PredictionCard, ShapPanel, ...
│  └─ ui/                     # Card, Badge, Skeleton, Section
├─ lib/                       # types, utils, yahoo, model, use-fetch
├─ .env.example
└─ README.md
```

## 🔌 API設計

| エンドポイント | 説明 | クエリ |
|---|---|---|
| `GET /api/stock` | 株価(現在値 + ローソク) | `range=1D\|1W\|1M\|3M\|1Y\|5Y`, `symbol` |
| `GET /api/prediction` | 予測確率・シグナル・SHAP・性能指標 | - |
| `GET /api/market` | 主要指数 + スパークライン | - |
| `GET /api/news` | ニュース | `category`, `q` |

## 🔑 環境変数

`.env.example` をコピーして `.env.local` を作成。

| 変数 | 必須 | 説明 |
|---|---|---|
| `NEXT_PUBLIC_TICKER` | 任意 | 対象銘柄(既定 `7201.T`) |
| `NEWS_API_KEY` | 任意 | [NewsAPI](https://newsapi.org/) のキー。未設定ならモックニュース |
| `PREDICTION_API_URL` | 任意 | 実モデル予測APIのURL。未設定なら内蔵のバックテスト結果を返す |

```bash
cp .env.example .env.local
```

## 🚀 セットアップ

```bash
# 1. 依存インストール
npm install

# 2. 開発サーバ
npm run dev
# http://localhost:3000

# 3. 本番ビルド
npm run build
npm start
```

> 株価・指数は Yahoo Finance から取得するため、初回アクセス時はネットワーク接続が必要です。

## ▲ 本番デプロイ（Vercel + Render）

2リポジトリ構成。フロントを Vercel、推論API(FastAPI/LightGBM)を Render にデプロイする。

| 役割 | リポジトリ | デプロイ先 |
|---|---|---|
| フロント (Next.js) | https://github.com/s1280061/nissan-ai-market-intelligence | **Vercel** |
| 推論API (FastAPI) | https://github.com/s1280061/nissan-prediction-api | **Render** |

### 1) Render に FastAPI をデプロイ（先に実施）
1. [Render Dashboard](https://dashboard.render.com/) → **New → Web Service**
2. `s1280061/nissan-prediction-api` を接続（`render.yaml` を自動検出: Docker / `healthCheckPath: /health`）
3. デプロイ後の URL を控える（例 `https://nissan-prediction-api.onrender.com`）
4. `GET /health` が `{"status":"ok"}` を返せば成功

### 2) Vercel に Next.js をデプロイ
1. [Vercel](https://vercel.com/new) → `s1280061/nissan-ai-market-intelligence` を Import
2. Framework Preset は **Next.js** が自動検出（設定不要）
3. **Environment Variables** を追加:
   | Key | Value |
   |---|---|
   | `PREDICTION_API_URL` | Render の URL（末尾スラッシュ不要） |
   | `NEWS_API_KEY` | （任意）NewsAPI のキー |
4. **Deploy** → 発行された URL で公開

`PREDICTION_API_URL` 設定後、`/api/prediction` は自動で Render の `/predict`（実LightGBM推論）を呼びます。
未設定・接続失敗時は内蔵のバックテスト値にフォールバックするため、アプリは常に動作します。

> Next.js の API Routes は Node.js runtime（Yahoo Finance を直接 fetch）。Vercel の Serverless Functions で動作します。

## 🧠 予測モデルについて

予測値・SHAP・性能指標は、別リポジトリの LightGBM パイプライン
(TimeSeriesSplit 5-fold Walk-Forward Validation, 13.2年バックテスト) の実結果を反映しています。

| 指標 | 値 |
|---|---|
| ROC-AUC | 0.621 |
| Sharpe Ratio | 0.60 |
| Win Rate | 59.7% |
| CAGR | 9.6% |
| Max Drawdown | -26.9% |
| Backtest Period | 13.2 years |

将来、`PREDICTION_API_URL` に Python 推論サーバを指定すれば、リアルタイム推論へ差し替え可能です。

## ⚠️ 免責

本アプリは教育・研究目的のデモであり、投資勧誘・投資助言ではありません。
投資判断はご自身の責任で行ってください。
