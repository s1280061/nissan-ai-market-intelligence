import { StockStats } from "@/components/stock-stats";
import { StockChart } from "@/components/stock-chart";
import { PredictionCard } from "@/components/prediction-card";
import { ShapPanel } from "@/components/shap-panel";
import { MetricsRow } from "@/components/metrics-row";
import { Card } from "@/components/ui/card";
import { PageContainer, PageHeading, SectionTitle } from "@/components/ui/section";

export default function DashboardPage() {
  return (
    <PageContainer className="space-y-8">
      <PageHeading
        title="Dashboard"
        subtitle="Nissan 7201.T · リアルタイム株価とAI予測"
      />

      <StockStats />

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <StockChart />
        </Card>
        <PredictionCard />
      </div>

      <section>
        <SectionTitle>AI Performance</SectionTitle>
        <MetricsRow />
      </section>

      <ShapPanel />
    </PageContainer>
  );
}
