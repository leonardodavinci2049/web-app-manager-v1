# 🔍 Check Service API

Serviço para verificação de unicidade de dados antes de criar ou atualizar registros no sistema.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso Básico](#uso-básico)
- [API Reference](#api-reference)
- [Exemplos](#exemplos)
- [Tipos de Verificação](#tipos-de-verificação)
- [Tratamento de Erros](#tratamento-de-erros)
- [Best Practices](#best-practices)

## 🎯 Visão Geral

O CheckServiceApi fornece métodos para validar a unicidade de dados como:

- ✅ **Emails** - Evita emails duplicados no cadastro de clientes
- ✅ **CPF/CNPJ** - Valida documentos únicos
- ✅ **Slugs** - Verifica disponibilidade de slugs para SEO
- ✅ **Nomes de Produtos** - Garante nomes únicos

### Características

- **Validação em Lote**: Verifica múltiplos termos simultaneamente
- **Normalização Automática**: CPF, CNPJ, emails e slugs são normalizados automaticamente
- **TypeScript First**: Totalmente tipado com TypeScript
- **Validação Local**: Validação de formato antes das requisições à API
- **Health Check**: Monitoramento da disponibilidade da API

## 🚀 Instalação

O serviço já está incluído no projeto. Para usar, importe do módulo:

```typescript
import { CheckServiceApi, CheckType } from '@/services/api/check';
```

## ⚙️ Configuração

O serviço utiliza as variáveis de ambiente configuradas em `src/core/config/envs.ts`:

```typescript
// Configuração automática via environment variables
APP_ID=1
SYSTEM_CLIENT_ID=1
STORE_ID=1
ORGANIZATION_ID="ORG_12345"
MEMBER_ID="MBR_67890"
USER_ID="USR_54321"
API_BASE_URL="http://localhost:3333"
API_KEY="9fc735176b51137b87d4303011dee5eb"
```

## 💡 Uso Básico

### Verificar Email

```typescript
// Método simplificado (recomendado)
const result = await CheckServiceApi.checkEmail("usuario@email.com");

if (result.isAvailable) {
  console.log("✅ Email disponível para cadastro");
} else {
  console.log("❌ Email já existe:", result.message);
  console.log("ID do registro:", result.recordId);
}
```

### Verificar CPF (com formatação)

```typescript
// CPF será normalizado automaticamente
const result = await CheckServiceApi.checkCpf("123.456.789-00");

console.log("Disponível:", result.isAvailable);
console.log("Mensagem:", result.message);
```

### Verificar Slug de Produto

```typescript
const result = await CheckServiceApi.checkProductSlug("notebook-dell-inspiron");

if (result.isAvailable) {
  // Prosseguir com criação
} else {
  // Sugerir slug alternativo
  const alternativeSlug = `notebook-dell-inspiron-${Date.now()}`;
}
```

## 📚 API Reference

### Métodos Principais

| Método | Descrição | Normalização |
|--------|-----------|--------------|
| `checkEmail(email)` | Verifica email | trim + lowercase |
| `checkCpf(cpf)` | Verifica CPF | remove não-numéricos |
| `checkCnpj(cnpj)` | Verifica CNPJ | remove não-numéricos |
| `checkTaxonomySlug(slug)` | Verifica slug de categoria | trim + lowercase |
| `checkProductName(name)` | Verifica nome de produto | trim |
| `checkProductSlug(slug)` | Verifica slug de produto | trim + lowercase |

### Métodos Avançados

| Método | Descrição |
|--------|-----------|
| `checkMultiple(checks)` | Verifica múltiplos termos em lote |
| `areAllAvailable(checks)` | Verifica se todos os termos estão disponíveis |
| `getApiStatus()` | Health check da API |
| `isValidTerm(term, type)` | Validação local de formato |
| `normalizeTerm(term, type)` | Normaliza termo para tipo específico |

### Tipos de Resposta

```typescript
interface CheckResult {
  isAvailable: boolean;     // true = disponível, false = já existe
  recordId: number;         // ID do registro existente (0 se disponível)
  message: string;          // Mensagem descritiva
  existingData?: object;    // Dados adicionais se registro existe
}
```

## 🔧 Exemplos

### Validação de Formulário Completo

```typescript
const dadosFormulario = {
  email: "novo.usuario@email.com",
  cpf: "123.456.789-00",
};

const { allAvailable, results } = await CheckServiceApi.areAllAvailable([
  { type: CheckType.EMAIL, term: dadosFormulario.email },
  { type: CheckType.CPF, term: dadosFormulario.cpf },
]);

if (allAvailable) {
  // Todos os dados estão disponíveis - pode prosseguir
  submitFormulario(dadosFormulario);
} else {
  // Alguns dados já existem - mostrar erros
  results.forEach((result, index) => {
    if (!result.isAvailable) {
      const field = index === 0 ? "Email" : "CPF";
      showError(`${field}: ${result.message}`);
    }
  });
}
```

### Validação com Debounce (React)

```typescript
import { createDebouncedValidator } from '@/services/api/check/examples/check-examples';

const validateEmail = createDebouncedValidator(CheckType.EMAIL, 500);

// Em um componente React
const [emailError, setEmailError] = useState<string | null>(null);

const handleEmailChange = (email: string) => {
  setEmail(email);
  
  validateEmail(email, (isValid, message) => {
    setEmailError(isValid ? null : message);
  });
};
```

### Health Check

```typescript
try {
  const status = await CheckServiceApi.getApiStatus();
  
  if (status.status === "online") {
    console.log("✅ API funcionando - Versão:", status.version);
  }
} catch (error) {
  console.error("❌ API offline");
}
```

## 🎭 Tipos de Verificação

### CheckType Enum

```typescript
enum CheckType {
  EMAIL = "email",
  CPF = "cpf", 
  CNPJ = "cnpj",
  TAXONOMY_SLUG = "taxonomy-slug",
  PRODUCT_NAME = "product-name",
  PRODUCT_SLUG = "product-slug",
}
```

### Configurações por Tipo

| Tipo | Endpoint | Min Length | Normalização | Validação |
|------|----------|------------|--------------|-----------|
| EMAIL | `/check/v2/check-if-email-exists` | 3 | trim + lowercase | Formato email |
| CPF | `/check/v2/check-if-cpf-exists` | 11 | Remove não-numéricos | 11 dígitos |
| CNPJ | `/check/v2/check-if-cnpj-exists` | 14 | Remove não-numéricos | 14 dígitos |
| TAXONOMY_SLUG | `/check/v2/check-if-taxonomy-slug-exists` | 3 | trim + lowercase | a-z0-9- |
| PRODUCT_NAME | `/check/v2/check-if-product-name-exists` | 3 | trim | - |
| PRODUCT_SLUG | `/check/v2/check-if-product-slug-exists` | 3 | trim + lowercase | a-z0-9- |

## 🚨 Tratamento de Erros

### Validação Local

```typescript
// Verificar formato antes da requisição
if (!CheckServiceApi.isValidTerm(email, CheckType.EMAIL)) {
  throw new Error("Formato de email inválido");
}
```

### Tratamento de Erros da API

```typescript
try {
  const result = await CheckServiceApi.checkEmail("email@teste.com");
} catch (error) {
  if (error instanceof Error) {
    if (error.message.includes("at least 3 characters")) {
      // Erro de validação de comprimento
    } else if (error.message.includes("API offline")) {
      // Erro de conectividade
    } else {
      // Outros erros
    }
  }
}
```

### Custom Error Classes

```typescript
import { CheckError, CheckValidationError } from '@/services/api/check';

try {
  // operação
} catch (error) {
  if (error instanceof CheckValidationError) {
    // Erro de validação específico
    console.log("Erros de validação:", error.validationErrors);
  } else if (error instanceof CheckError) {
    // Erro geral do check service
    console.log("Código do erro:", error.code);
  }
}
```

## ✨ Best Practices

### 1. Validação Progressiva

```typescript
// 1. Primeiro validar formato local (instantâneo)
if (!CheckServiceApi.isValidTerm(email, CheckType.EMAIL)) {
  return { error: "Formato inválido" };
}

// 2. Depois verificar disponibilidade na API (com debounce)
const result = await CheckServiceApi.checkEmail(email);
```

### 2. Use Debounce em Formulários

```typescript
// Evitar requisições excessivas durante digitação
const debouncedCheck = useDebouncedCallback(
  (value) => CheckServiceApi.checkEmail(value),
  500 // 500ms de delay
);
```

### 3. Validação em Lote

```typescript
// Para múltiplas verificações, use métodos em lote
const checks = [
  { type: CheckType.EMAIL, term: formData.email },
  { type: CheckType.CPF, term: formData.cpf },
];

const results = await CheckServiceApi.checkMultiple(checks);
```

### 4. Normalização Consistente

```typescript
// Use os métodos de normalização do serviço
const cpfNormalizado = CheckServiceApi.normalizeTerm(cpf, CheckType.CPF);
const emailNormalizado = CheckServiceApi.normalizeTerm(email, CheckType.EMAIL);
```

### 5. Feedback Visual Imediato

```typescript
// Mostrar status visual baseado na resposta
const getStatusIcon = (result: CheckResult) => {
  if (result.isAvailable) {
    return "✅"; // Disponível
  } else {
    return "❌"; // Já existe
  }
};
```

### 6. Cache de Resultados (se necessário)

```typescript
// Para resultados que não mudam frequentemente
const cacheResults = new Map<string, CheckResult>();

const checkWithCache = async (term: string, type: CheckType) => {
  const cacheKey = `${type}:${term}`;
  
  if (cacheResults.has(cacheKey)) {
    return cacheResults.get(cacheKey)!;
  }
  
  const result = await CheckServiceApi.checkEmail(term);
  cacheResults.set(cacheKey, result);
  
  return result;
};
```

## 🔄 Integração com React Hook Form

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createAsyncValidator } from '@/services/api/check/examples/check-examples';

const schema = z.object({
  email: z.string().email(),
});

const emailValidator = createAsyncValidator(CheckType.EMAIL);

const form = useForm({
  resolver: zodResolver(schema),
  mode: 'onBlur', // Validar quando sair do campo
});

// Validação assíncrona
const { setError, clearErrors } = form;

const handleEmailBlur = async (email: string) => {
  const result = await emailValidator(email);
  
  if (result === true) {
    clearErrors('email');
  } else {
    setError('email', { message: result });
  }
};
```

---

## 📝 Notas Importantes

1. **Rate Limiting**: A API possui rate limit - use debounce para evitar bloqueios
2. **Revalidação**: Sempre revalide no backend antes de criar registros
3. **Normalização**: Dados são normalizados automaticamente - verifique a documentação
4. **Multi-tenant**: Verificações são filtradas por organização automaticamente
5. **TypeScript**: Aproveite os tipos para melhor experiência de desenvolvimento

## 🐛 Troubleshooting

### Erro 400 - Bad Request
- Verifique se o termo tem pelo menos 3 caracteres
- Confirme o formato dos dados (email, CPF, etc.)

### Erro 401 - Unauthorized  
- Verifique se a API_KEY está configurada corretamente
- Confirme se o header Authorization está sendo enviado

### API Offline
- Use o health check para verificar status
- Implemente fallbacks para quando a API estiver indisponível

---

**Versão**: 1.0  
**Última Atualização**: 2025-10-18  
**Mantenedor**: Equipe de Desenvolvimento