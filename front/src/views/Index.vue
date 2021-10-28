<script setup lang="ts">
import { ref } from 'vue';
import AddTodo from './AddTodo.vue';
import TodoList from './TodoList.vue';
import todoStore from '../store/todo'
import Todo from '../entity/todo';
import { ElMessage } from 'element-plus'

const unTodos = ref<Todo[]>([])
const getUncompleteTodos = () => todoStore.getUncompleteTodos(1, 100000).then(todos => {
  unTodos.value = todos
}).catch(err => {
  ElMessage.error(`获取未完成列表失败：${err}`)
})
getUncompleteTodos()

const completeTodos = ref<Todo[]>([])
const getCompleteTodos = () => todoStore.getCompleteTodos(1, 100000).then(todos => {
  completeTodos.value = todos
}).catch(err => {
  ElMessage.error(`获取已完成列表失败：${err}`)
})
getCompleteTodos()

const onAddTodo = (id: number) => {
  todoStore.getTodo(id).then(todo => {
    if (todo == null) {
      ElMessage.error(`获取todo失败，todo不存在`)
      return
    }
    unTodos.value.unshift(todo)
  }).catch(err => {
    ElMessage.error(`获取todo失败：${err}`)
  })
}

const onCheckUnTodo = (idx: number) => {
  todoStore.completeTodo(unTodos.value[idx].id).then(count => {
    if (count > 0) {
      unTodos.value.splice(idx, 1)
    }
    getCompleteTodos()
  }).catch(err => {
    ElMessage.error(`完成todo失败：${err}`)
  })
}

const onCheckTodo = (idx: number) => {
  todoStore.reTodo(completeTodos.value[idx].id).then(count => {
    if (count > 0) {
      completeTodos.value.splice(idx, 1)
    }
    getUncompleteTodos()
  }).catch(err => {
    ElMessage.error(`重新todo失败：${err}`)
  })
}

const onUnCompleteTodoContentChange = (idx: number, content: string) => {
  todoStore.updateContent(unTodos.value[idx].id, content).then(count => {
    if (count > 0) {
      unTodos.value[idx].content = content
    }
  }).catch(err => {
    ElMessage.error(`更新todo内容失败：${err}`)
  })
}

const onCompleteTodoContentChange = (idx: number, content: string) => {
  todoStore.updateContent(completeTodos.value[idx].id, content).then(count => {
    if (count > 0) {
      completeTodos.value[idx].content = content
    }
  }).catch(err => {
    ElMessage.error(`更新todo内容失败：${err}`)
  })
}

const onDeleteUnTodo = (idx: number) => {
  todoStore.deleteTodo(unTodos.value[idx].id).then(count => {
    if (count > 0) {
      unTodos.value.splice(idx, 1)
    }
  }).catch(err => {
    ElMessage.error(`删除todo失败：${err}`)
  })
}

const onDeleteCompleteTodo = (idx: number) => {
  todoStore.deleteTodo(completeTodos.value[idx].id).then(count => {
    if (count > 0) {
      completeTodos.value.splice(idx, 1)
    }
  }).catch(err => {
    ElMessage.error(`删除todo失败：${err}`)
  })
}

</script>

<template>
  <div class="container">
    <AddTodo @add-todo="onAddTodo" />
    <TodoList
      :title="'未完成'"
      :todos="unTodos"
      :compete="false"
      @check-todo="onCheckUnTodo"
      @content-change="onUnCompleteTodoContentChange"
      @delete-todo="onDeleteUnTodo"
    />
    <TodoList
      :title="'已完成'"
      :todos="completeTodos"
      :compete="true"
      @check-todo="onCheckTodo"
      @content-change="onCompleteTodoContentChange"
      @delete-todo="onDeleteCompleteTodo"
    />
  </div>
</template>

<style scoped lang="less">
.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>