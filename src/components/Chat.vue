<template>
  <div class="flex flex-col gap-2 bg-base-200 p-4 rounded-xl max-h-[512px]">

    <div class="flex-1 overflow-y-scroll" id="messagesScroll">

      <div v-for="message in messages" :key="message.id" class="chat relative"
        :class="[message.user == auth.user?.id ? 'chat-end' : 'chat-start']">

        <div class="chat-image avatar">
          <div class="w-10 rounded-full group/hov">
            <img :src="`https://api.dicebear.com/6.x/bottts-neutral/svg?seed=${message.user}`" />

            <button v-if="message.user == auth.user?.id"
              class="group-hover/hov:!visible invisible absolute top-0 h-full w-full left-0 flex items-center justify-center material-symbols-sharp text-3xl bg-red-500/50 rounded-full"
              @click="delMsg(message.id)">
              close</button>
          </div>


          <!-- <div class="">123</div> -->
        </div>

        <div class="chat-header">
          {{ message.expand.user.username }}
          <time class="text-xs opacity-50">
            {{ new Date(message.created).toLocaleTimeString() }}
            {{ message.created != message.updated ? "(edited)" : "" }}
          </time>
        </div>

        <textarea v-if="message.user == auth.user?.id" class="chat-bubble chat-bubble-primary w-full"
          v-model="message.content" type="text" @change="updateMsg(<ExtendedMessage>message)" />

        <div v-else class="chat-bubble">{{ message.content }} </div>
      </div>

    </div>

    <form @submit.prevent @submit="sendMsg()" class="join w-full relative">

      <div v-if="unread"
        class="badge badge-lg badge-info p-2 absolute top-0 left-1/2  -translate-y-[150%] -translate-x-1/2">Nieuwe
        berichten</div>

      <input class="input input-sm join-item w-full" type="text" required v-model="msg" placeholder="bericht">
      <button class="btn btn-success btn-sm join-item">Sturen</button>
    </form>

  </div>
</template>

<script lang="ts">
import { auth, pb } from '@/pocketbase';
import { formatTime } from '@/utils';
import type { ExtendedMessage } from '@/views/GroupView.vue';

let lastScrolled = 0

export default {
  data: () => ({
    msg: "",
    unread: false,
    msgUpdate: false,
    messages: <ExtendedMessage[]>[],
    formatTime,
    auth
  }),
  mounted() {

    this.getMessages()


    let objDiv = document.getElementById("messagesScroll");

    if (!objDiv) { return }
    const toBottom = objDiv.scrollHeight - objDiv.clientHeight - objDiv.scrollTop
    lastScrolled = toBottom

    objDiv?.addEventListener("scroll", () => {
      if (!objDiv) { return }
      const toBottom = objDiv.scrollHeight - objDiv.clientHeight - objDiv.scrollTop
      lastScrolled = toBottom

      if (!toBottom) {
        this.unread = false
      }
    })

    pb.collection("pushup_messages").subscribe("*", async () => {
      this.getMessages()
    })
  },
  updated() {

    if (!this.msgUpdate) {
      return
    }
    this.msgUpdate = false
    var objDiv = document.getElementById("messagesScroll");
    if (!objDiv) { return }

    if (lastScrolled == 0) {
      objDiv.scrollTop = objDiv.scrollHeight;
    } else {
      this.unread = true
    }

  },
  methods: {

    async getMessages() {
      const messages = await pb.collection("pushup_messages").getFullList<ExtendedMessage>({
        filter: `group = "${this.$route.params.id}"`,
        expand: `user`
      })
      // messages.reverse()
      this.messages = messages
      this.msgUpdate = true


    },
    async sendMsg() {

      console.log(this.$route.params.id);

      const msg = await pb.collection("pushup_messages").create({
        user: auth.user?.id,
        group: this.$route.params.id,
        content: this.msg
      })
      if (msg) {
        this.msg = ""
      }
    },
    updateMsg(message: ExtendedMessage) {

      pb.collection("pushup_messages").update(message.id, {
        content: message.content
      })
    },
    delMsg(id: string) {
      pb.collection("pushup_messages").delete(id)
    },
  }
}

</script>