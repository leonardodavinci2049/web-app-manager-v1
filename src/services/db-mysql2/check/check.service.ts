import dbService from "../dbConnection";
import { MESSAGES, resultQueryData } from "../utils/global.result";
import { ResultModel } from "../utils/result.model";
import { validateCheckIfCnpjExistsDto } from "./dto/check-if-cnpj-exists.dto";
import { validateCheckIfCpfExistsDto } from "./dto/check-if-cpf-exists.dto";
import { validateCheckIfEmailExistsDto } from "./dto/check-if-email-exists.dto";
import { CheckIfCnpjExistsQuery } from "./query/check-if-cnpj-exists.query";
import { CheckIfCpfExistsQuery } from "./query/check-if-cpf-exists.query";
import { CheckIfEmailExistsQuery } from "./query/check-if-email-exists.query";
import type {
  SpCheckIfCnpjExistType,
  SpCheckIfCpfExistType,
  SpCheckIfEmailExistType,
} from "./types/check.type";

export class CheckService {
  // Serviço para verificar se email existe
  async tskCheckIfEmailExist(dataJsonDto: unknown): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto = validateCheckIfEmailExistsDto(dataJsonDto);

      const queryString = CheckIfEmailExistsQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpCheckIfEmailExistType;

      const tblRecords = resultData[0];
      const qtRecords: number = tblRecords.length;
      const tblRecord = tblRecords[0] || 0;
      const recordId: number = tblRecord?.ID_CHECK ?? 0;

      if (recordId > 0) {
        //TODO: Send instructions by email or WhatsApp
      }

      return resultQueryData<SpCheckIfEmailExistType>(
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

  // Serviço para verificar se CPF existe
  async tskCheckIfCpfExist(dataJsonDto: unknown): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto = validateCheckIfCpfExistsDto(dataJsonDto);

      const queryString = CheckIfCpfExistsQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpCheckIfCpfExistType;

      const tblRecords = resultData[0];
      const qtRecords: number = tblRecords.length;
      const tblRecord = tblRecords[0] || 0;
      const recordId: number = tblRecord?.ID_CHECK ?? 0;

      if (recordId > 0) {
        //TODO: Send instructions by email or WhatsApp
      }

      return resultQueryData<SpCheckIfCpfExistType>(
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

  // Serviço para verificar se CNPJ existe
  async tskCheckIfCnpjExist(dataJsonDto: unknown): Promise<ResultModel> {
    try {
      // Valida os dados de entrada
      const validatedDto = validateCheckIfCnpjExistsDto(dataJsonDto);

      const queryString = CheckIfCnpjExistsQuery(validatedDto);

      const resultData = (await dbService.selectExecute(
        queryString,
      )) as unknown as SpCheckIfCnpjExistType;

      const tblRecords = resultData[0];
      const qtRecords: number = tblRecords.length;
      const tblRecord = tblRecords[0] || 0;
      const recordId: number = tblRecord?.ID_CHECK ?? 0;

      if (recordId > 0) {
        //TODO: Send instructions by email or WhatsApp
      }

      return resultQueryData<SpCheckIfCnpjExistType>(
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

// Instância singleton do serviço de verificação
const checkService = new CheckService();
export default checkService;
