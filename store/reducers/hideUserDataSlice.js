import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Api";

export const hideUserRequest = createAsyncThunk(
  "hideuser",
  async ({ token, hideNumber }) => {
    await AsyncStorage.setItem("hide_person", "" + hideNumber);
    api
      .post("/hide-user-data", { secret_token: token, hide_person: hideNumber })
      .then((res) => {
        return res;
      })
      .catch((error) => {
        return error.message;
      });
  }
);

const hideUserSlice = createSlice({
  name: "hideUserData",
  initialState: {
    loading: false,
    error: false,
    hide: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(hideUserRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(hideUserRequest.fulfilled, (state) => {
        state.error = false;
      })
      .addCase(hideUserRequest.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
  },
});

export const { changeHideUser } = hideUserSlice.actions;
export default hideUserSlice.reducer;
