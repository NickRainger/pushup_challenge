import { useToast, type ToastPluginApi } from "vue-toast-notification";
// import type { ExtendedSession } from '@/types';

export const getDay = (): number => {
  var now = new Date().getTime();
  var bDay = new Date(new Date().getFullYear() - 1, 11, 31).getTime()
  // console.log(new Date(new Date().getFullYear() - 1, 11, 31));
  var elapsedT = now - bDay; // in ms
  const msInDay = 1000 * 60 * 60 * 24
  const days = Math.floor(elapsedT / msInDay)
  return days
}



export const formatTime = (time: number | undefined): string => {
  if (!time) { return "" }
  return `${Math.floor(time / 60)}:${time % 60 < 10 ? "0" : ""}${time % 60}`
}

export const getHexFromString = (seed: string): string => {
  return Math.floor((Math.abs(Math.sin(parseInt(seed, 36)) * 16777215))).toString(16)
}


// export const getTotalReps = (filter: string, sessions: ExtendedSession[]) => {

//   let total = 0
//   sessions.filter(e => e.expand.groupuser?.user == filter).forEach(session => {
//     total += session.reps
//   })
//   return total
// }


class ChartUpdate {
  listeners: { event: string, cb: Function }[]
  constructor() {
    this.listeners = []
  }
  emit(event: string, data?: any) {
    this.listeners.filter(e => e.event == event).forEach(event => {
      event.cb(data)
    })
  }
  on(event: string, cb: Function) {
    this.listeners.push({ event, cb })
  }
}

export const chartUpdate = new ChartUpdate()

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