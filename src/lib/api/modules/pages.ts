import { buildUrl, request } from "../common";
import { makeResourceApi } from "../resource";

const pagesBase = buildUrl("/pages");

export const pagesApi = {
  ...makeResourceApi("pages"),
  findBySlug: (slug: string, headers: any = {}) =>
    request(`${pagesBase}/slug/${slug}`, "GET", { headers }),
  updateBySlug: (slug: string, data: any, headers: any = {}) =>
    request(`${pagesBase}/slug/${slug}`, "PATCH", { body: data, headers }),
};
