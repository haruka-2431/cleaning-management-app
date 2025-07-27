const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 接続プール
const connection = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "mArk4-7oU/tChECk",
  database: "db_cleaning_report",
  connectionLimit: 10,        // 最大接続数
  acquireTimeout: 60000,      // 接続取得タイムアウト
  timeout: 60000,             // クエリタイムアウト
  reconnect: true,            // 自動再接続
  idleTimeout: 300000,        // アイドルタイムアウト（5分）
});

// 接続テスト
connection.getConnection((err, conn) => {
  if (err) {
    console.error("MySQL connection error:", err);
    process.exit(1);
  }
  console.log("Connected to MySQL with connection pooling!");
  conn.release(); 
});

const editRouter = require("./routes/edit")(connection);
app.use("/cleaning-edit", editRouter);

const anotherRouter = require("./routes/another")(connection);
app.use("/another", anotherRouter);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});