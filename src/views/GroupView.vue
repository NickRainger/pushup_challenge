<template>
  <div class="flex gap-4 items-center p-2">
    <RouterLink to="/" class="btn btn-square p-2">
      <chevronLeft class="h-full w-full fill-base-content" />
    </RouterLink>
    <h1 class="text-2xl font-bold">{{ groupUser.expand?.group?.naam }}</h1>
  </div>

  <main class="p-2 grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-6">

    <div class="flex flex-col gap-2 bg-base-200 p-4 rounded-xl">

      <div class="flex items-center justify-center gap-4">

        <button class="btn btn-square text-3xl material-symbols-sharp fill" @click="setDay('subtract')">
          horizontal_rule
        </button>

        <h1 class="font-bold"> {{ selectedDate }}</h1>
        <button class="btn font-bold" :class="{ 'btn-disabled': new Date().toLocaleDateString() == selectedDate }"
          @click="setDay('today')">
          vandaag
        </button>

        <button class="btn btn-square text-3xl material-symbols-sharp" @click="setDay('add')">
          add
        </button>

      </div>

      <div v-for="session in sessions.filter(e => e.expand.groupuser?.user == auth.user?.id).reverse()" class="flex">
        <h1 class="text-xl font-semibold text-white">{{ formatTime(session.tijd) }}</h1>
        <pre class="text-xl font-semibold text-white"> - </pre>
        <h1 class="text-xl font-semibold flex-1">Reps: {{ session.reps }} </h1>
        <button @click="del('pushup_sessies', session.id)" class="btn btn-error btn-sm">Del</button>
      </div>

      <h1 class="text-2xl font-bold">totaal: {{ getTotalReps(auth.user!.id) }}</h1>

      <form @submit="addSession()" @submit.prevent class="flex flex-col gap-2">

        <h1 class="text-xl font-semibold">reps Toevoegen</h1>

        <div class="join w-full">
          <input class="input input-sm join-item w-1/2" type="text" required v-model="newSession" placeholder="reps">
          <button class="btn btn-success btn-sm join-item w-1/2">Toevoegen</button>
        </div>

      </form>

    </div>



    <div class="flex flex-col gap-2 bg-base-200 p-4 rounded-xl">
      <canvas id="chart" height="300"></canvas>
    </div>


    <div class="flex flex-col gap-2 bg-base-200 p-4 rounded-xl">

      <h1 class="text-xl font-bold">Leaderboard</h1>

      <div v-for="groupUser, i in groupUsers" class="text-xl font-bold flex items-center gap-2">

        <div v-if="i == 0" class="text-3xl material-symbols-rounded fill"
          :class="{ 'text-yellow-500': getTotalReps(groupUser.user) >= 100 }" @click="setDay('subtract')">
          star
        </div>

        <div v-else-if="getTotalReps(groupUser.user) >= 100"
          class="text-3xl material-symbols-rounded fill text-emerald-500">
          done_all
        </div>

        <div class="text-2xl ">
          {{ i + 1 }}. {{ groupUser.expand.user?.username }}, {{ getTotalReps(groupUser.user) }} {{
            formatTime(groupUser.completedTime) }}
        </div>

      </div>


    </div>


    <div class="flex flex-col gap-2 bg-base-200 p-4 rounded-xl">

      <!-- <div v-for="session in sessions.filter(e => e.expand.groupuser?.user != auth.user?.id)" class="text-xl font-bold "> -->
      <div v-for="session in sessions" class="text-xl font-bold ">

        {{ formatTime(session.tijd) }} - {{ session.expand.groupuser?.expand.user?.username }}, {{ session.reps }} Reps

      </div>
    </div>


    <div class="flex flex-col gap-2 bg-base-200 p-4 rounded-xl">

      <div class="flex-1 overflow-y-scroll">

        <div v-for="message in messages" class="chat"
          :class="[message.user == auth.user?.id ? 'chat-end' : 'chat-start']">
          <div class="chat-header">
            {{ message.expand.user.username }}
            <time class="text-xs opacity-50">{{ new Date(message.created).toLocaleTimeString() }}</time>
          </div>
          <div class="chat-bubble" :class="{ 'chat-bubble-info': message.user == auth.user?.id }">{{ message.content }}
          </div>
        </div>

        <!-- ({{ message.expand.user.username }}) {{ message.content }} -->
      </div>

      <form @submit.prevent @submit="sendMsg()" class="join w-full">
        <input class="input input-sm join-item w-full" type="text" required v-model="msg" placeholder="bericht">
        <button class="btn btn-success btn-sm join-item">Sturen</button>
      </form>

    </div>


  </main>
