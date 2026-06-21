import { FeatureDocs } from "@/components/feature-docs";
import { GlossarySection } from "@/components/glossary";
import { PageContainer, PageHeading } from "@/components/ui/section";

export default function FeaturesPage() {
  return (
    <PageContainer>
      <PageHeading
        title="Feature Engineering"
        subtitle="特徴量設計 — モデルが何を見て予測しているか"
      />
      <FeatureDocs />
      <div className="mt-6">
        <GlossarySection />
      </div>
    </PageContainer>
  );
}
