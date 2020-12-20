<template>
  <div>
    <!--  面包屑  -->
    <bread-crumb :content="content"></bread-crumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加商品的警告条 -->
      <el-alert title="添加商品信息" center type="info" show-icon closeble></el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品照片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 表单区域  model 数据源 rules表单验证 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <!-- 竖直标签页 -->
        <el-tabs
          v-model="activeIndex"
          tab-position="left"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <!-- 第一个标签页 -->
          <el-tab-pane label="商品信息" name="0">
            <!-- input输入框 prop表单验证规则 -->
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 级联选择框 -->
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 第二个标签页 -->
          <el-tab-pane label="商品参数" name="1">
            <!-- 通过表单循环多项复选框 -->
            <el-form-item
              :label="item.attr_name"
              :key="item.attr_id"
              v-for="(item, index) in manyTableData"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="cb" :key="i" v-for="(cb, i) in item.attr_vals">
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 第三个标签页 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" :key="item.attr_id" v-for="item in onlyTableData">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 第四个标签页 -->
          <el-tab-pane label="商品图片" name="3">
            <!-- 上传图片组件 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <!-- 富文本编辑器 -->
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="addBtn" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog title="提示" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
// 导入工具库loadsh
import _ from 'loadsh'
export default {
  data() {
    return {
      // 面包屑数据区
      content: [
        { content: '首页', path: { path: '/home' } },
        { content: '商品管理', path: '' },
        { content: '商品添加', path: '' }
      ],
      // 控制tabs步骤条
      activeIndex: '0',
      // 添加商品的表单数据
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      // 商品表单的验证规则
      addFormRules: {
        goods_name: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入商品名称'
          }
        ],
        goods_price: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入商品价格'
          }
        ],
        goods_weight: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入商品重量'
          }
        ],
        goods_number: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入商品数量'
          }
        ],
        goods_cat: [
          {
            required: true,
            trigger: 'blur',
            message: '请选择商品分类'
          }
        ]
      },
      //
      cateList: [],

      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 动态参数的数据
      manyTableData: [],
      // 静态属性的数据
      onlyTableData: [],
      // 图片上传的url
      uploadURL: '',
      // 上传图片时携带的token
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 预览图的路径
      previewPath: '',
      // 控制预览框的显示与隐藏
      previewVisible: false,
      // 表单是否验证通过
      valid: false
    }
  },
  created() {
    // 获取分类商品的数据
    this.getCateList()
    this.uploadURL = this.$http.defaults.baseURL + 'upload'
  },
  methods: {
    // 获取分类商品的数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$Message.error('获取分类数据失败')
      this.cateList = res.data
    },
    // 级联选择框的控制
    handleChange() {
      // 如果选中的分类不是三级目录就清空
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // 在竖直标签页跳转之前 看级联选择框是否为空 为空则不跳转
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$Message.info('请先选择商品分类')
        return false
      }
    },
    // tabs标签页跳转是请求对应的数据
    async tabClicked() {
      if (this.activeIndex === '1') {
        // 请求动态参数的数据
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: {
            sel: 'many'
          }
        })
        if (res.meta.status !== 200) return this.$Message.error('获取动态参数失败！')
        // 将请求的动态参数的数据处理在返回 数组每一项空格分隔
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length !== 0 ? item.attr_vals.split(' ') : []
        })
        // 将动态参数的数据赋值
        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        // 请求静态属性的数据
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: {
            sel: 'only'
          }
        })
        if (res.meta.status !== 200) return this.$Message.error('获取静态属性失败！')
        // 将静态属性的数据赋值
        this.onlyTableData = res.data
      }
    },
    // 在点击图片预览时 给预览框的图片路径赋值 并打开预览框
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    // 移除图片时执行的操作
    handleRemove(file) {
      const filePath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex(item => x.pic === filePath)
      this.addForm.pics.splice(i, 1)
    },
    // 将图片添加到数据表单中
    handleSuccess(response) {
      const picInfo = {
        pic: response.data.tmp_path
      }
      this.addForm.pics.push(picInfo)
    },
    // 添加商品函数
    async addGoods() {
      this.$refs.addFormRef.validate(valid => {
        this.valid = valid
      })
      // 提交商品前预校验表单是否正确
      if (!this.valid) return this.$Message.error('请填写必要的表单项！')
      // 深度克隆函数
      const form = _.cloneDeep(this.addForm)
      // 将数组以,分隔为一个字符串
      form.goods_cat = form.goods_cat.join(',')
      // 动态数据处理
      this.manyTableData.forEach(item => {
        const newInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join(' ')
        }
        this.addForm.attrs.push(newInfo)
      })
      // 静态数据处理
      this.onlyTableData.forEach(item => {
        const newInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals
        }
        this.addForm.attrs.push(newInfo)
      })

      // 发送添加商品的请求
      const { data: res } = await this.$http.post('goods', form)
      if (res.meta.status !== 201) return this.$Message.error('添加商品数据失败')
      this.$Message.success('添加商品成功!')
      // 编程式路由跳转
      this.$router.push('/goods')
    }
  },
  // 计算属性
  computed: {
    // 取到分类的最后一个数组索引为ID返回
    cateId() {
      let len = this.addForm.goods_cat.length
      return len === 3 ? this.addForm.goods_cat[len - 1] : null
    }
  }
}
</script>
<style lang="less" scoped>
.el-checkbox {
  margin-right: 10px !important;
}
.previewImg {
  width: 100%;
}
.addBtn {
  margin-top: 15px;
}
</style>
