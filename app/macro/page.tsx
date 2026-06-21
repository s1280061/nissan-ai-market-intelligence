import { MarketGrid } from "@/components/market-grid";
import { PageContainer, PageHeading } from "@/components/ui/section";

export default function MacroPage() {
  return (
    <PageContainer>
      <PageHeading
        title="Global Macro Dashboard"
        subtitle="S&P500 · NASDAQ · USD/JPY · VIX · Nikkei 225"
      />
      <MarketGrid />
    </PageContainer>
  );
}
