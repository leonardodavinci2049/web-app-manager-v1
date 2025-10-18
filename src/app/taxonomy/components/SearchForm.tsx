"use client";

import { Loader2, Search } from "lucide-react";
import Form from "next/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { defaultSearchValues } from "../types/form-types";

interface SearchFormProps {
  onSubmit: (formData: FormData) => void;
  onReset?: () => void;
  isPending?: boolean;
}

export function SearchForm({
  onSubmit,
  onReset,
  isPending = false,
}: SearchFormProps) {
  const handleSubmit = (formData: FormData) => {
    onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Parâmetros de Busca
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pe_id_parent">ID Parent</Label>
              <Input
                id="pe_id_parent"
                name="pe_id_parent"
                type="number"
                defaultValue={defaultSearchValues.pe_id_parent}
                placeholder="-1 (todos níveis)"
                disabled={isPending}
              />
            </div>
            <div>
              <Label htmlFor="pe_id_taxonomy">ID Taxonomy</Label>
              <Input
                id="pe_id_taxonomy"
                name="pe_id_taxonomy"
                type="number"
                defaultValue={defaultSearchValues.pe_id_taxonomy}
                placeholder="0 (sem filtro)"
                disabled={isPending}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="pe_taxonomia">Nome da Taxonomia</Label>
            <Input
              id="pe_taxonomia"
              name="pe_taxonomia"
              type="text"
              defaultValue={defaultSearchValues.pe_taxonomia}
              placeholder="Filtrar por nome..."
              disabled={isPending}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pe_flag_inativo">Flag Inativo</Label>
              <Input
                id="pe_flag_inativo"
                name="pe_flag_inativo"
                type="number"
                min="0"
                max="1"
                defaultValue={defaultSearchValues.pe_flag_inativo}
                placeholder="0 (apenas ativos)"
                disabled={isPending}
              />
            </div>
            <div>
              <Label htmlFor="pe_qt_registros">Qtd Registros</Label>
              <Input
                id="pe_qt_registros"
                name="pe_qt_registros"
                type="number"
                min="1"
                max="100"
                defaultValue={defaultSearchValues.pe_qt_registros}
                placeholder="20"
                disabled={isPending}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pe_pagina_id">Página ID</Label>
              <Input
                id="pe_pagina_id"
                name="pe_pagina_id"
                type="number"
                min="0"
                defaultValue={defaultSearchValues.pe_pagina_id}
                placeholder="0 (primeira página)"
                disabled={isPending}
              />
            </div>
            <div>
              <Label htmlFor="pe_coluna_id">Coluna ID</Label>
              <Input
                id="pe_coluna_id"
                name="pe_coluna_id"
                type="number"
                defaultValue={defaultSearchValues.pe_coluna_id}
                placeholder="2 (ordenação)"
                disabled={isPending}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="pe_ordem_id">Ordem ID</Label>
            <Input
              id="pe_ordem_id"
              name="pe_ordem_id"
              type="number"
              min="0"
              max="1"
              defaultValue={defaultSearchValues.pe_ordem_id}
              placeholder="1 (crescente)"
              disabled={isPending}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Buscando...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Buscar Taxonomias
                </>
              )}
            </Button>
            <Button
              type="reset"
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                const form = e.currentTarget.form;
                if (form) {
                  form.reset();
                  onReset?.();
                }
              }}
              disabled={isPending}
            >
              Limpar
            </Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
