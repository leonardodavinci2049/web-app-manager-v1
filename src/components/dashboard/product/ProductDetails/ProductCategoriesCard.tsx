import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductCategoriesCardProps {
  familyId: number;
  groupId: number;
  subgroupId: number;
}

/**
 * ProductCategoriesCard Component
 *
 * Displays product taxonomy information (family, group, subgroup IDs).
 * Shows a message when no categories are defined.
 */
export function ProductCategoriesCard({
  familyId,
  groupId,
  subgroupId,
}: ProductCategoriesCardProps) {
  const hasCategories = familyId > 0 || groupId > 0 || subgroupId > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categorias</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-2">
          {familyId > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Família ID:</span>
              <span>{familyId}</span>
            </div>
          )}

          {groupId > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Grupo ID:</span>
              <span>{groupId}</span>
            </div>
          )}

          {subgroupId > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Subgrupo ID:</span>
              <span>{subgroupId}</span>
            </div>
          )}
        </div>

        {!hasCategories && (
          <p className="text-muted-foreground italic text-sm">
            Nenhuma categoria definida
          </p>
        )}
      </CardContent>
    </Card>
  );
}
