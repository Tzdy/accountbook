import { createApp } from "vue";
// import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import SvgIconVue from "./components/SvgIcon.vue";
import "virtual:svg-icons-register";
import "uno.css";
import "vant/es/toast/style";
import { indexdbUtil } from "./model";
import { createPinia } from "pinia";
indexdbUtil.connect().then(() => {
  const app = createApp(App);
  app.use(createPinia());
  app.use(router);
  app.component("SvgIcon", SvgIconVue);
  // app.config.errorHandler = (err, vm, info) => {
  //   // 处理错误
  //   // `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
  //   // alert(err.message);
  // };
  app.mount("#app");
});
