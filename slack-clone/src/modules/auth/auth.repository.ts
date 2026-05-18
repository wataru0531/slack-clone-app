
// /modules/auth/auth.repository.ts

import api from "../../lib/api";
// ↓
// const baseURL = import.meta.env.VITE_API_URL;
// const api = axios.create({ baseURL: baseURL })
// api.defaults.headers.common["Content-Type"] = "application/json";

// 認証周りのAPIをまとめたファイル

export const authRepository = {
  // ✅ 登録
  async signup(name: string, email: string, password: string) {
    const result = await api.post("/auth/signup", {
      name,
      email,
      password,
    });
    
    const { user, token } = result.data;

    return { user, token };
  }


}




