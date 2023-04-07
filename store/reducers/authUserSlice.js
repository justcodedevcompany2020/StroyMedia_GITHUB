import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Api";

export const authRequest = createAsyncThunk("authUser", async ({ token }) => {
  try {
    const result = await api.post("/get-auth-data", { secret_token: token });
    return result;
  } catch (error) {
    return error;
  }
});

const authSlice = createSlice({
  name: "authUser",
  initialState: {
    loading: false,
    error: false,
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(authRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(authRequest.fulfilled, (state, action) => {
        state.data = action.payload.data.data;
        state.loading = false;
      })
      .addCase(authRequest.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default authSlice.reducer;
