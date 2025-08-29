// src/redux/checkoutSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  address: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  shippingMethod: "standard", // default
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setAddress: (state, action) => {
      state.address = action.payload.address;
      state.city = action.payload.city;
      state.state = action.payload.state;
      state.zip = action.payload.zip;
      state.country = action.payload.country;
    },
    setShippingMethod: (state, action) => {
      state.shippingMethod = action.payload;
    },
    clearCheckout: () => initialState,
  },
});

export const { setAddress, setShippingMethod, clearCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;
