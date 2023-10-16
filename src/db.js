const mysql = require("mysql2/promise");

// // koneksi ke database mysql
const db = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  database: process.env.MYSQL_DBNAME || "todolist",
  password: process.env.MYSQL_PASSWORD || "123123",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// migrasi database mysql
const migration = async () => {
  try {
    await db.query(
      `
      CREATE TABLE IF NOT EXISTS activities (
        activity_id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
        `
    );

    await db.query(
      `
      CREATE TABLE IF NOT EXISTS todos (
        todo_id INT PRIMARY KEY AUTO_INCREMENT,
        activity_group_id INT,
        title VARCHAR(255) NOT NULL,
        priority INT,
        is_active BOOLEAN,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
          `
    );
    console.log("Running Migration Successfully!");
  } catch (err) {
    throw err;
  }
};

// // TODO: Lengkapi fungsi dibawah ini untuk mengambil data didalam database
const find = async () => {
  try {
    const query =
      "SELECT activity_id AS id,email,title,createdAt,updatedAt FROM activities";
    const connection = await db.getConnection();
    const [results] = await connection.query(query);

    return results;
  } catch (error) {
    console.log(error);
  }
};

const findOne = async (id) => {
  try {
    const query = `SELECT activity_id AS id,email,title,createdAt,updatedAt FROM activities WHERE activity_id = '${id}'`;
    const connection = await db.getConnection();
    const [results] = await connection.query(query);
    let data = results[0];
    return data;
  } catch (error) {
    console.log(error);
  }
};

const create = async (data) => {
  try {
    const query = "INSERT INTO activities (title, email) VALUES (?, ?)";
    const connection = await db.getConnection();
    const { title, email } = {
      title: data.title,
      email: data.email,
    };
    const results = await connection.query(query, [title, email]);
    const result = await findOne(results[0].insertId);

    return result;
  } catch (error) {
    console.log(error);
  }
};

const destroy = async (id) => {
  try {
    const query = "DELETE FROM activities WHERE activity_id = ?";
    const connection = await db.getConnection();

    await connection.query(query, id);
    connection.release();

    return parseInt(id);
  } catch (error) {
    console.log(error);
  }
};

const update = async (id, data) => {
  try {
    const query = "UPDATE activities SET title = ? WHERE activity_id = ? ";
    const connection = await db.getConnection();

    await connection.query(query, [data.title, id]);
    connection.release();
    const result = await findOne(id);

    return result;
  } catch (error) {
    console.log(error);
  }
};

const checkData = async (id, data) => {
  try {
    const result = await findOne(id);

    return result;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  migration,
  find,
  create,
  update,
  destroy,
  findOne,
  checkData,
};
