import './App.scss'
import { Routes, Route } from 'react-router-dom'
// 导入高阶组件==>把组件当参数传入，经过判断，返回新的组件
import { Authorization } from './components/Authorization'
import GeekLayout from '@/pages/Layout'
import Login from '@/pages/Login'
import Home from '@/pages/Home'
import Article from '@/pages/Article'
import Publish from '@/pages/Publish'
// 解决token过期问题
import { history, HistoryRouter } from './utils/history'
function App() {
  return (
    <HistoryRouter history={history}>
      <div className="App">
        <Routes>
          {/* layout页面需要鉴权才能登录 */}
          <Route
            path='/'
            element={
              <Authorization>
                <GeekLayout />
              </Authorization>
            }>
            <Route index element={<Home />}></Route>
            <Route path='/article' element={<Article />}></Route>
            <Route path='/publish' element={<Publish />}></Route>
          </Route>
          {/* login页面不需要鉴权 */}
          <Route path='/login' element={<Login />}></Route>
        </Routes>
      </div>
    </HistoryRouter>
  )
}

export default App;
