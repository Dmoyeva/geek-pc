import { Card, Button, Checkbox, Form, Input, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import logo from '@/assets/logo.png'
import './index.scss'
import { useStore } from '@/store'
function Login() {
  const { loginStore } = useStore()
  const navigate = useNavigate()
  const onFinish = async (values) => {
   try {
    loginStore.getToken({
      mobile: values.username,
      code: values.password
    })
    navigate('/', { replace: true })
    message.success('Login successfully')
  } catch(e) {
    message.error(e.response?.data?.message || 'Failed to login')
  }
  }
  return (
    <div className='login'>
      <Card className='login-container'>
        <img className='login-logo' src={logo} alt='' />
        {/* 登录表单 */}
        <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          validateTrigger={'onBlur'}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
              {
                pattern: /^1[3-9]\d{9}$/,
                message: 'Please input correct phone number'
              }
            ]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
              {
                len: 6,
                message: 'Length of password  should be 6!'
              }
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
          >
            <Checkbox>
              已阅读并同意<a href='/#'>用户协议</a>和<a href='/#'>隐私条款</a>
            </Checkbox>
          </Form.Item>

          <Form.Item
          >
            <Button type="primary" htmlType="submit" size='large' block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Login