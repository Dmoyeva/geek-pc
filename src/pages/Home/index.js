import Bar from '@/components/Bar'
function Home() {
  return (
    <div>
      <Bar
        title='chart demo'
        xData={['猪', '牛', '羊', '马', '兔']}
        yData={[20, 30, 40, 50, 50]}
        style={{ width: '500px', height: '400px' }}
      />
      <Bar
        title='test demo'
        xData={['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']}
        yData={[5, 20, 36, 10, 10, 20]}
        style={{ width: '600px', height: '240px' }}
      />
    </div>
  )
}

export default Home