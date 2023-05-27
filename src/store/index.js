import { configureStore } from "@reduxjs/toolkit";
import invoice from "../reducers";

// Redux Store
const store = configureStore({
  reducer: invoice,
});

export default store;
