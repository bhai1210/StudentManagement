// src/features/classSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../Services/api";

import { message } from "antd";

// ✅ Fetch classes
export const fetchClasses = createAsyncThunk("classes/fetchClasses", async () => {
  const res = await api.get("/class");
  return res.data?.data || [];
});

// ✅ Create class
export const createClass = createAsyncThunk("classes/createClass", async (payload, { dispatch }) => {
  await api.post("/class", payload);
  message.success("Class created successfully!");
  dispatch(fetchClasses());
});

// ✅ Update class
export const updateClass = createAsyncThunk("classes/updateClass", async ({ id, payload }, { dispatch }) => {
  await api.put(`/class/${id}`, payload);
  message.success("Class updated successfully!");
  dispatch(fetchClasses());
});

// ✅ Delete class
export const deleteClass = createAsyncThunk("classes/deleteClass", async (id, { dispatch }) => {
  await api.delete(`/class/${id}`);
  message.success("Class deleted successfully!");
  dispatch(fetchClasses());
});

const classSlice = createSlice({
  name: "classes",
  initialState: {
    data: [],
    loading: false,
    saving: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create
      .addCase(createClass.pending, (state) => {
        state.saving = true;
      })
      .addCase(createClass.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(createClass.rejected, (state) => {
        state.saving = false;
      })

      // Update
      .addCase(updateClass.pending, (state) => {
        state.saving = true;
      })
      .addCase(updateClass.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(updateClass.rejected, (state) => {
        state.saving = false;
      })

      // Delete
      .addCase(deleteClass.pending, (state) => {
        state.saving = true;
      })
      .addCase(deleteClass.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(deleteClass.rejected, (state) => {
        state.saving = false;
      });
  },
});

export default classSlice.reducer;
