const user = require("./sql/user");
const cleaning_type = require("./sql/cleaning_type");
const cleaning_area = require("./sql/cleaning_area");
const cleaning_spot = require("./sql/cleaning_spot");
const checklist = require("./sql/checklist");
const cleaning_report = require("./sql/cleaning_report");
const photo = require("./sql/photo");
const location_time = require("./sql/location_time");

const sqlMap = {
  user,
  cleaning_type,
  cleaning_area,
  cleaning_spot,
  checklist,
  cleaning_report,
  photo,
  location_time,
};

module.exports = function getSQL(type, key) {
  if (!type || !key) return null;
  const typeSQLs = sqlMap[type];
  if (!typeSQLs) {
    console.warn(`[getSQL] Unknown type: ${type}`);
    return null;
  }
  const sql = typeSQLs[key];
  if (!sql) {
    console.warn(`[getSQL] SQL not found for key: ${key} in type: ${type}`);
    return null;
  }
  return sql;
};
