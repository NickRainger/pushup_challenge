import PocketBase from "pocketbase"
import { reactive, onMounted } from 'vue';
import type { BaseUser } from "@/types";
import router from "@/router";

const pb = new PocketBase('https://pbapi.rainger.nl')

let auth = reactive({ user: <BaseUser | null>pb.authStore.model })

pb.authStore.onChange((token, model) => {

  auth.user = <BaseUser | null>model

  if (!model && router.currentRoute.value.meta.requiresAuth) {
    router.push("/login")
  } else if (model && router.currentRoute.value.path == "/login") {
    router.push("/")
  }

})


export { pb, auth }