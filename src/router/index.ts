import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "index",
      component: () => import("@/views/IndexView.vue"),
    },
    {
      path: "/takenote",
      name: "takenote",
      component: () => import("@/views/TakeNoteView.vue"),
    },
    {
      path: "/accountDetail",
      name: "accountDetail",
      component: () => import("@/views/AccountDetail.vue"),
    },
    // {
    //   path: "/login",
    //   name: "login",
    //   component: () => import("@/views/Login.vue"),
    // },
  ],
});
export default router;
