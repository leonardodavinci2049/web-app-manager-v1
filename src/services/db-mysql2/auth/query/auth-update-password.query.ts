import { envs } from "@/core/config";
import type { AuthUpdatePasswordDto } from "../dto/auth-update-password.dto";

export function AuthUpdatePasswordQuery(
  dataJsonDto: AuthUpdatePasswordDto,
): string {
  const olSystemClientId = envs.SYSTEM_CLIENT_ID;
  const olStoreId = envs.STORE_ID ?? 1;
  const olAppId = envs.APP_ID;
  const olUserId = dataJsonDto.USER_ID;
  const olPasswordMd5 = dataJsonDto.PASSWORD_MD5;

  const queryString = ` call sp_auth_update_password_v2(
       ${olSystemClientId},
       ${olStoreId},
       ${olAppId},
       ${olUserId},
       '${olPasswordMd5}'
       ) `;

  return queryString;
}
