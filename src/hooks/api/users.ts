import { api } from "@/lib/api";
import { authHeaders, unwrapData, unwrapList } from "./helpers";

export const fetchUsers = async (token?: string, queryParams: any = {}) =>
  unwrapList(await api.users.list(queryParams, authHeaders(token)));

export const createUser = async (payload: any, token?: string) =>
  unwrapData(await api.users.create(payload, authHeaders(token)));

export const updateUser = async (id: string | number, payload: any, token?: string) =>
  unwrapData(await api.users.update(id, payload, authHeaders(token)));

export const deleteUser = async (id: string | number, token?: string) =>
  unwrapData(await api.users.remove(id, authHeaders(token)));
