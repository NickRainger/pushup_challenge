<template>
  <div class="flex flex-col gap-2 bg-base-200 p-4 rounded-xl">

    <h1 class="text-2xl font-bold">Sessies</h1>

    <div v-for="session in store.sessions.filter((e, i) => i < 10 || expand)" :key="session.id" class="text-xl font-bold ">

      {{ formatTime(session.tijd) }} - {{ session.expand.groupuser?.expand.user?.username }}, {{ session.reps }} Reps

    </div>

    <button v-if="store.sessions.length > 10" class="btn" @click="expand = !expand">
      <div class="material-symbols-rounded fill transition-all text-5xl" :class="{ 'rotate-180': expand }">
        expand_more
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">

import { formatTime } from '@/utils';
import store from "@/store"
import { ref } from 'vue';

// watch(() => store.sessions.length, () => {
//   sessions.value = store.sessions.slice(0, 10)
// })

// const sessions = ref<ExtendedSession[]>([])

let expand = ref(false)

// function toggle() {

  

//   if (expand.value) {
//     sessions.value = store.sessions
//   } else {
//     sessions.value = store.sessions.slice(0, 10)
//   }

// }


</script>