import * as echarts from 'echarts'
import { useRef, useEffect } from 'react'
function Bar({ title, xData, yData, style }) {
  const barRef = useRef(null)
  useEffect(() => {
    const myChart = echarts.init(barRef.current)
    myChart.setOption({
      title: {
        text: title
      },
      tooltip: {},
      xAxis: {
        data: xData
      },
      yAxis: {},
      series: [
        {
          name: '数量',
          type: 'bar',
          data: yData
        }
      ]
    })
  }, [title, xData, yData])
  return (
    <div>
      <div ref={barRef} style={style}></div>
    </div>
  )
}

export default Bar