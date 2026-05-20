
// /lib/api/interceptors.ts

import type { InternalAxiosRequestConfig } from "axios";


// ✅ ローカルストレージからtokenを取得、リクエストヘッダーに設定して返す
// → axiosのデフォルト設定に足す
export const addAuthorizationHeader = (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  
  if(token == null) return config;

  config.headers.Authorization = `Bearer ${token}`;

  return config;
}








