<template>
  <div>
    <el-button type="info" @click="exit">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    //退出登录
    exit() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    }
  }
}
</script>

<style></style>
