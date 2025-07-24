import { EditConfig, ContentEditModalProps, CleaningTypeItem } from "../EditTypeDefinitions"
import { FormField } from "../../components/modal/FormField";

export const cleaningTypeConfig: EditConfig<CleaningTypeItem, ContentEditModalProps> = {
  title: "清掃タイプ",
  header: (onModalOpen) => (
    <>
      <th className="w-1/2">清掃タイプ</th>
      <th className="w-1/2">
        <button
          className="px-2 py-1 bg-gray-300 text-black text-xs rounded"
          onClick={() => onModalOpen("add")}
        >
          項目追加+
        </button>
      </th>
    </>
  ),
  row: (item, onModalOpen) => (
    <>
      <td>{item.type_name}</td>
      <td>
        <div className="flex gap-2 justify-center">
          <button
            className="px-2 py-1 bg-teal-600 text-white rounded"
            onClick={() => onModalOpen("update", item.id, item.type_name)}
          >
            変更
          </button>
          <button
            className="px-2 py-1 bg-red-600 text-white rounded"
            onClick={() => onModalOpen("delete", item.id, item.type_name)}
          >
            削除
          </button>
        </div>
      </td>
    </>
  ),
  modals: {
    add: (props: ContentEditModalProps) => (
      <div className="mt-12.5 mb-25 w-55">
        <p className="px-1 py-2 text-sm text-gray-700">追加項目</p>
        <div className="p-[2px] border rounded-lg border-gray-500">
          <FormField
            index={0}
            placeholder="清掃タイプを入力してください"
            inputValue={props.inputValue}
            setInputValue={props.setInputValue}
            valueBefore={props.valueBefore}
            isInput={true}
          />
        </div>
      </div>
    ),
    update: (props: ContentEditModalProps) => (
      <div className="mt-7.5 mb-15 w-55">
        <div>
          <p className="py-2 text-xs text-gray-700">変更前</p>
          <FormField
            index={0}
            inputValue={props.inputValue}
            setInputValue={props.setInputValue}
            valueBefore={props.valueBefore}
            isInput={false}
          />
        </div>
        <div className="mt-6 mb-1 flex justify-center text-black">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
          </svg>
        </div>
        <div>
          <p className="px-1 py-2 text-xs text-gray-700">変更後</p>
          <FormField
            index={0}
            inputValue={props.inputValue}
            setInputValue={props.setInputValue}
            valueBefore={props.valueBefore}
            isInput={true}
          />
        </div>
      </div>
    ),
    delete: (props: ContentEditModalProps) => (
      <div className="mt-12.5 mb-25 w-55">
        <p className="px-1 py-2 text-sm text-gray-700">削除項目</p>
        <div className="p-[2px] border rounded-lg border-gray-500">
          <FormField
            index={0}
            inputValue={props.inputValue}
            setInputValue={props.setInputValue}
            valueBefore={props.valueBefore}
            isInput={false}
          />
        </div>
      </div>
    )
  }
};