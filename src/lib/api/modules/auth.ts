import { buildUrl, request } from "../common";

const authBase = buildUrl("/auth");

export const authApi = {
  login: (data: any, headers: any = {}) =>
    request(`${authBase}/login`, "POST", { body: data, headers }),
  register: (data: any, headers: any = {}) =>
    request(`${authBase}/register`, "POST", { body: data, headers }),
  checkCode: (data: any, headers: any = {}) =>
    request(`${authBase}/check-code`, "POST", { body: data, headers }),
  retryActive: (email: string, headers: any = {}) =>
    request(`${authBase}/retry-active`, "POST", { body: { email }, headers }),
  retryPassword: (email: string, headers: any = {}) =>
    request(`${authBase}/retry-password`, "POST", { body: { email }, headers }),
  changePassword: (data: any, headers: any = {}) =>
    request(`${authBase}/change-password`, "POST", { body: data, headers }),
  testMail: (headers: any = {}) =>
    request(`${authBase}/mail`, "GET", { headers }),
};
