import { ChecklistItem, CleaningAreaItem, CleaningTypeItem, ContentEditModalProps, EditConfig, UserItem } from "./EditTypeConfig";

import { userConfig } from "./type/UserConfig";
import { cleaningTypeConfig } from "./type/CleaningTypeConfig";
import { cleaningAreaConfig } from "./type/CleaningAreaConfig";
import { checklistConfig } from "./type/ChecklistConfig";

type EditItemMap = {
  user: EditConfig<UserItem, ContentEditModalProps>;
  cleaning_type: EditConfig<CleaningTypeItem, ContentEditModalProps>;
  cleaning_area: EditConfig<CleaningAreaItem, ContentEditModalProps>;
  checklist: EditConfig<ChecklistItem, ContentEditModalProps>;
}

export const editConfig: EditItemMap = {
  user: userConfig,
  cleaning_type: cleaningTypeConfig,
  cleaning_area: cleaningAreaConfig,
  checklist: checklistConfig
};
