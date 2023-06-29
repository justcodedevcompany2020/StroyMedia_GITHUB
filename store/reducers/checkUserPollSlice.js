import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const checkUserPollRequest = createAsyncThunk(
  "check-user-poll",
  async ({ id }) => {
    try {
      const result = await api.post("/check-user-poll", {
        secret_token: await AsyncStorage.getItem("token"),
        last_id: id,
      });
      return result;
    } catch (error) {
      return error;
    }
  }
);
const checkUserPollSlice = createSlice({
  name: "check-user-poll",
  initialState: {
    loading: false,
    error: false,
    data: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getAnswerRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAnswerRequest.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.loading = false;
      })

      .addCase(getAnswerRequest.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default checkUserPollSlice.reducer;
