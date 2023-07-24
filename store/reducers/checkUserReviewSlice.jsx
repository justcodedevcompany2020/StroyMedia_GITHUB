import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

export const checkUserReviewRequest = createAsyncThunk(
  "allCat",
  async ({token, last_id, user_id}) => {
    let formdata = new FormData();
    formdata.append(
      "secret_token",
      token || (await AsyncStorage.getItem("token"))
    );
    formdata.append("last_id", last_id);
    formdata.append("user_id", user_id);

    let requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://teus.online/api/check-user-review",
        requestOptions
      );
      const data = await response.json();

      return data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
);

const checkUserReviewSlice = createSlice({
  name: "allCat",
  initialState: {
    loading: false,
    error: false,
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkUserReviewRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkUserReviewRequest.fulfilled, (state, action) => {
        state.data = action.payload?.data?.aplications?.aplications;
        state.error = false;
        state.loading = false;
      })
      .addCase(checkUserReviewRequest.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
  },
});

export default checkUserReviewSlice.reducer;
