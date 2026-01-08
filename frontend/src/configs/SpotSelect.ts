import { useState, useEffect } from "react";
import { CleaningSpotItem } from "./EditTypeDefinitions";
import { apiClient } from "../services/api/client";

export const SpotSelect = (areaID: number | "" = "") => {
  const [spotID, setSpotID] = useState<number | "">("");
  const [locationList, setLocationList] = useState<CleaningSpotItem[]>([]);

  useEffect(() => {
    if(!areaID){
      setLocationList([]);
      setSpotID("");
      return;
    }

    apiClient.get<CleaningSpotItem[]>("cleaning_spot", { area_id: areaID })
      .then((data) => {
        if (Array.isArray(data)) {
          setLocationList(data);
        } else {
          setLocationList([]);
        }
        setSpotID("");
      })
      .catch((err) => {
        console.error("cleaning_spot取得失敗", err);
        setLocationList([]);
      });
  }, [areaID]);

  return { spotID, setSpotID, locationList };
};