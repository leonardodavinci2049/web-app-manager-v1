import { organizationClient } from "better-auth/client/plugins";
import { nextCookies } from "better-auth/next-js";
import { createAuthClient } from "better-auth/react";
import { envs } from "@/core/config";

export const authClient = createAuthClient({
  plugins: [nextCookies(), organizationClient()],
  /** The base URL of the server (required para OAuth funcionar corretamente) */
  baseURL: envs.BETTER_AUTH_URL,
});
