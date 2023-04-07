import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Api";

export const getCitys = createAsyncThunk(
  "citys",
  async (data, { rejectWithValue }) => {
    try {
      const result = await api.post("/get-citys-data");
      return result;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        let error = err;
        if (!error.response) {
          throw err;
        }
        return rejectWithValue(error.response.data);
      }
      throw err;
    }
  }
);

const getCitysSlice = createSlice({
  name: "citys",
  initialState: {
    loading: false,
    error: false,
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCitys.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCitys.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(getCitys.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default getCitysSlice.reducer;
