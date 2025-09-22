import { useState, useEffect } from "react";
import { CleaningAreaItem } from "./EditTypeDefinitions";
import { apiClient } from "../services/api/client";

export const AreaSelect = (initialAreaID: number | "" = "") => {
  const [areaID, setAreaID] = useState<number | "">(initialAreaID);
  const [areaList, setAreaList] = useState<CleaningAreaItem[]>([]);

  useEffect(() => {
    const loadAreas = async () => {
      try {
        const data = await apiClient.get<CleaningAreaItem[]>('cleaning_area');
        setAreaList(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('cleaning_area取得エラー:', error);
        setAreaList([]);
      }
    };
    
    loadAreas();
  }, []);

  return { areaID, setAreaID, areaList };
}