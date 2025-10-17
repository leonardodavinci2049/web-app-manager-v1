"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "@/hooks/use-translation";
import type { TaxonomyData } from "@/services/api/taxonomy/types/taxonomy-types";

interface TaxonomyTableProps {
  taxonomies: TaxonomyData[];
  isLoading?: boolean;
}

/**
 * Componente de tabela para exibir as taxonomias
 */
export function TaxonomyTable({
  taxonomies,
  isLoading = false,
}: TaxonomyTableProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Loading skeleton */}
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20 min-w-[60px]">
                  {t("dashboard.taxonomies.columns.id")}
                </TableHead>
                <TableHead className="min-w-[200px]">
                  {t("dashboard.taxonomies.columns.name")}
                </TableHead>
                <TableHead className="min-w-[150px] hidden sm:table-cell">
                  {t("dashboard.taxonomies.columns.slug")}
                </TableHead>
                <TableHead className="min-w-[120px] hidden md:table-cell">
                  {t("dashboard.taxonomies.columns.parent")}
                </TableHead>
                <TableHead className="w-20 min-w-[60px] hidden lg:table-cell">
                  {t("dashboard.taxonomies.columns.level")}
                </TableHead>
                <TableHead className="w-20 min-w-[60px] hidden lg:table-cell">
                  {t("dashboard.taxonomies.columns.order")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }, (_, index) => (
                <TableRow key={`loading-row-${index + 1}`}>
                  <TableCell>
                    <div className="h-4 w-12 animate-pulse rounded bg-muted" />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                      <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="h-4 w-8 animate-pulse rounded bg-muted" />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="h-4 w-8 animate-pulse rounded bg-muted" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (taxonomies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mx-auto max-w-md">
          <h3 className="text-lg font-semibold">
            {t("dashboard.taxonomies.noResults")}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Tente ajustar os termos da busca ou limpe os filtros.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20 min-w-[60px]">
              {t("dashboard.taxonomies.columns.id")}
            </TableHead>
            <TableHead className="min-w-[200px]">
              {t("dashboard.taxonomies.columns.name")}
            </TableHead>
            <TableHead className="min-w-[150px] hidden sm:table-cell">
              {t("dashboard.taxonomies.columns.slug")}
            </TableHead>
            <TableHead className="min-w-[120px] hidden md:table-cell">
              {t("dashboard.taxonomies.columns.parent")}
            </TableHead>
            <TableHead className="w-20 min-w-[60px] hidden lg:table-cell">
              {t("dashboard.taxonomies.columns.level")}
            </TableHead>
            <TableHead className="w-20 min-w-[60px] hidden lg:table-cell">
              {t("dashboard.taxonomies.columns.order")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {taxonomies.map((taxonomy) => (
            <TableRow key={taxonomy.ID_TAXONOMY}>
              <TableCell className="font-medium">
                <Badge variant="outline">{taxonomy.ID_TAXONOMY}</Badge>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">{taxonomy.TAXONOMIA}</div>
                  {taxonomy.ANOTACOES && (
                    <div className="text-sm text-muted-foreground line-clamp-2">
                      {taxonomy.ANOTACOES}
                    </div>
                  )}
                  {/* Informações móveis */}
                  <div className="flex flex-wrap gap-2 sm:hidden">
                    {taxonomy.SLUG && (
                      <code className="rounded bg-muted px-2 py-1 text-xs">
                        {taxonomy.SLUG}
                      </code>
                    )}
                    {taxonomy.PARENT_ID > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        Pai: {taxonomy.PARENT_ID}
                      </Badge>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {taxonomy.SLUG ? (
                  <code className="rounded bg-muted px-2 py-1 text-xs">
                    {taxonomy.SLUG}
                  </code>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {taxonomy.PARENT_ID > 0 ? (
                  <Badge variant="secondary">ID: {taxonomy.PARENT_ID}</Badge>
                ) : (
                  <Badge variant="outline">Raiz</Badge>
                )}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <Badge
                  variant={taxonomy.LEVEL === 1 ? "default" : "secondary"}
                  className="w-8 justify-center"
                >
                  {taxonomy.LEVEL || 1}
                </Badge>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <span className="font-mono text-sm">{taxonomy.ORDEM}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
