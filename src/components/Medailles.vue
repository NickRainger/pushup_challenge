
<template>
  <div class="flex flex-col gap-2 bg-base-200 p-4 rounded-xl">


    <h1 class="text-2xl font-bold">Medailles</h1>
    <!-- <div v-for=""></div> -->
    <table>
      <tr>
        <th></th>
        <th>3x</th>
        <th>2x</th>
        <th>1x</th>
        <th></th>
      </tr>
      <tr v-for="groupUser, i1 in groupUsers">
        <th class="text-xl text-left">{{ i1 + 1 }}. {{ groupUser.expand.user.username }}</th>
        <th v-for="medal, i2 in groupUser.medals">
          <div class="flex">
            <div class="material-symbols-rounded fill" :class="colors[i2]">
              star
            </div>
            {{ medal }}
          </div>
        </th>
        <th>
          {{ sum(groupUser.medals) }}
        </th>
      </tr>


    </table>


  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import type { BaseUser, GroupUser } from '@/types';

interface MedalGroupUser extends GroupUser {
  positions: number[],
  medals: [number, number, number]
  expand: {
    user: BaseUser
  }
}

const route = useRoute()

// const medailles = []

const colors = ref(["text-amber-400", "text-[#898d90]", "text-[#b06c28]"])

const groupUsers = ref<MedalGroupUser[]>([])
// ; (async () => {

function sum(arr: [number, number, number]): number {
  return arr[0] * 3 + arr[1] * 2 + arr[2] * 1
}

onMounted(async () => {

  groupUsers.value = await fetch(`https://api.rainger.nl/pushups/leaderboard/${route.params.id}`).then(res => res.json())
    .then(data => data.data)

  // groupUsers[0].medals

  groupUsers.value.forEach(groupUser => {
    groupUser.medals = [0, 0, 0]

    groupUser.positions.forEach(medal => {
      if (medal <= 2) {
        groupUser.medals[medal]++
      }
    })
  })

  groupUsers.value.sort((a, b) => {


    return sum(b.medals) - sum(a.medals) 

  })

})

  // })()

</script>