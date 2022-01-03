<template>
  <v-app>
    <Alerts />
    <router-view></router-view>
  </v-app>
</template>

<script>
import Alerts from '@/components/Alerts'
import * as userAPI from '@/api/user'

export default {
  components: {
    Alerts
  },
  async mounted() {
    try {
      const res = await userAPI.load()     
      if (res.success) this.$store.dispatch('user/setUser', res.data)
    } catch (e) {}
    this.$store.dispatch('setLoaded', true)
  }
}
</script>
