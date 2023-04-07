import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Api";

export const personalNotificationRequest = createAsyncThunk(
  "personalNotification",
  async ({ token, name }) => {
    await AsyncStorage.setItem("personal_notify", name);
    api
      .post("/notification-control/personal-push-notification", {
        secret_token: token,
        personal_push_nothify: name,
      })
      .then((res) => {
        return res;
      })
      .catch((error) => {
        return error;
      });
  }
);

const personalNotificationSlice = createSlice({
  name: "personalNotification",
  initialState: {
    loading: false,
    error: false,
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(personalNotificationRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(personalNotificationRequest.fulfilled, (state, action) => {
        state.data = action.payload;
        state.error = false;
      })

      .addCase(personalNotificationRequest.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
  },
});

export default personalNotificationSlice.reducer;
