<template>
  <div class="flex flex-col gap-2 bg-base-200 p-4 rounded-xl">
    <canvas id="chart" height="300"></canvas>
  </div>
</template>

<script lang="ts">


import Chart from "chart.js/auto"
import { chartUpdate, formatTime, getHexFromString } from "@/utils";
import type { PropType } from "vue";
import type { ExtendedSession, ExtendedGroupUser } from "@/views/GroupView.vue";



export default {
  props: {
    sessions: {
      type: Array as PropType<ExtendedSession[]>,
      required: true
    },
    groupUsers: {
      type: Array as PropType<ExtendedGroupUser[]>,
      required: true
    },
  },
  watch: {
    sessions: function () {
      this.renderChart()
    },
    groupUsers: function () {
      this.renderChart()
    }
  },
  mounted() {

    console.log(this.sessions);

    const ctx = <HTMLCanvasElement>document.getElementById("chart")

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [],
      }
    });


    chartUpdate.on("update", (e: { tijden: number[], datasets: { label?: string, data: number[] }[] }) => {
      chart.data.labels = <never[]>e.tijden.map(e => formatTime(e))
      chart.data.datasets = e.datasets
      chart.update()
    })

    chartUpdate.on("clear", (e: { tijden: number[], datasets: { label?: string, data: number[] }[] }) => {
      chart.data.labels = []
      chart.data.datasets = []
      chart.update()
    })

    this.renderChart()
  },
  methods: {

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
  }
}

</script>