<script setup lang="ts">
import { ref } from 'vue';
import Todo from '../entity/todo';
interface Props {
  todos: Todo[]
  title: string,
  compete: boolean
}
defineProps<Props>()

const emit = defineEmits<{
  (e: 'check-todo', idx: number): void
  (e: 'content-change', idx: number, content: string): void
  (e: 'delete-todo', idx: number): void
}>()

const check = (idx: number) => {
  emit('check-todo', idx)
}

const changeTodoVisible = ref(false)
const changedTodoIdx = ref(0)
const changedContent = ref('')

const onChangeContentVisible = (todo: Todo, idx: number) => {
  changeTodoVisible.value = true
  changedTodoIdx.value = idx
  changedContent.value = todo.content
}

const onContentChange = (content: string) => {
  emit('content-change', changedTodoIdx.value, content)
}

const onDeleteTodo = () => {
  emit('delete-todo', changedTodoIdx.value)
  changeTodoVisible.value = false
}

</script>

<template>
  <div class="container">
    <div class="title">{{ title }}</div>
    <div class="todo-container" v-for="(todo, idx) in todos">
      <img class="todo-check" v-if="compete" src="../assets/complete.png" @click="check(idx)" />
      <img class="todo-check" v-if="!compete" src="../assets/uncomplete.png" @click="check(idx)" />
      <span
        @click="onChangeContentVisible(todo, idx)"
        :class="'todo-content ' + (compete ? 'todo-content-complete' : 'todo-content-uncomplete')"
      >{{ todo.content }}</span>
    </div>
    <el-dialog v-model="changeTodoVisible" title="改变Todo内容" width="30%">
      <el-input @input="onContentChange" v-model="changedContent" placeholder="准备做什么" />
      <template #footer>
        <el-button type="danger" icon="el-icon-delete" circle @click="onDeleteTodo"></el-button>
        <el-button type="success" icon="el-icon-check" circle @click="changeTodoVisible = false"></el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
.container {
  margin-top: 20px;
  .title {
    width: 100%;
    color: #8ec2b8;
  }
  .todo-container {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    line-height: 40px;
    .todo-check {
      cursor: pointer;
      line-height: 40px;
      height: 20px;
      width: 20px;
    }
    .todo-content {
      cursor: pointer;
      margin-left: 10px;
      font-size: 14px;
    }
    .todo-content-uncomplete {
      color: #fff;
    }
    .todo-content-complete {
      color: #51ab97;
    }
    .todo-close {
      cursor: pointer;
      line-height: 40px;
      height: 20px;
      width: 20px;
    }
  }
}
</style>