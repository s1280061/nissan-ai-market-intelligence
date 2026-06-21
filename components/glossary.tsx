import { BookOpen } from "lucide-react";
import { GLOSSARY } from "@/lib/glossary";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * 用語解説（注釈）。ページ下部に置いて専門用語を補足する。
 * only を渡すとそのidの用語だけ表示。
 */
export function GlossarySection({ only }: { only?: string[] }) {
  const terms = only ? GLOSSARY.filter((t) => only.includes(t.id)) : GLOSSARY;
  if (terms.length === 0) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="inline-flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-accent" />
            用語解説
          </span>
        </CardTitle>
      </CardHeader>
      <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
        {terms.map((t) => (
          <div key={t.id} className="border-b border-white/[0.04] pb-2.5">
            <dt className="text-sm font-semibold text-white/85">{t.term}</dt>
            <dd className="mt-0.5 text-xs leading-relaxed text-white/50">{t.def}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
