/**
 * Página de criação de nova categoria
 *
 * Esta página permite aos usuários criar novas categorias (taxonomias)
 * de produtos através de uma interface moderna e intuitiva.
 */

import { Suspense } from "react";
import { PageTitleSection } from "@/components/common/page-title-section";
import { NewCategoryForm } from "./new-category-form";
import { NewCategoryHeader } from "./new-category-header";

/**
 * Página principal de criação de categoria
 */
export default function NewCategoryPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="container mx-auto max-w-4xl">
        {/* Cabeçalho da página */}
        <NewCategoryHeader />

        {/* Título da Página */}
        <PageTitleSection
          titleKey="dashboard.category.new.title"
          subtitleKey="dashboard.category.new.subtitle"
        />

        {/* Formulário de criação */}
        <Suspense fallback={<div>Carregando formulário...</div>}>
          <NewCategoryForm />
        </Suspense>
      </div>
    </div>
  );
}
