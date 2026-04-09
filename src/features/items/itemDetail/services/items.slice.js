import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchItems, fetchCategories, fetchItemDetail } from "../../items/services/items.api";

export const getItems = createAsyncThunk("items/getItems", async (params) => {
  return await fetchItems(params);
});

export const getCategories = createAsyncThunk("items/getCategories", async () => {
  return await fetchCategories();
});

export const getItemDetail = createAsyncThunk("items/getItemDetail", async (id) => {
  return await fetchItemDetail(id);
});

const itemsSlice = createSlice({
  name: "items",
  initialState: {
    items: [],
    categories: [],
    pagination: { current_page: 1, last_page: 1, total: 0 },
    filters: {
      keyword: "",
      category_id: "",
      min_price: "",
      max_price: "",
      city: "",
      state: "",
      sort_by: "latest",
    },
    loading: false,
    error: null,

    // detail
    detail: null,
    detailLoading: false,
    detailError: null,
  },
  reducers: {
    updateFilter: (state, action) => {
      state.filters[action.payload.key] = action.payload.value;
    },
    resetFilters: (state) => {
      state.filters = {
        keyword: "",
        category_id: "",
        min_price: "",
        max_price: "",
        city: "",
        state: "",
        sort_by: "latest",
      };
    },
    clearDetail: (state) => {
      state.detail = null;
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data.data;
        state.pagination = {
          current_page: action.payload.data.current_page,
          last_page: action.payload.data.last_page,
          total: action.payload.data.total,
        };
      })
      .addCase(getItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categories = action.payload.data || [];
      })
      .addCase(getItemDetail.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
        state.detail = null;
      })
      .addCase(getItemDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.detail = action.payload.data;
      })
      .addCase(getItemDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.error.message;
      });
  },
});

export const { updateFilter, resetFilters, clearDetail } = itemsSlice.actions;
export default itemsSlice.reducer;