<template>
  <div class="flex flex-col gap-2 bg-base-200 p-4 rounded-xl">

    <div class="flex items-center justify-center gap-4">

      <button class="btn btn-square text-3xl material-symbols-rounded" @click="setDay('subtract')">
        arrow_back_ios
      </button>

      <h1 class="font-bold"> {{ selectedDate }}</h1>
      <button class="btn font-bold" :class="{ 'btn-disabled': new Date().toLocaleDateString() == selectedDate }"
        @click="setDay('today')">
        vandaag
      </button>

      <button class="btn btn-square text-3xl material-symbols-rounded" @click="setDay('add')">
        arrow_forward_ios
      </button>

    </div>

    <div v-for="session in sessions.filter(e => e.expand.groupuser?.user == auth.user?.id).reverse()" :key="session.id"
      class="flex">
      <h1 class="text-xl font-semibold text-base-content">{{ formatTime(session.tijd) }}</h1>
      <pre class="text-xl font-semibold"> - </pre>
      <h1 class="text-xl font-semibold flex-1">Reps: {{ session.reps }} </h1>
      <button @click="del(session.id)" class="btn btn-error btn-sm">Del</button>
    </div>

    <h1 class="text-2xl font-bold">totaal: {{ groupUser.totalReps }}</h1>

    <form @submit="addSession()" @submit.prevent class="flex flex-col gap-2">

      <h1 class="text-xl font-semibold">reps Toevoegen</h1>

      <div class="join w-full">
        <input class="input input-sm join-item w-1/2" type="text" required v-model="newSession" placeholder="reps">
        <button class="btn btn-success btn-sm join-item w-1/2">Toevoegen</button>
      </div>

    </form>

  </div>

  <canvas class="w-screen absolute top-0 left-0 h-screen pointer-events-none z-50" id="my-canvas"></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { ExtendedSession, ExtendedGroupUser } from '@/views/GroupView.vue';
import { auth, pb } from '@/pocketbase';
import { formatTime } from '@/utils';
import confetti from "canvas-confetti"

const props = defineProps<{
  sessions: ExtendedSession[],
  groupUser: ExtendedGroupUser,
  date: Date
}>()

let selectedDate = ref("")
let newSession = ref<number | string>("")

function del(id: string) {
  pb.collection("pushup_sessies").delete(id)
}

function activateConfetti() {

  var myCanvas = <HTMLCanvasElement | null>document.getElementById('my-canvas');

  if (!myCanvas) {
    return
  }

  var myConfetti = confetti.create(myCanvas, {
    resize: true,
    useWorker: true
  });

  console.log(Math.random() * 0.4 + 0.3,);

  myConfetti({
    particleCount: 100,
    spread: 160,
    startVelocity: 30,


    origin: {
      x: Math.random() * 0.4 + 0.3,
      // since they fall down, start a bit higher than random
      y: Math.random() * 0.4 + 0.3,
    }
  });
}

function addSession() {

  // if ((props.groupUser.totalReps || 0) < 100 && ((props.groupUser.totalReps || 0) + Number(newSession.value) >= 100)) {
  const interval = setInterval(() => {
    activateConfetti()
  }, 200,)

  setTimeout(() => {
    clearInterval(interval)
  }, 3000);
  // }

  pb.collection("pushup_sessies").create({
    reps: newSession.value,
    dag: props.date.getDate(),
    maand: props.date.getMonth() + 1,
    jaar: props.date.getFullYear(),
    tijd: new Date().toLocaleDateString() == selectedDate.value ? new Date().getMinutes() + new Date().getHours() * 60 : 1440,
    groupuser: props.groupUser.id,
  })
}

const emit = defineEmits<{
  datechange: []
}>()

async function setDay(type: "subtract" | "add" | "today") {

  if (type == 'subtract') {
    props.date.setDate(props.date.getDate() - 1)
  } else if (type == 'add') {
    props.date.setDate(props.date.getDate() + 1)
  } else if (type == 'today') {
    props.date.setTime(Date.now())
  }
  emit("datechange")
  selectedDate.value = props.date.toLocaleDateString()
}
onMounted(() => {

  selectedDate.value = props.date.toLocaleDateString()
})

</script>