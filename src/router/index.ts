import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "index",
      component: () => import("@/views/IndexView.vue"),
      meta: { layer: 0 },
    },
    {
      path: "/takenote",
      name: "takenote",
      component: () => import("@/views/TakeNoteView.vue"),
      meta: { layer: 2 },
    },
    {
      path: "/accountDetail",
      name: "accountDetail",
      component: () => import("@/views/AccountDetail.vue"),
      meta: { layer: 1 },
    },
    // {
    //   path: "/login",
    //   name: "login",
    //   component: () => import("@/views/Login.vue"),
    // },
  ],
});
export default router;
