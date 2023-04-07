import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Api";

export const getCountrys = createAsyncThunk("countrys", async () => {
  try {
    const result = api.post("/get-countrys-data");
    return result;
  } catch (error) {
    return error;
  }
});
const getCountrySlice = createSlice({
  name: "countrys",
  initialState: {
    loading: false,
    error: false,
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getCountrys.pending, (state, action) => {
        state.loading = true;
      })
      
      .addCase(getCountrys.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })

      .addCase(getCountrys.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export default getCountrySlice.reducer;
