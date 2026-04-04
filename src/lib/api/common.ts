import { sendRequest, sendRequestFile } from "@/utils/api";

export const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL
  ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`
  : "/api/v1";

export type ApiRequestOptions = {
  body?: any;
  headers?: Record<string, string>;
  queryParams?: any;
  useCredentials?: boolean;
  nextOption?: any;
};

export const buildUrl = (path: string) => {
  const normalized = path.startsWith("/") ? path.substring(1) : path;
  return `${API_BASE}/${normalized}`;
};

export const request = async <T>(
  url: string,
  method: string,
  options: ApiRequestOptions = {}
) => {
  return sendRequest<T>({
    url,
    method,
    body: options.body,
    queryParams: options.queryParams,
    headers: options.headers,
    useCredentials: options.useCredentials,
    nextOption: options.nextOption,
  });
};

export const requestFile = async <T>(
  url: string,
  method: string,
  options: ApiRequestOptions = {}
) => {
  return sendRequestFile<T>({
    url,
    method,
    body: options.body,
    queryParams: options.queryParams,
    headers: options.headers,
    useCredentials: options.useCredentials,
    nextOption: options.nextOption,
  });
};
