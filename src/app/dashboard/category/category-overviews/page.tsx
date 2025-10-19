import { PageTitleSection } from "@/components/common/page-title-section";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TaxonomyServiceApi } from "@/services/api/taxonomy/taxonomy-service-api";
import { CategoryTree } from "./CategoryTree";
import { CategoryOverviewsHeaderClient } from "./category-overviews-header";
import type { CategoryNode } from "./category-tree.types";
import {
  transformTaxonomyToHierarchy,
  validateTaxonomyData,
} from "./utils/taxonomy-transform";

/**
 * Página de visualização hierárquica de categorias
 * Server Component que renderiza a estrutura de categorias em árvore interativa
 */
export default async function CategoryOverviewsPage() {
  // Buscar dados reais da API
  let categories: CategoryNode[] = [];
  let error: string | null = null;

  try {
    // Buscar taxonomias da API usando pe_parent_id = -1 para carregar todos os níveis
    const response = await TaxonomyServiceApi.findTaxonomyMenu({
      pe_parent_id: -1, // Carrega hierarquia completa
    });

    // Validar e extrair dados da resposta
    if (TaxonomyServiceApi.isValidTaxonomyMenuResponse(response)) {
      const taxonomyData = TaxonomyServiceApi.extractTaxonomyMenuList(response);

      if (validateTaxonomyData(taxonomyData)) {
        // Transformar dados planos em estrutura hierárquica
        categories = transformTaxonomyToHierarchy(taxonomyData);
      } else {
        error = "Dados da API em formato inválido";
      }
    } else {
      error = response.message || "Erro ao carregar categorias";
    }
  } catch (err) {
    console.error("Erro ao buscar categorias:", err);
    error = "Falha na conexão com a API. Tente novamente mais tarde.";
  }
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="container mx-auto max-w-4xl">
        {/* Header com Breadcrumb - Client Component com i18n */}
        <CategoryOverviewsHeaderClient />

        {/* Título da Página */}
        <PageTitleSection
          titleKey="dashboard.category.overviews.title"
          subtitleKey="dashboard.category.overviews.subtitle"
        />

        <div className="space-y-6">
          {/* Card com árvore de categorias */}
          <Card>
            <CardHeader>
              <CardTitle>Hierarquia de Categorias</CardTitle>
              <CardDescription>
                Família → Grupo → Subgrupo (3 níveis de profundidade)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Árvore de categorias interativa */}
              <div className="rounded-lg border border-muted bg-card p-4">
                {error ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-2">
                      ⚠️ Erro ao carregar categorias
                    </p>
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                ) : categories.length > 0 ? (
                  <CategoryTree categories={categories} />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Nenhuma categoria encontrada
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Card com instruções de uso */}
          <Card>
            <CardHeader>
              <CardTitle>Como usar</CardTitle>
              <CardDescription>
                Instruções para navegação e interação com a árvore de categorias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <strong>Expandir/Colapsar:</strong> Clique no ícone de seta
                    para expandir ou colapsar categorias
                  </li>
                  <li>
                    <strong>Selecionar:</strong> Clique uma vez no nome da
                    categoria para selecioná-la
                  </li>
                  <li>
                    <strong>Detalhes:</strong> Clique duas vezes no nome da
                    categoria para visualizar detalhes completos
                  </li>
                  <li>
                    <strong>Teclado:</strong> Use as setas (← →) para
                    expandir/colapsar e Enter para selecionar
                  </li>
                  <li>
                    <strong>Quantidade:</strong> O número entre parênteses
                    indica a quantidade de produtos relacionados
                  </li>
                </ul>

                <div className="mt-4 pt-3 border-t border-muted">
                  <h4 className="font-semibold text-sm mb-2">
                    Ícones dos Níveis:
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="text-blue-600 dark:text-blue-400">
                        📁
                      </span>
                      <strong>Nível 1 (Família):</strong> Categorias principais
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600 dark:text-green-400">
                        📦
                      </span>
                      <strong>Nível 2 (Grupo):</strong> Subcategorias
                      intermediárias
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-orange-600 dark:text-orange-400">
                        🏷️
                      </span>
                      <strong>Nível 3 (Subgrupo):</strong> Especializações
                      finais
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações adicionais */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Estrutura de Dados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-muted-foreground">Níveis:</p>
                  <ul className="mt-2 space-y-1 ml-4 text-muted-foreground">
                    <li>
                      • <strong>Nível 1 (Família):</strong> Categorias
                      principais (Eletrônicos, Informática, Perfumes)
                    </li>
                    <li>
                      • <strong>Nível 2 (Grupo):</strong> Subcategorias
                      intermediárias (Computadores, Periféricos, etc)
                    </li>
                    <li>
                      • <strong>Nível 3 (Subgrupo):</strong> Especializações
                      finais (Notebooks, Mouses, etc)
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
