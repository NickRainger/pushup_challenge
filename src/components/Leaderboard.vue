<template>
  <div class="flex flex-col gap-2 bg-base-200 p-4 rounded-xl">

    <h1 class="text-2xl font-bold">Leaderboard</h1>

    <div v-for="groupUser, i in  store.groupUsers " :key="groupUser.id" class="text-xl font-bold flex items-center gap-2">


      <div v-if="i == 0 && (groupUser.totalReps || 0) >= 100"
        class="text-3xl material-symbols-rounded fill text-amber-400">star</div>

      <div v-else-if="i == 1 && (groupUser.totalReps || 0) >= 100"
        class="text-3xl text-[#898d90]  material-symbols-rounded fill">star</div>
      <div v-else-if="i == 2 && (groupUser.totalReps || 0) >= 100"
        class=" text-3xl text-[#b06c28] material-symbols-rounded fill" :class="{ '': (groupUser.totalReps || 0) >= 100 }">
        star</div>

      <div v-else-if="(groupUser.totalReps || 0) >= 100" class="text-3xl material-symbols-rounded fill text-emerald-500">
        done_all
      </div>


      <div v-else class="text-2xl">{{ i + 1 }}.</div>

      <div class="text-2xl ">
        {{ groupUser.expand.user?.username }},
        {{ groupUser.totalReps }}
        {{ formatTime(groupUser.completedTime) }}
      </div>

    </div>


  </div>
</template>

<script setup lang="ts">
import { formatTime } from '@/utils';
import store from "@/store"
import type { ExtendedGroupUser } from '@/types';

// function canShow(groupUser: ExtendedGroupUser): boolean {
//   return (!store.groupUsers.some(user => user.id != groupUser.id && groupUser.totalReps == user.totalReps) ||
//     (groupUser.totalReps || 0) >= 100) &&
//     groupUser.totalReps != 0
// }

</script>