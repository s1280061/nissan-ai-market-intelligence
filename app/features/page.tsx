import { FeatureDocs } from "@/components/feature-docs";
import { PageContainer, PageHeading } from "@/components/ui/section";

export default function FeaturesPage() {
  return (
    <PageContainer>
      <PageHeading
        title="Feature Engineering"
        subtitle="特徴量設計 — モデルが何を見て予測しているか"
      />
      <FeatureDocs />
    </PageContainer>
  );
}
