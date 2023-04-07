import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Api";

export const sendCatRequest = createAsyncThunk("sendCat", async (data) => {
  try {
    const result = await api.post("/cat-serv-send", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return result;
  } catch (error) {
    return error;
  }
});

const sendCatSlice = createSlice({
  name: "sendCat",
  initialState: {
    loading: false,
    error: false,
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(sendCatRequest.pending, (state) => {
        state.loading = true;
      })
      
      .addCase(sendCatRequest.fulfilled, (state, action) => {
        state.data = action.payload;
        state.error = false;
      })

      .addCase(sendCatRequest.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
  },
});

export default sendCatSlice.reducer;
