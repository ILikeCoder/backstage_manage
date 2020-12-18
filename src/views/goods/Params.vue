<template>
  <div>
    <!-- 面包屑区域 -->
    <bread-crumb :content="content"></bread-crumb>
    <el-card>
      <!-- 警告提示 -->
      <el-alert
        :closable="true"
        title="注意:只允许为第三级分类设置相关参数!"
        type="warning"
        show-icon
      >
      </el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>请选择商品分类:</span>
          <el-cascader
            :options="cateList"
            :props="cateProps"
            v-model="selectdCateKeys"
            @change="handleChange"
          >
          </el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            @click="addDialogVisible = true"
            :disabled="isDisabled"
          >
            添加参数
          </el-button>
          <!-- 动态参数的表格 -->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <!-- 循环Tag标签 -->
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="item"
                  closable
                  @close="handleClose(index, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 添加新的标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  class="el-icon-edit"
                  size="mini"
                  @click="editAttr(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  class="el-icon-delete"
                  size="mini"
                  @click="deleteAttr(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            @click="addDialogVisible = true"
            :disabled="isDisabled"
          >
            添加参数
          </el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <!-- 循环Tag标签 -->
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="item"
                  closable
                  @close="handleClose(index, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 添加新的标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  class="el-icon-edit"
                  size="mini"
                  @click="editAttr(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  class="el-icon-delete"
                  size="mini"
                  @click="deleteAttr(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog
      :title="titleText"
      :visible.sync="addDialogVisible"
      @close="closedDialog"
      width="50%"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText | filterText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAttributies">添 加</el-button>
      </span>
    </el-dialog>

    <!-- 编辑参数对话框 -->
    <el-dialog
      title="编辑参数"
      :visible.sync="editAttrDialogVisible"
      width="50%"
    >
      <el-form :model="addForm" label-width="100px">
        <el-form-item label="参数名称:">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAttrDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotEditAttr">确 定</el-button>
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
        { content: '参数列表', path: '' }
      ],
      // 分类数据列表
      cateList: [],
      // 级联选择框配置对象
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 级联选择框双向绑定的数据
      selectdCateKeys: [],
      activeName: 'many',
      onlyTableData: [],
      manyTableData: [],
      addDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入参数名称'
          }
        ]
      },
      valid: false,
      editAttrDialogVisible: false,
      currentId: ''
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //获取所有商品的分类
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200)
        return this.$Message.error('获取商品分类数据失败')
      this.cateList = res.data
    },
    handleChange() {
      this.getParamsData()
    },
    // tab页签点击事件处理函数
    handleTabClick() {
      this.getParamsData()
    },
    async getParamsData() {
      if (this.selectdCateKeys.length !== 3) {
        this.selectdCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: this.activeName
          }
        }
      )
      if (res.meta.status !== 200)
        return this.$Message.error('当前分类没有参数')

      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      console.log(res.data)
      if (this.activeName === 'many') this.manyTableData = res.data
      if (this.activeName === 'only') this.onlyTableData = res.data
    },
    closedDialog() {
      this.$refs.addFormRef.resetFields()
    },
    async addAttributies() {
      const { attr_name } = this.addForm
      this.$refs.addFormRef.validate(valid => (this.valid = valid))
      if (!this.valid) return
      const { data: res } = await this.$http.post(
        `categories/${this.cateId}/attributes`,
        {
          attr_name,
          attr_sel: this.activeName
        }
      )

      if (res.meta.status !== 201) return this.$Message.error('添加参数失败')
      this.$Message.success('添加参数成功')
      console.log(res.data)
      this.addDialogVisible = false
      this.getParamsData()
    },
    async editAttr(id) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${id}`
      )
      if (res.meta.status !== 200) return this.$Message.error('查询id失败')
      this.addForm = res.data
      this.currentId = id
      this.editAttrDialogVisible = true
    },
    async allotEditAttr() {
      const { attr_name } = this.addForm
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${this.currentId}`,
        {
          attr_name,
          attr_sel: this.activeName
        }
      )
      if (res.meta.status !== 200) return this.$Message.error('编辑参数失败')

      this.$Message.success('编辑参数成功')
      this.getParamsData()
      this.editAttrDialogVisible = false
    },
    async deleteAttr(attr_id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') return this.$Message.info('已取消删除')
      //发起删除用户信息的请求
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      )
      if (res.meta.status !== 200) return this.$Message.error('请求删除失败')
      this.$Message.success('删除成功')
      //删除权限时刷新小权限
      this.getParamsData()
    },
    // 输入框失去焦点或按下了enter键都会触发
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) return this.$Message.error('更新失败')
      console.log(res)
      this.$Message.success('添加成功')
    },
    // 点击了New Tag
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async handleClose(index, row) {
      row.attr_vals.splice(index, 1)

      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) return this.$Message.error('更新失败')
      console.log(res)
      this.$Message.success('删除成功')
    }
  },
  computed: {
    // 控制按钮的禁用状态
    isDisabled() {
      return this.selectdCateKeys.length !== 3
    },
    // 获得级联选择框的id值
    cateId() {
      const value = this.selectdCateKeys
      if (this.selectdCateKeys.length !== 3) return false
      return this.selectdCateKeys[this.selectdCateKeys.length - 1]
    },
    titleText() {
      return this.activeName === 'many' ? '添加动态参数:' : '添加静态参数:'
    }
  },
  // 过滤器
  filters: {
    filterText(value) {
      return value.slice(2)
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0px;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 100px;
}
</style>
