import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { EditModalHandle, EditModalProps, LayoutType, RendererEditModalProps } from "../configs/EditTypeConfig";
import { editConfig } from "../configs/EditConfig";

const EditModal = forwardRef<EditModalHandle, EditModalProps>((props, ref) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [inputValue, setInputValue] = useState<string[]>([]);
  const [valueBefore, setValueBefore] = useState<string[]>([]);
  const [selectID, setSelectID] = useState<number | null>(null);
  const [layoutType, setLayoutType] = useState<LayoutType>("");

  //showModal・closeを外部から使えるようにする
  useImperativeHandle(ref, ()=> ({
    showModal: ({ inputValue, selectID, layoutType }) => {
      setValueBefore(inputValue);
      setInputValue(inputValue);
      setSelectID(selectID);
      setLayoutType(layoutType);
      dialogRef.current?.showModal();
    },
    close: () => dialogRef.current?.close(),
  }));

  //各typeに対応するModalRenderを取得
  const modalRenderer = editConfig[props.type].modals?.[layoutType];

  const content = modalRenderer ? modalRenderer({
    type: props.type,
    onModalClose: props.onModalClose,
    addItem: props.addItem,
    editItem: props.editItem,
    deleteItem: props.deleteItem,
    valueBefore,
    inputValue,
    setInputValue,
    selectID,
    setSelectID
  } as RendererEditModalProps ) : (
    <div className="p-6 text-sm text-gray-500">
      該当するモーダルが見つかりませんでした。
    </div>
  );

  let btnLabel ;

  switch(layoutType){
    case "authentication":
      btnLabel = "認証";
      break;

    case "add":
      btnLabel = "追加";
      break;

    case "delete":
      btnLabel = "削除";
      break;

    default:
      btnLabel = "保存";
  }

  return (
    <dialog ref={dialogRef} className="modal backdrop:bg-black backdrop:opacity-70">
      <div className="modal-box w-full p-0 bg-white border border-gray-200 shadow-2xl">
        <div className="modal-action w-full mt-0 flex flex-col items-center">
          <form method="dialog">
            <button
              type="button"
              className="btn btn-xs btn-circle absolute top-2 right-5 bg-gray-100 border border-gray-100"
              onClick={props.onModalClose}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-gray-800">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
            {content}
            <button
              type="button"
              className="btn btn-sm absolute bottom-6 right-6 bg-sky-800 rounded-lg border-cyan-800 text-sm text-white"
              onClick={() => {
                if(layoutType === "add") props.addItem(inputValue);
                if(layoutType === "update") props.editItem(inputValue, selectID);
                if(layoutType === "delete") props.deleteItem(selectID);
                props.onModalClose();
              }}
            >{btnLabel}</button>
          </form>
        </div>
      </div>
    </dialog>
  );
});

export default EditModal;