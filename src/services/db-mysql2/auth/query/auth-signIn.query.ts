import { v4 as UuidV4 } from "uuid";
import { envs } from "@/core/config";
import type { AuthSignInDto } from "../dto/auth-signIn.dto";

export function AuthSignInQuery(dataJsonDto: AuthSignInDto): string {
  const olSystemClientId = envs.SYSTEM_CLIENT_ID;
  const olStoreId = envs.STORE_ID ?? 1;
  const olAppId = envs.APP_ID;
  const olUserId = dataJsonDto.USER_ID;
  const olUuid = UuidV4();

  const olEmail = dataJsonDto.EMAIL;
  const olPasswordMd5 = dataJsonDto.PASSWORD_MD5;

  const queryString = ` call sp_auth_signIn_v2(
       ${olSystemClientId},
       ${olStoreId},
       ${olAppId},
       ${olUserId},
       '${olUuid}',
       '${olEmail}',
       '${olPasswordMd5}'
       ) `;

  return queryString;
}
