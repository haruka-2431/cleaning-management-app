module.exports = {
  select_all: `
    SELECT id, spot_id, item FROM Checklist;
  `,
  select_spot: `
    SELECT ch.id, area_name, location, item FROM Checklist as ch
      INNER JOIN cleaning_spot as sp ON ch.sopt_id = sp.id
      INNER JOIN cleaning_area as ar ON sp.area_id = ar.id
    WHERE spot_id = ?;
  `,
  insert: `
    INSERT INTO Checklist (id, spot_id, item) VALUES (null, ?, ?);
  `,
  update: `
    UPDATE Checklist SET item = ? WHERE id = ?;
  `,
  delete: `
    DELETE FROM Checklist WHERE id = ?;
  `,
};
