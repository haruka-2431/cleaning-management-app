import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export const MY_API_URL = "/api/another";

// 型定義
interface CleanSelectProps {
  onGoToReportList?: () => void;
  userRole?: string;
}

interface LocationOption {
  value: string;
  label: string;
}

interface CleaningArea {
  id: number;
  type_name: string;
  area_name: string;
}

const CleanSelect = ({}: CleanSelectProps) => {
  const nav = useNavigate();

  const [cleaningType, setCleaningType] = useState("");
  const [cleaningLocation, setCleaningLocation] = useState("");
  const [locationOptions, setLocationOptions] = useState<LocationOption[]>([]);

  // DB から場所オプション取得
  const fetchLocationOptions = async (typeName: string) => {
    try {
      console.log("API呼び出し開始:", `${MY_API_URL}/cleaning_area`);

      const response = await fetch(`${MY_API_URL}/cleaning_area`);
      console.log("レスポンス状態:", response.status);

      const data: CleaningArea[] = await response.json();
      console.log("取得データ:", data);

      // 配列を直接処理
      if (!data || !Array.isArray(data)) {
        console.error("不正なデータ形式:", data);
        setLocationOptions(getStaticLocationOptions(typeName));
        return;
      }

      // type_name でフィルタリングして area_name を取得
      const filteredAreas = data.filter(
        (item: CleaningArea) => item.type_name === typeName
      );

      // 重複する area_name を除去
      const uniqueAreaNames = Array.from(
        new Set(filteredAreas.map((item) => item.area_name))
      );
      const options = uniqueAreaNames.map((areaName: string) => ({
        value: areaName,
        label: areaName,
      }));

      console.log("フィルタ結果:", options);
      setLocationOptions(options);
    } catch (err) {
      console.error("場所取得エラー:", err);
      setLocationOptions(getStaticLocationOptions(typeName));
    }
  };

  // フォールバック用の静的データ関数
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

  // 清掃タイプ変更時の処理
  useEffect(() => {
    if (cleaningType) {
      // ← 巡回清掃・ハウスクリーニングは場所選択不要
      if (
        cleaningType === "巡回清掃" ||
        cleaningType === "ハウスクリーニング"
      ) {
        setLocationOptions([]);
        setCleaningLocation("選択なし"); //自動で「選択なし」をセット
      } else {
        fetchLocationOptions(cleaningType);
      }
    } else {
      setLocationOptions([]);
      setCleaningLocation("");
    }
  }, [cleaningType]);

  // 場所オプション取得後の自動選択処理
  useEffect(() => {
    if (locationOptions.length === 1) {
      setCleaningLocation(locationOptions[0].value);
    } else if (locationOptions.length > 1) {
      setCleaningLocation("");
    }
  }, [locationOptions]);

  const handleSubmit = () => {
    // 巡回清掃・ハウスクリーニングは場所チェック不要
    const isLocationRequired =
      cleaningType !== "巡回清掃" && cleaningType !== "ハウスクリーニング";

    if (cleaningType && (cleaningLocation || !isLocationRequired)) {
      nav("/worker/Checklist", {
        state: {
          type: cleaningType,
          location: cleaningLocation || "選択なし",
        },
      });
    } else {
      alert("すべての項目を選択してください");
    }
  };

  // バリデーション調整
  const isLocationRequired =
    cleaningType !== "巡回清掃" && cleaningType !== "ハウスクリーニング";
  const isFormValid = cleaningType && (cleaningLocation || !isLocationRequired);

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

          {/* 清掃場所欄を常に表示 */}
          <fieldset className="mt-10 mx-auto flex flex-col items-center">
            <legend className="text-base font-semibold mb-2 text-slate-800">
              清掃場所
            </legend>
            <select
              required
              className="select text-sm h-14 max-w-80 w-full text-slate-800 bg-white border border-gray-300 rounded-lg px-4 focus:border-cyan-800 focus:ring-1 focus:ring-cyan-800 focus:ring-opacity-20"
              value={cleaningLocation}
              onChange={(e) => setCleaningLocation(e.target.value)}
              disabled={
                !cleaningType ||
                cleaningType === "巡回清掃" ||
                cleaningType === "ハウスクリーニング" ||
                locationOptions.length === 1
              }
            >
              <option className="text-neutral-400" value="" disabled hidden>
                {!cleaningType
                  ? "先に清掃タイプを選択してください"
                  : cleaningType === "巡回清掃" ||
                      cleaningType === "ハウスクリーニング"
                    ? "場所の選択は不要です"
                    : "清掃場所を選択"}
              </option>
              {/* 巡回清掃・ハウスクリーニングの場合は「選択なし」オプションを表示 */}
              {cleaningType &&
                (cleaningType === "巡回清掃" ||
                  cleaningType === "ハウスクリーニング") && (
                  <option value="選択なし">選択なし</option>
                )}
              {/* その他の場合は通常のオプション */}
              {cleaningType &&
                cleaningType !== "巡回清掃" &&
                cleaningType !== "ハウスクリーニング" &&
                locationOptions.map((option) => (
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
