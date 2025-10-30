"use client";

import { SiteHeaderWithBreadcrumb } from "@/components/dashboard/header/site-header-with-breadcrumb";
import { useTranslation } from "@/hooks/use-translation";

interface CategoryDetailsHeaderProps {
  categoryName: string;
}

export function CategoryDetailsHeaderClient({
  categoryName,
}: CategoryDetailsHeaderProps) {
  const { t } = useTranslation();

  return (
    <SiteHeaderWithBreadcrumb
      title={categoryName}
      breadcrumbItems={[
        { label: t("dashboard.breadcrumb.dashboard"), href: "/dashboard" },
        {
          label: t("dashboard.category.list.title"),
          href: "/dashboard/category/category-list",
        },
        { label: categoryName, isActive: true },
      ]}
    />
  );
}
