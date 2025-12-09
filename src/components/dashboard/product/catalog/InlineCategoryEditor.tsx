"use client";

import { Edit2, Plus, Tag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ProductCategory } from "../../../../types/types";

interface InlineCategoryEditorProps {
  productId: number;
  categories?: ProductCategory[];
}

export function InlineCategoryEditor({
  productId,
  categories = [],
}: InlineCategoryEditorProps) {
  const handleAddCategory = () => {
    console.log("Add category to product", productId);
  };

  const handleDeleteCategory = (categoryId: number) => {
    console.log("Delete category", categoryId, "from product", productId);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 mt-2 group/category-editor cursor-pointer hover:bg-accent/50 p-1 -ml-1 rounded-md transition-colors text-left"
        >
          <Tag className="h-4 w-4 shrink-0" />
          <span className="font-medium text-muted-foreground">Categorias:</span>
          <Edit2 className="h-3 w-3 opacity-0 group-hover/category-editor:opacity-100 transition-opacity text-muted-foreground" />
        </button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <SheetTitle>Categorias Relacionadas</SheetTitle>
        </SheetHeader>

        <div className="py-6 space-y-6">
          <div className="flex justify-end">
            <Button size="sm" className="gap-2" onClick={handleAddCategory}>
              <Plus className="h-4 w-4" />
              Adicionar Categoria
            </Button>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Nome da Categoria</TableHead>
                  <TableHead className="w-[80px] text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center text-muted-foreground h-24"
                    >
                      Nenhuma categoria vinculada
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow key={category.ID_TAXONOMY}>
                      <TableCell className="font-medium">
                        {category.ID_TAXONOMY}
                      </TableCell>
                      <TableCell>{category.TAXONOMIA}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive/90"
                          onClick={() =>
                            handleDeleteCategory(category.ID_TAXONOMY)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
