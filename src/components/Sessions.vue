<template>
  <div
    class="flex flex-col gap-2 bg-base-200 p-4 rounded-xl h-[512px] relative overflow-hidden"
  >
    <h1 class="text-2xl font-bold">Sessies</h1>

    <!-- <div class="h-full">123</div> -->
    <div
      class="overflow-y-scroll relative h-full"
      id="scroll"
      @scroll="onScroll"
    >
      <div
        v-for="session in store.sessions"
        :key="session.id"
        class="text-xl font-bold"
      >
        {{ formatTime(session.tijd) }} -
        {{ session.expand.groupuser?.expand.user?.username }},
        {{ session.reps }} Reps
      </div>
    </div>

    <!-- box-shadow: -3px 0 5px 0 var(--shadowColor); -->
    <!-- <div
      class="absolute w-full h-8 bottom-0 left-0 bg-gradient-to-b from-transparent to-black"
    ></div> -->
    <div
      class="absolute w-full h-4 bottom-0 left-0 pointer-events-none transition-all duration-500 shadow-[0px_-2px_6px_0px_rgba(20,21,23,1)] dark:shadow-[0px_-8px_10px_0px_rgba(20,21,23,1)]"
      :class="{
        'opacity-0': !bottom
      }"
    ></div>

    <!-- <div class="">
    </div> -->

    <!-- <button v-if="store.sessions.length > 10" class="btn" @click="expand = !expand">
      <div class="material-symbols-rounded fill transition-all text-5xl" :class="{ 'rotate-180': expand }">
        expand_more
      </div>
    </button> -->
  </div>
</template>

<script setup lang="ts">
import { formatTime } from "@/utils";
import store from "@/store";
import { ref, onMounted, watch, onUpdated } from "vue";

let bottom = ref(1);

function onScroll(e: UIEvent) {
  const { scrollHeight, clientHeight, scrollTop } = e.target as HTMLDivElement;

  bottom.value = scrollHeight - clientHeight - scrollTop;
}

onUpdated(() => {
  const { scrollHeight, clientHeight, scrollTop } =
    document.getElementById("scroll") || {};

  bottom.value = (scrollHeight || 0) - (clientHeight || 0) - (scrollTop || 0);
});

// watch(() => store.sessions.length, () => {
//   const { scrollHeight, clientHeight, scrollTop } = document.getElementById(
//     "scroll"
//   ) as HTMLDivElement;
//   bottom.value = scrollHeight - clientHeight - scrollTop;
// })

// const sessions = ref<ExtendedSession[]>([])

// let expand = ref(false)

// function toggle() {

//   if (expand.value) {
//     sessions.value = store.sessions
//   } else {
//     sessions.value = store.sessions.slice(0, 10)
//   }

// }
</script>
