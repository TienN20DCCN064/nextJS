import { api } from "@/lib/api";
import { authHeaders, unwrapData, unwrapList } from "./helpers";

export const fetchPages = async (token?: string, published?: boolean) =>
  unwrapList(await api.pages.list({ published: published ? 'true' : undefined }, authHeaders(token)));

export const fetchAboutPage = async (token?: string) =>
  unwrapData(await api.pages.findBySlug("about", authHeaders(token)));

export const fetchContactPage = async (token?: string) =>
  unwrapData(await api.pages.findBySlug("contact", authHeaders(token)));

export const fetchPageBySlug = async (slug: string, token?: string, published?: boolean) =>
  unwrapData(await api.pages.findBySlug(`${slug}${published ? '?published=true' : ''}`, authHeaders(token)));

export const createPage = async (payload: any, token?: string) =>
  unwrapData(await api.pages.create(payload, authHeaders(token)));

export const updatePageBySlug = async (
  slug: string,
  payload: any,
  token?: string,
) => unwrapData(await api.pages.updateBySlug(slug, payload, authHeaders(token)));

export const updatePage = async (
  id: number | string,
  payload: any,
  token?: string,
) => unwrapData(await api.pages.update(id, payload, authHeaders(token)));

export const deletePage = async (id: string | number, token?: string) =>
  unwrapData(await api.pages.remove(id, authHeaders(token)));
