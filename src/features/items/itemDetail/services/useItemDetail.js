import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getItemDetail, clearDetail } from "../services/items.slice";

export function useItemDetail(id) {
  const dispatch = useDispatch();
  const { detail, detailLoading, detailError } = useSelector((s) => s.items);

  useEffect(() => {
    if (id) dispatch(getItemDetail(id));
    return () => dispatch(clearDetail());
  }, [id, dispatch]);

  return { item: detail, loading: detailLoading, error: detailError };
}