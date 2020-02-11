import { Settings } from "../../types";
import defaultStore from "../defaultStore";
import { SetSettingAction, SET_SETTING } from "../actions/settings";

function settingsReducer(
  state: Settings = defaultStore.settings,
  action: SetSettingAction
): Settings {
  switch (action.type) {
    case SET_SETTING:
      return {
        ...state,
        [action.key]: action.value
      };
    default:
      return state;
  }
}

export default settingsReducer;
