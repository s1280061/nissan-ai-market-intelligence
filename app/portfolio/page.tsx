import { PortfolioView } from "@/components/portfolio-view";
import { PageContainer, PageHeading } from "@/components/ui/section";

export default function PortfolioPage() {
  return (
    <PageContainer>
      <PageHeading title="Portfolio" subtitle="仮想ポートフォリオ · 保有株と損益" />
      <PortfolioView />
    </PageContainer>
  );
}
