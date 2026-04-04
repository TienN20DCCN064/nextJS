export * from "./auth";
export * from "./departments";
export * from "./pages";
export * from "./posts";
export * from "./procedures";
export * from "./staffs";
export * from "./users";
export * from "./categories";

import * as authHooks from "./auth";
import * as departmentHooks from "./departments";
import * as pageHooks from "./pages";
import * as postHooks from "./posts";
import * as procedureHooks from "./procedures";
import * as staffHooks from "./staffs";
import * as userHooks from "./users";
import * as categoryHooks from "./categories";

export const apiHooks = {
  ...authHooks,
  ...departmentHooks,
  ...pageHooks,
  ...postHooks,
  ...procedureHooks,
  ...staffHooks,
  ...userHooks,
  ...categoryHooks,
};
