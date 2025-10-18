/**
 * Teste básico para verificar se o serviço Check foi implementado corretamente
 * Execute este arquivo para validar a estrutura criada
 */

import { CheckServiceApi, CheckType } from "@/services/api/check";

console.log("🧪 Testando estrutura do Check Service...\n");

// Teste 1: Verificar se as exportações estão funcionando
console.log("✅ Teste 1: Importações");
console.log("- CheckServiceApi:", typeof CheckServiceApi);
console.log("- CheckType:", typeof CheckType);
console.log("- CheckType.EMAIL:", CheckType.EMAIL);
console.log("- CheckType.CPF:", CheckType.CPF);

// Teste 2: Verificar métodos estáticos disponíveis
console.log("\n✅ Teste 2: Métodos disponíveis");
const methodsToCheck = [
  "checkEmail",
  "checkCpf",
  "checkCnpj",
  "checkTaxonomySlug",
  "checkProductName",
  "checkProductSlug",
  "checkMultiple",
  "areAllAvailable",
  "getApiStatus",
  "isValidTerm",
  "normalizeTerm",
];

methodsToCheck.forEach((method) => {
  const exists =
    typeof CheckServiceApi[method as keyof typeof CheckServiceApi] ===
    "function";
  console.log(`- ${method}: ${exists ? "✅" : "❌"}`);
});

// Teste 3: Verificar validação local
console.log("\n✅ Teste 3: Validação local");
try {
  const emailValido = CheckServiceApi.isValidTerm(
    "teste@email.com",
    CheckType.EMAIL,
  );
  const emailInvalido = CheckServiceApi.isValidTerm(
    "email-invalido",
    CheckType.EMAIL,
  );
  const cpfValido = CheckServiceApi.isValidTerm("12345678901", CheckType.CPF);
  const cpfInvalido = CheckServiceApi.isValidTerm("123", CheckType.CPF);

  console.log(`- Email válido: ${emailValido ? "✅" : "❌"}`);
  console.log(`- Email inválido: ${!emailInvalido ? "✅" : "❌"}`);
  console.log(`- CPF válido: ${cpfValido ? "✅" : "❌"}`);
  console.log(`- CPF inválido: ${!cpfInvalido ? "✅" : "❌"}`);
} catch (error) {
  console.log("❌ Erro na validação local:", error);
}

// Teste 4: Verificar normalização
console.log("\n✅ Teste 4: Normalização");
try {
  const cpfFormatado = "123.456.789-00";
  const cpfNormalizado = CheckServiceApi.normalizeTerm(
    cpfFormatado,
    CheckType.CPF,
  );
  console.log(`- CPF "${cpfFormatado}" → "${cpfNormalizado}"`);

  const emailMisto = "  TESTE@EMAIL.COM  ";
  const emailNormalizado = CheckServiceApi.normalizeTerm(
    emailMisto,
    CheckType.EMAIL,
  );
  console.log(`- Email "${emailMisto}" → "${emailNormalizado}"`);

  console.log("✅ Normalização funcionando");
} catch (error) {
  console.log("❌ Erro na normalização:", error);
}

console.log("\n🎉 Testes da estrutura concluídos!");
console.log("\nPara testar com a API real, certifique-se de que:");
console.log("1. O servidor da API esteja rodando em http://localhost:3333");
console.log("2. As variáveis de ambiente estejam configuradas");
console.log("3. A API_KEY seja válida");
