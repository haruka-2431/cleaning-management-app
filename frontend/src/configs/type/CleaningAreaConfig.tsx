import { EditConfig, ContentEditModalProps, CleaningAreaItem } from "../EditTypeDefinitions"
import { FormField } from "../../components/modal/FormField";
import { CleaningAreaModalContent } from "../../components/modal/CleaningAreaModalContent";

export const cleaningAreaConfig: EditConfig<CleaningAreaItem, ContentEditModalProps> = {
  title: "清掃場所",
  header: (onModalOpen) => (
    <>
      <th className="w-1/2">清掃場所</th>
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
      <td>{item.area_name}</td>
      <td>
        <div className="flex gap-2 justify-center">
          <button
            className="px-2 py-1 bg-teal-600 text-white rounded"
            onClick={() => onModalOpen("update", item.id, item.type_name, item.area_name)}
          >
            変更
          </button>
          <button
            className="px-2 py-1 bg-red-600 text-white rounded"
            onClick={() => onModalOpen("delete", item.id, item.type_name, item.area_name)}
          >
            削除
          </button>
        </div>
      </td>
    </>
  ),
  modals: {
    add: (props) => <CleaningAreaModalContent mode="add" {...props} />,
    update: (props) => <CleaningAreaModalContent mode="update" {...props} />,
    delete: (props) => (
      <div className="mt-12.5 mb-25 w-55">
        <p className="px-1 py-2 text-sm text-gray-700">削除項目</p>
        <div className="p-[2px] border rounded-lg border-gray-500">
          {props.valueBefore.map((_, index) =>
            <FormField
              key={index}
              index={index}
              inputValue={props.inputValue}
              setInputValue={props.setInputValue}
              valueBefore={props.valueBefore}
              isInput={false}
            />
          )}
        </div>
      </div>
    )
  }
};