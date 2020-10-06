<template>
  <!-- 页面头部 -->
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="./images/heima.png" alt="" />
        <span>电商管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 菜单栏折叠按钮 -->
        <div class="toggleCollapse" @click="toggleCollapse">|||</div>
        <!-- 导航菜单项 -->
        <el-menu
          :collapse-transition="false"
          :collapse="isCollapse"
          unique-opened
          class="el-menu-vertical-demo"
          background-color="#323743"
          text-color="#fff"
          active-text-color="#2f6cde"
          router
          :default-active="$route.path"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/home/' + subitem.path"
              v-for="subitem in item.children"
              :key="subitem.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subitem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      menuList: [],
      iconObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse: false
    }
  },
  methods: {
    logout () {
      // 清除token
      sessionStorage.removeItem('token')
      // 重新跳转到login组件
      this.$router.replace('/login')
    },
    async getMenuList () {
      const result = await this.$API.reqSideMenus()
      this.menuList = result.data
    },
    // 控制菜单栏折叠
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    }
  },
  mounted () {
    this.getMenuList()
  }
}
</script>

<style lang='less' rel='stylesheet/less' scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d3f;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 20px;
    }
  }
  .el-button {
    margin-right: 20px;
  }
}

.el-aside {
  background-color: #323743;
  .toggleCollapse {
    text-align: center;
    color: #fff;
    background-color: #485066;
    line-height: 30px;
    cursor: pointer;
  }
  .el-menu {
    border-right: none;
  }
  .iconfont {
    margin-right: 10px;
  }
}

.el-main {
  background-color: #e9edf0;
}
</style>
