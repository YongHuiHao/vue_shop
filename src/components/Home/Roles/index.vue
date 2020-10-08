<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-row>
          <el-button type="primary">添加角色</el-button>
        </el-row>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template v-slot="scope">
            <!-- 权限一级列表渲染 -->
            <el-row
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'vcenter']"
            >
              <!-- 一级权限列表 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限列表 -->
              <el-col :span="19">
                <!-- 渲染二级权限列表 -->
                <el-row
                  :class="[index2 !== 0 ? 'bdtop' : '', 'vcenter']"
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                >
                  <!-- 二级权限列表标签 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 三级权限列表 -->
                    <el-tag
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button size="mini" class="el-icon-edit" type="primary"
              >编辑</el-button
            >
            <el-button size="mini" class="el-icon-delete" type="danger"
              >删除</el-button
            >
            <el-button
              size="mini"
              @click="showSetRightDialog(scope.row)"
              class="el-icon-s-tools"
              type="warning"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="allotDialogClosed"
    >
      <!-- 树形控件区域 -->
      <el-tree
        :data="rightsTree"
        :props="treeProps"
        default-expand-all
        show-checkbox
        node-key="id"
        ref="treeRef"
        :default-checked-keys="defKeys"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data () {
    return {
      // 角色列表数据
      rolesList: [],
      // 树状权限列表数据
      rightsTree: [],
      // 分配权限对话框显示隐藏属性
      setRightDialogVisible: false,
      // 树形控件属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中节点数组
      defKeys: [],
      // 当前点击角色id
      roleId: ''
    }
  },
  mounted () {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表
    async getRolesList () {
      try {
        const result = await this.$API.reqRolesList()
        this.rolesList = result.data
        console.log(this.rolesList)
      } catch (error) {
        this.$message.error('获取角色列表失败')
        console.log(error)
      }
    },
    // 根据id移除对应权限
    async removeRightById (role, rightId) {
      // 点击移除按钮弹出对话框
      await this.$confirm('此操作将永久移除该权限,是否继续?', {
        title: '提示',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        this.$message.info('已取消移除')
      })
      try {
        // 调用接口，删除对应权限
        const result = await this.$API.reqRemoveRightById(role.id, rightId)
        this.$message.success('移除权限成功')
        // 将移除后的数据重新赋值给该角色
        role.children = result.data
      } catch (error) {
        this.$message.error('权限移除失败')
        console.log(error)
      }
    },
    // 展示权限列表分配对话框
    async showSetRightDialog (role) {
      this.roleId = role.id
      try {
        // 调用接口，获取权限数据
        const result = await this.$API.reqRightsList('tree')
        this.rightsTree = result.data
      } catch (error) {
        this.$message.error('获取权限列表失败')
        console.log(error)
      }
      // 获取当前点击角色的所有权限id
      this.getLeatKeys(role, this.defKeys)
      console.log(this.defKeys)
      this.setRightDialogVisible = true
    },
    // 获取所有三级权限id,并保存到defKeys数组中
    getLeatKeys (node, arr) {
      // 如果当前节点没有children属性
      if (!node.children) {
        return arr.push(node.id)
      }
      // 否则遍历children数组
      node.children.forEach(item => {
        this.getLeatKeys(item, arr)
      })
    },
    // 分配角色权限
    async allotRights () {
      // 用来保存所有已选中和半选中节点的id
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const rids = keys.join(',')
      try {
        // 调用接口
        await this.$API.reqAllotRights(this.roleId, rids)
        this.$message.success('分配角色权限成功')
        // 重新获取数据
        this.getRolesList()
      } catch (error) {
        this.$message.error('分配角色权限失败')
        console.log(error)
      }
      // 对话框隐藏
      this.setRightDialogVisible = false
    },
    // 监听分配权限对话框关闭事件
    allotDialogClosed () {
      this.defKeys = []
      this.roleId = ''
    }
  }
}
</script>

<style lang='less' rel='stylesheet/less' scoped>
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.el-tag {
  margin: 7px;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
