
module.exports ={
  select_all: `
    select id, area_id, location from cleaning_spot;
  `,
  select_spot: `
    select id, area_id, location from cleaning_spot
    where area_id = ?;
  `
}

