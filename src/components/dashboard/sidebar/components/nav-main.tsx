"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  // Estado para controlar qual menu está aberto (apenas um por vez)
  const [openItem, setOpenItem] = useState<string | null>(null);

  // Função para fechar sidebar mobile quando link é clicado
  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  // Função para verificar se um item específico está ativo
  const isSubItemActive = (url: string): boolean => {
    return pathname === url;
  };

  // Efeito para abrir automaticamente o menu que tem subitem ativo
  useEffect(() => {
    // Função para verificar se um item do menu tem algum subitem ativo
    const hasActiveSubItem = (menuItem: {
      items?: { title: string; url: string }[];
    }): boolean => {
      if (!menuItem.items) return false;
      return menuItem.items.some((subItem) => pathname === subItem.url);
    };

    // Encontra o primeiro item que deveria estar aberto
    const activeItem = items.find(
      (item) => item.isActive || hasActiveSubItem(item),
    );

    if (activeItem) {
      setOpenItem(activeItem.title);
    } else {
      // Se não há item ativo, mantém o estado atual ou fecha tudo
      // setOpenItem(null); // Descomente se quiser fechar tudo quando não há item ativo
    }
  }, [pathname, items]);

  // Função para alternar o estado de abertura de um menu (accordion behavior)
  const toggleItem = (itemTitle: string) => {
    setOpenItem((prev) => {
      // Se o item clicado já está aberto, fecha ele
      if (prev === itemTitle) {
        return null;
      }
      // Caso contrário, abre o item clicado (fechando qualquer outro)
      return itemTitle;
    });
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isOpen = openItem === item.title;

          return (
            <Collapsible
              key={item.title}
              asChild
              open={isOpen}
              onOpenChange={() => toggleItem(item.title)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isSubItemActive(subItem.url)}
                        >
                          <Link href={subItem.url} onClick={handleLinkClick}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
