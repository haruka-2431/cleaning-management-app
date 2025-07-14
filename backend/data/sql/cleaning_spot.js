module.exports = {
  select_all: "SELECT id, area_id, location FROM cleaning_spot ORDER BY id",
  insert: "INSERT INTO cleaning_spot (area_id, location) VALUES (?, ?)",
  update: "UPDATE cleaning_spot SET area_id = ?, location = ? WHERE id = ?",
  delete: "DELETE FROM cleaning_spot WHERE id = ?"
};
