<template>
  <div class="flex flex-col gap-2 bg-base-200 p-4 rounded-xl">

    <h1 class="text-xl font-bold">Leaderboard</h1>

    <div v-for="groupUser, i in store.groupUsers" :key="groupUser.id" class="text-xl font-bold flex items-center gap-2">

      <div
        v-if="i == 0 && groupUser.totalReps != 0 && (!store.groupUsers.some(user => { return user.id == groupUser.id ? false : groupUser.totalReps == user.totalReps }) || (groupUser.totalReps || 0) >= 100)"
        class="text-3xl material-symbols-rounded fill" :class="{ 'text-yellow-500': (groupUser.totalReps || 0) >= 100 }">
        star
      </div>

      <div v-else-if="(groupUser.totalReps || 0) >= 100" class="text-3xl material-symbols-rounded fill text-emerald-500">
        done_all
      </div>

      <div class="text-2xl ">
        {{ i + 1 }}. {{ groupUser.expand.user?.username }},
        {{ groupUser.totalReps }}
        {{ formatTime(groupUser.completedTime) }}
      </div>

    </div>


  </div>
</template>

<script setup lang="ts">
import { formatTime } from '@/utils';
import store from "@/store"

</script>