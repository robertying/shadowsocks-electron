import { createStore } from "redux";
import { persistReducer, persistStore, PersistConfig } from "redux-persist";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import createElectronStorage from "redux-persist-electron-storage";
import rootReducer from "./reducers";
import { RootState } from "../types";

const persistConfig: PersistConfig<RootState> = {
  key: "root",
  storage: createElectronStorage(),
  stateReconciler: autoMergeLevel2,
  blacklist: ["status"]
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(
  persistedReducer,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);

export const persistor = persistStore(store as any);
