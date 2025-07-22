module.exports = {
  select_all: `
    SELECT 
      id, 
      report_id, 
      photo_url, 
      posted_datetime 
    FROM photo
    ORDER BY posted_datetime DESC;
  `,
  
  select_by_report: `
    SELECT 
      p.id,
      p.report_id,
      p.photo_url,
      p.posted_datetime,
      CONCAT(u.last_name, u.first_name) as user_name,
      ca.area_name
    FROM photo p
      INNER JOIN cleaning_report cr ON p.report_id = cr.id
      INNER JOIN user u ON cr.user_id = u.id
      INNER JOIN cleaning_area ca ON cr.area_id = ca.id
    WHERE p.report_id = ?
    ORDER BY p.posted_datetime DESC;
  `,
  
  insert: `
    INSERT INTO photo (report_id, photo_url, posted_datetime) 
    VALUES (?, ?, ?);
  `,
  
  update: `
    UPDATE photo 
    SET photo_url = ?, posted_datetime = ? 
    WHERE id = ?;
  `,
  
  delete: `
    DELETE FROM photo WHERE id = ?;
  `,
  
  delete_by_report: `
    DELETE FROM photo WHERE report_id = ?;
  `
};