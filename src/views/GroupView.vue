<template>
  <div class="flex gap-4 items-center p-2">
    <RouterLink to="/" class="btn btn-square p-2">
      <chevronLeft class="h-full w-full fill-base-content" />
    </RouterLink>
    <h1 class="text-2xl font-bold">{{ store.groupUser.expand?.group?.naam }}. dag {{ getDaysDiff() }} / 31</h1>
  </div>

  <main class="p-2 grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-6">

    <UserSessions :date="date" @datechange="dateChangeEvent" />
    <Chart />
    <Leaderboard />
    <Sessions />
    <Chat />

  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { auth, pb } from '@/pocketbase';

import type { ExtendedGroupUser, ExtendedSession } from '@/types';

import chevronLeft from "@/assets/chevron-left-solid.vue"
import UserSessions from "@/components/UserSessions.vue";
import Chart from "@/components/Chart.vue";
import Leaderboard from "@/components/Leaderboard.vue";
import Sessions from "@/components/Sessions.vue";
import Chat from "@/components/Chat.vue";

import { chartUpdate } from '@/utils';

import store from "@/store"

const route = useRoute()

const date = new Date()

// let groupUser = ref(<ExtendedGroupUser>{})
// let groupUsers = ref(<ExtendedGroupUser[]>[])
// let sessions = ref(<ExtendedSession[]>[])

function getDaysDiff() {

  const now = new Date(date)
  const start = new Date(2023, 6, 12, 0, 0, 0, 0)

  // date2.setDate(date2.getDate() + 1)

  now.setHours(0, 0, 0, 0)
  start.setHours(0, 0, 0, 0)

  return (now.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)
}

async function dateChangeEvent() {

  store.sessions.length = 0
  chartUpdate.emit("clear")
  await getSessions()
  updateGroupUsers()
}

async function getSessions() {


  store.sessions = await pb.collection("pushup_sessies").getFullList<ExtendedSession>({
    filter: `groupuser.group = "${route.params?.id}" && dag = "${date.getDate()}" && jaar = "${date.getFullYear()}" && maand = "${date.getMonth() + 1}"`,
    sort: "-tijd",
    expand: "groupuser.user"
  })


}
async function getGroupUsers() {

  store.groupUsers = await pb.collection("pushup_groupusers").getFullList<ExtendedGroupUser>({
    filter: `group = "${route.params?.id}"`,
    expand: "user, group"
  })

}

async function updateGroupUsers() {

  store.groupUsers.forEach(groupUser => {

    const Asessions = [...store.sessions.filter(e => e.groupuser == groupUser.id)].reverse()

    groupUser.completedTime = undefined
    groupUser.totalReps = 0

    Asessions.forEach(Asessions => {

      if (typeof groupUser.totalReps == "undefined") {
        return
      }
      groupUser.totalReps += Asessions.reps

      if (groupUser.totalReps >= 100 && !groupUser.completedTime) {
        groupUser.completedTime = Asessions.tijd
      }
    })

  });

  store.groupUsers = store.groupUsers.sort((a, b) => {
    // a.completedTime && b.completedTime
    return (a.completedTime || 24 * 60) - (b.completedTime || 24 * 60)
  })

  store.groupUsers = store.groupUsers.sort((a, b) => {
    return Math.min(b.totalReps || 0, 100) - Math.min(a.totalReps || 0, 100)
  })

  const AgroupUser = store.groupUsers.find(e => e.user == auth.user?.id)

  if (AgroupUser) {

    console.log(AgroupUser);

    store.groupUser = AgroupUser
  }
}

onMounted(async () => {

  // var confettiSettings = { target: 'my-canvas' };
  // var confetti = new ConfettiGenerator(confettiSettings);
  // confetti.render();


  await getSessions()
  await getGroupUsers()

  updateGroupUsers()

  pb.collection("pushup_sessies").subscribe("*", async () => {
    await getSessions()
    updateGroupUsers()
  })
  pb.collection("pushup_groupusers").subscribe("*", async () => {
    await getGroupUsers()
    updateGroupUsers()
  })
})


</script>
