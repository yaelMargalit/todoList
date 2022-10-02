class Forum{
    constructor(dao){
        this.dao=dao;
    }


    createTable() {
        const sql = `
          CREATE TABLE IF NOT EXISTS forum (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            description TEXT,
            date DATE,
            fileName TEXT,
            userId INTEGER,
            defaultValue BOOLEAN,
            CONSTRAINT forum_fk_userId FOREIGN KEY (userId)
              REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE)`
        return this.dao.run(sql)
      }

      create(title, description, date, fileName, userId, defaultValue) {
        return this.dao.run(
          `INSERT INTO forum (title, description, date, fileName, userId, defaultValue)
            VALUES (?, ?, ?, ?, ?, ?)`,
          [title, description, date, fileName, userId, defaultValue])
      }

      getAll() {
        return this.dao.all(`SELECT * FROM forum`)
      }


      deleteAll(){
        return this.dao.run(
          `DELETE FROM forum WHERE defaultValue = false`
        )
      }


      getByTitle(title){
        return this.dao.get(
          `SELECT * FROM forum WHERE title = '${title}'`
          )
      }
}
module.exports=Forum;