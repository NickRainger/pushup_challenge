<template>
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { pb, auth } from '@/pocketbase';

onMounted(()=>{
  if (auth.user) {
  
  pb.collection("pushup_users").authRefresh()
  }
})
</script>
