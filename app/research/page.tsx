import { ResearchView } from "@/components/research-view";
import { PageContainer, PageHeading } from "@/components/ui/section";

export default function ResearchPage() {
  return (
    <PageContainer>
      <PageHeading
        title="Research"
        subtitle="モデル情報 · 特徴量 · バックテスト結果"
      />
      <ResearchView />
    </PageContainer>
  );
}
