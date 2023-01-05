import { Link, useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Card, Breadcrumb, Form, Button, Radio, DatePicker, Select, Table, Space, Tag, Popconfirm }
  from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import img404 from '@/assets/error.png'
import 'dayjs/locale/zh-cn'
import locale from 'antd/es/date-picker/locale/zh_CN'
import './index.scss'
import { useEffect, useState } from 'react'
import { http } from '@/utils'
import { useStore } from '@/store'

const { Option } = Select
const { RangePicker } = DatePicker

function Article() {
  // 获取频道列表
  // const [channels, setChannels] = useState([])
  const { channelsStore } = useStore()
  // useEffect(() => {
  //   channelsStore.getChannels()
  //   // async function fetchChannels() {
  //   //   const res = await http.get('/channels')
  //   //   setChannels(res.data.channels)
  //   // }
  //   // fetchChannels()
  // }, [channelsStore])
  // 渲染表格区域
  const [article, setArticle] = useState({
    list: [],
    count: 0
  })
  const [params, setParams] = useState({
    page: 1,
    per_page: 2
  })
  useEffect(() => {
    async function getArticleList() {
      const res = await http.get('/mp/articles', { params })
      const { results, total_count } = res.data
      setArticle({
        list: results,
        count: total_count
      })
    }
    getArticleList()
  }, [params])
  const columns = [
    {
      title: '封面',
      dataIndex: 'cover',
      width: 120,
      render: cover => {
        return <img src={cover.images[0] || img404} width={80} height={60} alt="" />
      }
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 220
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: data => <Tag color="green">审核通过</Tag>
    },
    {
      title: '发布时间',
      dataIndex: 'pubdate'
    },
    {
      title: '阅读数',
      dataIndex: 'read_count'
    },
    {
      title: '评论数',
      dataIndex: 'comment_count'
    },
    {
      title: '点赞数',
      dataIndex: 'like_count'
    },
    {
      title: '操作',
      render: data => {
        return (
          <Space size="middle">
            <Button type="primary" shape="circle" onClick={() => goEdit(data)} icon={<EditOutlined />} />
            <Popconfirm
              title='Delete confirmation'
              description="Are you sure to delete this article?"
              onConfirm={() => removeArticle(data)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="primary"
                danger
                shape="circle"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Space>
        )
      }
    }
  ]
  // 筛选功能实现==>本质就是更新发起请求的参数
  function onfinish(values) {
    const { channel_id, date, status } = values
    const newParams = {}
    if (status !== -1) newParams.status = status
    if (channel_id) newParams.channel_id = channel_id
    if (date) {
      newParams.begin_pubdate = date[0].format('YYYY-MM-DD')
      newParams.end_pubdate = date[1].format('YYYY-MM-DD')
    }
    setParams({
      ...params,
      ...newParams
    })
  }
  // 翻页功能实现==>本质就是更新发起请求的页码
  function pageChange(page) {
    setParams({
      page
    })
  }
  // 删除文章
  async function removeArticle(data) {
    await http.delete(`/mp/articles/${data.id}`)
    setParams({
      page: 1,
      ...params
    })
  }
  // 编辑按钮跳转
  const navigate = useNavigate()
  function goEdit(data) {
    navigate(`/publish?id=${data.id}`)
  }
  return (
    <div>
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>内容管理</Breadcrumb.Item>
          </Breadcrumb>
        }
        style={{ marginBottom: 20 }}
      >
        <Form initialValues={{ status: -1 }} onFinish={onfinish}>
          <Form.Item label="状态" name="status">
            <Radio.Group>
              <Radio value={-1}>全部</Radio>
              <Radio value={0}>草稿</Radio>
              <Radio value={1}>待审核</Radio>
              <Radio value={2}>审核通过</Radio>
              <Radio value={3}>审核失败</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="频道" name="channel_id">
            <Select
              placeholder="请选择文章频道"
              style={{ width: 120 }}
            >
              {channelsStore.channelsList.map(item => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="日期" name="date">
            {/* 传入locale属性 控制中文显示*/}
            <RangePicker locale={locale}></RangePicker>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 80 }}>
              筛选
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <div>
        <Card title={`根据筛选条件共查询到${article.count}条结果：`}>
          <Table rowKey="id" pagination={{ total: article.count, pageSize: params.per_page }} onChange={pageChange} columns={columns} dataSource={article.list} />
        </Card>
      </div>
    </div>
  )
}

export default observer(Article)