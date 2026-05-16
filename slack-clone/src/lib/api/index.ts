
// /lib/api
// axiosの設定ファイル

import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;
const api = axios.create({ baseURL: baseURL })
api.defaults.headers.common["Content-Type"] = "application/json";
// → リクエストの形式をJSON形式で送るための設定


export default api;
