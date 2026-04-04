import { api } from "@/lib/api";
import { authHeaders, unwrapData, unwrapList } from "./helpers";

export const fetchNews = async (token?: string, status?: string, limit: number = 1000) =>
  unwrapList(await api.posts.list({ type: "news", status, limit }, authHeaders(token)));

export const createNews = async (payload: any, token?: string) =>
  unwrapData(
    await api.posts.create({ ...payload, type: "news" }, authHeaders(token)),
  );

export const updateNews = async (id: string | number, payload: any, token?: string) =>
  unwrapData(
    await api.posts.update(
      id,
      { ...payload, type: "news" },
      authHeaders(token),
    ),
  );

export const deleteNews = async (id: string | number, token?: string) =>
  unwrapData(await api.posts.remove(id, authHeaders(token)));

export const fetchAnnouncements = async (token?: string, status?: string) =>
  unwrapList(
    await api.posts.list({ type: "announcement", status }, authHeaders(token)),
  );

export const createAnnouncement = async (payload: any, token?: string) =>
  unwrapData(
    await api.posts.create(
      { ...payload, type: "announcement" },
      authHeaders(token),
    ),
  );

export const updateAnnouncement = async (
  id: string | number,
  payload: any,
  token?: string,
) =>
  unwrapData(
    await api.posts.update(
      id,
      { ...payload, type: "announcement" },
      authHeaders(token),
    ),
  );

export const deleteAnnouncement = async (id: string | number, token?: string) =>
  unwrapData(await api.posts.remove(id, authHeaders(token)));

export const fetchLatestNews = async (token?: string) => {
  const items = await api.posts.list({ limit: 1 }, authHeaders(token));
  return unwrapList(items)[0] ?? null;
};

export const fetchLatestAnnouncements = async (token?: string) => {
  const items = await api.posts.list({ limit: 1 }, authHeaders(token));
  return unwrapList(items)[0] ?? null;
};
