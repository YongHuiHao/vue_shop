<template>
  <div>
    <h1>home</h1>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    logout () {
      // 清除token
      sessionStorage.removeItem('token')
      // 重新跳转到login组件
      this.$router.replace('/login')
    }
  }
}
</script>

<style lang='less' rel='stylesheet/less' scoped>
</style>
