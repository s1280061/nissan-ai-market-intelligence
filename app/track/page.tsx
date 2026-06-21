import { TrackRecord } from "@/components/track-record";
import { GlossarySection } from "@/components/glossary";
import { PageContainer, PageHeading } from "@/components/ui/section";

export default function TrackPage() {
  return (
    <PageContainer>
      <PageHeading
        title="Track Record"
        subtitle="予測実績 — 実際に当たったか（out-of-sample）"
      />
      <TrackRecord />
      <div className="mt-8">
        <GlossarySection only={["out-of-sample", "base-rate", "+5%ターゲット", "shap"]} />
      </div>
    </PageContainer>
  );
}
