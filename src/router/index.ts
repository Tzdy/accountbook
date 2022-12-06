import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "IndexView", // name与组件名一致，方便缓存
      component: () => import("@/views/IndexView.vue"),
      meta: { layer: 0, keepAlive: true },
    },
    {
      path: "/takenote",
      name: "TakeNoteView",
      component: () => import("@/views/TakeNoteView.vue"),
      meta: { layer: 3 },
    },
    {
      path: "/accountDetail",
      name: "AccountDetail",
      component: () => import("@/views/AccountDetail.vue"),
      meta: { layer: 2 },
    },
    {
      path: "/accountTypeDetail",
      name: "AccountTypeDetail",
      component: () => import("@/views/AccountTypeDetail.vue"),
      meta: { layer: 1, keepAlive: true },
    },
    {
      path: "/transactionDetail",
      name: "TransactionDetail",
      component: () => import("@/views/TransactionDetail.vue"),
      meta: { layer: 2, keepAlive: true },
    },
    // {
    //   path: "/login",
    //   name: "login",
    //   component: () => import("@/views/Login.vue"),
    // },
  ],
});
export default router;
