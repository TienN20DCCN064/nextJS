import { api } from "@/lib/api";
import { authHeaders, unwrapData, unwrapList } from "./helpers";

export const fetchProcedures = async (token?: string) =>
  unwrapList(await api.procedures.list({}, authHeaders(token)));

export const createProcedure = async (payload: any, token?: string) =>
  unwrapData(await api.procedures.create(payload, authHeaders(token)));

export const updateProcedure = async (
  id: string | number,
  data: any,
  token?: string,
) => unwrapData(await api.procedures.update(id, data, authHeaders(token)));

export const deleteProcedure = async (id: string | number, token?: string) =>
  unwrapData(await api.procedures.remove(id, authHeaders(token)));
