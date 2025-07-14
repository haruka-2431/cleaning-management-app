const express = require("express");
const getSQL = require("../data/getSQL");

const ALLOWED_TYPE = ["user", "cleaning_type", "cleaning_area", "cleaning_spot", "checklist"];

function isValidType(type){
  return ALLOWED_TYPE.includes(type);
}

module.exports = (connection) => {
  const router = express.Router();

  router.get("/:type/:action/:id", (req, res) => {
    const { type, action, id } = req.params;
    const validActions = ["select_spot"];

    if(!validActions.includes(action)){
      return res.status(400).json({ error: "Invalid action" });
    }

    handleQuery({
      type,
      key: action,
      params: [Number(id)],
      res,
      connection
    });
  });

  router.get("/:type", (req, res) => {
    const type = req.params.type;
    handleQuery({
      type,
      key: "select_all",
      res,
      connection
    });
  });

  router.post("/:type", (req, res) => {
    const type = req.params.type;

    let params;
    try{
      params = paramsBuilder(type, req.body);
    }catch(err){
      return res.status(400).send(err.message);
    }

    handleQuery({
      type,
      key: "insert",
      params,
      res,
      connection
    });
  });

  router.put("/:type/:id", (req, res) => {
    const type = req.params.type;
    const id = Number(req.params.id);

    let params;
    try{
      params = paramsBuilder(type, req.body, id);
    }catch(err){
      return res.status(400).send(err.message);
    }

    handleQuery({
      type,
      key: "update",
      params,
      res,
      connection
    });
  });

  router.delete("/:type/:id", (req, res) => {
    const type = req.params.type;
    const id = Number(req.params.id);
    handleQuery({
      type,
      key: "delete",
      params: [id],
      res,
      connection
    });
  });

    return router;
  };

  function paramsBuilder(type, data, id = null){
    switch(type){
      case "user":
        if (!data.first_name || !data.last_name || !data.email || !data.position){
          throw new Error("Missing required fields for user");
        }
        const userParams = [data.first_name, data.last_name, data.email, data.position];
        return id ? [...userParams, id] : userParams;

      case "cleaning_type":
        if (!data.type_name){
          throw new Error("Missing required field 'type_name' for cleaning_type");
        }
        return id ? [data.type_name, id] : [data.type_name];

      case "cleaning_area":
        if (!data.type_id || !data.area_name){
          throw new Error("Missing required fields for cleaning_area");
        }
        return id ? [data.area_name, id] : [data.type_id, data.area_name];

      case "checklist":
        if (
          typeof data.spot_id !== "number" ||
          typeof data.item !== "string" ||
          !data.item.trim()
        ){
          throw new Error("Missing or invalid fields for checklist");
        }
        return id
          ? [data.spot_id, data.item, id]
          : [data.spot_id, data.item];

      default:
        throw new Error("Unsupported type for param building");
    }
  }

  function handleQuery({ type, key, params = [], res, connection }) {
    //typeが有効の物かどうか
    if(!isValidType(type)) return res.status(400).send("Invalid table name");

    const sql = getSQL(type, key);
    //指定されたSQLがあるかどうか
    if(!sql) return res.status(500).send("SQL Not Found");

    connection.query(sql, params, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("DB error");
      }

      if (key.startsWith("select")) {
        res.json(result);
      } else if (key === "insert") {
        res.status(201).json({ insertedId: result.insertId });
      } else {
        res.sendStatus(200);
      }
  });
}