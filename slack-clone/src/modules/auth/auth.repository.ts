
// /modules/auth/auth.repository.ts

import api from "../../lib/api";
import { User } from "../users/user.entity";
// ↓
// const baseURL = import.meta.env.VITE_API_URL;
// const api = axios.create({ baseURL: baseURL })
// api.defaults.headers.common["Content-Type"] = "application/json";

// 認証周りのAPIをまとめたファイル

export const authRepository = {
  // ✅ ユーザー登録
  async signup(
    name: string, 
    email: string, 
    password: string
  ): Promise<{ user: User, token: string }> {
    const result = await api.post("/auth/signup", {
      name,
      email,
      password,
    });
    
    const { user, token } = result.data;

    return { user: new User(user), token };
  },

  // ✅ ログイン
  async signin(
    email: string, 
    password: string): Promise<{ user: User, token: string }>{
    const result = await api.post(`/auth/signin`, { email, password });
    const { user, token } = result.data;

    return { user: new User(user), token: token }
  },

  // ✅ ユーザーデータを返すAPI
  // → axiosのinterceptorにtokenを渡している
  //   Expressでもミドルウェアでtokenをとりだしている。set-current-user.ts
  async getCurrentUser(): Promise<User | undefined>{
    const result = await api.get("/auth/me");

    if(result.data == null) return undefined;

    return new User(result.data);
  },






}




