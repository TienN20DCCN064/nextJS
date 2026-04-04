import { buildUrl, request } from "../common";
import { makeResourceApi } from "../resource";

const categoriesBase = buildUrl("/categories");

export const categoriesApi = {
  ...makeResourceApi("categories"),
  findByType: (type: string, queryParams: any = {}, headers: any = {}) =>
    request(`${categoriesBase}/type/${type}`, "GET", { queryParams, headers }),
};
