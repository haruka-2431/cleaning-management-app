const express = require("express");
const getSQL = require("../data/getSQL");

const ALLOWED_TYPE = [
  "user",
  "cleaning_type",
  "cleaning_area",
  "cleaning_spot",
  "checklist",       
  "cleaning_report",
  "photo",          
  "location_time",  
];

function isValidType(type) {
  return ALLOWED_TYPE.includes(type);
}

module.exports = (connection) => {
  const router = express.Router();

  // 特別なアクション付きエンドポイント
  // GET /my/cleaning_spot/select_spot/1
  // GET /my/photo/select_by_report/1
  router.get("/:type/:action/:id", (req, res) => {
    const { type, action, id } = req.params;
    const validActions = [
      "select_spot",      
      "select_by_report", 
      "select_total_time" 
    ];

    if (!validActions.includes(action)) {
      return res.status(400).json({ error: "Invalid action" });
    }

    handleQuery({
      type,
      key: action,
      params: [Number(id)],
      res,
      connection,
    });
  });

  // 全データ取得
  // GET /my/user
  router.get("/:type", (req, res) => {
    const type = req.params.type;
    handleQuery({
      type,
      key: "select_all",
      res,
      connection,
    });
  });

  // データ挿入
  // POST /my/user
  router.post("/:type", (req, res) => {
    const type = req.params.type;

    let params;
    try {
      params = paramsBuilder(type, req.body);
    } catch (err) {
      return res.status(400).send(err.message);
    }

    handleQuery({
      type,
      key: "insert",
      params,
      res,
      connection,
    });
  });

  // データ更新
  // PUT /my/user/1
  router.put("/:type/:id", (req, res) => {
    const type = req.params.type;
    const id = Number(req.params.id);

    let params;
    try {
      params = paramsBuilder(type, req.body, id);
    } catch (err) {
      return res.status(400).send(err.message);
    }

    handleQuery({
      type,
      key: "update",
      params,
      res,
      connection,
    });
  });

  // データ削除
  // DELETE /my/user/1
  router.delete("/:type/:id", (req, res) => {
    const type = req.params.type;
    const id = Number(req.params.id);
    handleQuery({
      type,
      key: "delete",
      params: [id],
      res,
      connection,
    });
  });

  // レポート単位での削除（photo, location_time用）
  // DELETE /my/photo/report/1
  router.delete("/:type/report/:id", (req, res) => {
    const type = req.params.type;
    const reportId = Number(req.params.id);
    
    if (!["photo", "location_time"].includes(type)) {
      return res.status(400).json({ error: "Report deletion only available for photo and location_time" });
    }

    handleQuery({
      type,
      key: "delete_by_report",
      params: [reportId],
      res,
      connection,
    });
  });

  return router;
};

function paramsBuilder(type, data, id = null) {
  switch (type) {
    case "user":
      if (
        !data.first_name ||
        !data.last_name ||
        !data.email ||
        !data.position
      ) {
        throw new Error("Missing required fields for user");
      }
      const userParams = [
        data.first_name,
        data.last_name,
        data.email,
        data.position,
      ];
      return id ? [...userParams, id] : userParams;

    case "cleaning_type":
      if (!data.type_name) {
        throw new Error("Missing required field 'type_name' for cleaning_type");
      }
      return id ? [data.type_name, id] : [data.type_name];

    case "cleaning_area":
      if (!data.type_id || !data.area_name) {
        throw new Error("Missing required fields for cleaning_area");
      }
      return id ? [data.area_name, id] : [data.type_id, data.area_name];

    case "cleaning_spot":
      if (!data.area_id || !data.location) {
        throw new Error("Missing required fields for cleaning_spot");
      }
      return id ? [data.area_id, data.location, id] : [data.area_id, data.location];

    case "checklist":
      if (
        typeof data.spot_id !== "number" ||
        typeof data.item !== "string" ||
        !data.item.trim()
      ) {
        throw new Error("Missing or invalid fields for checklist");
      }
      return id ? [data.spot_id, data.item, id] : [data.spot_id, data.item];

    case "cleaning_report":
      if (
        !data.user_id ||
        !data.type_id ||
        !data.area_id ||
        !data.start_datetime ||
        !data.end_datetime ||
        typeof data.status !== "boolean"
      ) {
        throw new Error("Missing required fields for cleaning_report");
      }
      return id
        ? [data.user_id, data.sub_user_id, data.type_id, data.area_id, data.start_datetime, data.end_datetime, data.status, id]
        : [data.user_id, data.sub_user_id, data.type_id, data.area_id, data.start_datetime, data.end_datetime, data.status];

    case "photo":
      if (!data.report_id || !data.photo_url || !data.posted_datetime) {
        throw new Error("Missing required fields for photo");
      }
      return id 
        ? [data.photo_url, data.posted_datetime, id] 
        : [data.report_id, data.photo_url, data.posted_datetime];

    case "location_time":
      if (!data.report_id || !data.task_name || !data.required_time) {
        throw new Error("Missing required fields for location_time");
      }
      return id 
        ? [data.task_name, data.required_time, id] 
        : [data.report_id, data.task_name, data.required_time];

    default:
      throw new Error("Unsupported type for param building");
  }
}

function handleQuery({ type, key, params = [], res, connection }) {
  // typeが有効の物かどうか
  if (!isValidType(type)) return res.status(400).send("Invalid table name");

  const sql = getSQL(type, key);
  // 指定されたSQLがあるかどうか
  if (!sql) return res.status(500).send("SQL Not Found");

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