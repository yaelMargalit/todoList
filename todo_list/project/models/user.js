class User{
    constructor(dao){
        this.dao=dao;
    }


    createTable(){
        const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userName TEXT,
      userPassword TEXT,
      imgProfile TEXT,
      defaultValue BOOLEAN)`
    return this.dao.run(sql)
  }


  create(userName, userPassword, imgProfile, defaultValue) {
      return this.dao.run(
        `INSERT INTO users (userName, userPassword, imgProfile, defaultValue)
          VALUES (?, ?, ?, ?)`,
        [userName, userPassword, imgProfile, defaultValue])
  }


  update(user) {
    const { id, userName, userPassword, imgProfile } = user
    return this.dao.run(
      `UPDATE users
      SET userName = ?,
      userPassword = ?,
      imgProfile= ?,
      WHERE id = ?`,
      [userName, userPassword, imgProfile, id]
    )
  }


  updateImgProfile(imgProfile, id) {
    console.log(id, "  ", imgProfile)
    return this.dao.run(
      `UPDATE users
      SET imgProfile = ?
      WHERE id = ?`,
      [imgProfile, id]
    )
  }


  delete(id) {
    return this.dao.run(
      `DELETE FROM users WHERE id = ?`,
      [id]
    )
  }

  deleteAll(){
    return this.dao.run(
      `DELETE FROM users WHERE defaultValue = false`
    )
  }


  getById(id) {
    return this.dao.get(
      `SELECT * FROM users WHERE id = ?`,
      [id])
  }


  //login. enable sql injection
  getByNameAndPass(name, pass) {
    return this.dao.get(
      `SELECT * FROM users WHERE userName = '${name}' AND userPassword = '${pass}'`
      )
  }


  getByName(name){
    return this.dao.get(
      `SELECT * FROM users WHERE userName = '${name}'`
      )
  }

  getByPass(pass){
    console.log("---------------")
    return this.dao.get(
      `SELECT * FROM users WHERE userPassword = '${pass}'`
      )
  }


  getAll() {
    return this.dao.all(`SELECT * FROM users`)
  }


  getTasks(userId) {
    console.log("user id=",userId)
    return this.dao.all(
      `SELECT * FROM tasks WHERE userId = ?`,
      [userId])
  }
    


}
module.exports=User;