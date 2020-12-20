<template>
  <div>
    <bread-crumb :content="content"></bread-crumb>
    <el-card>
      <div id="main" style="width:1000px;height:500px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
import _ from 'loadsh'
export default {
  data() {
    return {
      // 面包屑数据
      content: [
        { content: '首页', path: { path: '/home' } },
        { content: '数据统计', path: '' },
        { content: '数据报表', path: '' }
      ],
      // 需要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },

  async mounted() {
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) return this.$Message.error('获取报表数据失败了')
    this.options = _.merge(res.data, this.options)
    let mycharts = echarts.init(document.getElementById('main'))
    mycharts.setOption(this.options)
  }
}
</script>

<style lang="less" scoped></style>
