<template>
  <div>
    <!-- 面包屑 -->
    <bread-crumb :content="content" />
    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template v-slot="scoped">
            <el-tag size="mini" v-if="scoped.row.level === '0'">一级</el-tag>
            <el-tag
              size="mini"
              type="success"
              v-else-if="scoped.row.level === '1'"
              >二级</el-tag
            >
            <el-tag size="mini" type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: [
        { content: '首页', path: { path: '/home' } },
        { content: '权限管理', path: '' },
        { content: '权限列表', path: '' }
      ],
      // 保存所有的权限
      rightsList: []
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    // 获取所有权限
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      this.rightsList = res.data
    }
  }
}
</script>

<style lang="less" scoped></style>
