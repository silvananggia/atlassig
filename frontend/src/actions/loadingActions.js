
import {
  SHOW_LOADING
  } from "./types";

export const setLoading = (isLoading = true) => ({
    type: SHOW_LOADING,
    payload: isLoading,
  });
  