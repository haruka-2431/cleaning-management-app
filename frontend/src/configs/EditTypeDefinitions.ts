//各タイプのリストデータ
export type UserItem = { id: number; last_name: string; first_name: string; email: string; position: string; status: string };
export type CleaningTypeItem = { id: number; type_name: string };
export type CleaningAreaItem = { id: number; type_name: string; area_name: string };
export type CleaningSpotItem = { id: number; location: string };
export type ChecklistItem = { id: number; area_name: string; location: string; item: string };

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

//各typeにおけるModalを定義
export type ModalRenderFunction<P extends EditModalProps = EditModalProps> = (props: P) => React.ReactNode;

export type EditConfig<T, P extends EditModalProps = EditModalProps, HProps = {}> = {
  title: string;
  header: (onModalOpen: OnModalOpen, extraProps?: HProps) => React.ReactNode;
  row: (item: T, onModalOpen: OnModalOpen) => React.ReactNode;
  modals?: {
    [key in LayoutType]? : ModalRenderFunction<P>
  };
};

//Modalのタイプ
export type LayoutType = "" | "add" | "update" | "delete" | "authentication";

export type EditModalHandle = {
  showModal: (options: {
    inputValue: string[];
    selectID: number | null;
    layoutType: LayoutType;
  }) => void;
  close: () => void;
} 

//Modalの基本Props
export interface EditModalProps {
  type: keyof ItemMap,
  onModalClose: () => void,
  addItem: (input: string[]) => Promise<void>,
  editItem: (input: string[], id: number | null, action: string) => Promise<void>,
  deleteItem: (id: number | null) => Promise<void>
}

//Modal内のConfigに対するProps
export interface ContentEditModalProps extends EditModalProps {
  valueBefore: string[];
  inputValue: string[];
  setInputValue: (val: string[]) => void;
}

//ModalのRendererに対するProps
export interface RendererEditModalProps extends EditModalProps {
  valueBefore: string[];
  inputValue: string[];
  setInputValue: (val: string[]) => void;
  selectID: number | null;
  setSelectID: (id: number | null) => void;
}