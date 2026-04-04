import { buildUrl, request, requestFile } from "./common";

export type ResourceApi<TItem = any, TCreate = any, TUpdate = any> = {
  list: (queryParams?: any, headers?: any) => Promise<IBackendRes<TItem>>;
  listWithOptions: (
    queryParams?: any,
    headers?: any,
  ) => Promise<IBackendRes<TItem>>;
  getById: (id: string | number, headers?: any) => Promise<IBackendRes<TItem>>;
  create: (data: TCreate, headers?: any) => Promise<IBackendRes<TItem>>;
  update: (
    id: string | number,
    data: TUpdate,
    headers?: any,
  ) => Promise<IBackendRes<TItem>>;
  updateByBody: (data: TUpdate, headers?: any) => Promise<IBackendRes<TItem>>;
  remove: (id: string | number, headers?: any) => Promise<IBackendRes<TItem>>;
  createFile: (data: any, headers?: any) => Promise<IBackendRes<TItem>>;
};

export const makeResourceApi = (resourcePath: string): ResourceApi => {
  const base = (path = "") => buildUrl(`/${resourcePath}${path}`);

  return {
    list: (queryParams = {}, headers = {}) =>
      request(base(), "GET", { queryParams, headers }),
    listWithOptions: (queryParams = {}, headers = {}) =>
      request(base(), "GET", { queryParams, headers }),
    getById: (id, headers = {}) => request(base(`/${id}`), "GET", { headers }),
    create: (data, headers = {}) =>
      request(base(), "POST", { body: data, headers }),
    update: (id, data, headers = {}) =>
      request(base(`/${id}`), "PATCH", { body: data, headers }),
    updateByBody: (data, headers = {}) =>
      request(base(), "PATCH", { body: data, headers }),
    remove: (id, headers = {}) =>
      request(base(`/${id}`), "DELETE", { headers }),
    createFile: (data, headers = {}) =>
      requestFile(base(), "POST", { body: data, headers }),
  };
};
