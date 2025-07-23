module.exports = {
  select_all: `
    SELECT id, last_name, first_name, email, position, status FROM user;
  `,
  authentication:`
    UPDATE user SET status = ?
    WHERE id = ?;
  `,
  update: `
    UPDATE user SET last_name = ?, first_name = ?, email = ?, position = ?
    WHERE id = ?;
  `,
  delete: `
    DELETE FROM user WHERE id = ?;
  `
};