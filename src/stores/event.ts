import { defineStore } from "pinia";

// Initialize deferredPrompt for use later to show browser install prompt.
let deferredPrompt;
console.log("???");
window.addEventListener("beforeinstallprompt", (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later.
  console.log(e);
  useEvent().deferredPrompt = e;
  // Update UI notify the user they can install the PWA
  // showInstallPromotion();
  // Optionally, send analytics event that PWA install promo was shown.
  console.log(`'beforeinstallprompt' event was fired.`);
});

export const useEvent = defineStore("event", {
  state: () => ({
    deferredPrompt: null as Event | null,
  }),
  actions: {
    installApp() {
      if (this.deferredPrompt) {
        this.deferredPrompt.prompt();
      }
    },
  },
});
