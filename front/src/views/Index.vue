<script setup lang="ts">
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
const store = useStore()
</script>

<template>
  <el-button  type="primary" @click="store.commit('increment')">增加1</el-button>
  {{ store.state.count }}
</template>

<style scoped lang="less">
</style>