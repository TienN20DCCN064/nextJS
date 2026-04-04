"use client";

import { useMemo } from "react";
import { api } from "@/lib/api";
import * as apiHooks from "./apiHooks";

export const useApi = () => {
  return useMemo(
    () => ({
      api,
      hooks: apiHooks,
    }),
    []
  );
};
