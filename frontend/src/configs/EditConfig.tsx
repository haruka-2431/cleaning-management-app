import {
  ChecklistItem,
  CleaningAreaItem,
  CleaningTypeItem,
  ContentEditModalProps,
  EditConfig,
  UserItem,
} from "./EditTypeConfig";

import { userConfig } from "./type/UserConfig";
import { cleaningTypeConfig } from "./type/CleaningTypeConfig";
import { cleaningAreaConfig } from "./type/CleaningAreaConfig";
import { ChecklistConfig } from "./type/ChecklistConfig";

export type ChecklistHeaderProps = {
  selectedSpotID: number | "";
  setSelectedSpotID: React.Dispatch<React.SetStateAction<number | "">>;
};

type EditItemMap = {
  user: EditConfig<UserItem, ContentEditModalProps>;
  cleaning_type: EditConfig<CleaningTypeItem, ContentEditModalProps>;
  cleaning_area: EditConfig<CleaningAreaItem, ContentEditModalProps>;
  Checklist: EditConfig<
    ChecklistItem,
    ContentEditModalProps,
    ChecklistHeaderProps
  >;
};

export const editConfig: EditItemMap = {
  user: userConfig,
  cleaning_type: cleaningTypeConfig,
  cleaning_area: cleaningAreaConfig,
  Checklist: ChecklistConfig,
};
