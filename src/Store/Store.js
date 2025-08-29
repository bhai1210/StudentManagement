import { configureStore } from "@reduxjs/toolkit";
import classReducer from "../features/classSlice"; // if you have classSlice
import productReducer from "../features/productSlice";
import cartReducer from "../features/cartSlice"
import checkoutReducer from "../features/checkoutSlice";
const store = configureStore({
  reducer: {
    classes: classReducer,
    products: productReducer,
    cart:cartReducer,
    checkout: checkoutReducer,
  },
});

export default store;
