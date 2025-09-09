module.exports = {
  select_all: `
    SELECT ar.id, type_name, area_name FROM cleaning_area as ar
      INNER JOIN cleaning_type as ty ON ar.type_id = ty.id
    ORDER BY ar.id;
  `,
  insert: `
    INSERT INTO cleaning_area (id, type_id, area_name) VALUES (null, ?, ?);
  `,
  update: `
    UPDATE cleaning_area SET type_id = ?, area_name = ? WHERE id = ?;
  `,
  delete: `
    DELETE FROM cleaning_area WHERE id = ?;
  `
};