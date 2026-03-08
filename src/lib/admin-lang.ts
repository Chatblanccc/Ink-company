import { cookies } from "next/headers";

import { type AdminLocale } from "@/lib/admin-i18n";
import { ADMIN_LANG_COOKIE } from "@/lib/admin-lang-cookie";

export { ADMIN_LANG_COOKIE };

export async function getAdminLocale(): Promise<AdminLocale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(ADMIN_LANG_COOKIE)?.value;
  return value === "zh" ? "zh" : "en";
}
