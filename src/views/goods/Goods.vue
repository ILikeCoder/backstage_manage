<template>
  <div>
    <bread-crumb :content="content"></bread-crumb>
    <el-card>
      <!-- 顶部搜索框区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索框区域 -->
          <el-input
            clearable
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!-- 添加用户功能 点击的时候弹出对话框 -->
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品数据表格 -->
      <el-table border stripe highlight-current-row :data="goodsList">
        <el-table-column label="#" content type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="120px">
          <template v-slot="scope">
            {{ '￥' + scope.row.goods_price }}
          </template>
        </el-table-column>
        <el-table-column
          label="商品总量"
          prop="goods_weight"
          width="120px"
        ></el-table-column>
        <el-table-column label="创建时间" width="180px">
          <template v-slot="scope">
            {{ time(scope) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(scope.row)"
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
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryInfo.pagesize"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: [
        { content: '首页', path: { path: '/home' } },
        { content: '商品管理', path: '' },
        { content: '商品列表', path: '' }
      ],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 20
      },
      // 商品列表数据
      goodsList: [],
      //数据总条数
      total: 0,
      inputGoods: ''
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 获取商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200)
        return this.$Message.error('获取商品数据失败')
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    time(scope) {
      let timeFormat = this.$options.filters['dateFormat']
      return timeFormat(scope.row.add_time * 1050)
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    async removeById(row) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      //如果删除了返回字符串 confirm 否则 cancel
      if (confirmResult !== 'confirm') return this.$Message.info('已取消删除')
      //发起删除用户信息的请求
      const { data: res } = await this.$http.delete('goods/' + row.goods_id)
      if (res.meta.status !== 200) return this.$Message.error('请求删除失败')
      this.$Message.success('删除成功')
      // 删除成功刷新列表
      this.getGoodsList()
    },
    goAddpage(){
      this.$router.push('/goods/add')
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
