"use client";

import {
  BookOpen,
  Bot,
  Frame,
  Map as MapIcon,
  PieChart,
  Settings2,
  SettingsIcon,
  SquareTerminal,
  User,
  Zap,
} from "lucide-react";

import { NavMain } from "@/components/dashboard/sidebar/components/nav-main";
import { NavProjects } from "@/components/dashboard/sidebar/components/nav-projects";
import { NavSecondary } from "@/components/dashboard/sidebar/components/nav-secondary";
import { SidebarLogo } from "@/components/dashboard/sidebar/components/sidebar-logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useTranslation } from "@/hooks/use-translation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation();

  // This is sample data.
  const data = {
    navMain: [
      {
        title: t("dashboard.navigation.orders"),
        url: "#",
        icon: Settings2,
        items: [
          {
            title: "Painel Geral",
            url: "/dashboard/",
          },
          {
            title: "Lista de Pedidos",
            url: "/dashboard/orders/order-list",
          },
        ],
      },
      {
        title: t("dashboard.navigation.products"),
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: "Catalogo",
            url: "/dashboard/product/catalog",
          },

          {
            title: "Novo Produto",
            url: "/dashboard/product/new-product",
          },
        ],
      },
      {
        title: t("dashboard.navigation.categories"),
        url: "#",
        icon: Bot,
        items: [
          {
            title: "Visão Geral de Categorias",
            url: "/dashboard/category/category-overviews",
          },
          {
            title: "Lista de Categorias",
            url: "/dashboard/category/category-list",
          },

          {
            title: "Nova Categoria",
            url: "/dashboard/category/new-category",
          },
        ],
      },
      {
        title: t("dashboard.navigation.brands"),
        url: "#",
        icon: Bot,
        items: [
          {
            title: "Lista de Marcas",
            url: "/dashboard/development",
          },

          {
            title: "Nova Marca",
            url: "/dashboard/development",
          },
        ],
      },
      {
        title: t("dashboard.navigation.suppliers"),
        url: "#",
        icon: Bot,
        items: [
          {
            title: "Lista de Fornecedores",
            url: "/dashboard/development",
          },

          {
            title: "Nova Fornecedor",
            url: "/dashboard/development",
          },
        ],
      },
      {
        title: t("dashboard.navigation.carriers"),
        url: "#",
        icon: Bot,
        items: [
          {
            title: "Lista de Transportadoras",
            url: "/dashboard/development",
          },

          {
            title: "Nova Transportadora",
            url: "/dashboard/development",
          },
        ],
      },

      {
        title: t("dashboard.navigation.customers"),
        url: "#",
        icon: BookOpen,
        items: [
          {
            title: "Lsita de Clientes",
            url: "/dashboard/customer/customer-list",
          },
          {
            title: "Detalhes do Cliente",
            url: "/dashboard/customer/customer-details",
          },
          {
            title: "Novo Cliente",
            url: "/dashboard/customer/new-customer",
          },
          {
            title: "Relatórios",
            url: "/dashboard/customer/customer-reports",
          },
          {
            title: "Cadastros Pendentes",
            url: "/dashboard/customer/pending-registrations",
          },
        ],
      },

      {
        title: t("dashboard.navigation.productEntry"),
        url: "#",
        icon: Bot,
        items: [
          {
            title: "Lista Entradas",
            url: "/dashboard/development",
          },

          {
            title: "Nova Entrada",
            url: "/dashboard/development",
          },
        ],
      },
    ],
    report: [
      {
        name: "Relatórios Pedidos",
        url: "#",
        icon: Frame,
      },
      {
        name: "Relatórios Clientes",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Relatórios Produtos",
        url: "#",
        icon: MapIcon,
      },
    ],
    navSecondary: [
      {
        title: t("dashboard.navigation.settings"),
        url: "/dashboard/settings",
        icon: SettingsIcon,
      },
      {
        title: "Usuários",
        url: "#",
        icon: User,
      },
      {
        title: "Integrações",
        url: "#",
        icon: Zap,
      },
    ],
  };
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.report} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>{/* NavUser foi migrado para o header */}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
