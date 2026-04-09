import { useState, useEffect, useCallback } from "react";
import { fetchItems, fetchCategories } from "./items.api";

const DEFAULT_FILTERS = {
  keyword: "",
  category_id: "",
  min_price: "",
  max_price: "",
  city: "",
  state: "",
  sort_by: "latest",
};

export function useItems() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadItems = useCallback(async (page = 1, activeFilters = appliedFilters) => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, ...activeFilters };
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);
      const res = await fetchItems(params);
      if (res.error === false) {
        setItems(res.data.data || []);
        setPagination({
          current_page: res.data.current_page,
          last_page: res.data.last_page,
          total: res.data.total,
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [appliedFilters]);

  const loadCategories = async () => {
    try {
      const res = await fetchCategories();
      if (res?.data) setCategories(res.data);
    } catch {
      // silently fail — categories are optional UI enhancement
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadItems(1, appliedFilters);
  }, [appliedFilters]);

  const applyFilters = () => {
    setAppliedFilters({ ...filters });
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const goToPage = (page) => {
    loadItems(page, appliedFilters);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    items,
    categories,
    filters,
    appliedFilters,
    pagination,
    loading,
    error,
    updateFilter,
    applyFilters,
    resetFilters,
    goToPage,
  };
}