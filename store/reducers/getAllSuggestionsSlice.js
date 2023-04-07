import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Api";
import axios from "axios";

export const allSuggestionRequest = createAsyncThunk(
  "allSuggestions",
  async ({
    token,
    id,
    offset,
    searchText,
    to_city,
    from_city,
    type_container,
  }) => {
    let activeOffer;
    if (id === "Поиск КТК") {
      activeOffer = 2;
    } else if (id === "Продажа КТК") {
      activeOffer = 5;
    } else if (id === "Выдача КТК") {
      activeOffer = 3;
    } else if (id === "Контейнерный сервис") {
      activeOffer = 6;
    } else if (id === "Заявка на ТЭО") {
      activeOffer = 7;
    }
    try {
      const result = await api.post("/get-request-work-all", {
        secret_token: token,
        last_id: activeOffer,
        offset,
        searchText,
        type_container,
        to_city,
        from_city,
      });
      return result;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        let error = err;
        if (!error.response) {
          throw err;
        }
        return rejectWithValue(error.response.data);
      }
      throw err;
    }
  }
);

const allSuggestionsSlice = createSlice({
  name: "allSuggestions",
  initialState: {
    loading: false,
    error: false,
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(allSuggestionRequest.pending, (state) => {
        state.loading = true;
      })
      
      .addCase(allSuggestionRequest.fulfilled, (state, action) => {
        state.data = action.payload.data?.data.rows;
        state.error = false;
        state.loading = false;
      })

      .addCase(allSuggestionRequest.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
  },
});

export default allSuggestionsSlice.reducer;
