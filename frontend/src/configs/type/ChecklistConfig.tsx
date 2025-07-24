import { EditConfig, ContentEditModalProps, ChecklistItem } from "../EditTypeDefinitions"
import { ChecklistHeaderProps } from "../EditTypeConfig";
import { ChecklistSelects } from "../../components/ChecklistHeader";
import { ChecklistModalContent } from "../../components/modal/ChecklistModalContent";
import { FormField } from "../../components/modal/FormField";

export const ChecklistConfig: EditConfig<
  ChecklistItem,
  ContentEditModalProps,
  ChecklistHeaderProps
> = {
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
            onClick={() => onModalOpen("update", item.id, item.area_name, item.location, item.item)}
          >
            変更
          </button>
          <button
            className="px-2 py-1 bg-red-600 text-white rounded"
            onClick={() => onModalOpen("delete", item.id, item.area_name, item.location, item.item)}
          >
            削除
          </button>
        </div>
      </td>
    </>
  ),
  modals: {
    add: (props) => <ChecklistModalContent mode="add" {...props} />,
    update: (props) => <ChecklistModalContent mode="update" {...props} />,
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
    ),
  },
};
