import { buildUrl, request } from "../common";
import { makeResourceApi } from "../resource";

const postsBase = buildUrl("/posts");

export const postsApi = {
  ...makeResourceApi("posts"),
  findFeatured: (headers: any = {}) =>
    request(`${postsBase}/featured`, "GET", { headers }),
  findByCategory: (categoryId: string, headers: any = {}) =>
    request(`${postsBase}/category/${categoryId}`, "GET", { headers }),
  findBySlug: (slug: string, headers: any = {}) =>
    request(`${postsBase}/slug/${slug}`, "GET", { headers }),
};
