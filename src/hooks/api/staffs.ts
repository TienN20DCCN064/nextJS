import { api } from "@/lib/api";
import { authHeaders, unwrapData, unwrapList } from "./helpers";

export const fetchStaffs = async (token?: string) =>
  unwrapList(await api.staffs.list({}, authHeaders(token)));

export const createStaff = async (payload: any, token?: string) =>
  unwrapData(await api.staffs.create(payload, authHeaders(token)));

export const updateStaff = async (
  id: string | number,
  payload: any,
  token?: string,
) => unwrapData(await api.staffs.update(id, payload, authHeaders(token)));

export const deleteStaff = async (id: string | number, token?: string) =>
  unwrapData(await api.staffs.remove(id, authHeaders(token)));
