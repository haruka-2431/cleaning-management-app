import { useState, useEffect } from "react";
import { CleaningTypeItem } from "./EditTypeDefinitions";
import { apiClient } from "../services/api/client";

export const TypeSelect = (initialTypeID: number | "" = "") => {
  const [typeID, setTypeID] = useState<number | "">(initialTypeID);
  const [typeList, setTypeList] = useState<CleaningTypeItem[]>([]);

  useEffect(() => {
    const loadTypes = async () => {
      try {
        const data = await apiClient.get<CleaningTypeItem[]>('cleaning_type');
        setTypeList(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('cleaning_type取得エラー:', error);
        setTypeList([]);
      }
    };
    
    loadTypes();
  }, []);

  return { typeID, setTypeID, typeList };
};