import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Api";

export const getEventsRequest = createAsyncThunk(
  "get/events",
  async ({ token, events_id }) => {
    try {
      const result = api.post("/get-events-all", {
        secret_token: token,
        event_id: events_id,
      });
      return result;
    } catch (error) {
      return error;
    }
  }
);
const getEventsSlice = createSlice({
  name: "events",
  initialState: {
    loading: false,
    error: false,
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getEventsRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEventsRequest.fulfilled, (state, action) => {
        state.data = action.payload.data.data;
        state.loading = false;
      })

      .addCase(getEventsRequest.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default getEventsSlice.reducer;
