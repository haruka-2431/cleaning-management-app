import { useEffect } from "react";
import { ContentEditModalProps } from "../../configs/EditTypeDefinitions";
import { AreaSelect } from "../../configs/AreaSelect";
import { SpotSelect } from "../../configs/SpotSelect";

interface ChecklistModalProps extends ContentEditModalProps {
  mode: "add" | "update";
};

export const ChecklistModalContent = ({
   mode, valueBefore, inputValue, setInputValue 
}: ChecklistModalProps) => {
  const parsedAreaID = Number(inputValue[0]);
  const initialAreaID = Number.isNaN(parsedAreaID) || parsedAreaID <= 0 ? "" : parsedAreaID;

  const { areaID, setAreaID, areaList } = AreaSelect(initialAreaID);
  const { spotID, setSpotID, locationList } = SpotSelect(areaID);

  useEffect(() => {
    const newInput = [...inputValue];
    const newArea = String(areaID);
    const newSpot = String(spotID);
    if (newInput[0] !== newArea || newInput[1] !== newSpot) {
      newInput[0] = newArea;
      newInput[1] = newSpot;
      setInputValue(newInput);
    }
  }, [areaID, spotID]);

  useEffect(() => {
    const parsedArea = Number(valueBefore[0]);
    const parsedSpot = Number(valueBefore[1]);
    setAreaID(Number.isNaN(parsedArea) ? "" : parsedArea);
    setSpotID(Number.isNaN(parsedSpot) ? "" : parsedSpot);
  }, [valueBefore]);

  // modeがaddならinputValueをリセット
  useEffect(() => {
    if (mode === "add") {
      setInputValue([]);
    }
  }, [mode]);

  // クリーンアップ時（モーダル閉じるとき）にリセット
  useEffect(() => {
    return () => {
      setAreaID("");
      setSpotID("");
      setInputValue([]);
    };
  }, []);

  return (
    <div className={`${mode === "add" ? "mt-12.5 mb-25" : "mt-7.5 mb-15"} w-55`}>
      {mode === "update" && (
        <>
          <p className="py-2 text-xs text-gray-700">変更前</p>
          {valueBefore.map((val, index) => (
            <p
              key={index}
              className="w-full px-3 py-1.5 border rounded-lg border-gray-300 text-sm text-slate-800"
            >
              {val}
            </p>
          ))}
          <div className="mt-6 mb-1 flex justify-center text-black">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
            </svg>
          </div>
        </>
      )}
      <p className="px-1 py-2 text-sm text-gray-700">
        {mode === "add" ? "追加項目" : "変更後"}
      </p>
      <div className="p-[2px] border rounded-lg border-gray-500">
        <select
          className="w-full px-3 py-1.5 border rounded-lg border-gray-300 text-sm text-slate-800"
          value={areaID}
          onChange={(e) => setAreaID(e.target.value ? Number(e.target.value) : "")}
        >
          <option disabled value="">清掃場所を選択してください</option>
          {areaList.map((area) => (
            <option key={area.id} value={area.id}>
              {area.area_name}
            </option>
          ))}
        </select>

        <select
          className="w-full px-3 py-1.5 border rounded-lg border-gray-300 text-sm text-slate-800"
          value={spotID}
          onChange={(e) => setSpotID(e.target.value ? Number(e.target.value) : "")}
          disabled={!areaID}
        >
          <option disabled value="">{areaID ? "清掃箇所を選択してください" : "先に清掃場所を選択してください"}</option>
          {locationList.map((spot) => (
            <option key={spot.id} value={spot.id}>
              {spot.location}
            </option>
          ))}
        </select>

        <input
          type="text"
          className="w-full px-3 py-1.5 border rounded-lg border-gray-300 text-sm text-slate-800"
          placeholder="チェック内容を記入してください"
          value={inputValue[2] || ""}
          onChange={(e) => {
            const newInputValue = [...inputValue];
            newInputValue[2] = e.target.value;
            setInputValue(newInputValue);
          }}
        />
      </div>
    </div>
  );
}