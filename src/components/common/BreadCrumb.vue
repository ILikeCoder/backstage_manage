<template>
  <!-- 面包屑进一步封装 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="item.path" v-for="item in content" :key="item.content">{{
      item.content
    }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'BreadCrumb',
  props: {
    content: {
      type: Array,
      required: true
    }
  }
}
</script>

<style></style>
