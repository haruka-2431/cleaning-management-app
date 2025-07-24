import { useState, useEffect } from "react";
import { CleaningAreaItem } from "./EditTypeDefinitions";
import { API_EDIT } from "../pages/List";


export const AreaSelect = (initialAreaID: number | "" = "") => {
  const [areaID, setAreaID] = useState<number | "">(initialAreaID);
  const [areaList, setAreaList] = useState<CleaningAreaItem[]>([]);

  useEffect(() => {
    fetch(API_EDIT + "/cleaning_area")
      .then((res) => res.json())
      .then((data) => setAreaList(data))
      .catch(() => setAreaList([]));
  }, []);

  return { areaID, setAreaID, areaList };
}