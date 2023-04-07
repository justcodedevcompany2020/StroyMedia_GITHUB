import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../Api";

export const loginRequest = createAsyncThunk("login", async (data) => {
  const result = await api
    .post("/user-login", data)
    .then((result) => {
      AsyncStorage.setItem("token", result.data.data.secret_token);
      return result.data.data.secret_token;
    })
    .catch((error) => {
      return error.message;
    });

  return result;
});

const loginSlice = createSlice({
  name: "login",
  initialState: {
    loading: false,
    error: false,
    token: "",
  },
  reducers: {
    logout: (state) => {
      state.token = "";
      AsyncStorage.removeItem("token").then((value) => value);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginRequest.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loginRequest.fulfilled, (state, action) => {
      const success = action.payload + "";
      if (success.includes(422)) {
        state.token = "";
        state.loading = false;
        state.error = "неверный пароль или адрес электронной почты";
      } else {
        state.token = action.payload;
      }
    });
    builder.addCase(loginRequest.rejected, (state) => {
      state.error = true;
      state.loading = false;
    });
  },
});

export const { logout } = loginSlice.actions;
export default loginSlice.reducer;
