"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/use-translation";
import type { TaxonomyData } from "@/services/api/taxonomy/types/taxonomy-types";

/**
 * Props for CategoryList Component
 */
interface CategoryListProps {
  categories: TaxonomyData[];
  isLoading?: boolean;
}

/**
 * CategoryList Component
 *
 * Displays categories in a list layout (row format)
 * Each row shows: ID, Image, Name, Slug, Parent, Level, Products
 */
export function CategoryList({
  categories,
  isLoading = false,
}: CategoryListProps) {
  const { t } = useTranslation();

  // Loading state with skeletons
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items don't have stable IDs
            key={index}
            className="p-4"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // Empty state
  if (categories.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <h3 className="mt-4 text-lg font-semibold">
            {t("dashboard.category.list.emptyState")}
          </h3>
          <p className="text-muted-foreground mb-4 mt-2 text-sm">
            {t("dashboard.category.list.emptyStateDescription")}
          </p>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-2">
      {categories.map((category) => (
        <Card
          key={category.ID_TAXONOMY}
          className="hover:bg-accent transition-colors duration-200"
        >
          <div className="flex items-center gap-4 p-4">
            {/* Image */}
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
              {category.PATH_IMAGEM ? (
                <Image
                  src={category.PATH_IMAGEM}
                  alt={category.TAXONOMIA}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                  {t("dashboard.category.list.noImage")}
                </div>
              )}
            </div>

            {/* Main Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold truncate">{category.TAXONOMIA}</h3>
                <Badge variant="outline" className="text-xs flex-shrink-0">
                  {t("dashboard.category.list.cardId")}: {category.ID_TAXONOMY}
                </Badge>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {category.SLUG && (
                  <span className="truncate">
                    {t("dashboard.category.list.cardSlug")}: {category.SLUG}
                  </span>
                )}
                {category.PARENT_ID !== 0 && (
                  <span className="truncate">
                    {t("dashboard.category.list.cardParent")}:{" "}
                    {category.PARENT_ID}
                  </span>
                )}
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-shrink-0 items-center gap-2">
              {category.LEVEL !== null && category.LEVEL !== undefined && (
                <Badge variant="secondary">
                  {t("dashboard.category.list.cardLevel")} {category.LEVEL}
                </Badge>
              )}
              {category.QT_RECORDS !== null &&
                category.QT_RECORDS !== undefined &&
                category.QT_RECORDS > 0 && (
                  <Badge variant="default">
                    {category.QT_RECORDS}{" "}
                    {t("dashboard.category.list.cardProducts")}
                  </Badge>
                )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
