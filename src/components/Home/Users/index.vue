<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="20">
        <!-- 输入框 -->
        <el-col :span="8">
          <el-input
            clearable
            @clear="getUserList"
            placeholder="请输入内容"
            v-model="userInfo.query"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addDialogFormVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="userList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStatusChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-tooltip
              effect="dark"
              content="修改信息"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="删除用户"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteUser(scope.row.id)"
              ></el-button>
            </el-tooltip>

            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-s-tools"
                size="mini"
                @click="ShowAllotRoleDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userInfo.pagenum"
        :page-sizes="[userInfo.pagesize, 4]"
        :page-size="userInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框区域 -->
    <el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
      <el-form
        :model="addForm"
        status-icon
        :rules="formRules"
        ref="ruleFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户对话框区域 -->
    <el-dialog title="修改用户信息" :visible.sync="editDialogVisible">
      <el-form
        ref="editFormRef"
        :model="editInfo"
        label-width="80px"
        status-icon
        :rules="formRules"
      >
        <el-form-item label="用户名">
          <el-input v-model="editInfo.username" :disabled="true"> </el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editInfo.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="cancelEdit">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="allotRoleDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <div>
        <p>当前的用户：{{ currentUserInfo.username }}</p>
        <p>当前的角色：{{ currentUserInfo.role_name }}</p>
        <p>
          分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="allotRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'User',
  data () {
    const validateEmail = (rule, value, callback) => {
      // 验证邮箱的正则
      const emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (value === '') {
        callback(new Error('请输入邮箱'))
      } else if (!emailReg.test(value)) {
        callback(new Error('请输入正确的邮箱'))
      } else {
        callback()
      }
    }
    const validateMobile = (rule, value, callback) => {
      // 验证手机号的正则
      const mobileReg = /^1[3456789]\d{9}$/
      if (value === '') {
        callback(new Error('请输入手机号码'))
      } else if (!mobileReg.test(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }
    return {
      // 获取用户列表参数
      userInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      total: 0,
      // 用户数据列表
      userList: [],
      // 角色列表
      roleList: [],
      // 当前选择用户信息
      currentUserInfo: {},
      // 当前选择的角色id,
      selectedRoleId: '',
      // 搜索关键字
      keyword: '',
      // 添加用户对话框的显示与隐藏
      addDialogFormVisible: false,
      // 修改用户信息对话框显示与隐藏
      editDialogVisible: false,
      // 分配角色对话框显示隐藏
      allotRoleDialogVisible: false,
      // 添加用户数据
      addForm: {
        username: 'admin@333',
        password: '123456',
        email: '1556021501@qq.com',
        mobile: '18702608903'
      },
      // 修改用户信息数据
      editInfo: {},
      // 表单验证规则
      formRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [{ required: true, validator: validateEmail, trigger: 'blur' }],
        mobile: [{ required: true, validator: validateMobile, trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 调用接口获取用户数据列表
    async getUserList () {
      try {
        const result = await this.$API.reqUserList(this.userInfo)
        if (result.meta.status === 200) {
          this.userList = result.data.users
          this.total = result.data.total
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 改变每页显示几条数
    handleSizeChange (pagesize) {
      // 改变pagesize
      this.userInfo.pagesize = pagesize
      // 重新获取数据
      this.getUserList()
    },
    // 切换页
    handleCurrentChange (page) {
      // 改变pagenum
      this.userInfo.pagenum = page
      // 重新获取数据
      this.getUserList()
    },
    // 修改用户状态
    async userStatusChange (user) {
      const { mg_state, id } = user
      try {
        const result = await this.$API.reqUserStatusChange(id, mg_state)
        this.$message.success('修改用户状态数据成功!')
      } catch (error) {
        user.mg_state = !user.mg_state
        this.$message.error('修改用户状态数据失败：' + error)
      }
    },
    // 添加用户
    addUser () {
      // 表单的预校验
      this.$refs.ruleFormRef.validate(async valid => {
        // 如果校验不通过，则直接返回
        if (!valid) return
        // 调用接口，添加用户数据
        try {
          const result = await this.$API.reqAddUser(this.addForm)
          this.$message.success('添加用户成功')
        } catch (error) {
          console.log(error)
          this.$message.error('添加用户失败')
        }
        // 表单隐藏
        this.addDialogFormVisible = false
      })

    },
    // 修改用户信息对话框显示方法
    async showEditDialog (id) {
      // 界面显示
      this.editDialogVisible = true
      try {
        // 调用接口，获取对应id数据
        const result = await this.$API.reqUserInfoById(id)
        // 将获取的数据赋值给修改对象
        this.editInfo = result.data
      } catch (error) {
        this.$message.error('获取用户数据失败')
        console.log(error)
      }
    },
    // 取消修改用户信息
    cancelEdit () {
      // 移除表单校验结果
      this.$refs.editFormRef.clearValidate()
      // 隐藏修改用户数据界面
      this.editDialogVisible = false
    },
    // 修改用户信息
    editUserInfo () {
      // 表单预校验
      this.$refs.editFormRef.validate(async valid => {
        const { id, mobile, email } = this.editInfo
        if (valid) {
          // 调用接口
          try {
            await this.$API.reqEditUserInfo(id, { mobile, email })
            // 重新获取数据
            this.getUserList()
            this.$message.success('修改用户信息成功')
          } catch (error) {
            this.$message.error('修改用户数据失败')
            console.log(error)
          }
        }
      })
      this.editDialogVisible = false
    },
    // 删除用户数据
    async deleteUser (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户,是否继续?', {
        title: '提示',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果返回值不为confirm,则表示用户取消了删除
      if (confirmResult !== 'confirm') {
        this.$message.info('已取消删除')
      }
      // 如果没有取消，则请求接口，删除该条用户数据
      try {
        await this.$API.reqDeleteUserById(id)
        // 重新获取数据
        this.getUserList()
        this.$message.success('已删除该用户信息')
      } catch (error) {
        this.$message.error('删除用户数据失败')
        console.log(error)
      }
    },
    // 分配角色界面显示
    async ShowAllotRoleDialog (user) {
      this.currentUserInfo = user
      try {
        // 调用接口，获取所有角色列表
        const result = await this.$API.reqRolesList()
        this.roleList = result.data
      } catch (error) {
        this.$message.error('获取角色列表失败')
        console.log(error)
      }
      // 对话框展示
      this.allotRoleDialogVisible = true
    },
    // 分配角色方法
    async allotRole () {
      try {
        // 调用接口
        await this.$API.reqAllotUserRole(this.currentUserInfo.id, this.selectedRoleId)
        this.$message.success('设置角色成功')
        this.getUserList()
      } catch (error) {
        this.$message.error('设置角色失败')
        console.log(error)
      }
      // 界面隐藏
      this.allotRoleDialogVisible = false
    },
    // 分监听配角色对话框关闭事件
    editDialogClosed () {
      this.selectedRoleId = ''
      this.currentUserInfo = {}
    }
  },
  mounted () {
    this.getUserList()
  }
}
</script>

<style lang='less' rel='stylesheet/less' scoped>
</style>
