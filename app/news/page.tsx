import { NewsList } from "@/components/news-list";
import { PageContainer, PageHeading } from "@/components/ui/section";

export default function NewsPage() {
  return (
    <PageContainer>
      <PageHeading title="Market News" subtitle="世界情勢ニュース · Economy / AI / Automotive / EV / Geopolitics" />
      <NewsList />
    </PageContainer>
  );
}
