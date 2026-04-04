import { buildUrl, request } from "../common";
import { makeResourceApi } from "../resource";

const mediaBase = buildUrl("/media");

export const mediaApi = {
  ...makeResourceApi("media"),
  findByType: (type: string, queryParams: any = {}, headers: any = {}) =>
    request(`${mediaBase}/type/${type}`, "GET", { queryParams, headers }),
};
