<template>
  <div class="wr" v-if="isLogged">
    <v-navigation-drawer v-model="drawer" app>
      <AppSidebar />
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    </v-app-bar>

    <v-main>
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </v-main>
  </div>
</template>

<script>
import AppSidebar from '@/components/Sidebar.vue'

export default {
  components: {
    AppSidebar,
  },
  data: () => ({ drawer: null }),
  computed: {
    isLogged() {
      return this.$store.getters['user/user']
    }
  }
}
</script>

<style lang="sass" scoped>
.avatar
  cursor: pointer
  color: #ffffff
.wr
  min-height: 100%
.v-main
  min-height: 100%
</style>
