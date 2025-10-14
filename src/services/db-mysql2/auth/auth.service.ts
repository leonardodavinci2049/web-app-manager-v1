import dbService from "../dbConnection";
import { MESSAGES, resultQueryData } from "../utils/global.result";
import { ResultModel } from "../utils/result.model";
import { validateAuthNewPasswordDto } from "./dto/auth-new-password.dto";
import { validateAuthSignInDto } from "./dto/auth-signIn.dto";
import { validateAuthSignUpDto } from "./dto/auth-signUp.dto";
import { validateAuthUpdatePasswordDto } from "./dto/auth-update-password.dto";
import { AuthNewPasswordQuery } from "./query/auth-new-password.query";
import { AuthSignInQuery } from "./query/auth-signIn.query";
import { AuthSignUpQuery } from "./query/auth-signUp.query";
import { AuthUpdatePasswordQuery } from "./query/auth-update-password.query";
import type { SpResultData } from "./types/auth.type";

export class AuthService {
  // Serviço para cadastro de usuário
  async tskAuthSignUp(dataJsonDto: unknown): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto = validateAuthSignUpDto(dataJsonDto);

      const queryString = AuthSignUpQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultData;

      const tblRecords = resultData[0];
      const qtRecords: number = tblRecords.length;
      const tblRecord = tblRecords[0] || 0;
      const recordId: number = tblRecord?.USER_ID ?? 0;

      if (recordId > 0) {
        //TODO: Send confirmation email or welcome message
      }

      return resultQueryData<SpResultData>(
        recordId,
        0,
        "",
        resultData,
        qtRecords,
        "",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, 0, []);
    }
  }

  // Serviço para login de usuário
  async tskAuthSignIn(dataJsonDto: unknown): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto = validateAuthSignInDto(dataJsonDto);

      const queryString = AuthSignInQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultData;

      const tblRecords = resultData[0];
      const qtRecords: number = tblRecords.length;
      const tblRecord = tblRecords[0] || 0;
      const recordId: number = tblRecord?.USER_ID ?? 0;

      if (recordId > 0) {
        //TODO: Update last login time and create session
      }

      return resultQueryData<SpResultData>(
        recordId,
        0,
        "",
        resultData,
        qtRecords,
        "",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, 0, []);
    }
  }

  // Serviço para atualização de senha
  async tskAuthUpdatePassword(dataJsonDto: unknown): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto = validateAuthUpdatePasswordDto(dataJsonDto);

      const queryString = AuthUpdatePasswordQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultData;

      const tblRecords = resultData[0];
      const qtRecords: number = tblRecords.length;
      const tblRecord = tblRecords[0] || 0;
      const recordId: number = tblRecord?.USER_ID ?? 0;

      if (recordId > 0) {
        //TODO: Send password update confirmation email
      }

      return resultQueryData<SpResultData>(
        recordId,
        0,
        "",
        resultData,
        qtRecords,
        "",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, 0, []);
    }
  }

  // Serviço para nova senha
  async tskAuthNewPassword(dataJsonDto: unknown): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto = validateAuthNewPasswordDto(dataJsonDto);

      const queryString = AuthNewPasswordQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpResultData;

      const tblRecords = resultData[0];
      const qtRecords: number = tblRecords.length;
      const tblRecord = tblRecords[0] || 0;
      const recordId: number = tblRecord?.USER_ID ?? 0;

      if (recordId > 0) {
        //TODO: Send new password confirmation email
      }

      return resultQueryData<SpResultData>(
        recordId,
        0,
        "",
        resultData,
        qtRecords,
        "",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : MESSAGES.UNKNOWN_ERROR;
      return new ResultModel(100404, errorMessage, 0, []);
    }
  }
}

// Instância singleton do serviço de autenticação
const authService = new AuthService();
export default authService;
