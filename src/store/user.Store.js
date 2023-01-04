import { http } from "@/utils"
import { makeAutoObservable } from "mobx"

class UserStore {
  userInfo = {}
  constructor() {
    makeAutoObservable(this)
  }
  async getUserInfo() {
    const { data } = await http.get('/user/profile')
    this.setUserInfo(data)
  }
  setUserInfo(info) {
    this.userInfo = info
  }
}

export default UserStore