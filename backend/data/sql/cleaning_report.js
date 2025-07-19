module.exports = {
  select_all: "SELECT * FROM cleaning_report ORDER BY start_datetime DESC",
  insert:
    "INSERT INTO cleaning_report (user_id, sub_user_id, area_id, start_datetime, end_datetime, status) VALUES (?, ?, ?, ?, ?, ?)",
  update:
    "UPDATE cleaning_report SET user_id = ?, sub_user_id = ?, area_id = ?, start_datetime = ?, end_datetime = ?, status = ? WHERE id = ?",
  delete: "DELETE FROM cleaning_report WHERE id = ?",
};
