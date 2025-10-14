import type { RowDataPacket } from "mysql2";
import genericService from "../generic.service";

// Exemplos de como usar o serviço genérico

// Interfaces específicas para diferentes tipos de procedures (opcionais)
interface UserRecord extends RowDataPacket {
  USER_ID: number;
  NOME?: string;
  EMAIL?: string;
}

interface CheckRecord extends RowDataPacket {
  ID_CHECK?: number;
  ID_RECORD: number;
}

/**
 * Exemplo 1: Testando procedure sp_check_if_cpf_exists_V2
 */
export async function testCheckCpfProcedure() {
  const procedureCall = `
    CALL sp_check_if_cpf_exists_V2 (
      1, -- PE_SYSTEM_CLIENT_ID INT,
      1, -- PE_STORE_ID INT,	
      1, -- PE_APP_ID INT,	
      29014, --  PE_USER_ID INT                           
      UNIX_TIMESTAMP() -- PE_TERM VARCHAR(500)  
    )`;

  try {
    // Usando o método genérico principal
    const response =
      await genericService.executeGenericProcedure<CheckRecord>(procedureCall);

    console.log("=== TESTE: sp_check_if_cpf_exists_V2 ===");
    console.log(genericService.formatResponseForDisplay(response));

    return response;
  } catch (error) {
    console.error("Erro ao testar procedure de CPF:", error);
    throw error;
  }
}

/**
 * Exemplo 2: Testando procedure sp_auth_update_password_v2
 */
export async function testUpdatePasswordProcedure() {
  const procedureCall = `
    CALL sp_auth_update_password_v2(
      1, -- PE_SYSTEM_CLIENT_ID INT,
      1, -- PE_STORE_ID INT,
      2, -- PE_APP_ID INT,
      47513, -- PE_USER_ID INT,     
      MD5('CstH@2052') -- bcf05ec7cc74846c875217b4bf6418b6
    )`;

  try {
    // Usando o método genérico principal
    const response =
      await genericService.executeGenericProcedure<UserRecord>(procedureCall);

    console.log("=== TESTE: sp_auth_update_password_v2 ===");
    console.log(genericService.formatResponseForDisplay(response));

    return response;
  } catch (error) {
    console.error("Erro ao testar procedure de update password:", error);
    throw error;
  }
}

/**
 * Exemplo 3: Testando procedure que retorna apenas dados (sem feedback estruturado)
 */
export async function testSimpleDataProcedure() {
  const procedureCall = `CALL sp_get_all_users()`;

  try {
    // Usando o método específico para dados
    const response =
      await genericService.executeDataProcedure<UserRecord>(procedureCall);

    console.log("=== TESTE: sp_get_all_users ===");
    console.log(genericService.formatResponseForDisplay(response));

    return response;
  } catch (error) {
    console.error("Erro ao testar procedure simples:", error);
    throw error;
  }
}

/**
 * Exemplo 4: Testando procedure de modificação (INSERT/UPDATE/DELETE)
 */
export async function testModifyProcedure() {
  const procedureCall = `
    CALL sp_delete_user(47513)`;

  try {
    // Usando o método específico para modificações
    const response = await genericService.executeModifyProcedure(procedureCall);

    console.log("=== TESTE: sp_delete_user ===");
    console.log(genericService.formatResponseForDisplay(response));

    return response;
  } catch (error) {
    console.error("Erro ao testar procedure de modificação:", error);
    throw error;
  }
}

/**
 * Exemplo 5: Testando procedure genérica sem saber o tipo exato de retorno
 */
export async function testUnknownProcedure(procedureCall: string) {
  try {
    // Usando o método genérico sem tipagem específica
    const response =
      await genericService.executeGenericProcedure(procedureCall);

    console.log(
      `=== TESTE GENÉRICO: ${procedureCall.trim().split("\n")[0]} ===`,
    );
    console.log(genericService.formatResponseForDisplay(response));

    return response;
  } catch (error) {
    console.error("Erro ao testar procedure genérica:", error);
    throw error;
  }
}

/**
 * Exemplo 6: Usando o método legacy para compatibilidade
 */
export async function testLegacyMethod() {
  const procedureCall = `
    CALL sp_check_if_cpf_exists_V2 (
      1, 1, 1, 29014, UNIX_TIMESTAMP()
    )`;

  try {
    // Usando o método legacy
    const response =
      await genericService.tskGenericStoreProcedure(procedureCall);

    console.log("=== TESTE LEGACY METHOD ===");
    console.log("Status Code:", response.statusCode);
    console.log("Message:", response.message);
    console.log("Record ID:", response.recordId);
    console.log("Quantity:", response.quantity);
    console.log("Data:", JSON.stringify(response.data, null, 2));

    return response;
  } catch (error) {
    console.error("Erro ao testar método legacy:", error);
    throw error;
  }
}

/**
 * Função principal para executar todos os testes
 */
export async function runAllTests() {
  console.log("🚀 Iniciando testes do serviço genérico...\n");

  try {
    await testCheckCpfProcedure();
    console.log(`\n${"=".repeat(50)}\n`);

    await testUpdatePasswordProcedure();
    console.log(`\n${"=".repeat(50)}\n`);

    await testSimpleDataProcedure();
    console.log(`\n${"=".repeat(50)}\n`);

    await testModifyProcedure();
    console.log(`\n${"=".repeat(50)}\n`);

    await testUnknownProcedure("CALL sp_test_any_procedure(1, 'test')");
    console.log(`\n${"=".repeat(50)}\n`);

    await testLegacyMethod();

    console.log("\n✅ Todos os testes foram executados!");
  } catch (error) {
    console.error("❌ Erro durante os testes:", error);
  }
}

// Para uso em desenvolvimento/debug
export { genericService };

export type { UserRecord, CheckRecord };
