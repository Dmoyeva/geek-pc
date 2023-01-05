import './index.scss'
import { observer } from 'mobx-react-lite'
import { Card, Form, Breadcrumb, Input, Select, Space, Button, Upload, Radio, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useStore } from '@/store'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useEffect, useRef, useState } from 'react'

import { http } from '@/utils'

const { Option } = Select
function Publish() {
  const { channelsStore } = useStore()
  // 切换数量的变化，显示图片随之变化
  const cacheImg = useRef()
  // 设置图片列表
  const [fileList, setFileList] = useState([])
  function handleChange(info) {
    // setFileList(info.fileList)  // 这里直接把fileList设置为了表单返回的大对象，其实要用的只有url
    const formatData = info.fileList.map(file => {
      if (file.response) {
        // response存在说明已上传完成
        return {
          url: file.response.data.url
        }
      } else {
        // 没完成上传就不要动了
        return file
      }
    })
    setFileList(formatData)
    cacheImg.current = formatData
  }

  // 切换图片数量
  // 先把图片数量及设置图片数量存储起来
  const [imgCount, setImgCount] = useState(1)
  function radioToggle(e) {
    const countType = e.target.value
    setImgCount(countType)
    if (countType === 1) {
      setFileList(cacheImg.current ? [cacheImg.current[0]] : [])
    } else if (countType === 3) {
      setFileList(cacheImg.current ? cacheImg.current : [])
    }
  }
  // 提交表单数据
  const navigate = useNavigate()
  async function onFinish(values) {
    const { channel_id, content, type, title } = values
    const params = {
      channel_id,
      content,
      type,
      title,
      cover: {
        type,
        // images: fileList.map(item => item.response.data?.url) //有问题，在编辑的时候改变了fileList
        images: fileList.map(item => item.url) //有问题，在编辑的时候改变了fileList
      }
    }
    if (id) {
      await http.put(`/mp/articles/${id}?draft=false`, params)
    } else {
      await http.post('/mp/articles?draft=false', params)
    }
    navigate('/article')
    message.success(`${id ? 'edit' : 'publish'}successfully`)
  }
  // 匹配编辑跟发布文章文案==>依据文章id来判断
  const [params] = useSearchParams()
  const id = params.get('id')
  // 重装载文章数据
  const formRef = useRef(null)
  useEffect(() => {
    async function loadArticle() {
      const res = await http.get(`/mp/articles/${id}`)
      // 重置的几个数据：表单、暂存列表、upload组件fileList
      const data = res.data
      // 调用Form组件的实例对象方法 setFieldsValue
      formRef.current.setFieldsValue({ ...data, type: data.cover.type })
      const formatList = data.cover.images.map(url => ({ url }))
      setFileList(formatList)
      // 上述设置之后，数据回显没问题了，但是点解切换图片类型还是无法显示暂存内容
      // 【重点】把暂存内容设置为与fileList一样！
      cacheImg.current = formatList
    }
    // 只有存在id的时候才要发起请求拿到数据
    if (id) {
      loadArticle()
    }
  }, [id])

  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb separator='>'>
            <Breadcrumb.Item>
              <Link to='/'>首页</Link >
            </Breadcrumb.Item>
            <Breadcrumb.Item>{id ? '编辑' : '发布'}文章</Breadcrumb.Item>
          </Breadcrumb>
        }
      >
        <Form
          autoComplete='off'
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 1, content: 'this is content' }}
          onFinish={onFinish}
          ref={formRef}
        >
          <Form.Item label='标题' name='title' rules={[{ required: true, message: 'input title' }]}>
            <Input placeholder='请输入文章标题' style={{ width: 400 }} />
          </Form.Item>
          <Form.Item label='频道' name='channel_id' rules={[{ required: true, message: 'select channel' }]}>
            <Select
              placeholder='请选择文章频道'
              style={{ width: 400 }}
            >
              {channelsStore.channelsList.map(item => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group onChange={radioToggle}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            {imgCount > 0 && (
              <Upload
                name="image"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList
                fileList={fileList}
                action="http://geek.itheima.net/v1_0/upload"
                onChange={handleChange}
                maxCount={imgCount}
                multiple={imgCount > 1}
              >
                <div style={{ marginTop: 8 }}>
                  <PlusOutlined />
                </div>
              </Upload>
            )}
          </Form.Item>
          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: '请输入文章内容' }]}
          >
            <ReactQuill
              className="publish-quill"
              theme="snow"
              placeholder="请输入文章内容"></ReactQuill>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                {id ? '修改' : '发布'}文章
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default observer(Publish)