<template>
  <div class="wr">
    <v-navigation-drawer v-model="drawer" app>
      <AppSidebar />
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      UserName
      <v-spacer></v-spacer>
      <router-link to="/profile">
        <v-avatar color="primary" size="40" class="avatar">
          <v-icon dark size="20">
            mdi-account
          </v-icon>
        </v-avatar>
      </router-link>
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
  data: () => ({ drawer: null })
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
