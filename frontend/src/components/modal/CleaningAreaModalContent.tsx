import { useEffect } from "react";
import { ContentEditModalProps } from "../../configs/EditTypeDefinitions";
import { TypeSelect } from "../../configs/TypeSelect";
import { FormField } from "./FormField";

interface CleaningTypeModalProps extends ContentEditModalProps {
  mode: "add" | "update";
};

export const CleaningAreaModalContent = ({
  mode, valueBefore, inputValue, setInputValue
}: CleaningTypeModalProps) => {
  const parsedTypeID = Number(inputValue[0]);
  const initialTypeID = Number.isNaN(parsedTypeID) || parsedTypeID <= 0 ? "" : parsedTypeID;

  const { typeID, setTypeID, typeList } = TypeSelect(initialTypeID);

  useEffect(() => {
    const newInput = [...inputValue];
    const newType = String(typeID);
    if(newInput[0] !== newType){
      newInput[0] = newType;
      setInputValue(newInput);
    }
  },[typeID]);
  
  useEffect(() => {
    const parsedType = Number(valueBefore[0]);
    setTypeID(Number.isNaN(parsedType) ? "" : parsedType);
  }, [valueBefore])

  // modeがaddならinputValueをリセット
  useEffect(() => {
    if (mode === "add") {
      setInputValue([]);
    }
  }, [mode]);

  // クリーンアップ時（モーダル閉じるとき）にリセット
  useEffect(() => {
    return () => {
      setTypeID("");
      setInputValue([]);
    };
  }, []);

  const isUpdate = mode === "update";

  return (
    <div className={`${isUpdate ? "mt-7.5 mb-15" : "mt-12.5 mb-25"} w-55`}>
      {mode === "update" && (
        <>
          <p className="px-1 py-2 text-xs text-gray-700">変更前</p>
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
        {isUpdate ? "変更後" : "追加項目"}
      </p>
      <div className={isUpdate ? "" : "p-[2px] border rounded-lg border-gray-500"}>
        <select
          className="w-full px-3 py-1.5 border rounded-lg border-gray-300 text-sm text-slate-800"
          value={typeID}
          onChange={(e) => setTypeID(e.target.value ? Number(e.target.value) : "")}
        >
          <option disabled value="">清掃タイプを選択してください</option>
          {typeList.map((type) => (
            <option key={type.id} value={type.id}>
              {type.type_name}
            </option>
          ))}
        </select>
        <FormField
          index={1}
          placeholder="清掃場所を入力してください"
          inputValue={inputValue}
          setInputValue={setInputValue}
          valueBefore={valueBefore}
          isInput={true}
        />
      </div>
    </div>
  );
};