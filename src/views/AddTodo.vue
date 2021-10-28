<script setup lang="ts">
import { ref } from 'vue';
import todoStore from '../store/todo'
import { ElMessage } from 'element-plus'

const todo = ref('')
const emit = defineEmits<{
  (e: 'add-todo', id: number): void
}>()
const onEnter = (e: KeyboardEvent) => {
  if (todo.value === '') {
    return
  }
  todoStore.addTodo(todo.value).then(id => {
    emit('add-todo', id)
    todo.value = ''
  }).catch(err => {
    ElMessage.error(`添加Todo失败：${err}`)
  })
}
</script>

<template>
  <el-input
    class="input-container"
    @keyup.enter.native="onEnter"
    v-model="todo"
    placeholder="添加任务至Todo List，回车即可保存"
  />
</template>

<style scoped lang="less">
.input-container {
  ::v-deep(.el-input__inner) {
    background-color: #298e7e;
    color: #fff;
    border: none;
    border-radius: 0;
  }
}
</style>