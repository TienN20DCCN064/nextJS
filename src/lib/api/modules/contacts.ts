import { buildUrl, request } from "../common";
import { makeResourceApi } from "../resource";

const contactsBase = buildUrl("/contacts");

export const contactsApi = {
  ...makeResourceApi("contacts"),
  findByStatus: (status: string, headers: any = {}) =>
    request(`${contactsBase}/status/${status}`, "GET", { headers }),
};
