import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

export const workRequest = createAsyncThunk(
  "work/request",
  async (form_data) => {
    let requestOptions = {
      method: "POST",
      // headers: myHeaders,
      body: form_data,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        "https://teus.online/api/work-request-send",
        requestOptions
      );
      const data = await response.json();
      
      return data;
    } catch (error) {
      return error;
    }
  }
);
const workRequestSlice = createSlice({
  name: "work/request",
  initialState: {
    loading: false,
    error: false,
    data: [],
  },

  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(workRequest.pending, (state) => {
        state.loading = true;
      })

      .addCase(workRequest.fulfilled, (state, action) => {
        state.data = action.payload;
        state.error = false;
        state.loading = false;
      })

      .addCase(workRequest.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
  },
});

export default workRequestSlice.reducer;
