class Task{
    constructor(dao){
        this.dao=dao;
    }


    createTable() {
      const sql = `
        CREATE TABLE IF NOT EXISTS tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          taskName TEXT,
          taskStatus TEXT,
          userId INTEGER,
          defaultValue BOOLEAN,
          CONSTRAINT tasks_fk_userId FOREIGN KEY (userId)
            REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE)`
      return this.dao.run(sql)
    }


  create(name, status, userId, defaultValue) {
    return this.dao.run(
      `INSERT INTO tasks (taskName, taskStatus, userId, defaultValue)
        VALUES (?, ?, ?, ?)`,
      [name, status, userId, defaultValue])
  }

  update(task) {
    const { id, taskName, status, userId } = task
    return this.dao.run(
      `UPDATE tasks
      SET taskName = ?,
        taskStatus = ?,
        userId = ?
      WHERE id = ?`,
      [taskName, status, userId, id]
    )
  }


  delete(id) {
    return this.dao.run(
      `DELETE FROM tasks WHERE id = ?`,
      [id]
    )
  }


  deleteAll(){
    return this.dao.run(
      `DELETE FROM tasks WHERE defaultValue = false`
    )
  }

  getAll() {
    return this.dao.all(`SELECT * FROM tasks`)
  }


  getById(id) {
    return this.dao.get(
      `SELECT * FROM tasks WHERE id = ?`,
      [id])
  }


  getByTaskName(name){
    return this.dao.get(
      `SELECT * FROM tasks WHERE taskName = '${name}'`
      )
  }

}
module.exports=Task;