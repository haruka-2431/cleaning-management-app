import { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ListHeader from "../components/ListHeader";
import ListBody from "../components/ListBody";
import EditModal from "../components/EditModal";

import { editConfig } from "../configs/EditConfig";
import { ItemMap, EditConfig ,EditConfigKey, OnModalOpen, EditModalHandle } from "../configs/EditTypeConfig";

export const API_URL = "http://localhost:3000/cleaning-edit";

type ListProps = {
  setTitle: (title: string) => void;
}

const List = ({ setTitle }: ListProps) => {
  const editModalRef = useRef<EditModalHandle>(null);
  const { type } = useParams<{ type: EditConfigKey }>();

  //typeが存在するかどうか
  if(!type || !(type in editConfig)) return <div>Not URLtype Found</div>;

  const currentList = editConfig[type] as EditConfig<ItemMap[typeof type]>;
  const [data, setData] = useState<ItemMap[typeof type][]>([]);

  //初期データ取得
  useEffect(() => {
    if(currentList){
      fetchData();
      setTitle(currentList?.title || "データ一覧");
    }
  }, [type]);

  const fetchData =  async() => {
    try{
      const url = `${API_URL}/${type}`;
      const res = await fetch(url);
      if (!res.ok) {
      const errText = await res.text(); // 応答の中身を確認
      console.error("Fetch failed with status:", res.status, errText);
      throw new Error("Data Fetch Failed");
    }
      const json = await res.json();
      setData(json);
    }catch(err) {
      console.log(err);
      setData([]);
    }
  };

  //Modal表示処理
  const onModalOpen: OnModalOpen = (
    layoutType,
    id = null,
    ...value
  ) => {
    editModalRef.current?.showModal({
      inputValue: value,
      selectID: id,
      layoutType: layoutType,
    });
  };

  const onModalClose = () => {
    editModalRef.current?.close();
  };

  //Data変換
  const getItemFormat = (
    type: string,
    value: string[]
  ) => {
    switch(type){
      case "user":
        return { name: value[0], email: value[1], position: value[2] };
      case "cleaning_type":
        return { type_name: value[0] };
      case "cleaning_area":
        return { type_name: value[0], area_name: value[1] };
      case "checklist":
        return { item: value[0] };
      default:
        return {};
    }
  };

  //CRUD
  const addItem = async(input: string[]) => {
    await fetch(`${API_URL}/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(getItemFormat(type, input)),
    });
    await fetchData();
  };

  const editItem = async (input: string[], id: number | null) => {
    await fetch(`${API_URL}/${type}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(getItemFormat(type, input)),
    });
    await fetchData();
  };

  const deleteItem = async (id: number | null) => {
    await fetch(`${API_URL}/${type}/${id}`, {
      method: "DELETE",
    });
    await fetchData();
  };

  if(!currentList) return <div>Not Found</div>;

  return (
    <main className="flex-grow overflow-x-auto bg-white">
      <div className="relative overflow-y-auto mx-auto max-w-320 max-h-[calc(100vh-4.5rem)] lg:max-h-[calc(100vh-6.25rem)]">
        <table className="table w-full border-collapse text-center">
          <ListHeader
            header={currentList.header}
            onModalOpen={onModalOpen}
          />
          <ListBody
            data={data}
            row={currentList.row}
            onModalOpen={onModalOpen}
          />
       </table>
      </div>
      <EditModal
        ref={editModalRef}
        type={type}
        onModalClose={onModalClose}
        addItem={addItem}
        editItem={editItem}
        deleteItem={deleteItem}
      />
    </main>
  );
};

export default List;