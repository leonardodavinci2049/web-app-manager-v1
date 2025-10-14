import { envs } from "@/core/config";
import type { AuthNewPasswordDto } from "../dto/auth-new-password.dto";

export function AuthNewPasswordQuery(dataJsonDto: AuthNewPasswordDto): string {
  const olSystemClientId = envs.SYSTEM_CLIENT_ID;
  const olStoreId = envs.STORE_ID ?? 1;
  const olAppId = envs.APP_ID;
  const olUserId = dataJsonDto.USER_ID;
  const olPasswordMd5 = dataJsonDto.PASSWORD_MD5;

  const queryString = ` call sp_auth_new_password_v2(
       ${olSystemClientId},
       ${olStoreId},
       ${olAppId},
       ${olUserId},
       '${olPasswordMd5}'
       ) `;

  return queryString;
}
