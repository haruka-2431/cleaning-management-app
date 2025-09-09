import { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Header from "../components/Header";
import ListHeader from "../components/ListHeader";
import ListBody from "../components/ListBody";
import EditModal from "../components/modal/EditModal";

import { editConfig } from "../configs/EditTypeConfig";
import {
  ItemMap,
  EditConfig,
  EditConfigKey,
  OnModalOpen,
  EditModalHandle,
} from "../configs/EditTypeDefinitions";

export const API_EDIT = "http://localhost:3000/cleaning-edit";

type ListProps = {
  title: string;
  setTitle: (title: string) => void;
};

const List = ({ title, setTitle }: ListProps) => {
  const editModalRef = useRef<EditModalHandle>(null);
  const { type } = useParams<{ type: EditConfigKey }>();

  //typeが存在するかどうか
  if (!type || !(type in editConfig)) return <div>Not URLtype Found</div>;

  const currentList = editConfig[type] as EditConfig<ItemMap[typeof type]>;
  const [data, setData] = useState<ItemMap[typeof type][]>([]);

  //checklistの差分表示機構
  const [selectedSpotID, setSelectedSpotID] = useState<number | "">("");

  useEffect(() => {
    fetchData();
    if (currentList?.title) setTitle;
  }, [type, selectedSpotID]);

  //初期データ取得
  useEffect(() => {
    if (currentList) {
      fetchData();
      setTitle(currentList?.title || "データ一覧");
    }
  }, [type, selectedSpotID]);

  const fetchData = async () => {
    try {
      let url = `${API_EDIT}/${type}`;

      //清掃箇所が指定された場合のみ（checklist）
      if (type === "checklist" && selectedSpotID !== "") {
        url += `/select_spot/${selectedSpotID}`;
      }

      const res = await fetch(url);
      
      if (!res.ok) {
        const errText = await res.text(); // 応答の中身を確認
        console.error("Fetch failed with status:", res.status, errText);
        throw new Error("Data Fetch Failed");
      }
      const json = await res.json();
      setData(json);

      //初期状態では表示されないよう変更（checklist）
      if (type === "checklist" && selectedSpotID === "") setData([]);
    } catch (err) {
      console.log(err);
      setData([]);
    }
  };

  //Modal表示処理
  const onModalOpen: OnModalOpen = (layoutType, id = null, ...value) => {
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
  const getItemFormat = (type: string, value: string[], action: string) => {
    switch (type) {
      case "user":
        if (action === "authentication") {
          return { status: value[0] };
        }
        return {
          last_name: value[0],
          first_name: value[1],
          email: value[2],
          position: value[3],
        };

      case "cleaning_type":
        return { type_name: value[0] };

      case "cleaning_area":
        return { type_id: Number(value[0]), area_name: value[1] };

      case "checklist":
        return { spot_id: Number(value[1]), item: value[2] };

      default:
        return {};
    }
  };

  //CRUD
  const addItem = async (input: string[]) => {
    await fetch(`${API_EDIT}/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(getItemFormat(type, input, "")),
    });
    await fetchData();
  };

  const editItem = async (
    input: string[],
    id: number | null,
    action: string
  ) => {
    await fetch(`${API_EDIT}/${type}/${action}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(getItemFormat(type, input, action)),
    });
    await fetchData();
  };

  const deleteItem = async (id: number | null) => {
    await fetch(`${API_EDIT}/${type}/${id}`, {
      method: "DELETE",
    });
    await fetchData();
  };

  if (!currentList) return <div>Not Found</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Header title={title} />
      <main className="flex-grow overflow-x-auto bg-white">
        <div className="relative overflow-y-auto mx-auto max-w-320 max-h-[calc(100vh-4.5rem)] lg:max-h-[calc(100vh-6.25rem)]">
          <table className="table w-full border-collapse text-center">
            <ListHeader
              header={currentList.header}
              onModalOpen={onModalOpen}
              extraProps={{ selectedSpotID, setSelectedSpotID }}
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
    </div>
  );
};

export default List;
