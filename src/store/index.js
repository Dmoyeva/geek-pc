// useStore

import LoginStore from './login.Store'
import UserStore from './user.Store'
import ChannelsStore from './channels.Store'
import React from 'react'

class RootStore {
  constructor() {
    this.loginStore = new LoginStore()
    this.userStore = new UserStore()
    this.channelsStore = new ChannelsStore()
  }
}

const rootStore = new RootStore()
const Context = React.createContext(rootStore)

const useStore = () => React.useContext(Context)

export { useStore }