</template>

<script lang="ts">
import Chart from "chart.js/auto"
import { auth, pb } from '@/pocketbase';
import type { BaseUser, Group, Session, GroupUser, Message } from '@/types';
import chevronLeft from "@/assets/chevron-left-solid.vue"
import { data } from "autoprefixer";

function getHexFromString(seed: string): string {
  return Math.floor((Math.abs(Math.sin(parseInt(seed, 36)) * 16777215))).toString(16)
}

interface ExtendedGroupUser extends GroupUser {
  completedTime?: number
  expand: {
    user: BaseUser
    group: Group
  }
}

interface ExtendedSession extends Session {
  expand: {
    groupuser: ExtendedGroupUser
  }
}

interface ExtendedMessage extends Message {
  expand: {
    user: BaseUser
  }
}

class ChartUpdate {
  listeners: { event: string, cb: Function }[]
  constructor() {
    this.listeners = []
  }
  emit(event: string, data: any) {
    this.listeners.filter(e => e.event == event).forEach(event => {
      event.cb(data)
    })
  }
  on(event: string, cb: Function) {
    this.listeners.push({ event, cb })
  }
}

const chartUpdate = new ChartUpdate

export default {
  components: {
    chevronLeft
  },
  data: () => ({
    newSession: <number | string>"",
    date: new Date(),
    selectedDate: "",
    auth,
    // group: <Group>{},
    groupUser: <ExtendedGroupUser>{},
    groupUsers: <ExtendedGroupUser[]>[],
    sessions: <ExtendedSession[]>[],
    messages: <ExtendedMessage[]>[],
    msg: ""
  }),
  methods: {
    setDay(type: "subtract" | "add" | "today") {

      if (type == 'subtract') {
        this.date.setDate(this.date.getDate() - 1)
      } else if (type == 'add') {
        this.date.setDate(this.date.getDate() + 1)
      } else if (type == 'today') {
        this.date = new Date()
      }

      this.getSessions()

      this.selectedDate = this.date.toLocaleDateString()
    },
    addSession() {
      pb.collection("pushup_sessies").create({
        reps: this.newSession,
        dag: this.date.getDate(),
        maand: this.date.getMonth() + 1,
        jaar: this.date.getFullYear(),
        tijd: new Date().getMinutes() + new Date().getHours() * 60,
        groupuser: this.groupUser.id,
      })
    },
    formatTime(time: number | undefined): string {
      if (!time) { return "" }
      return `${Math.floor(time / 60)}:${time % 60 < 10 ? "0" : ""}${time % 60}`
    },
    getTotalReps(filter: string): number {
      let total = 0

      // console.log(this.sessions?.[0]?.expand.groupuser?.user, filter);

      this.sessions.filter(e => e.expand.groupuser?.user == filter).forEach(session => {
        total += session.reps
      })

      // console.log(total);

      return total
    },
    async getSessions() {


      this.sessions = await pb.collection("pushup_sessies").getFullList<ExtendedSession>({
        filter: `groupuser.group = "${this.$route.params?.id}" && dag = "${this.date.getDate()}" && jaar = "${this.date.getFullYear()}" && maand = "${this.date.getMonth() + 1}"`,
        sort: "-tijd",
        expand: "groupuser.user"
      })

      this.renderChart()

    },
    async getGroupUsers() {

      this.groupUsers = await pb.collection("pushup_groupusers").getFullList({
        filter: `group = "${this.$route.params?.id}"`,
        expand: "user, group"
      })

      this.updateGroupUsers()
    },
    del(collection: string, id: string) {
      pb.collection(collection).delete(id)
    },
    updateGroupUsers() {


      this.groupUsers.forEach(groupUser => {
        const sessions = [...this.sessions.filter(e => e.groupuser == groupUser.id)].reverse()
        // console.log(session.length);
        let total = 0
        sessions.every(session => {
          total += session.reps
          if (total >= 100) {
            groupUser.completedTime = session.tijd
            return false
          }
          return true
        })
      });

      this.groupUsers = this.groupUsers.sort((a, b) => {
        if (a.completedTime && b.completedTime) {
          return a.completedTime - b.completedTime
        }
        return 0
      })

      this.groupUsers = this.groupUsers.sort((a, b) => {
        return Math.min(this.getTotalReps(b.user), 100) - Math.min(this.getTotalReps(a.user), 100)
      })

      const groupUser = this.groupUsers.find(e => e.user == auth.user?.id)
      if (groupUser) {
        this.groupUser = groupUser
      }
    },
    renderChart() {

      const tijden: number[] = []

      const first = [...this.sessions].reverse()?.[0]?.tijd
      const last = [...this.sessions]?.[0]?.tijd

      const start = Math.floor(first / 10) * 10 - 10
      const end = Math.ceil(last / 10) * 10 + 10

      for (let i = start; i < end; i += 10) {
        tijden.push(i)
      }

      const datasets: { label?: string, data: number[] }[] = []

      this.groupUsers.forEach(groupuser => {

        const backgroundColor = `#${getHexFromString(groupuser.expand.user.username)}80`
        const borderColor = `#${getHexFromString(groupuser.expand.user.username)}`

        const userDataSet: { label?: string, data: number[], backgroundColor: string, borderColor: string } = {
          label: groupuser.expand.user.username,
          data: [],
          backgroundColor,
          borderColor
        }

        tijden.forEach((tijd) => {
          userDataSet.data.push(userDataSet.data[userDataSet.data.length - 1] || 0)
          this.sessions.filter(e => e.expand.groupuser.user == groupuser.user).forEach((session) => {
            if (session.tijd >= tijd && session.tijd < tijd + 10) {
              userDataSet.data[userDataSet.data.length - 1] += session.reps
            }
          })
        })
        datasets.push(userDataSet)
      })
      chartUpdate.emit("update", { datasets, tijden })
    },
    async getMessages() {
      const messages = await pb.collection("pushup_messages").getFullList<ExtendedMessage>({
        filter: `group = "${this.$route.params.id}"`,
        expand: `user`
      })
      messages.reverse()
      this.messages = messages
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
    }
  },
  async mounted() {

    this.selectedDate = this.date.toLocaleDateString()

    await this.getSessions()
    await this.getGroupUsers()
    this.getMessages()

    const ctx = <HTMLCanvasElement>document.getElementById("chart")

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [],
      }
    });

    chartUpdate.on("update", (e: { tijden: number[], datasets: { label?: string, data: number[] }[] }) => {

      chart.data.labels = <never[]>e.tijden.map(e => this.formatTime(e))
      chart.data.datasets = e.datasets

      chart.update()
    })

    this.renderChart()

    pb.collection("pushup_sessies").subscribe("*", async () => {
      await this.getSessions()
      this.updateGroupUsers()
      // this.getGroupUsers()
    })
    pb.collection("pushup_groupusers").subscribe("*", async () => {
      // this.getSessions()
      await this.getGroupUsers()
      this.renderChart()
    })

    pb.collection("pushup_messages").subscribe("*", async () => {
      this.getMessages()
    })
  }
}

</script>
