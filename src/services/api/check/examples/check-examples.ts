/**
 * Exemplo de como usar o CheckServiceApi
 * Este arquivo demonstra diferentes cenários de uso do serviço de verificação
 */

import { CheckServiceApi, CheckType } from "@/services/api/check";

// ========================================
// EXEMPLOS DE USO BÁSICO
// ========================================

/**
 * Exemplo 1: Verificar se um email está disponível
 */
async function exemploVerificarEmail() {
  try {
    // Método simplificado (recomendado)
    const result = await CheckServiceApi.checkEmail("teste@email.com");

    console.log("Email disponível:", result.isAvailable);
    console.log("Mensagem:", result.message);

    if (!result.isAvailable) {
      console.log("ID do registro existente:", result.recordId);
    }
  } catch (error) {
    console.error("Erro ao verificar email:", error);
  }
}

/**
 * Exemplo 2: Verificar CPF com formatação
 */
async function exemploVerificarCpf() {
  try {
    // CPF com formatação será normalizado automaticamente
    const result = await CheckServiceApi.checkCpf("123.456.789-00");

    if (result.isAvailable) {
      console.log("✅ CPF disponível para cadastro");
    } else {
      console.log("❌ CPF já cadastrado");
      console.log("ID do registro:", result.recordId);
    }
  } catch (error) {
    console.error("Erro ao verificar CPF:", error);
  }
}

/**
 * Exemplo 3: Verificar slug de produto
 */
async function exemploVerificarSlugProduto() {
  try {
    const slug = "notebook-dell-inspiron-15";
    const result = await CheckServiceApi.checkProductSlug(slug);

    if (result.isAvailable) {
      console.log(`✅ Slug "${slug}" está disponível`);
      // Prosseguir com criação do produto...
    } else {
      console.log(`❌ Slug "${slug}" já está em uso`);
      // Sugerir slug alternativo...
      const alternativeSlug = `${slug}-${Date.now()}`;
      console.log(`💡 Sugestão: ${alternativeSlug}`);
    }
  } catch (error) {
    console.error("Erro ao verificar slug:", error);
  }
}

// ========================================
// EXEMPLOS DE USO AVANÇADO
// ========================================

/**
 * Exemplo 4: Verificar múltiplos termos em lote
 */
async function exemploVerificacaoEmLote() {
  try {
    const verificacoes = [
      { type: CheckType.EMAIL, term: "usuario@email.com" },
      { type: CheckType.CPF, term: "12345678901" },
      { type: CheckType.TAXONOMY_SLUG, term: "categoria-teste" },
    ];

    const resultados = await CheckServiceApi.checkMultiple(verificacoes);

    console.log("Resultados das verificações:");
    resultados.forEach((resultado, index) => {
      const verificacao = verificacoes[index];
      console.log(
        `${verificacao.type}: ${resultado.isAvailable ? "✅ Disponível" : "❌ Já existe"}`,
      );
    });
  } catch (error) {
    console.error("Erro na verificação em lote:", error);
  }
}

/**
 * Exemplo 5: Validar formulário completo antes de submeter
 */
async function exemploValidacaoFormulario() {
  const dadosFormulario = {
    email: "novo.usuario@email.com",
    cpf: "123.456.789-00",
    nomeEmpresa: "Minha Empresa Ltda",
  };

  try {
    // Verificar se todos os dados estão disponíveis
    const { allAvailable, results } = await CheckServiceApi.areAllAvailable([
      { type: CheckType.EMAIL, term: dadosFormulario.email },
      { type: CheckType.CPF, term: dadosFormulario.cpf },
    ]);

    if (allAvailable) {
      console.log("✅ Todos os dados estão disponíveis - pode prosseguir");
      // Submeter formulário...
    } else {
      console.log("❌ Alguns dados já existem:");
      results.forEach((result, index) => {
        if (!result.isAvailable) {
          const field = index === 0 ? "Email" : "CPF";
          console.log(`- ${field}: ${result.message}`);
        }
      });
    }
  } catch (error) {
    console.error("Erro na validação do formulário:", error);
  }
}

/**
 * Exemplo 6: Health check da API
 */
async function exemploHealthCheck() {
  try {
    const status = await CheckServiceApi.getApiStatus();

    console.log("Status da API:", status.status);
    console.log("Versão:", status.version);
    console.log("Timestamp:", status.timestamp);

    if (status.status === "online") {
      console.log("✅ API está funcionando normalmente");
    } else {
      console.log("⚠️ API pode estar com problemas");
    }
  } catch (error) {
    console.error("❌ API está offline:", error);
  }
}

