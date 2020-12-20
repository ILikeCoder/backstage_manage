<template>
  <div>
    <!-- 面包屑 -->
    <bread-crumb :content="content"></bread-crumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格视图 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        class="tree-table"
        index-text="#"
        show-index
        border
      >
        <!-- 状态 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            type="primary"
            v-if="!scope.row.cat_deleted"
            style="color:lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success" size="mini">二级</el-tag>
          <el-tag v-else type="warning" size="mini">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="option" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editCate(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteCate(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页内容 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 7, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="50%" @close="closedDialog">
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <el-cascader
            v-model="selectdKeys"
            :options="parentCateList"
            :props="cascaderProps"
            expand-trigger="hover"
            @change="parentCateChanged"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改分类信息 -->
    <el-dialog
      title="修改分类信息"
      width="50%"
      :visible.sync="editDialogVisible"
      @close="editDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form :model="editCateForm" ref="editCateRef" label-width="80px">
        <el-form-item label="编辑名称:">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateInfo">修 改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 面包屑数据
      content: [
        { content: '首页', path: { path: '/home' } },
        { content: '商品管理', path: '' },
        { content: '商品分类', path: '' }
      ],
      // 请求参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 树形图数据源
      cateList: [],
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'option'
        }
      ],
      //控制对话框
      dialogVisible: false,

      // 表单数据源
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      //添加分类的验证规则
      addCateFormRules: {
        cat_name: [
          {
            required: true,
            message: `请输入分类名称`,
            trigger: 'blur'
          }
        ]
      },
      // 父分类列表
      parentCateList: [],

      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectdKeys: [],
      valid: false,
      editDialogVisible: false,
      editCateForm: {
        cat_name: ''
      },
      currentId: ''
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })

      if (res.meta.status !== 200) return this.$Message.error('获取商品数据失败')

      this.cateList = res.data.result
      this.total = res.data.total
    },
    //处理页数的变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    //处理分页当前的改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    //打开对话框的方法
    showAddCateDialog() {
      //获取父分类列表的数据
      this.getParentCateList()
      this.dialogVisible = true
    },
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: {
          type: 2
        }
      })
      if (res.meta.status !== 200) return this.$Message.error('获取分类数据失败')

      this.parentCateList = res.data
    },
    // 级联选择器发生变化触发
    parentCateChanged() {
      if (this.selectdKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectdKeys[this.selectdKeys.length - 1]
        this.addCateForm.cat_level = this.selectdKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 添加分类
    async addCate() {
      this.$refs.addCateFormRef.validate(valid => (this.valid = valid))
      if (!this.valid) return
      const { data: res } = await this.$http.post('categories', this.addCateForm)
      if (res.meta.status !== 201) {
        return this.$Message.error('添加失败')
      }
      this.$Message.success('添加成功了!')
      this.getCateList()
      this.dialogVisible = false
    },
    //关闭对话框  重置表单数据
    closedDialog() {
      this.selectdKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
      this.$refs.addCateFormRef.resetFields()
    },
    //删除当前分类
    async deleteCate(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      //如果删除了返回字符串 confirm 否则 cancel
      if (confirmResult !== 'confirm') return this.$Message.info('已取消删除')
      const { data: res } = await this.$http.delete('categories/' + id)
      if (res.meta.status !== 200) return this.$Message.error('删除失败了！')
      this.$Message.success('删除成功')
      // 刷新分类列表
      this.getCateList()
    },

    // 编辑分类按钮是
    editCate(id) {
      this.currentId = id
      this.editDialogVisible = true
    },
    // 编辑分类对话框
    async editCateInfo() {
      const { data: res } = await this.$http.put('categories/' + this.currentId, {
        cat_name: this.editCateForm.cat_name
      })
      if (res.meta.status !== 200) return this.$Message.error('修改失败了！')
      this.$Message.success('修改成功~')
      this.getCateList()
      this.editDialogVisible = false
    },
    // 关闭对话框重置表单
    editDialogClosed() {
      this.$refs.editCateRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.tree-table {
  margin-top: 20px;
}
.el-cascader {
  width: 100%;
}
</style>
