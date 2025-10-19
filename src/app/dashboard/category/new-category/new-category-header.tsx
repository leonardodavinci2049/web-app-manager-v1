"use client";

import { SiteHeaderWithBreadcrumb } from "@/components/dashboard/header/site-header-with-breadcrumb";
import { useTranslation } from "@/hooks/use-translation";

export function NewCategoryHeader() {
  const { t } = useTranslation();

  return (
    <SiteHeaderWithBreadcrumb
      title={t("dashboard.category.new.title")}
      breadcrumbItems={[
        { label: t("dashboard.breadcrumb.dashboard"), href: "/dashboard" },
        {
          label: t("dashboard.category.list.title"),
          href: "/dashboard/category/category-list",
        },
        { label: t("dashboard.category.new.title"), isActive: true },
      ]}
    />
  );
}