// ========================================
// EXEMPLOS DE VALIDAÇÃO LOCAL
// ========================================

/**
 * Exemplo 7: Validar formato antes de fazer requisição
 */
function exemploValidacaoLocal() {
  const email = "email.invalido";
  const cpf = "123.456.789-00";
  const slug = "meu-produto-123";

  // Validar formatos localmente antes de fazer requisições à API
  const emailValido = CheckServiceApi.isValidTerm(email, CheckType.EMAIL);
  const cpfValido = CheckServiceApi.isValidTerm(cpf, CheckType.CPF);
  const slugValido = CheckServiceApi.isValidTerm(slug, CheckType.PRODUCT_SLUG);

  console.log("Validações locais:");
  console.log(`Email "${email}": ${emailValido ? "✅ Válido" : "❌ Inválido"}`);
  console.log(`CPF "${cpf}": ${cpfValido ? "✅ Válido" : "❌ Inválido"}`);
  console.log(`Slug "${slug}": ${slugValido ? "✅ Válido" : "❌ Inválido"}`);

  // Normalizar termos
  const cpfNormalizado = CheckServiceApi.normalizeTerm(cpf, CheckType.CPF);
  console.log(`CPF normalizado: ${cpfNormalizado}`);
}

// ========================================
// EXEMPLOS DE TRATAMENTO DE ERROS
// ========================================

/**
 * Exemplo 8: Tratamento de erros específicos
 */
async function exemploTratamentoErros() {
  try {
    // Tentar verificar com termo muito curto (vai dar erro)
    await CheckServiceApi.checkEmail("ab");
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("at least 3 characters")
    ) {
      console.log("❌ Email deve ter pelo menos 3 caracteres");
    } else {
      console.error("❌ Erro inesperado:", error);
    }
  }
}

// ========================================
// EXEMPLO DE INTEGRAÇÃO COM REACT HOOK FORM
// ========================================

/**
 * Exemplo 9: Validação assíncrona para formulário React
 */
export function createAsyncValidator(checkType: CheckType) {
  return async (value: string) => {
    // Primeiro valida formato local
    if (!CheckServiceApi.isValidTerm(value, checkType)) {
      return "Formato inválido";
    }

    try {
      // Depois verifica disponibilidade na API
      let result: Awaited<ReturnType<typeof CheckServiceApi.checkEmail>>;
      switch (checkType) {
        case CheckType.EMAIL:
          result = await CheckServiceApi.checkEmail(value);
          break;
        case CheckType.CPF:
          result = await CheckServiceApi.checkCpf(value);
          break;
        case CheckType.CNPJ:
          result = await CheckServiceApi.checkCnpj(value);
          break;
        default:
          throw new Error(`Tipo de validação não suportado: ${checkType}`);
      }

      return result.isAvailable ? true : result.message;
    } catch {
      return "Erro ao verificar disponibilidade";
    }
  };
}

// ========================================
// EXPORTAÇÕES PARA USO EM OUTROS ARQUIVOS
// ========================================

export {
  exemploVerificarEmail,
  exemploVerificarCpf,
  exemploVerificarSlugProduto,
  exemploVerificacaoEmLote,
  exemploValidacaoFormulario,
  exemploHealthCheck,
  exemploValidacaoLocal,
  exemploTratamentoErros,
};

/**
 * Função utilitária para criar validador de debounce
 */
export function createDebouncedValidator(checkType: CheckType, delay = 500) {
  let timeoutId: NodeJS.Timeout;

  return (
    value: string,
    callback: (result: boolean, message?: string) => void,
  ) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(async () => {
      try {
        if (!CheckServiceApi.isValidTerm(value, checkType)) {
          callback(false, "Formato inválido");
          return;
        }

        let result: Awaited<ReturnType<typeof CheckServiceApi.checkEmail>>;
        switch (checkType) {
          case CheckType.EMAIL:
            result = await CheckServiceApi.checkEmail(value);
            break;
          case CheckType.CPF:
            result = await CheckServiceApi.checkCpf(value);
            break;
          case CheckType.CNPJ:
            result = await CheckServiceApi.checkCnpj(value);
            break;
          default:
            throw new Error(`Tipo não suportado: ${checkType}`);
        }

        callback(result.isAvailable, result.message);
      } catch {
        callback(false, "Erro ao verificar");
      }
    }, delay);
  };
}
