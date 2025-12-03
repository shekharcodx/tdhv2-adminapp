// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import registrationReducer from "./slices/registrationSlice";

export const store = configureStore({
  reducer: {
    baseApi: baseApi.reducer,
    registration: registrationReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(baseApi.middleware);
  },
});
