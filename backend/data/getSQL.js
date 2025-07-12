const user = require("./sql/user");
const cleaning_type = require("./sql/cleaning_type");
const cleaning_area = require("./sql/cleaning_area");
const checklist = require("./sql/checklist");

const sqlMap = { user, cleaning_type, cleaning_area, checklist };

module.exports = function getSQL(type, key) {
  if(!type || !key) return null;

  const typeSQLs = sqlMap[type];
  if(!typeSQLs){
    console.warn(`[getSQL] Unknown type: ${type}`);
    return null;
  }

  const sql = typeSQLs[key];
  if(!sql){
    console.warn(`[getSQL] SQL not found for key: ${key} in type: ${type}`);
    return null;
  }

  return sql;
};
