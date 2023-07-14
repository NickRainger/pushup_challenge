<template>
  <div class="flex flex-col gap-2 bg-base-200 p-4 rounded-xl">

    <!-- <div v-for="session in sessions.filter(e => e.expand.groupuser?.user != auth.user?.id)" class="text-xl font-bold "> -->
    <div v-for="session in sessions" :key="session.id" class="text-xl font-bold ">

      {{ formatTime(session.tijd) }} - {{ session.expand.groupuser?.expand.user?.username }}, {{ session.reps }} Reps

    </div>
  </div>
</template>

<script lang="ts">

import { formatTime } from '@/utils';
import type { ExtendedSession } from '@/views/GroupView.vue';
import type { PropType } from 'vue';

export default {
  props: {
    sessions: {
      type: Array as PropType<ExtendedSession[]>,
      required: true
    },
  },
  data: () => ({
    formatTime
  })

}

</script>