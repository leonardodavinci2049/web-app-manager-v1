"use client";

import { useState } from "react";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ProductDetail } from "@/services/api/product/types/product-types";
import { InlineNumberEdit } from "./InlineNumberEdit";
import { InlineTextEdit } from "./InlineTextEdit";

interface ProductInlineEditDemoProps {
  product: ProductDetail;
}

// Validation schemas
const productNameSchema = z.string().min(1, "Nome do produto é obrigatório");
const referenceSchema = z.string().optional();
const descriptionSchema = z.string().optional();
const _priceSchema = z.number().min(0, "Preço deve ser maior ou igual a zero");
const _stockSchema = z
  .number()
  .int()
  .min(0, "Estoque deve ser um número inteiro não negativo");

export function ProductInlineEditDemo({ product }: ProductInlineEditDemoProps) {
  const [localProduct, setLocalProduct] = useState(product);

  // Mock API update functions - in real app, these would call the actual API
  const updateProductName = async (value: string) => {
    // Mock API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Here you would call the ProductServiceApi.updateProductName
    // const response = await ProductServiceApi.updateProductName({
    //   pe_id_produto: localProduct.ID_TBL_PRODUTO,
    //   pe_nome_produto: value
    // });

    setLocalProduct((prev) => ({ ...prev, PRODUTO: value }));
  };

  const updateProductReference = async (value: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Here you would call the ProductServiceApi.updateProductGeneral
    // const response = await ProductServiceApi.updateProductGeneral({
    //   pe_id_produto: localProduct.ID_TBL_PRODUTO,
    //   pe_nome_produto: localProduct.PRODUTO,
    //   pe_ref: value,
    //   pe_modelo: localProduct.MODELO,
    //   pe_etiqueta: localProduct.ETIQUETA,
    //   pe_descricao_tab: localProduct.DESCRICAO_TAB
    // });

    setLocalProduct((prev) => ({ ...prev, REF: value }));
  };

  const updateProductDescription = async (value: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Here you would call the ProductServiceApi.updateProductGeneral or specific description endpoint
    setLocalProduct((prev) => ({ ...prev, DESCRICAO_TAB: value }));
  };

  const updateRetailPrice = async (value: number) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Here you would call the ProductServiceApi.updateProductPrice
    // const response = await ProductServiceApi.updateProductPrice({
    //   pe_id_produto: localProduct.ID_TBL_PRODUTO,
    //   pe_preco_venda_atac: localProduct.VL_VENDA_ATACADO,
    //   pe_preco_venda_corporativo: localProduct.VL_CORPORATIVO,
    //   pe_preco_venda_vare: value
    // });

    setLocalProduct((prev) => ({ ...prev, VL_VENDA_VAREJO: value }));
  };

  const updateWholesalePrice = async (value: number) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setLocalProduct((prev) => ({ ...prev, VL_VENDA_ATACADO: value }));
  };

  const updateCorporatePrice = async (value: number) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setLocalProduct((prev) => ({ ...prev, VL_CORPORATIVO: value }));
  };

  const updateStock = async (value: number) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Here you would call the ProductServiceApi.updateProductStock
    // const response = await ProductServiceApi.updateProductStock({
    //   pe_id_produto: localProduct.ID_TBL_PRODUTO,
    //   pe_qt_estoque: value,
    //   pe_qt_minimo: 0 // This would come from another field
    // });

    setLocalProduct((prev) => ({ ...prev, QT_ESTOQUE: value }));
  };

  const updateWeight = async (value: number) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Here you would call the ProductServiceApi.updateProductCharacteristics
    setLocalProduct((prev) => ({ ...prev, PESO_GR: value }));
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
          <CardDescription>
            Clique no ícone de edição ao lado de cada campo para editar inline
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <InlineTextEdit
            label="Nome do Produto"
            value={localProduct.PRODUTO}
            onSave={updateProductName}
            validation={productNameSchema}
            placeholder="Digite o nome do produto"
          />

          <InlineTextEdit
            label="Referência"
            value={localProduct.REF || ""}
            onSave={updateProductReference}
            validation={referenceSchema}
            placeholder="Digite a referência do produto"
          />

          <InlineTextEdit
            label="Descrição"
            value={localProduct.DESCRICAO_TAB || ""}
            onSave={updateProductDescription}
            multiline
            validation={descriptionSchema}
            placeholder="Digite a descrição do produto"
          />
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Preços</CardTitle>
          <CardDescription>
            Edite os preços do produto diretamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <InlineNumberEdit
            label="Preço Varejo"
            value={localProduct.VL_VENDA_VAREJO ?? 0}
            onSave={updateRetailPrice}
            type="currency"
            min={0}
            step={0.01}
          />

          <InlineNumberEdit
            label="Preço Atacado"
            value={localProduct.VL_VENDA_ATACADO ?? 0}
            onSave={updateWholesalePrice}
            type="currency"
            min={0}
            step={0.01}
          />

          <InlineNumberEdit
            label="Preço Corporativo"
            value={localProduct.VL_CORPORATIVO ?? 0}
            onSave={updateCorporatePrice}
            type="currency"
            min={0}
            step={0.01}
          />
        </CardContent>
      </Card>

      {/* Stock and Physical Characteristics */}
      <Card>
        <CardHeader>
          <CardTitle>Estoque e Características</CardTitle>
          <CardDescription>
            Informações de estoque e características físicas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <InlineNumberEdit
            label="Quantidade em Estoque"
            value={localProduct.QT_ESTOQUE ?? 0}
            onSave={updateStock}
            type="number"
            min={0}
            step={1}
            suffix="unidades"
          />

          <InlineNumberEdit
            label="Peso"
            value={localProduct.PESO_GR ?? 0}
            onSave={updateWeight}
            type="decimal"
            min={0}
            step={0.1}
            suffix="g"
          />
        </CardContent>
      </Card>

      {/* Info box */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
        <CardContent className="pt-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-label="Info"
              >
                <title>Info icon</title>
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Demonstração de Edição Inline
              </h3>
              <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                <p>
                  Esta é uma implementação de demonstração dos componentes de
                  edição inline. Em uma aplicação real, as funções de salvamento
                  fariam chamadas reais para a API usando os métodos do{" "}
                  <code>ProductServiceApi</code>.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
