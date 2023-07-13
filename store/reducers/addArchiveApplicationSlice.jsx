import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const addArchiveApplicationRequest = createAsyncThunk(
  "allCat",
  async ({ token, last_id }) => {
    var formdata = new FormData();
    formdata.append("secret_token", token);
    formdata.append("last_id", last_id);

    var requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://teus.online/api/cat-request-close",
        requestOptions
      );
      const data = await response.json();
      console.log(data);
      return data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
);

// const addArchiveApplicationSlice = createSlice({
//   name: "allCat",
//   initialState: {
//     loading: false,
//     error: false,
//     data: [],
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(addArchiveApplicationRequest.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(addArchiveApplicationRequest.fulfilled, (state, action) => {
//         state.error = false;
//         state.loading = false;
//       })
//       .addCase(addArchiveApplicationRequest.rejected, (state) => {
//         state.error = true;
//         state.loading = false;
//       });
//   },
// });

// export default addArchiveApplicationSlice.reducer;
