import { Layout, Menu, Popconfirm } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import {
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import './index.scss'
import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { useStore } from '@/store'
const { Header, Sider } = Layout
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const items = [
  getItem('数据概览', '/', <HomeOutlined />),
  getItem('内容管理', '/article', <DiffOutlined />),
  getItem('发布文章', '/publish', <EditOutlined />)
]
function GeekLayout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const handleClick = (key) => {
    navigate(key)
  }
  // 获取频道列表
  const { channelsStore } = useStore()
  useEffect(() => {
    channelsStore.getChannels()
  }, [channelsStore])
  // 获取用户信息
  const { userStore, loginStore } = useStore()
  useEffect(() => {
    userStore.getUserInfo()
  }, [userStore])
  // 确认退出
  const confirm = () => {
    // 退出登录，清空本地及store里的token
    loginStore.logout()
    // 跳转到登录页
    navigate('/login')
  }
  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <div className="user-info">
          <span className="user-name">{userStore.userInfo.name}</span>
          <span className="user-logout">
            <Popconfirm title="是否确认退出？" onConfirm={confirm} okText="退出" cancelText="取消">
              <LogoutOutlined /> 退出
            </Popconfirm>
          </span>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            defaultSelectedKeys={[pathname]}
            mode="inline"
            theme="dark"
            items={items}
            onClick={({ key }) => handleClick(key)}
          />
        </Sider>
        <Layout className="layout-content" style={{ padding: 20 }}>
          {/* 二级路由出口 */}
          <Outlet />
        </Layout>
      </Layout>
    </Layout>
  )
}

export default observer(GeekLayout)