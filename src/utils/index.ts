import { useToast, type ToastPluginApi } from "vue-toast-notification";

export const getDay = (): number => {
  var now = new Date().getTime();
  var bDay = new Date(new Date().getFullYear() - 1, 11, 31).getTime()
  // console.log(new Date(new Date().getFullYear() - 1, 11, 31));
  var elapsedT = now - bDay; // in ms
  const msInDay = 1000 * 60 * 60 * 24
  const days = Math.floor(elapsedT / msInDay)
  return days
}

class Toast {
  toast: ToastPluginApi

  constructor() {
    this.toast = useToast()
  }
  clear() {
    this.toast.clear()
  }
  info(msg: string) {
    this.toast.info(msg, {
      duration: 5000,
      position: "top-right",
    })
  }
  success(msg: string) {
    this.toast.success(msg, {
      duration: 5000,
      position: "top-right",
    })
  }
  error(msg: string) {
    this.toast.error(msg, {
      duration: 5000,
      position: "top-right",
    })
  }
}

export const toast = new Toast()