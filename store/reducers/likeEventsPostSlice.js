import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Api";

export const likeEventsRequest = createAsyncThunk(
  "like/events",
  async ({ token, id }) => {
    try {
      const result = await api.post("/send-likes-event", {
        secret_token: token,
        event_id: id,
      });
      return result;
    } catch (error) {
      return error;
    }
  }
);

const likeEventsSlice = createSlice({
  name: "likly/events",
  initialState: {
    loading: false,
    error: false,
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(likeEventsRequest.pending, (state) => {
        state.loading = true;
      })

      .addCase(likeEventsRequest.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })

      .addCase(likeEventsRequest.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default likeEventsSlice.reducer;
