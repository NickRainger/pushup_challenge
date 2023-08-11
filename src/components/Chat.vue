<template>
  <div class="flex flex-col gap-2 bg-base-200 p-4 rounded-xl max-h-[512px]">
    <h1 class="text-2xl font-bold">Chat</h1>

    <div class="flex-1 overflow-y-scroll" id="messagesScroll">
      <div v-for="(message, i) in messages" :key="message.id">
        <div
          class="divider"
          v-if="
            !i ||
            new Date(message.created).getDate() !=
              new Date(messages[i - 1].created).getDate()
          "
        >
          {{new Date(message.created).toLocaleDateString()}}
        </div>

        <div
          class="chat relative"
          :class="[
            message.expand.groupuser.user == auth.user?.id
              ? 'chat-end'
              : 'chat-start',
          ]"
        >
          <div class="chat-image avatar">
            <div class="w-10 rounded-lg group/hov">
              <img
                :src="`https://api.dicebear.com/6.x/bottts-neutral/svg?seed=${message.expand.groupuser.user}`"
              />

              <button
                v-if="message.expand.groupuser.user == auth.user?.id"
                class="transition-all group-hover/hov:!opacity-100 opacity-0 absolute top-0 h-full w-full left-0 flex items-center justify-center material-symbols-sharp text-3xl bg-red-500/50 rounded-lg text-white"
                @click="delMsg(message.id)"
              >
                close
              </button>
            </div>

            <!-- <div class="">123</div> -->
          </div>

          <div class="chat-header">
            {{ message.expand.groupuser.expand.user.username }}
            <time class="text-xs opacity-50">
              {{ new Date(message.created).toLocaleTimeString() }}
              {{ message.created != message.updated ? "(edited)" : "" }}
            </time>
          </div>

          <!-- <div></div> -->

          <textarea
            v-if="message.expand.groupuser.user == auth.user?.id"
            class="chat-bubble chat-bubble-primary w-full"
            v-model="message.content"
            type="text"
            @change="updateMsg(<ExtendedMessage>message)"
          />

          <div v-else class="chat-bubble">{{ message.content }}</div>
        </div>
      </div>
    </div>

    <form @submit.prevent @submit="sendMsg()" class="join w-full relative">
      <div
        v-if="unread"
        class="badge badge-lg badge-info p-2 absolute top-0 left-1/2 -translate-y-[150%] -translate-x-1/2"
      >
        Nieuwe berichten
      </div>

      <input
        class="input input-sm join-item w-full"
        type="text"
        required
        v-model="msg"
        placeholder="bericht"
      />
      <button class="btn btn-success btn-sm join-item">Sturen</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { auth, pb } from "@/pocketbase";
import type { BaseUser, Message } from "@/types";
import { formatTime } from "@/utils";
import type { ExtendedGroupUser } from "@/types";
import { onMounted, onUpdated, ref } from "vue";
import { useRoute } from "vue-router";

import store from "@/store";

export interface ExtendedMessage extends Message {
  expand: {
    groupuser: ExtendedGroupUser;
  };
}

const route = useRoute();

let lastScrolled = 0;

let msg = ref("");
let unread = ref(false);
let msgUpdate = ref(false);
let messages = ref<ExtendedMessage[]>([]);

onMounted(() => {
  getMessages();

  let objDiv = document.getElementById("messagesScroll");

  if (!objDiv) {
    return;
  }
  const toBottom = objDiv.scrollHeight - objDiv.clientHeight - objDiv.scrollTop;
  lastScrolled = toBottom;

  objDiv?.addEventListener("scroll", () => {
    if (!objDiv) {
      return;
    }
    const toBottom =
      objDiv.scrollHeight - objDiv.clientHeight - objDiv.scrollTop;
    lastScrolled = toBottom;

    if (!toBottom) {
      unread.value = false;
    }
  });

  pb.collection("pushup_messages").subscribe("*", async () => {
    getMessages();
  });
}),
  onUpdated(() => {
    if (!msgUpdate.value) {
      return;
    }
    msgUpdate.value = false;
    var objDiv = document.getElementById("messagesScroll");
    if (!objDiv) {
      return;
    }

    if (lastScrolled == 0) {
      objDiv.scrollTop = objDiv.scrollHeight;
    } else {
      unread.value = true;
    }
  });

async function getMessages() {
  messages.value = await pb
    .collection("pushup_messages")
    .getFullList<ExtendedMessage>({
      filter: `groupuser.group = "${route.params.id}"`,
      expand: `groupuser.user`,
      sort: "+created",
    });
  // messages.reverse()
  msgUpdate.value = true;
}
async function sendMsg() {
  const res = await pb.collection("pushup_messages").create({
    groupuser: store.groupUser.id,
    content: msg.value,
  });
  if (res) {
    msg.value = "";
  }
}
function updateMsg(message: ExtendedMessage) {
  pb.collection("pushup_messages").update(message.id, {
    content: message.content,
  });
}
function delMsg(id: string) {
  pb.collection("pushup_messages").delete(id);
}
</script>
