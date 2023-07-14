<template>
  <div class="flex gap-4 items-center p-2">
    <RouterLink to="/" class="btn btn-square p-2">
      <chevronLeft class="h-full w-full fill-base-content" />
    </RouterLink>
    <h1 class="text-2xl font-bold">{{ groupUser.expand?.group?.naam }}</h1>
  </div>

  <main class="p-2 grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-6">

    <UserSessions :sessions="<ExtendedSession[]>sessions" :date="date" :groupUser="<ExtendedGroupUser>groupUser" @datechange="dateChangeEvent" />

    <Chart :sessions="<ExtendedSession[]>sessions" :groupUsers="<ExtendedGroupUser[]>groupUsers" />

    <Leaderboard :sessions="<ExtendedSession[]>sessions" :groupUsers="<ExtendedGroupUser[]>groupUsers" />

    <Sessions :sessions="<ExtendedSession[]>sessions" />

    <Chat />

  </main>
</template>

<script lang="ts">
import { auth, pb } from '@/pocketbase';
import type { BaseUser, Group, Session, GroupUser, Message } from '@/types';
import chevronLeft from "@/assets/chevron-left-solid.vue"
import { formatTime, chartUpdate, getTotalReps } from '@/utils';

import UserSessions from "@/components/UserSessions.vue";
import Chart from "@/components/Chart.vue";
import Leaderboard from "@/components/Leaderboard.vue";
import Sessions from "@/components/Sessions.vue";
import Chat from "@/components/Chat.vue";


export interface ExtendedGroupUser extends GroupUser {
  completedTime?: number
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

export interface ExtendedMessage extends Message {
  expand: {
    user: BaseUser
  }
}


export default {
  components: {
    UserSessions,
    chevronLeft,
    Chart,
    Leaderboard,
    Sessions,
    Chat
  },
  data: function () {
    return {
      date: new Date(),
      auth,
      // group: <Group>{},
      groupUser: <ExtendedGroupUser>{},
      groupUsers: <ExtendedGroupUser[]>[],
      sessions: <ExtendedSession[]>[],
    }
  },
  methods: {
    async dateChangeEvent() {

      chartUpdate.emit("clear")
      this.groupUsers.forEach(groupUser => {
        delete groupUser.completedTime
      })
      await this.getSessions()
      this.updateGroupUsers()
    },
    async getSessions() {


      this.sessions = await pb.collection("pushup_sessies").getFullList<ExtendedSession>({
        filter: `groupuser.group = "${this.$route.params?.id}" && dag = "${this.date.getDate()}" && jaar = "${this.date.getFullYear()}" && maand = "${this.date.getMonth() + 1}"`,
        sort: "-tijd",
        expand: "groupuser.user"
      })


    },
    async getGroupUsers() {

      this.groupUsers = await pb.collection("pushup_groupusers").getFullList<ExtendedGroupUser>({
        filter: `group = "${this.$route.params?.id}"`,
        expand: "user, group"
      })

      this.updateGroupUsers()
    },
    updateGroupUsers() {

      this.groupUsers.forEach(groupUser => {
        const sessions = [...this.sessions.filter(e => e.groupuser == groupUser.id)].reverse()
        let total = 0
        sessions.every(session => {
          total += session.reps
          if (total >= 100) {
            groupUser.completedTime = session.tijd
            return false
          }
          return true
        })
      });

      console.log(this.groupUsers.map(e => e.expand.user.username));

      this.groupUsers = this.groupUsers.sort((a, b) => {
        a.completedTime && b.completedTime
        return (a.completedTime || 24 * 60) - (b.completedTime || 24 * 60)
      })
      console.log(this.groupUsers.map(e => e.expand.user.username));
      this.groupUsers = this.groupUsers.sort((a, b) => {
        return Math.min(getTotalReps(b.user, <ExtendedSession[]>this.sessions), 100) - Math.min(getTotalReps(a.user, <ExtendedSession[]>this.sessions), 100)
      })
      const groupUser = this.groupUsers.find(e => e.user == auth.user?.id)
      if (groupUser) {
        this.groupUser = groupUser
      }
    },
  },
  async mounted() {
    await this.getSessions()
    await this.getGroupUsers()

    pb.collection("pushup_sessies").subscribe("*", async () => {
      await this.getSessions()
      this.updateGroupUsers()
    })
    pb.collection("pushup_groupusers").subscribe("*", async () => {
      await this.getGroupUsers()
    })
  }
}

</script>
