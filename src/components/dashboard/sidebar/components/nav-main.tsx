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

  // Estado para controlar quais menus estão abertos
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  // Função para verificar se um item específico está ativo
  const isSubItemActive = (url: string): boolean => {
    return pathname === url;
  };

  // Efeito para abrir automaticamente menus que têm subitens ativos
  useEffect(() => {
    // Função para verificar se um item do menu tem algum subitem ativo
    const hasActiveSubItem = (menuItem: {
      items?: { title: string; url: string }[];
    }): boolean => {
      if (!menuItem.items) return false;
      return menuItem.items.some((subItem) => pathname === subItem.url);
    };

    const newOpenItems = new Set<string>();

    items.forEach((item) => {
      if (item.isActive || hasActiveSubItem(item)) {
        newOpenItems.add(item.title);
      }
    });

    setOpenItems(newOpenItems);
  }, [pathname, items]);

  // Função para alternar o estado de abertura de um menu
  const toggleItem = (itemTitle: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemTitle)) {
        newSet.delete(itemTitle);
      } else {
        newSet.add(itemTitle);
      }
      return newSet;
    });
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isOpen = openItems.has(item.title);

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
                          <Link href={subItem.url}>
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
