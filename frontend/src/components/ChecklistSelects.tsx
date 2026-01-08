import { useState, useEffect } from "react";
import { CleaningAreaItem, LayoutType } from "../configs/EditTypeDefinitions";
import { apiClient } from "../services/api/client";

type CleaningLocation = { id: number; location: string };

type Props = {
  onModalOpen: (layoutType: LayoutType) => void;
  selectedSpotID: number | "";
  setSelectedSpotID: React.Dispatch<React.SetStateAction<number | "">>;
};

export const ChecklistSelects = ({
  onModalOpen,
  selectedSpotID,
  setSelectedSpotID,
}: Props) => {
  const [areaList, setAreaList] = useState<CleaningAreaItem[]>([]);
  const [locationList, setLocationList] = useState<CleaningLocation[]>([]);
  const [selectedAreaID, setSelectAreaID] = useState<number | "">("");

 // ✅ Supabaseからcleaning_area取得
  useEffect(() => {
    apiClient.get<CleaningAreaItem[]>("cleaning_area")
      .then((data) => {
        console.log("cleaning_area取得成功:", data);
        setAreaList(data);
      })
      .catch((error) => {
        console.error("cleaning_area取得エラー:", error);
        setAreaList([]);
      });
  }, []);

  // ✅ Supabaseからcleaning_spot取得
  useEffect(() => {
    if (selectedAreaID === "") {
      setLocationList([]);
      return;
    }

    apiClient.get<CleaningLocation[]>("cleaning_spot", { area_id: selectedAreaID })
      .then((data) => {
        console.log("cleaning_spot取得成功:", data);
        setLocationList(data);
      })
      .catch((error) => {
        console.error("cleaning_spot取得エラー:", error);
        setLocationList([]);
      });
  }, [selectedAreaID]);

  return (
    <>
      <th className="w-2/3 flex flex-col lg:flex-row">
        <select
          className="w-50 lg:w-100 border rounded border-gray-300 select-xs"
          value={selectedAreaID}
          onChange={(e) =>
            setSelectAreaID(e.target.value ? Number(e.target.value) : "")
          }
        >
          <option disabled value="">
            清掃場所を選択してください
          </option>
          {areaList.map((area) => (
            <option key={area.id} value={area.id}>
              {area.area_name}
            </option>
          ))}
        </select>
        <select
          className="w-50 lg:w-100 border rounded border-gray-300 select-xs"
          disabled={!selectedAreaID}
          value={selectedSpotID}
          onChange={(e) =>
            setSelectedSpotID(e.target.value ? Number(e.target.value) : "")
          }
        >
          <option disabled value="">
            {selectedAreaID
              ? "清掃箇所を選択してください"
              : "先に清掃場所を選択してください"}
          </option>
          {locationList.map((location) => (
            <option key={location.id} value={location.id}>
              {location.location}
            </option>
          ))}
        </select>
      </th>
      <th className="w-1/3">
        <button
          className="px-2 py-1 bg-gray-300 text-black text-xs rounded"
          onClick={() => onModalOpen("add")}
        >
          項目追加+
        </button>
      </th>
    </>
  );
};
