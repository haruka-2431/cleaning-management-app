const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connection = mysql.createPool({
  host: "127.0.0.1",
  user: "root", 
  password: "mArk4-7oU/tChECk",
  database: "db_cleaning_report",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,     
});

connection.getConnection((err, conn) => {
  if (err) {
    console.error("MySQL connection error:", err);
    console.error("Error code:", err.code);
    console.error("Error message:", err.message);
    return;
  }
  console.log("Connected to MySQL with connection pooling!");
  conn.release(); 
});

const editRouter = require("./routes/edit")(connection);
app.use("/cleaning-edit", editRouter);

const anotherRouter = require("./routes/another")(connection);
app.use("/api/another", anotherRouter); 

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});