module.exports = {
  select_all: `
    SELECT id, spot_id, item FROM checklist;
  `,
  select_spot: `
    SELECT ch.id, area_name, location, item FROM checklist as ch
      INNER JOIN cleaning_spot as sp ON ch.sopt_id = sp.id
      INNER JOIN cleaning_area as ar ON sp.area_id = ar.id
    WHERE spot_id = ?;
  `,
  insert: `
    INSERT INTO checklist (id, spot_id, item) VALUES (null, ?, ?);
  `,
  update: `
    UPDATE checklist SET item = ? WHERE id = ?;
  `,
  delete: `
    DELETE FROM checklist WHERE id = ?;
  `
};