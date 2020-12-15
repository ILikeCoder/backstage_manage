<template>
  <div>
    <!-- 面包屑 -->
    <bread-crumb :content="content"></bread-crumb>

    <!-- 卡片视图 -->
    <el-card>
      <!--添加角色区域  -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRole">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 权限列表 -->
      <el-table :data="rolesList" border stripe>
        <!-- 下拉菜单 -->
        <el-table-column type="expand">
          <template v-slot="scoped">
            <el-row
              v-for="(item, index) in scoped.row.children"
              :class="['bdbuttom', index === 0 ? 'bdtop' : '', 'vcenter']"
              :key="item.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="romveRightById(scoped.row, item.id)">{{
                  item.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(item2, index2) in item.children"
                  :key="item2.id"
                  :class="(index2 === 0 ? '' : 'bdtop', 'vcenter')"
                >
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="romveRightById(scoped.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 三级权限 -->
                    <el-tag
                      type="warning"
                      v-for="(item3, index3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="romveRightById(scoped.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scoped">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editRole(scoped.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteRole(scoped.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scoped.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="权限分配"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="closedRole"
    >
      <el-form :model="roleForm" label-width="70px">
        <el-form-item label="角色名称">
          <el-input v-model="roleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelRole">取 消</el-button>
        <el-button type="primary" @click="allotRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRoleDialogVisible"
      width="50%"
    >
      <el-form :model="editForm" label-width="70px">
        <el-form-item label="角色名称">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEditRole">取 消</el-button>
        <el-button type="primary" @click="allotEditRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //面包屑数据
      content: [
        { content: '首页', path: { path: '/home' } },
        { content: '权限管理', path: '' },
        { content: '角色列表', path: '' }
      ],
      //获取权限列表
      rolesList: [],
      //控制权限分配对话框的显示
      setRightDialogVisible: false,
      // 所有权限数据列表
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      //默认选中的节点
      defKeys: [],
      roleId: '',
      setRoleDialogVisible: false,
      roleForm: {
        roleName: '',
        roleDesc: ''
      },
      //编辑角色表单
      editForm: {
        roleName: '',
        roleDesc: ''
      },
      editRoleDialogVisible: false
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色信息列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')

      if (res.meta.status !== 200) {
        this.$Message.error('获取角色列表失败')
      }
      this.rolesList = res.data
    },
    //处理删除权限的操作
    async romveRightById(role, rightId) {
      //弹框提示删除
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
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) return this.$Message.error('请求删除失败')
      this.$Message.success('删除成功')
      // this.getRolesList()

      role.children = res.data
    },
    //展示分配权限对话框
    async showSetRightDialog(role) {
      // 保存当前角色的id
      this.roleId = role.id
      //获取所有权限列表
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200)
        return this.$Message.error('获取用户权限数据失败！')
      this.rightsList = res.data

      //递归获取3级节点的id
      this.getLeafKeys(role, this.defKeys)
      //弹出对话框
      this.setRightDialogVisible = true
    },
    /** 通过递归的形式获取角色下的三级权限
     * 并保存在defKeys数组中
     */
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    //关闭对话框重置数组默认选项
    setRightDialogClosed() {
      this.defKeys = []
    },
    //点击为角色分配权限
    async allotRights() {
      const { treeRef } = this.$refs
      //获取选中的权限
      const keys = [
        ...treeRef.getCheckedKeys(),
        ...treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {
          rids: idStr
        }
      )
      if (res.meta.status !== 200)
        return this.$Message.error('分配角色权限失败了')
      this.$Message.success('分配权限操作完成')
      this.getRolesList()

      this.setRightDialogVisible = false
    },

    //添加角色功能
    addRole() {
      this.setRoleDialogVisible = true
    },
    //添加用户时确定，发送网络请求并添加到页面中
    async allotRole() {
      const { roleName, roleDesc } = this.roleForm
      const { data: res } = await this.$http.post('roles', {
        roleName,
        roleDesc
      })
      if (res.meta.status !== 201) return this.$Message.error('创建角色失败')
      this.$Message.success('添加角色成功')
      this.getRolesList()
      this.setRoleDialogVisible = false
    },
    //取消添加角色对话框
    cancelRole() {
      this.setRoleDialogVisible = false
      this.$Message.info('取消了添加角色')
    },
    //对话框关闭时重置表单
    closedRole() {
      this.roleForm = {
        roleName: '',
        roleDesc: ''
      }
    },
    //编辑功能
    editRole(id) {
      this.roleId = id
      this.editRoleDialogVisible = true
    },
    cancelEditRole() {
      this.$Message.info('取消了编辑角色')
      this.editRoleDialogVisible = false
    },
    async allotEditRole() {
      const { roleName, roleDesc } = this.editForm
      const { data: res } = await this.$http.put('roles/' + this.roleId, {
        roleName,
        roleDesc
      })
      if (res.meta.status !== 200)
        return this.$Message.error('修改角色信息失败')
      this.$Message.success('修改角色信息完成')
      this.getRolesList()
      this.editRoleDialogVisible = false
    },

    async deleteRole(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') return this.$Message.info('已经取消删除')

      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$Message.error('删除失败')

      this.$Message.success('删除角色成功')
      this.getRolesList()
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbuttom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
