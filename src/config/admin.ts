// 管理員白名單設定
// 只有清單內的 Google 帳號才能進入諮詢師後台
export const ADMIN_WHITELIST: string[] = [
  'ytfannie87@gmail.com',
  'stevenjhu5j@gmail.com',
];

export function isUserAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  if (ADMIN_WHITELIST.length === 0) return true; // 若留空則開放已登入管理者
  return ADMIN_WHITELIST.some((adminEmail) => adminEmail.toLowerCase() === email.toLowerCase());
}
