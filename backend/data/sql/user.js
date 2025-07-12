module.exports = {
  select_all: `
    SELECT id, concat(last_name, first_name) as name, email, position, status FROM user;
  `,
  update: `
    UPDATE user SET last_name = ?, first_name = ?, email = ?, osition = ?
    WHERE id = ?;
  `,
  delete: `
    DELETE FROM user WHERE id = ?;
  `
};