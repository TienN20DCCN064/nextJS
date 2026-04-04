import { buildUrl, request } from "../common";
import { makeResourceApi } from "../resource";

const documentsBase = buildUrl("/documents");

export const documentsApi = {
  ...makeResourceApi("documents"),
  findByCategory: (categoryId: string, headers: any = {}) =>
    request(`${documentsBase}/category/${categoryId}`, "GET", { headers }),
};
