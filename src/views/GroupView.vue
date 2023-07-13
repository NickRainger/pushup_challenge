<template>
  <main class="p-2">

    <div class="flex gap-4 items-center px-2 pt-2">
      <RouterLink to="/" class="btn btn-square p-2">
        <chevronLeft class="h-full w-full fill-base-content" />
      </RouterLink>
      <h1 class="text-2xl font-bold">{{ groupUser.expand?.group?.naam }}</h1>
    </div>

    <div class="flex flex-col gap-2 my-4 bg-base-200 p-4 rounded-xl">

      <div v-for="session in sessions.filter(e => e.expand.groupuser?.user == auth.user?.id).reverse()" class="flex">
        <h1 class="text-xl font-semibold flex-1">Reps: {{ session.reps }} {{ formatTime(session.tijd) }}</h1>
        <button @click="del('pushup_sessies', session.id)" class="btn btn-error btn-sm">Del</button>
      </div>

      <h1 class="text-2xl font-bold">totaal: {{ getTotalReps(auth.user!.id) }}</h1>

    </div>



    <!-- {{ sessions.filter(e => e.user == auth.user.id) }} -->

    <form @submit="addSession()" @submit.prevent class="flex flex-col gap-2 p-4 bg-base-200 rounded-xl">

      <div class="flex w-full">
        <div class="w-full">reps</div>
        <div class="w-full">dag</div>
        <div class="w-full">maand</div>
        <div class="w-full">jaar</div>
      </div>

      <div class="flex w-full">

        <input class="w-full input input-sm" type="text" min="1" required v-model="newSession.reps">
        <input class="w-full input input-sm" type="text" required v-model="newSession.dag">
        <input class="w-full input input-sm" type="text" required v-model="newSession.maand">
        <input class="w-full input input-sm" type="text" required v-model="newSession.jaar">
      </div>

      <button class="btn btn-success btn-sm">Toevoegen</button>


    </form>


    <!-- <div class="flex flex-col gap-2 my-4 bg-base-200 p-4 rounded-xl">

      <div v-for="session in sessions.filter(e => e.user == auth.user.id).reverse()" class="flex">

        <h1 class="text-xl font-semibold flex-1">Reps: {{ session.reps }}</h1>


        <button @click="del('pushup_sessies', session.id)" class="btn btn-error btn-sm">Del</button>
      </div>

    </div> -->

    <!-- <pre>{{ sessions }}</pre> -->



    <div class="flex flex-col gap-2 my-4 bg-base-200 p-4 rounded-xl">

      <h1 class="text-xl font-bold">Leaderboard</h1>

      <div v-for="groupUser, i in groupUsers" class="text-xl font-bold ">

        {{ i + 1 }}. {{ groupUser.expand.user?.username }}, {{ getTotalReps(groupUser.user) }}

      </div>


    </div>


    <div class="flex flex-col gap-2 my-4 bg-base-200 p-4 rounded-xl">

      <!-- <div v-for="session in sessions.filter(e => e.expand.groupuser?.user != auth.user?.id)" class="text-xl font-bold "> -->
      <div v-for="session in sessions" class="text-xl font-bold ">

        {{ formatTime(session.tijd) }} - {{ session.expand.groupuser?.expand.user?.username }}, {{ session.reps }} Reps

      </div>
    </div>


  </main>
</template>

<script lang="ts">
import { auth, pb } from '@/pocketbase';
import type { BaseUser, Group, Session, GroupUser } from '@/types';
import chevronLeft from "@/assets/chevron-left-solid.vue"



interface ExtendedGroupUser extends GroupUser {
  expand: {
    user?: BaseUser
    group?: Group
  }
}

interface ExtendedSession extends Session {
  expand: {
    groupuser?: ExtendedGroupUser
  }
}

export default {
  components: {
    chevronLeft
  },
  data: () => ({
    newSession: {
      reps: <number | string>"",
      dag: new Date().getDate(),
      maand: new Date().getMonth() + 1,
      jaar: new Date().getFullYear()
    },
    auth,
    // group: <Group>{},
    groupUser: <ExtendedGroupUser>{},
    groupUsers: <ExtendedGroupUser[]>[],
    sessions: <ExtendedSession[]>[]
  }),
  methods: {
    addSession() {
      pb.collection("pushup_sessies").create({
        reps: this.newSession.reps,
        dag: this.newSession.dag,
        maand: this.newSession.maand,
        jaar: this.newSession.jaar,
        tijd: new Date().getMinutes() + new Date().getHours() * 60,
        groupuser: this.groupUser.id,
      })
    },
    formatTime(time: number) {
      return `${Math.floor(time / 60)}:${time % 60 < 10 ? "0" : ""}${time % 60}`
    },
    getTotalReps(filter: string): number {
      let total = 0

      // console.log(this.sessions?.[0]?.expand.groupuser?.user, filter);

      this.sessions.filter(e => e.expand.groupuser?.user == filter).forEach(session => {
        total += session.reps
      })

      // console.log(total);

      return total
    },
    async getSessions() {


      this.sessions = await pb.collection("pushup_sessies").getFullList<ExtendedSession>({
        filter: `dag = "${new Date().getDate()}" && jaar = "${new Date().getFullYear()}" && maand = "${new Date().getMonth() + 1}"`,
        sort: "-created",
        expand: "groupuser.user"
      })

      const session = this.sessions.find(e => e.user == auth.user?.id)
      if (!session) {
        return
      }

      this.newSession.reps = session.reps
    },
    async getGroupUsers() {

      this.groupUsers = await pb.collection("pushup_groupusers").getFullList({
        filter: `group = "${this.$route.params?.id}"`,
        expand: "user, group"
      })
      this.groupUsers = this.groupUsers.sort((a, b) => {
        return this.getTotalReps(b.user) - this.getTotalReps(a.user)
      })


      const groupUser = this.groupUsers.find(e => e.user == auth.user?.id)
      if (groupUser) {
        this.groupUser = groupUser
      }
    },
    del(collection: string, id: string) {
      pb.collection(collection).delete(id)
    }
  },
  async mounted() {



    await this.getSessions()
    await this.getGroupUsers()

    // if (typeof this.$route.params?.id == "string") {
    //   this.groupUser = await pb.collection("pushup_groupusers").getOne<ExtendedGroupUser>(this.$route.params?.id, {
    //     expand: "user, group"
    //   })
    // }

    pb.collection("pushup_sessies").subscribe("*", () => {
      this.getSessions()
    })

    // this.groupUser = await pb.collection("pushup_groupusers").getFullList<ExtendedGroupUser>({
    //   filter: `group = "${this.$route.params?.id}"`
    // })


  }
}

</script>
