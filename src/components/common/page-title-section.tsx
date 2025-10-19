"use client";

import { useTranslation } from "@/hooks/use-translation";

interface PageTitleSectionProps {
  titleKey: string;
  subtitleKey?: string;
  className?: string;
}

export function PageTitleSection({
  titleKey,
  subtitleKey,
  className = "space-y-2 pb-6",
}: PageTitleSectionProps) {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <h1 className="text-3xl font-bold tracking-tight">{t(titleKey)}</h1>
      {subtitleKey && <p className="text-muted-foreground">{t(subtitleKey)}</p>}
    </div>
  );
}
