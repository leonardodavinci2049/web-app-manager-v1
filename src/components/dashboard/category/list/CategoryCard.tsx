"use client";

/**
 * Componente de Card para exibir uma categoria
 *
 * Exibe informações da categoria em formato de card
 */

import { FolderOpen, Layers, Package, Tag } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import type { TaxonomyData } from "@/services/api/taxonomy/types/taxonomy-types";

interface CategoryCardProps {
  category: TaxonomyData;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const { t } = useTranslation();

  // Determinar se é categoria raiz
  const isRoot = category.PARENT_ID === 0 || category.PARENT_ID === null;

  // Formatar informações da categoria
  const categoryLevel = category.LEVEL || 1;
  const productCount = category.QT_RECORDS || 0;

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      {/* Imagem da Categoria */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {category.PATH_IMAGEM ? (
          <Image
            src={category.PATH_IMAGEM}
            alt={category.TAXONOMIA}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <FolderOpen className="h-16 w-16 text-muted-foreground" />
          </div>
        )}

        {/* Badge de Nível no canto superior direito */}
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="gap-1">
            <Layers className="h-3 w-3" />
            {t("dashboard.category.list.cardLevel")} {categoryLevel}
          </Badge>
        </div>
      </div>

      {/* Conteúdo do Card */}
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2 text-lg">
            {category.TAXONOMIA}
          </CardTitle>
          <Badge variant="outline" className="shrink-0">
            {t("dashboard.category.list.cardId")} {category.ID_TAXONOMY}
          </Badge>
        </div>

        {/* Slug */}
        {category.SLUG && (
          <CardDescription className="flex items-center gap-1">
            <Tag className="h-3 w-3" />
            {category.SLUG}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Informações adicionais */}
        <div className="space-y-2 text-sm">
          {/* Categoria Pai */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              {t("dashboard.category.list.cardParent")}:
            </span>
            <span className="font-medium">
              {isRoot
                ? t("dashboard.category.list.rootCategory")
                : `ID ${category.PARENT_ID}`}
            </span>
          </div>

          {/* Quantidade de Produtos */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Package className="h-3 w-3" />
              {t("dashboard.category.list.cardProducts")}:
            </span>
            <Badge variant={productCount > 0 ? "default" : "secondary"}>
              {productCount}
            </Badge>
          </div>
        </div>

        {/* Anotações (se houver) */}
        {category.ANOTACOES && (
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {category.ANOTACOES}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
