<template>
  <div class="flex gap-4 items-center p-2">
    <RouterLink to="/" class="btn btn-square p-2">
      <chevronLeft class="h-full w-full fill-base-content" />
    </RouterLink>
    <h1 class="text-2xl font-bold">{{ groupUser.expand?.group?.naam }}</h1>
  </div>

  <main class="p-2 grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-6">

    <UserSessions :sessions="<ExtendedSession[]>sessions" :date="date" :groupUser="<ExtendedGroupUser>groupUser"
      @datechange="dateChangeEvent" />

    <Chart :sessions="<ExtendedSession[]>sessions" :groupUsers="<ExtendedGroupUser[]>groupUsers" />

    <Leaderboard :sessions="<ExtendedSession[]>sessions" :groupUsers="<ExtendedGroupUser[]>groupUsers" />


    <Sessions :sessions="<ExtendedSession[]>sessions" />

    <Chat :groupuser="<ExtendedGroupUser>groupUser" />

    <!-- <vue-particles color="#dedede"></vue-particles> -->

    <!-- <button id="test"></button> -->


  </main>
</template>

<script setup lang="ts">
import { auth, pb } from '@/pocketbase';
import type { BaseUser, Group, Session, GroupUser, Message } from '@/types';
import chevronLeft from "@/assets/chevron-left-solid.vue"
import { formatTime, chartUpdate } from '@/utils';

import UserSessions from "@/components/UserSessions.vue";
import Chart from "@/components/Chart.vue";
import Leaderboard from "@/components/Leaderboard.vue";
import Sessions from "@/components/Sessions.vue";
import Chat from "@/components/Chat.vue";
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()

export interface ExtendedGroupUser extends GroupUser {
  completedTime?: number
  totalReps?: number
  expand: {
    user: BaseUser
    group: Group
  }
}

export interface ExtendedSession extends Session {
  expand: {
    groupuser: ExtendedGroupUser
  }
}

const date = new Date()

let groupUser = ref(<ExtendedGroupUser>{})
let groupUsers = ref(<ExtendedGroupUser[]>[])
let sessions = ref(<ExtendedSession[]>[])

async function dateChangeEvent() {

  sessions.value.length = 0
  chartUpdate.emit("clear")
  await getSessions()
  updateGroupUsers()
}

async function getSessions() {


  sessions.value = await pb.collection("pushup_sessies").getFullList<ExtendedSession>({
    filter: `groupuser.group = "${route.params?.id}" && dag = "${date.getDate()}" && jaar = "${date.getFullYear()}" && maand = "${date.getMonth() + 1}"`,
    sort: "-tijd",
    expand: "groupuser.user"
  })


}
async function getGroupUsers() {

  groupUsers.value = await pb.collection("pushup_groupusers").getFullList<ExtendedGroupUser>({
    filter: `group = "${route.params?.id}"`,
    expand: "user, group"
  })

  updateGroupUsers()
}

async function updateGroupUsers() {

  groupUsers.value.forEach(groupUser => {

    const Asessions = [...sessions.value.filter(e => e.groupuser == groupUser.id)].reverse()

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

  groupUsers.value = groupUsers.value.sort((a, b) => {
    // a.completedTime && b.completedTime
    return (a.completedTime || 24 * 60) - (b.completedTime || 24 * 60)
  })

  groupUsers.value = groupUsers.value.sort((a, b) => {
    return Math.min(b.totalReps || 0, 100) - Math.min(a.totalReps || 0, 100)
  })

  const AgroupUser = groupUsers.value.find(e => e.user == auth.user?.id)

  if (AgroupUser) {

    console.log(AgroupUser);

    groupUser.value = AgroupUser
  }
}

onMounted(async () => {

  // var confettiSettings = { target: 'my-canvas' };
  // var confetti = new ConfettiGenerator(confettiSettings);
  // confetti.render();


  await getSessions()
  await getGroupUsers()

  pb.collection("pushup_sessies").subscribe("*", async () => {
    await getSessions()
    updateGroupUsers()
  })
  pb.collection("pushup_groupusers").subscribe("*", async () => {
    await getGroupUsers()
  })
})


</script>
