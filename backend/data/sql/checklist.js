module.exports = {
  select_all: `
    SELECT id, spot_id, item FROM checklist;
  `,
  select_spot: `
    SELECT id, spot_id, item FROM checklist
    WHERE spot_id = ?;
  `,
  insert: `
    INSERT INTO checklist (id, area_id, spot_id, item) VALUES (null, ?, ?, ?);
  `,
  update: `
    UPDATE checklist SET item = ? WHERE id = ?;
  `,
  delete: `
    DELETE FROM checklist WHERE id = ?;
  `
};