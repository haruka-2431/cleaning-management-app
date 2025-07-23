import { useState, useEffect } from "react";
import { CleaningTypeItem } from "./EditTypeDefinitions";
import { API_EDIT } from "../pages/List";

export const TypeSelect = (initialTypeID: number | "" = "") => {
  const [typeID, setTypeID] = useState<number | "">(initialTypeID);
  const [typeList, setTypeList] = useState<CleaningTypeItem[]>([]);

  useEffect(() => {
    fetch(API_EDIT + "/cleaning_type")
      .then((res) => res.json())
      .then((data) => setTypeList(data))
      .catch(() => setTypeList([]));
  }, []);

  return { typeID, setTypeID, typeList };
};