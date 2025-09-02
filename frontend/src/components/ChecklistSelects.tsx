import { useState, useEffect } from "react";
import { CleaningAreaItem, LayoutType } from "../configs/EditTypeDefinitions";
import { API_EDIT } from "../pages/List";

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

// デバッグ用にconsole.logを追加
useEffect(() => {
  console.log("API_EDIT:", API_EDIT); // APIのURLを確認
  fetch(API_EDIT + "/cleaning_area")
    .then((res) => {
      console.log("Response status:", res.status); // ステータス確認
      return res.json();
    })
    .then((data) => {
      console.log("API response:", data); // レスポンス内容確認
      setAreaList(data);
    })
    .catch((error) => {
      console.error("API error:", error); // エラー詳細確認
      setAreaList([]);
    });
}, []);

  //清掃場所が選ばれたらcleaning_spot一覧取得
  useEffect(() => {
    if (selectedAreaID === "") {
      setLocationList([]);
      return;
    }

    fetch(API_EDIT + `/cleaning_spot/select_spot/${selectedAreaID}`)
      .then((res) => res.json())
      .then((data) => setLocationList(data))
      .catch(() => setLocationList([]));
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
