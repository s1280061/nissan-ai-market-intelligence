import { Hero } from "@/components/hero";
import { MetricsRow } from "@/components/metrics-row";
import { StockChart } from "@/components/stock-chart";
import { ShapPanel } from "@/components/shap-panel";
import { MarketGrid } from "@/components/market-grid";
import { AICommentary } from "@/components/ai-commentary";
import { Card } from "@/components/ui/card";
import { PageContainer, SectionTitle } from "@/components/ui/section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PageContainer className="space-y-10 pt-0">
        <section>
          <SectionTitle>Model Performance · Walk-Forward Backtest</SectionTitle>
          <MetricsRow />
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          <Card>
            <StockChart />
          </Card>
          <ShapPanel />
        </section>

        <AICommentary />

        <section>
          <SectionTitle>Global Macro</SectionTitle>
          <MarketGrid />
        </section>
      </PageContainer>
    </>
  );
}
