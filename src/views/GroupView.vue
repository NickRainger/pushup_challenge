<template>
  <main class="p-2">

    <h1 class="text-2xl font-bold px-4 pt-4">{{ group.naam }}</h1>

    <div class="flex flex-col gap-2 my-4 bg-base-200 p-4 rounded-xl">

      <div v-for="session in sessions.filter(e => e.user == auth.user.id).reverse()" class="flex">

        <h1 class="text-xl font-semibold flex-1">Reps: {{ session.reps }}</h1>


        <button @click="del('pushup_sessies', session.id)" class="btn btn-error btn-sm">Del</button>
      </div>

      <h1 class="text-2xl font-bold">totaal: {{ getTotalReps() }}</h1>

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

        <input class="w-full input input-sm" type="number" min="1" required v-model="newSession.reps">
        <input class="w-full input input-sm" type="number" required v-model="newSession.dag">
        <input class="w-full input input-sm" type="number" required v-model="newSession.maand">
        <input class="w-full input input-sm" type="number" required v-model="newSession.jaar">
      </div>

      <button class="btn btn-success btn-sm">Toevoegen</button>


    </form>


    <!-- <div class="flex flex-col gap-2 my-4 bg-base-200 p-4 rounded-xl">

      <div v-for="session in sessions.filter(e => e.user == auth.user.id).reverse()" class="flex">

        <h1 class="text-xl font-semibold flex-1">Reps: {{ session.reps }}</h1>


        <button @click="del('pushup_sessies', session.id)" class="btn btn-error btn-sm">Del</button>
      </div>

    </div> -->

    <div class="flex flex-col gap-2 my-4 bg-base-200 p-4 rounded-xl">

      <div v-for="session in sessions.filter(e => e.user != auth.user.id)" class="text-xl font-bold ">

        {{ session.expand.user?.username }}, {{ session.reps }} Reps

      </div>
    </div>


  </main>
</template>

<script lang="ts">
import { auth, pb } from '@/pocketbase';
import type { BaseUser, Groep, Session } from '@/types';
import type { Record } from 'pocketbase';

type ExtendedSession = Session & {
  expand: {
    user?: BaseUser
  }
}

export default {
  data: () => ({
    newSession: {
      reps: 0,
      dag: new Date().getDate(),
      maand: new Date().getMonth() + 1,
      jaar: new Date().getFullYear()
    },
    auth,
    group: <Groep>{},
    users: <BaseUser[]>[],
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
        user: auth.user.id,
        group: this.$route.params?.id
      })
    },
    getTotalReps(): number {
      let total = 0
      this.sessions.filter(e => e.user == auth.user.id).forEach(session => {
        total += session.reps
      })
      return total
    },
    async getSessions() {


      this.sessions = await pb.collection("pushup_sessies").getFullList<ExtendedSession>({
        filter: `group = "${this.$route.params?.id}" && dag = "${new Date().getDate()}" && jaar = "${new Date().getFullYear()}" && maand = "${new Date().getMonth() + 1}"`,
        sort: "-created",
        expand: "user"
      })

      const session = this.sessions.filter(e => e.user == auth.user.id)[0]

      this.newSession.reps = session.reps
    },
    del(collection: string, id: string) {
      pb.collection(collection).delete(id)
    }
  },
  async mounted() {

    pb.collection("pushup_sessies").subscribe("*", () => {
      this.getSessions()
    })

    if (typeof this.$route.params?.id == "string") {
      this.group = await pb.collection("pushup_groepen").getOne<Groep>(this.$route.params?.id)
    }

    this.users = await pb.collection("pushup_users").getFullList<BaseUser>({
      filter: `groups.id ?= "${this.$route.params?.id}"`
    })

    this.getSessions()

  }
}

</script>
