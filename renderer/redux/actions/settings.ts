import { Settings } from "../../types";

export const SET_SETTING = "SET_SETTING";

export function setSetting<T extends keyof Settings>(
  key: T,
  value: Settings[T]
) {
  return {
    type: SET_SETTING,
    key,
    value
  };
}

export type SetSettingAction = ReturnType<typeof setSetting>;
