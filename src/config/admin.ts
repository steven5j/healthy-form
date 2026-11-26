// 管理員白名單設定
// 若留空陣列 []，則「任何成功透過 Google 登入的使用者」皆可進入後台（適合初期測試）
// 若填入信箱，例如 ['your-email@gmail.com']，則只有清單內的 Google 帳號才能進入後台
export const ADMIN_WHITELIST: string[] = [
  // 'example@gmail.com',
];

export function isUserAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  if (ADMIN_WHITELIST.length === 0) return true; // 預設留空時開放給已登入管理者
  return ADMIN_WHITELIST.some((adminEmail) => adminEmail.toLowerCase() === email.toLowerCase());
}
