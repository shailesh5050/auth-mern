import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { persistStore } from "redux-persist";

const rootReducer = combineReducers({
  user: userSlice,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,

  whitelist: ["user"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export default store;
export const persistor = persistStore(store);
