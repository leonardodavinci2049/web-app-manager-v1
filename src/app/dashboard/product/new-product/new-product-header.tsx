"use client";

/**
 * Componente de cabeçalho para a página de novo produto
 * Inclui breadcrumb de navegação
 */

import { SiteHeaderWithBreadcrumb } from "@/components/dashboard/header/site-header-with-breadcrumb";
import { useTranslation } from "@/hooks/use-translation";

export function NewProductHeader() {
  const { t } = useTranslation();

  return (
    <SiteHeaderWithBreadcrumb
      title={t("dashboard.products.new.title")}
      breadcrumbItems={[
        { label: t("dashboard.breadcrumb.dashboard"), href: "/dashboard" },
        {
          label: t("dashboard.navigation.products"),
          href: "/dashboard/product/catalog",
        },
        { label: t("dashboard.products.new.title"), isActive: true },
      ]}
    />
  );
}
