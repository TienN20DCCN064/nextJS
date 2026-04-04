import { api } from "@/lib/api";
import { authHeaders, unwrapList } from "./helpers";

export const fetchCategories = async (token?: string) =>
  unwrapList(await api.categories.list({}, authHeaders(token)));
