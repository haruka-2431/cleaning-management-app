module.exports = {
  select_all: `
    SELECT id, type_name FROM cleaning_type;
  `,
  insert: `
    INSERT INTO cleaning_type (id, type_name) VALUES (null, ?);
  `,
  update: `
    UPDATE cleaning_type SET type_name = ? WHERE id = ?;
  `,
  delete: `
    DELETE FROM cleaning_type WHERE id = ?;
  `
};