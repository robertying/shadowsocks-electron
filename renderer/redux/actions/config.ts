import { Config } from "../../types";

export const ADD_CONFIG = "ADD_CONFIG";
export const REMOVE_CONFIG = "REMOVE_CONFIG";
export const EDIT_CONFIG = "EDIT_CONFIG";

export const addConfig = (id: string, config: Config) => {
  return {
    type: ADD_CONFIG,
    id,
    config
  };
};

export const removeConfig = (id: string, config: Config) => {
  return {
    type: REMOVE_CONFIG,
    id,
    config
  };
};

export const editConfig = (id: string, config: Config) => {
  return {
    type: EDIT_CONFIG,
    id,
    config
  };
};

export type AddConfigAction = ReturnType<typeof addConfig>;
export type RemoveConfigAction = ReturnType<typeof removeConfig>;
export type EditConfigAction = ReturnType<typeof editConfig>;
