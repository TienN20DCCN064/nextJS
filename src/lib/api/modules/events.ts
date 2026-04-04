import { buildUrl, request } from "../common";
import { makeResourceApi } from "../resource";

const eventsBase = buildUrl("/events");

export const eventsApi = {
  ...makeResourceApi("events"),
  findUpcoming: (headers: any = {}) =>
    request(`${eventsBase}/upcoming`, "GET", { headers }),
};
