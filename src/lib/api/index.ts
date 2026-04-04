import { authApi } from "./modules/auth";
import { bannersApi } from "./modules/banners";
import { categoriesApi } from "./modules/categories";
import { contactsApi } from "./modules/contacts";
import { departmentsApi } from "./modules/departments";
import { documentsApi } from "./modules/documents";
import { eventsApi } from "./modules/events";
import { faqsApi } from "./modules/faqs";
import { likesApi } from "./modules/likes";
import { mediaApi } from "./modules/media";
import { pagesApi } from "./modules/pages";
import { postsApi } from "./modules/posts";
import { proceduresApi } from "./modules/procedures";
import { restaurantsApi } from "./modules/restaurants";
import { reviewsApi } from "./modules/reviews";
import { settingsApi } from "./modules/settings";
import { staffsApi } from "./modules/staffs";
import { usersApi } from "./modules/users";

export {
  authApi,
  bannersApi,
  categoriesApi,
  contactsApi,
  departmentsApi,
  documentsApi,
  eventsApi,
  faqsApi,
  likesApi,
  mediaApi,
  pagesApi,
  postsApi,
  proceduresApi,
  restaurantsApi,
  reviewsApi,
  settingsApi,
  staffsApi,
  usersApi,
};

export const api = {
  auth: authApi,
  banners: bannersApi,
  categories: categoriesApi,
  contacts: contactsApi,
  departments: departmentsApi,
  documents: documentsApi,
  events: eventsApi,
  faqs: faqsApi,
  likes: likesApi,
  media: mediaApi,
  pages: pagesApi,
  posts: postsApi,
  procedures: proceduresApi,
  restaurants: restaurantsApi,
  reviews: reviewsApi,
  settings: settingsApi,
  staffs: staffsApi,
  users: usersApi,
};
