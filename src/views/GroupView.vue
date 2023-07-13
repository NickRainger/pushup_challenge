<template>
  <main class="p-2">

    <h1 class="text-2xl font-bold px-4 pt-4">{{ group.naam }}</h1>

    <div class="flex flex-col gap-2 my-4 bg-base-200 p-4 rounded-xl">
      <div v-for="session in sessions.filter(e => e.expand.groupuser.user == auth.user?.id).reverse()" class="flex">

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

      <div v-for="session in sessions.filter(e => e.expand.groupuser.user != auth.user?.id)" class="text-xl font-bold ">

        {{ session.expand.groupuser.expand.user.username }}, {{ session.reps }} Reps

      </div>
    </div>


  </main>
</template>

<script lang="ts">
import { auth, pb } from '@/pocketbase';
import type { BaseUser, Group, Session, GroupUser } from '@/types';



interface ExtendedGroupUser extends GroupUser {
  expand: {
    user: BaseUser
  }
}

interface ExtendedSession extends Session {
  expand: {
    groupuser: ExtendedGroupUser
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
    group: <Group>{},
    groupUser: <ExtendedGroupUser>{},
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
        groupuser: this.$route.params?.id,
      })
    },
    getTotalReps(): number {
      let total = 0
      this.sessions.filter(e => e.expand.groupuser.user == auth.user?.id).forEach(session => {
        total += session.reps
      })
      return total
    },
    async getSessions() {


      this.sessions = await pb.collection("pushup_sessies").getFullList<ExtendedSession>({
        filter: `groupuser = "${this.$route.params?.id}" && dag = "${new Date().getDate()}" && jaar = "${new Date().getFullYear()}" && maand = "${new Date().getMonth() + 1}"`,
        sort: "-created",
        expand: "groupuser.user"
      })

      const session = this.sessions.filter(e => e.user == auth.user?.id)[0]
      if (!session) {
        return
      }

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
      this.groupUser = await pb.collection("pushup_groupusers").getOne<ExtendedGroupUser>(this.$route.params?.id, {
        expand: "user"
      })
    }

    // this.groupUser = await pb.collection("pushup_groupusers").getFullList<ExtendedGroupUser>({
    //   filter: `group = "${this.$route.params?.id}"`
    // })

    this.getSessions()

  }
}

</script>
