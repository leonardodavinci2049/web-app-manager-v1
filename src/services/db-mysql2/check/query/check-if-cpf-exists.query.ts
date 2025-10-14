import { envs } from "@/core/config";
import type { CheckIfCpfExistsDto } from "../dto/check-if-cpf-exists.dto";

export function CheckIfCpfExistsQuery(
  dataJsonDto: CheckIfCpfExistsDto,
): string {
  const olSystemClientId = envs.SYSTEM_CLIENT_ID;
  const olStoreId = envs.STORE_ID ?? 1;
  const olAppId = envs.APP_ID;
  const olUserId = dataJsonDto.USER_ID;
  const olTerm = dataJsonDto.TERM;

  const queryString = ` call sp_check_if_cpf_exists_v2(
       ${olSystemClientId},
       ${olStoreId},
       ${olAppId},
       ${olUserId},
       '${olTerm}'
       ) `;

  return queryString;
}
