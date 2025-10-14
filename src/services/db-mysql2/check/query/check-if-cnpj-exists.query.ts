import { envs } from "@/core/config";
import type { CheckIfCnpjExistsDto } from "../dto/check-if-cnpj-exists.dto";

export function CheckIfCnpjExistsQuery(
  dataJsonDto: CheckIfCnpjExistsDto,
): string {
  const olSystemClientId = envs.SYSTEM_CLIENT_ID;
  const olStoreId = envs.STORE_ID ?? 1;
  const olAppId = envs.APP_ID;
  const olUserId = dataJsonDto.USER_ID;
  const olTerm = dataJsonDto.TERM;

  const queryString = ` call sp_check_if_cnpj_exists_v2(
       ${olSystemClientId},
       ${olStoreId},
       ${olAppId},
       ${olUserId},
       '${olTerm}'
       ) `;

  return queryString;
}
