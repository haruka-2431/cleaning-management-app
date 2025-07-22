module.exports = {
  select_all: `
    SELECT 
      id, 
      report_id, 
      task_name, 
      required_time 
    FROM location_time
    ORDER BY report_id DESC, id ASC;
  `,
  
  select_by_report: `
    SELECT 
      lt.id,
      lt.report_id,
      lt.task_name,
      lt.required_time,
      CONCAT(u.last_name, u.first_name) as user_name,
      ca.area_name
    FROM location_time lt
      INNER JOIN cleaning_report cr ON lt.report_id = cr.id
      INNER JOIN user u ON cr.user_id = u.id
      INNER JOIN cleaning_area ca ON cr.area_id = ca.id
    WHERE lt.report_id = ?
    ORDER BY lt.id ASC;
  `,
  
  select_total_time: `
    SELECT 
      report_id,
      SEC_TO_TIME(SUM(TIME_TO_SEC(required_time))) as total_time
    FROM location_time 
    WHERE report_id = ?
    GROUP BY report_id;
  `,
  
  insert: `
    INSERT INTO location_time (report_id, task_name, required_time) 
    VALUES (?, ?, ?);
  `,
  
  update: `
    UPDATE location_time 
    SET task_name = ?, required_time = ? 
    WHERE id = ?;
  `,
  
  delete: `
    DELETE FROM location_time WHERE id = ?;
  `,
  
  delete_by_report: `
    DELETE FROM location_time WHERE report_id = ?;
  `
};