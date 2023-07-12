import PocketBase from "pocketbase"
import { reactive } from 'vue';
import type { BaseUser } from "@/types";
import router from "@/router";

const pb = new PocketBase('https://pbapi.rainger.nl')

let auth = reactive({ user: <BaseUser>pb.authStore.model })

pb.authStore.onChange((token, model) => {

  auth.user = <BaseUser>model

  if (model) {
    router.push("/")
  } else {
    router.push("/login")
  }

})


if (auth.user) {
  pb.collection("pushup_users").authRefresh()
}


export { pb, auth }