import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export const MY_API_URL = "http://localhost:3000/my"; 

// ← 型定義追加
interface CleanSelectProps {
  onGoToReportList?: () => void;
  userRole?: string;
}

interface LocationOption {
  value: string;
  label: string;
}

interface CleaningType {
  id: number;
  name: string;
  areas: CleaningArea[];
}

interface CleaningArea {
  id: number;
  name: string;
}

interface ApiResponse {
  types: CleaningType[];
}

const CleanSelect = ({}: CleanSelectProps) => {
  const nav = useNavigate();

  const [cleaningType, setCleaningType] = useState("");
  const [cleaningLocation, setCleaningLocation] = useState("");
  const [locationOptions, setLocationOptions] = useState<LocationOption[]>([]);

  const fetchLocationOptions = async (typeName: string) => {
    try {
      const response = await fetch(`${MY_API_URL}/cleaning_area`);
      const data: ApiResponse = await response.json(); 
      
      const targetType = data.types.find((type: CleaningType) => type.name === typeName); 
      if (targetType) {
        const options = targetType.areas.map((area: CleaningArea) => ({ 
          value: area.name,
          label: area.name
        }));
        setLocationOptions(options);
      } else {
        // フォールバック：静的データ
        setLocationOptions(getStaticLocationOptions(typeName));
      }
    } catch (err) {
      console.error("場所取得エラー:", err);
      // フォールバック：静的データ
      setLocationOptions(getStaticLocationOptions(typeName));
    }
  };

  // ← フォールバック用の静的データ関数
  const getStaticLocationOptions = (type: string): LocationOption[] => {
    switch (type) {
      case "巡回清掃":
        return [{ value: "選択なし", label: "選択なし" }];
      case "民泊清掃":
        return [
          { value: "天神民泊", label: "天神民泊" },
          { value: "春吉民泊", label: "春吉民泊" },
        ];
      case "施設清掃":
        return [
          { value: "サンホームさくら本館", label: "サンホームさくら本館" },
          { value: "サンホームさくら2号館", label: "サンホームさくら2号館" },
          { value: "メディカルホーム新宮", label: "メディカルホーム新宮" },
          { value: "ラナシカ乙金", label: "ラナシカ乙金" },
          { value: "ゆうはな", label: "ゆうはな" },
        ];
      case "ハウスクリーニング":
        return [{ value: "選択なし", label: "選択なし" }];
      default:
        return [];
    }
  };

  // ← 清掃タイプ変更時の処理（DB取得＋自動選択）
  useEffect(() => {
    if (cleaningType) {
      // DBから場所オプション取得
      fetchLocationOptions(cleaningType);
    } else {
      setLocationOptions([]);
      setCleaningLocation("");
    }
  }, [cleaningType]);

  // ← 場所オプション取得後の自動選択処理
  useEffect(() => {
    if (locationOptions.length === 1) {
      // 選択肢が1つしかない場合は自動で選択
      setCleaningLocation(locationOptions[0].value);
    } else if (locationOptions.length > 1) {
      // 選択肢が複数ある場合はリセット
      setCleaningLocation("");
    }
  }, [locationOptions]);

  const handleSubmit = () => {
    if (cleaningType && cleaningLocation) {
      nav("/worker/Checklist", {
        state: { type: cleaningType, location: cleaningLocation },
      });
    } else {
      alert("すべての項目を選択してください");
    }
  };

  const isFormValid = cleaningType && cleaningLocation;

  return (
    <>
      <Header title="作業開始" className="fixed top-0 left-0 right-0 z-50" />
      <div className="h-dvh flex items-center justify-center flex-col px-4 py-8">
        <div className="w-full max-w-80">
          <fieldset className="mx-auto flex flex-col items-center">
            <legend className="text-base font-semibold mb-2 text-slate-800">
              清掃タイプ
            </legend>
            <select
              required
              className="select text-sm h-14 max-w-80 w-full text-slate-800 bg-white border border-gray-300 rounded-lg px-4 focus:border-cyan-800 focus:ring-1 focus:ring-cyan-800 focus:ring-opacity-20"
              value={cleaningType}
              onChange={(e) => setCleaningType(e.target.value)}
            >
              <option className="text-neutral-400" value="" disabled hidden>
                清掃タイプを選択
              </option>
              <option value="巡回清掃">巡回清掃</option>
              <option value="民泊清掃">民泊清掃</option>
              <option value="施設清掃">施設清掃</option>
              <option value="ハウスクリーニング">ハウスクリーニング</option>
            </select>
          </fieldset>

          <fieldset className="mt-10 mx-auto flex flex-col items-center">
            <legend className="text-base font-semibold mb-2 text-slate-800">
              清掃場所
            </legend>
            <select
              required
              className="select text-sm h-14 max-w-80 w-full text-slate-800 bg-white border border-gray-300 rounded-lg px-4 focus:border-cyan-800 focus:ring-1 focus:ring-cyan-800 focus:ring-opacity-20"
              value={cleaningLocation}
              onChange={(e) => setCleaningLocation(e.target.value)}
              disabled={!cleaningType || locationOptions.length === 1}
            >
              <option className="text-neutral-400" value="" disabled hidden>
                {!cleaningType
                  ? "先に清掃タイプを選択してください"
                  : "清掃場所を選択"}
              </option>
              {locationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </fieldset>

          <div className="text-center">
            <button
              onClick={handleSubmit}
              className={`max-w-80 w-full h-14 mt-16 rounded-lg font-medium transition-colors ${
                isFormValid
                  ? "bg-cyan-800 text-white hover:bg-cyan-900 cursor-pointer"
                  : "bg-neutral-300 text-neutral-500 cursor-not-allowed"
              }`}
              disabled={!isFormValid}
            >
              作業を開始する！
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CleanSelect;