import { EditConfig } from "./EditTypeConfig";
import { ItemMap } from "./EditTypeConfig";

import { userConfig } from "./type/UserConfig";
import { cleaningTypeConfig } from "./type/CleaningTypeConfig";
import { cleaningAreaConfig } from "./type/CleaningAreaConfig";
import { checklistConfig } from "./type/ChecklistConfig";

export const editConfig: { [K in keyof ItemMap]: EditConfig<ItemMap[K]> } = {
  user: userConfig,
  cleaning_type: cleaningTypeConfig,
  cleaning_area: cleaningAreaConfig,
  checklist: checklistConfig
};
