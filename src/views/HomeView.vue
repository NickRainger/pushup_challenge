
<template>
  <main class="p-4">

    <div class="flex gap-2 mb-4 w-full items-center">
      <h1 class="text-2xl font-bold">Hoi</h1>
      <input v-if="auth.user" class=" input input-sm text-2xl font-bold w-full px-0" type="text"
        v-model="auth.user.username" @change="update('pushup_users', <BaseUser>auth.user)">
    </div>

    <div class="flex flex-col gap-4">

      <div class="p-4 bg-base-200 flex items-center rounded-xl gap-4" v-for="groep in store.groupUsers">
        <h1 class="text-lg font-bold">{{ groep.expand.group.naam }}</h1>
        <div class="badge badge-lg" :class="{ 'badge-info': groep.expand.group.type == 'public' }">{{
          groep.expand.group.type }}</div>
        <div class="flex-1"></div>
        <RouterLink :to="`/group/${groep.group}`" class="btn">Open</RouterLink>
      </div>

      <div class="p-4 bg-base-200 flex items-center rounded-xl gap-4" v-for="groep in store.groups">
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


<script setup lang="ts">

import { pb, auth } from "@/pocketbase"
import type { Group, BaseUser, ExtendedGroupUser } from "@/types"
import type { Record } from "pocketbase";
import { onMounted, ref, reactive } from 'vue';



// interface ExtendedUser {

// }

const store = reactive({
  groupUsers: <ExtendedGroupUser[]>[],
  groups: <Group[]>[]
})


onMounted(() => {
  getGroups()
})

async function getGroups() {

  store.groupUsers = await pb.collection("pushup_groupusers").getFullList<ExtendedGroupUser>({
    expand: "group, user",
    filter: `user = "${auth.user?.id}"`
  })

  store.groups = await pb.collection("pushup_groepen").getFullList<Group>()

  const groepusersArr: string[] = []

  store.groupUsers.forEach(groupuser => {
    groepusersArr.push(groupuser.expand.group.id)
  })

  store.groups = store.groups.filter((e) => !store.groupUsers.map((groupuser) => groupuser.expand.group.id).includes(e.id))

}
async function join(groupID: string) {
  await pb.collection("pushup_groupusers").create({
    user: auth.user?.id,
    group: groupID
  })
  getGroups()
}
function update(collection: string, record: Record) {
  pb.collection(collection).update(record.id, record)
}

function logout() {
  pb.authStore.clear()
}

</script>