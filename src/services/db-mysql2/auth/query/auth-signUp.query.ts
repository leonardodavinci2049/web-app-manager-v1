import { v4 as UuidV4 } from "uuid";
import { envs } from "@/core/config";
import type { AuthSignUpDto } from "../dto/auth-signUp.dto";

export function AuthSignUpQuery(dataJsonDto: AuthSignUpDto): string {
  const olSystemClientId = envs.SYSTEM_CLIENT_ID;
  const olStoreId = envs.STORE_ID ?? 1;
  const olAppId = envs.APP_ID;
  const olUserId = dataJsonDto.USER_ID;
  const olUuid = UuidV4();
  const olName = dataJsonDto.NAME;
  const olEmail = dataJsonDto.EMAIL;
  const olPasswordMd5 = dataJsonDto.PASSWORD_MD5;
  const olInfo1 = dataJsonDto.INFO1 ?? "";

  const queryString = ` call sp_auth_signUp_v2(
       ${olSystemClientId},
       ${olStoreId},
       ${olAppId},
       ${olUserId},
       '${olUuid}',
       '${olName}',
       '${olEmail}',
       '${olPasswordMd5}',
       '${olInfo1}'
       ) `;

  return queryString;
}
