// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/services/auth.slice";
import itemsReducer from "../features/items/itemDetail/services/items.slice" 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    items: itemsReducer,
  },
});