//各タイプのリストデータ
export type UserItem = { id: number; name: string; email: string; position: string; status: boolean };
export type CleaningTypeItem = { id: number; type_name: string };
export type CleaningAreaItem = { id: number; type_name: string; area_name: string };
export type ChecklistItem = { id: number; checklist: string };

export type ItemMap = {
  user: UserItem;
  cleaning_type: CleaningTypeItem;
  cleaning_area: CleaningAreaItem;
  checklist: ChecklistItem;
};

export type EditConfigKey = keyof ItemMap;

export type OnModalOpen = (
  layoutType: LayoutType,
  id?: number | null,
  ...value: string[]
) => void;

export type ModalRenderFunction<T, P extends EditModalProps = EditModalProps> = (props: P) => React.ReactNode;

export type EditConfig<T, P extends EditModalProps = EditModalProps> = {
  title: string;
  header: (onModalOpen: OnModalOpen) => React.ReactNode;
  row: (item: T, onModalOpen: OnModalOpen) => React.ReactNode;
  modals?: {
    [key in LayoutType]? : ModalRenderFunction<T, P>
  };
};

export type LayoutType = "" | "add" | "update" | "delete" | "authentication";

export type EditModalHandle = {
  showModal: (options: {
    inputValue: string[];
    selectID: number | null;
    layoutType: LayoutType;
  }) => void;
  close: () => void;
} 

//Modalの基本型
export interface EditModalProps {
  type: keyof ItemMap,
  onModalClose: () => void,
  addItem: () => Promise<void>,
  editItem: () => Promise<void>,
  deleteItem: () => Promise<void>
}

//Modal内のConfigに対する型
export interface ContentEditModalProps extends EditModalProps {
  inputValue: string[];
  setInputValue: (val: string[]) => void;
}

//ModalのRendererに対する型
export interface RendererEditModalProps extends EditModalProps {
  inputValue: string[];
  setInputValue: (val: string[]) => void;
  selectID: number | null;
  setSelectID: (id: number | null) => void;
}