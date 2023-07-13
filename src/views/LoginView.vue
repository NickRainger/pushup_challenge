<template>
  <main class="flex justify-center items-center h-screen">

    <div class="bg-base-300 p-4 rounded-xl w-11/12">

      <form class=" flex flex-col gap-4" @submit="register()" @submit.prevent v-if="register_screen">

        <div class="flex">
          <h1 class="text-xl font-bold flex-1">Registreer</h1>
          <button type="button" class="btn btn-sm btn-info btn-outline font-bold"
            @click="register_screen = !register_screen">Login</button>
        </div>

        <h2 class="font-bold">Email</h2>
        <input v-model="form.email" type="text" class="input input-sm" placeholder="Email">

        <h2 class="font-bold">Naam <span class="text-red-500">*</span></h2>
        <input required v-model="form.username" type="text" class="input input-sm" placeholder="Naam">

        <h2 class="font-bold">Wachtwoord <span class="text-red-500">*</span></h2>
        <input required v-model="form.password" type="password" class="input input-sm"
          placeholder="Wachtwoord (min 5 characters)">

        <button class="btn btn-sm  btn-success btn-outline flex-1 join-item" type="submit">Registreer</button>
      </form>


      <form class=" flex flex-col gap-4" @submit="login()" @submit.prevent v-else>

        <div class="flex">
          <h1 class="text-xl font-bold flex-1">Login</h1>
          <button type="button" class="btn btn-sm btn-success btn-outline font-bold"
            @click="register_screen = !register_screen">Registreer</button>
        </div>

        <h2 class="font-bold">Naam / Email <span class="text-red-500">*</span></h2>
        <input required v-model="form.username" type="text" class="input input-sm" placeholder="Naam / Email">

        <h2 class="font-bold">Wachtwoord <span class="text-red-500">*</span></h2>
        <input required v-model="form.password" type="password" class="input input-sm" placeholder="Wachtwoord">

        <button class="btn btn-sm btn-info btn-outline flex-1 join-item" type="submit">Inloggen</button>
      </form>

    </div>

  </main>
</template>

<script lang="ts">

import { auth, pb } from "@/pocketbase"

export default {
  data: () => ({
    groepen: [],
    form: {
      username: "",
      email: "",
      password: ""
    },
    register_screen: true
  }),
  async mounted() {
    this.groepen = await pb.collection("pushup_groepen").getFullList()
  },
  methods: {
    async login() {


      pb.collection("pushup_users").authWithPassword(this.form.username, this.form.password)


    },
    async register() {

      const create = await pb.collection("pushup_users").create({
        email: this.form.email,
        username: this.form.username,
        password: this.form.password,
        passwordConfirm: this.form.password
      })

      if (create) {
        pb.collection("pushup_users").authWithPassword(this.form.username, this.form.password)
      }
    }
  }
}


</script>