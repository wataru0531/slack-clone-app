
// /lib/api
// axiosの設定ファイル

import axios from "axios";
import { addAuthorizationHeader } from "./interceptors";

const baseURL = import.meta.env.VITE_API_URL;
const api = axios.create({ baseURL: baseURL })

// リクエストの形式をJSON形式で送るための設定
api.defaults.headers.common["Content-Type"] = "application/json";

// ローカスストレージからtokenを取り出して、リクエストヘッダーに付与
api.interceptors.request.use(addAuthorizationHeader);

export default api;
