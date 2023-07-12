import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Api";

export const hideUserRequest = createAsyncThunk(
  "hideuser",
  async ({ token, hideNumber }) => {
    await AsyncStorage.setItem("hide_person", "" + hideNumber);
    try {
      const response = await api.post("/hide-user-data", {
        secret_token: token,
        hide_person: hideNumber,
      });
      return response;
    } catch (e) {
      return error.message;
    }
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
      .addCase(hideUserRequest.fulfilled, (state, action) => {
        state.error = false;
        // state.hide = action.meta.arg.hideNumber;
      })
      .addCase(hideUserRequest.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
  },
});

export const { changeHideUser } = hideUserSlice.actions;
export default hideUserSlice.reducer;
