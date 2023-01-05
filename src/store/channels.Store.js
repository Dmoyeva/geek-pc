import { http } from "@/utils"
import { makeAutoObservable } from "mobx"

class ChannelsStore{
  channelsList = []
  constructor() {
    makeAutoObservable(this)
  }
  async getChannels() {
    const res = await http.get('/channels')
    this.setChannels(res.data.channels)
  }
  setChannels(data) {
    this.channelsList = data
  }
}

export default ChannelsStore