"use client";

import { SiteHeaderWithBreadcrumb } from "@/components/dashboard/header/site-header-with-breadcrumb";
import { useTranslation } from "@/hooks/use-translation";

export function CategoryListHeaderClient() {
  const { t } = useTranslation();

  return (
    <SiteHeaderWithBreadcrumb
      title={t("dashboard.category.list.title")}
      breadcrumbItems={[
        { label: t("dashboard.breadcrumb.dashboard"), href: "/dashboard" },
        { label: t("dashboard.category.list.title"), isActive: true },
      ]}
    />
  );
}
