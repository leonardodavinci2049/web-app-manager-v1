import { Suspense } from "react";
import { PageTitleSection } from "@/components/common/page-title-section";
import { NewProductForm } from "./new-product-form";
import { NewProductHeader } from "./new-product-header";

/**
 * Página de criação de novo produto
 */
const NewProductPage = () => {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="container mx-auto max-w-4xl">
        {/* Cabeçalho da página */}
        <NewProductHeader />

        {/* Título da Página */}
        <PageTitleSection
          titleKey="dashboard.products.new.title"
          subtitleKey="dashboard.products.new.subtitle"
        />

        {/* Formulário de criação */}
        <Suspense fallback={<div>Carregando formulário...</div>}>
          <NewProductForm />
        </Suspense>
      </div>
    </div>
  );
};

export default NewProductPage;
