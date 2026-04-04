import { api } from "@/lib/api";
import { unwrapData } from "./helpers";

export const login = async (payload: any) => {
  const res: any = await api.auth.login(payload);
  if (res?.statusCode && Number(res.statusCode) >= 400) {
    throw new Error(res?.message || "Login failed");
  }
  return res;
};

export const register = async (payload: any) =>
  unwrapData(await api.auth.register(payload));

export const checkCode = async (payload: any) =>
  unwrapData(await api.auth.checkCode(payload));

export const retryActive = async (payload: any) =>
  unwrapData(await api.auth.retryActive(payload.email));

export const retryPassword = async (payload: any) =>
  unwrapData(await api.auth.retryPassword(payload.email));

export const changePassword = async (payload: any) =>
  unwrapData(await api.auth.changePassword(payload));
