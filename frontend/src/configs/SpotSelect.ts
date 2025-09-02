import { useState, useEffect } from "react";
import { CleaningSpotItem } from "./EditTypeDefinitions";
import { API_EDIT } from "../pages/List";

export const SpotSelect = (areaID: number | "" = "") => {
  const [spotID, setSpotID] = useState<number | "">("");
  const [locationList, setLocationList] = useState<CleaningSpotItem[]>([]);

  useEffect(() => {
    if(!areaID){
      setLocationList([]);
      setSpotID("");
      return;
    }

    fetch(API_EDIT + `/cleaning_spot/select_spot/${areaID}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLocationList(data);
        } else if (data && Array.isArray(data.data)) {
          setLocationList(data.data);
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