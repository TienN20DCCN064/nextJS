import { api } from "@/lib/api";
import { authHeaders, unwrapData, unwrapList } from "./helpers";

export const fetchDepartments = async (token?: string) =>
  unwrapList(await api.departments.list({}, authHeaders(token)));

export const createDepartment = async (payload: any, token?: string) =>
  unwrapData(await api.departments.create(payload, authHeaders(token)));

export const updateDepartment = async (
  id: string | number,
  payload: any,
  token?: string,
) => unwrapData(await api.departments.update(id, payload, authHeaders(token)));

export const deleteDepartment = async (id: string | number, token?: string) =>
  unwrapData(await api.departments.remove(id, authHeaders(token)));
