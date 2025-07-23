module.exports = {
  select_all: `
    SELECT 
      cr.id,
      cr.user_id,
      cr.sub_user_id,
      cr.type_id,
      cr.area_id,
      cr.start_datetime as raw_start_datetime,
      cr.end_datetime as raw_end_datetime,
      DATE_FORMAT(cr.start_datetime, '%Y/%m/%d %H:%i') as start_datetime,
      DATE_FORMAT(cr.end_datetime, '%Y/%m/%d %H:%i') as end_datetime,
      cr.status,
      CONCAT(u1.last_name, ' ', u1.first_name) as user_name,
      CASE 
        WHEN cr.sub_user_id IS NOT NULL 
        THEN CONCAT(u2.last_name, ' ', u2.first_name) 
        ELSE NULL 
      END as sub_user_name,
      ct.type_name as cleaning_type,
      ca.area_name as cleaning_area
    FROM cleaning_report cr
    LEFT JOIN user u1 ON cr.user_id = u1.id
    LEFT JOIN user u2 ON cr.sub_user_id = u2.id
    LEFT JOIN cleaning_type ct ON cr.type_id = ct.id
    LEFT JOIN cleaning_area ca ON cr.area_id = ca.id
    ORDER BY cr.start_datetime DESC
  `,
  
  insert: `
    INSERT INTO cleaning_report (user_id, sub_user_id, type_id, area_id, start_datetime, end_datetime, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `,
  
  update: `
    UPDATE cleaning_report 
    SET user_id = ?, sub_user_id = ?, type_id = ?, area_id = ?, start_datetime = ?, end_datetime = ?, status = ?
    WHERE id = ?
  `,
  
  delete: `
    DELETE FROM cleaning_report 
    WHERE id = ?
  `
};