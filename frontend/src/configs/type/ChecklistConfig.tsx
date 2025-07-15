import { EditConfig, ContentEditModalProps, ChecklistItem } from "../EditTypeConfig"
import { ChecklistHeaderProps } from "../EditConfig";
import { ChecklistSelects } from "../../components/CheckListSelects";

export const checklistConfig: EditConfig<ChecklistItem, ContentEditModalProps, ChecklistHeaderProps> = {
  title: "チェックリスト",
  header: (onModalOpen, extraProps) => {
    if(!extraProps) return null;

    const{ selectedSpotID, setSelectedSpotID } = extraProps;

    return (
      <ChecklistSelects
        onModalOpen={onModalOpen}
        selectedSpotID={selectedSpotID}
        setSelectedSpotID={setSelectedSpotID}
      />
    );
  },
  row: (item, onModalOpen) => (
    <>
      <td>{item.item}</td>
      <td>
        <div className="flex gap-2 justify-center">
          <button
            className="px-2 py-1 bg-teal-600 text-white rounded"
            onClick={() => onModalOpen("update", item.id, item.item)}
          >
            変更
          </button>
          <button
            className="px-2 py-1 bg-red-600 text-white rounded"
            onClick={() => onModalOpen("delete", item.id, item.item)}
          >
            削除
          </button>
        </div>
      </td>
    </>
  ),
  modals: {
    add: (props) => (
      <div className="mt-12.5 mb-25 w-55">
        <p className="px-1 py-2 text-sm text-gray-700">追加項目</p>
        <div className="p-[2px] border rounded-lg border-gray-500">
          <input
            type="text"
            className="w-full px-3 py-1.5 border rounded-lg border-gray-300 text-sm text-slate-800"
            placeholder="清掃場所を選択"
            value={props.inputValue[0] || ""}
            onChange={(e) => {
              const newInputValue = [...props.inputValue];
              newInputValue[0] = e.target.value;
              props.setInputValue(newInputValue);
            }}
          />
          <input
            type="text"
            className="w-full px-3 py-1.5 border rounded-lg border-gray-300 text-sm text-slate-800"
            placeholder="清掃箇所を選択"
            value={props.inputValue[1] || ""}
            onChange={(e) => {
              const newInputValue = [...props.inputValue];
              newInputValue[1] = e.target.value;
              props.setInputValue(newInputValue);
            }}
          />
          <input
            type="text"
            className="w-full px-3 py-1.5 border rounded-lg border-gray-300 text-sm text-slate-800"
            placeholder="チェック内容を記入してください"
            value={props.inputValue[2] || ""}
            onChange={(e) => {
              const newInputValue = [...props.inputValue];
              newInputValue[2] = e.target.value;
              props.setInputValue(newInputValue);
            }}
          />
        </div>
      </div>
    ),
    update: (props) => (
      <div className="mt-7.5 mb-15 w-55">
        <div>
          <p className="py-2 text-xs text-gray-700">変更前</p>
          <p className="w-full px-3 py-1.5 border rounded-lg border-gray-300 text-sm text-slate-800">
            {props.valueBefore[0]}
          </p>
          <p className="w-full px-3 py-1.5 border rounded-lg border-gray-300 text-sm text-slate-800">
            {props.valueBefore[1]}
          </p>
          <p className="w-full px-3 py-1.5 border rounded-lg border-gray-300 text-sm text-slate-800">
            {props.valueBefore[2]}
          </p>
        </div>
        <div className="mt-6 mb-1 flex justify-center text-black">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
          </svg>
        </div>
        <div>
          <p className="px-1 py-2 text-xs text-gray-700">変更後</p>
          <input
            type="text"
            className="w-full px-3 py-1.5 border rounded-lg border-gray-300 text-sm text-slate-800"
            placeholder="○○"
            value={props.inputValue[0] || ""}
            onChange={(e) => {
              const newInputValue = [...props.inputValue];
              newInputValue[0] = e.target.value;
              props.setInputValue(newInputValue);
            }}
          />
          <input
            type="text"
            className="w-full px-3 py-1.5 border rounded-lg border-gray-300 text-sm text-slate-800"
            placeholder="○○"
            value={props.inputValue[1] || ""}
            onChange={(e) => {
              const newInputValue = [...props.inputValue];
              newInputValue[1] = e.target.value;
              props.setInputValue(newInputValue);
            }}
          />
          <input
            type="text"
            className="w-full px-3 py-1.5 border rounded-lg border-gray-300 text-sm text-slate-800"
            placeholder="○○"
            value={props.inputValue[2] || ""}
            onChange={(e) => {
              const newInputValue = [...props.inputValue];
              newInputValue[2] = e.target.value;
              props.setInputValue(newInputValue);
            }}
          />
        </div>
      </div>
    ),
    delete: (props) => (
      <div className="mt-12.5 mb-25 w-55">
        <p className="px-1 py-2 text-sm text-gray-700">削除項目</p>
        <div className="p-[2px] border rounded-lg border-gray-500">
          <p className="w-full px-3 py-1.5 border rounded-lg border-gray-300 text-sm text-slate-800">
            {props.inputValue[0]}
          </p>
          <p className="w-full px-3 py-1.5 border rounded-lg border-gray-300 text-sm text-slate-800">
            {props.inputValue[1]}
          </p>
          <p className="w-full px-3 py-1.5 border rounded-lg border-gray-300 text-sm text-slate-800">
            {props.inputValue[2]}
          </p>
        </div>
      </div>
    )
  }
};