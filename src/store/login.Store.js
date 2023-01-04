// store for token

import { makeAutoObservable } from "mobx"
import { http, setToken, getToken, removeToken } from "@/utils"

class LoginStore {
  // 在初始化的时候要getToken，不然被置为空字符串
  token = getToken() || ''
  constructor() {
    makeAutoObservable(this)
  }
  async getToken({ mobile, code }) {
    const res = await http.post('/authorizations', { mobile, code })
    this.token = res.data.token
    // token赋值后存储到localStorage
    setToken(this.token)
  }
  logout() {
    this.token = ''
    removeToken()
  }
}

export default LoginStore