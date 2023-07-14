<template>
  <div class="flex flex-col gap-2 bg-base-200 p-4 rounded-xl">

    <h1 class="text-xl font-bold">Leaderboard</h1>

    <div v-for="groupUser, i in groupUsers" :key="groupUser.id" class="text-xl font-bold flex items-center gap-2">

      <div
        v-if="i == 0 && (!groupUsers.some(user => getTotalReps(user.user, <ExtendedSession[]>sessions) == getTotalReps(user.user, <ExtendedSession[]>sessions)) || getTotalReps(groupUser.user, <ExtendedSession[]>sessions) >= 100)"
        class="text-3xl material-symbols-rounded fill"
        :class="{ 'text-yellow-500': getTotalReps(groupUser.user, <ExtendedSession[]>sessions) >= 100 }">
        star
      </div>

      <div v-else-if="getTotalReps(groupUser.user, <ExtendedSession[]>sessions) >= 100"
        class="text-3xl material-symbols-rounded fill text-emerald-500">
        done_all
      </div>

      <div class="text-2xl ">
        {{ i + 1 }}. {{ groupUser.expand.user?.username }},
        {{ getTotalReps(groupUser.user, <ExtendedSession[]>sessions) }}
          {{ formatTime(groupUser.completedTime) }}
      </div>

    </div>


  </div>
</template>

<script setup lang="ts">
import { formatTime, getTotalReps } from '@/utils';
import type { ExtendedSession, ExtendedGroupUser } from '@/views/GroupView.vue';

const props = defineProps<{
  sessions: ExtendedSession[],
  groupUsers: ExtendedGroupUser[]
}>()

</script>