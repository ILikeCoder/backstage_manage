<template>
  <div>
    <bread-crumb :content="content"></bread-crumb>

    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-table :data="orderList" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款">
          <template v-slot="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间">
          <template v-slot="scope">
            {{ time(scope) }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showBox"
            ></el-button>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-location"
              @click="showProgressBox"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      @close="closedDialog"
      width="50%"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false"
          >添 加</el-button
        >
      </span>
    </el-dialog>

    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :icon="activity.icon"
          :type="activity.type"
          :color="activity.color"
          :size="activity.size"
          :timestamp="activity.timestamp"
        >
          {{ activity.content }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  data() {
    return {
      content: [
        { content: '首页', path: { path: '/home' } },
        { content: '订单管理', path: '' },
        { content: '订单列表', path: '' }
      ],
      queryInfo: {
        query: '',
        pagesize: 1,
        pagenum: 10
      },
      orderList: [],
      total: 0,
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [
          {
            required: true,
            message: '请选择省市区县',
            trigger: 'blur'
          }
        ],
        address2: [
          {
            required: true,
            message: '请填写详细地址',
            trigger: 'blur'
          }
        ]
      },
      cityData,
      progressVisible: false,
      progressInfo: [],
      activities: [
        {
          content: '支持使用图标',
          timestamp: '2018-04-12 20:46',
          size: 'large',
          type: 'primary',
          icon: 'el-icon-more'
        },
        {
          content: '支持自定义颜色',
          timestamp: '2018-04-03 20:46',
          color: '#0bbd87'
        },
        {
          content: '支持自定义尺寸',
          timestamp: '2018-04-03 20:46',
          size: 'large'
        },
        {
          content: '默认样式的节点',
          timestamp: '2018-04-03 20:46'
        }
      ]
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })

      if (res.meta.status !== 200)
        return this.$Message.error('获取订单数据失败了')
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    time(scope) {
      let timeFormat = this.$options.filters['dateFormat']
      return timeFormat(scope.row.create_time * 1050)
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getOrderList()
    },
    showBox() {
      this.addressVisible = true
    },

    // 物流模块
    async showProgressBox() {
      // const { data: res } = await this.$http.get(`/kuaidi/80490957441244580`)
      // if (res.meta.status !== 200)
      //   return this.$message.error('获取物流信息失败')
      // this.progressInfo = res.data
      // console.log(this.progressInfo)
      // this.progressVisible = true
    },
    closedDialog() {
      this.$refs.addressFormRef.resetFields()
    }
  },
  filters: {
    dateFormat(originVal) {
      const dt = new Date(originVal)
      const y = dt.getFullYear()
      const m = (dt.getMonth() + 1 + '').padStart(2, '0')
      const d = (dt.getDate() + '').padStart(2, '0')
      const hh = (dt.getHours() + '').padStart(2, '0')
      const mm = (dt.getMinutes() + '').padStart(2, '0')
      const ss = (dt.getSeconds() + '').padStart(2, '0')
      return `${y}-${m}-${d}-${hh}:${mm}:${ss}`
    }
  }
}
</script>

<style lang="less" scoped></style>
