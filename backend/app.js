const express = require('express');
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const port = 3000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "mArk4-7oU/tChECk",
  database: "db_cleaning_report",
});

connection.connect((err) => {
  if(err){
    console.error("MySQL connection error:", err);
    process.exit(1);
  }
  console.log("Connected to MySQL!");
});

const editRouter = require("./routes/edit")(connection);

app.use("/cleaning-edit", editRouter);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});