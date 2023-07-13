
<template>
  <main class="p-4">

    <div class="flex gap-2 mb-4 w-full items-center">
      <h1 class="text-2xl font-bold">Hoi</h1>
      <input v-if="auth.user" class=" input input-sm text-2xl font-bold w-full px-0" type="text"
        v-model="auth.user.username" @change="update('pushup_users', <BaseUser>auth.user)">
    </div>

    <div class="flex flex-col gap-4">

      <div class="p-4 bg-base-200 flex items-center rounded-xl gap-4" v-for="groep in groepusers">
        <h1 class="text-lg font-bold">{{ groep.expand.group.naam }}</h1>
        <div class="badge badge-lg" :class="{ 'badge-info': groep.expand.group.type == 'public' }">{{
          groep.expand.group.type }}</div>
        <div class="flex-1"></div>
        <RouterLink :to="`/group/${groep.group}`" class="btn">Open</RouterLink>
      </div>

      <div class="p-4 bg-base-200 flex items-center rounded-xl gap-4" v-for="groep in groepen">
        <h1 class="text-lg font-bold">{{ groep.naam }}</h1>
        <div class="badge badge-lg"
          :class="{ 'badge-info': groep.type == 'public', 'badge-error': groep.type == 'private', 'badge-warning': groep.type == 'invite' }">
          {{ groep.type }}</div>
        <div class="flex-1"></div>
        <button v-if="groep.type == 'public'" class="btn" @click="join(groep.id)">Deelnemen</button>
      </div>

    </div>


    <button class="btn btn-error btn-sm mt-12" @click="logout">logout</button>

  </main>
</template>


<script lang="ts">

import { pb, auth } from "@/pocketbase"
import type { Group, BaseUser, GroupUser } from "@/types"
import type { Record } from "pocketbase";

// interface ExtendedUser {

// }

interface ExtendedGroupUser extends GroupUser {
  expand: {
    group: Group,
  }
}



export default {
  data: () => ({
    auth,
    groepen: <Group[]>[],
    groepusers: <ExtendedGroupUser[]>[]
  }),
  async mounted() {
    this.getGroups()
  },
  methods: {
    async getGroups() {
      this.groepusers = await pb.collection("pushup_groupusers").getFullList<ExtendedGroupUser>({
        expand: "group",
        filter: `user = "${auth.user?.id}"`
      })
      this.groepen = await pb.collection("pushup_groepen").getFullList<Group>()

      const groepusersArr: string[] = []

      this.groepusers.forEach(groupuser => {
        groepusersArr.push(groupuser.expand.group.id)
      })
      this.groepen = this.groepen.filter((e) => !groepusersArr.includes(e.id))

    },
    async join(groupID: string) {
      await pb.collection("pushup_groupusers").create({
        user: auth.user?.id,
        group: groupID
      })
      this.getGroups()
    },
    update(collection: string, record: Record) {
      pb.collection(collection).update(record.id, record)
    },

    logout() {
      pb.authStore.clear()
    },
  }
}

</script>