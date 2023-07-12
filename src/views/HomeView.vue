
<template>
  <main class="p-4">

    <div class="flex gap-2 mb-4 w-full items-center">
      <h1 class="text-2xl font-bold">Hoi</h1>
      <input class=" input input-sm text-2xl font-bold w-full" type="text" v-model="auth.user.username"
        @change="update('pushup_users', <BaseUser>auth.user)">
    </div>

    <div class="flex flex-col gap-4">


      <div class="p-4 bg-base-200 flex items-center rounded-xl" v-for="groep in groepen">
        <h1 class="flex-1">{{ groep.naam }}</h1>

        <RouterLink :to="`/group/${groep.id}`" class="btn">Open</RouterLink>

      </div>

    </div>


    <button class="btn btn-error btn-sm mt-12" @click="logout">logout</button>

  </main>
</template>


<script lang="ts">

import { pb, auth } from "@/pocketbase"
import type { Groep, BaseUser } from "@/types"
import type { Record } from "pocketbase";

export default {
  data: () => ({
    auth,
    groepen: <Groep[]>[]
  }),
  async mounted() {
    console.log(pb.authStore.model);

    this.groepen = await pb.collection("pushup_groepen").getFullList<Groep>()
  },
  methods: {
    update(collection: string, record: Record) {
      pb.collection(collection).update(record.id, record)
    },

    logout() {
      pb.authStore.clear()
    },
  }
}

</script>