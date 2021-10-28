import Todo from "../entity/todo"

class TodoStore {
  /**
   * 数据库实例
   */
  db: Database

  /**
   * todo数据库名
   */
  todoDbName: string = 'todo'

  /**
   * todo表名
   */
  todoTableName: string = 'todo'

  private constructor() { }

  public static async buildTodoStore() {
    const todoStore = new TodoStore()
    todoStore.openDb()
    await todoStore.createTable()
    return todoStore
  }

  /**
     * 获取todo
     * @param id todo编号
     * @returns todo
     */
  public async getTodo(id: number): Promise<Todo | null> {
    const res = await this.transaction(
      `SELECT * from ${this.todoTableName} WHERE id = ?`,
      [id]
    )
    if (res.rows.length === 0) {
      return null
    }
    const todo = new Todo()
    todo.id = res.rows[0].id
    todo.content = res.rows[0].content
    todo.isComplete = res.rows[0].is_complete
    todo.completeTime = res.rows[0].complete_time
    todo.updateTime = res.rows[0].update_time
    todo.createTime = res.rows[0].create_time
    return todo
  }

  /**
     * 获取完成的todo
     * @param page 页码
     * @param step 条数
     * @returns 完成的todo
     */
  public async getCompleteTodos(page: number, step: number): Promise<Array<Todo>> {
    const res = await this.transaction(
      `SELECT * from ${this.todoTableName} WHERE is_complete = ? ORDER BY complete_time DESC LIMIT ? OFFSET ?`,
      [1, step, (page - 1) * step]
    )
    const todos = new Array<Todo>(res.rows.length)
    for (let i = 0; i < res.rows.length; i++) {
      const todo = new Todo()
      todo.id = res.rows[i].id
      todo.content = res.rows[i].content
      todo.isComplete = res.rows[i].is_complete
      todo.completeTime = res.rows[i].complete_time
      todo.updateTime = res.rows[i].update_time
      todo.createTime = res.rows[i].create_time
      todos[i] = todo
    }
    return todos
  }

  /**
   * 获取未完成的todo
   * @param page 页码
   * @param step 条数
   * @returns 未完成的todo
   */
  public async getUncompleteTodos(page: number, step: number): Promise<Array<Todo>> {
    const res = await this.transaction(
      `SELECT * from ${this.todoTableName} WHERE is_complete = ? ORDER BY create_time DESC LIMIT ? OFFSET ?`,
      [0, step, (page - 1) * step]
    )
    const todos = new Array<Todo>(res.rows.length)
    for (let i = 0; i < res.rows.length; i++) {
      const todo = new Todo()
      todo.id = res.rows[i].id
      todo.content = res.rows[i].content
      todo.isComplete = res.rows[i].is_complete
      todo.completeTime = res.rows[i].complete_time
      todo.updateTime = res.rows[i].update_time
      todo.createTime = res.rows[i].create_time
      todos[i] = todo
    }
    return todos
  }

  /**
   * 更新todo内容
   * @param id todo编号
   * @param content 内容
   * @returns 更新的行数
   */
  public async updateContent(id: number, content: string): Promise<number> {
    const res = await this.transaction(
      `UPDATE ${this.todoTableName} SET content = ?, update_time = ? WHERE id = ?`,
      [content, new Date().getTime(), id]
    )
    return res.rowsAffected
  }

  /**
   * 重新todo
   * @param id todo编号
   * @returns 更新的行数
   */
  public async reTodo(id: number): Promise<number> {
    const now = new Date().getTime()
    const res = await this.transaction(
      `UPDATE ${this.todoTableName} SET is_complete = ?, complete_time = ?, update_time = ? WHERE id = ?`,
      [0, null, now, id]
    )
    return res.rowsAffected
  }

  /**
   * 完成todo
   * @param id todo编号
   * @returns 更新的行数
   */
  public async completeTodo(id: number): Promise<number> {
    const now = new Date().getTime()
    const res = await this.transaction(
      `UPDATE ${this.todoTableName} SET is_complete = ?, complete_time = ?, update_time = ? WHERE id = ?`,
      [1, now, now, id]
    )
    return res.rowsAffected
  }

  /**
   * 删除todo
   * @param id todo编号
   * @returns 删除的行数
   */
  public async deleteTodo(id: number): Promise<number> {
    const res = await this.transaction(
      `DELETE FROM ${this.todoTableName} WHERE id = ?`,
      [id]
    )
    return res.rowsAffected
  }

  /**
   * 添加todo
   * @param content todo内容
   * @returns 记录的id
   */
  public async addTodo(content: string): Promise<number> {
    const now = new Date().getTime()
    const res = await this.transaction(
      `INSERT INTO ${this.todoTableName} (content, is_complete, update_time, create_time) VALUES (?, ?, ?, ?)`,
      [content, 0, now, now]
    );
    return res.insertId
  }

  /**
   * 创建表
   */
  private async createTable(): Promise<void> {
    return this.transaction(
      `CREATE TABLE IF NOT EXISTS ${this.todoTableName} (
        id INTEGER  PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        is_complete INTEGER NOT NULL,
        complete_time INTEGER ,
        update_time INTEGER NOT NULL,
        create_time INTEGER NOT NULL
      )`,
      []
    );
  }

  /**
   * 打开数据库，打开后可以对数据库进行操作
   */
  private openDb(): void {
    this.db = openDatabase(this.todoDbName, "1.0", "Todo数据库", 0);
  }

  /**
   * 执行事务的封装
   * @param sql SQL
   * @param params 参数列表
   * @returns 执行结果
   */
  private async transaction(sql: string, params: Array<string | number | null>): Promise<void | SQLResultSet> {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(
          sql,
          params,
          (tx, res) => {
            resolve(res);
          },
          (tx, err) => {
            reject(err);
          }
        );
      });
    });
  }
}

const todoStore = await TodoStore.buildTodoStore()

export default todoStore