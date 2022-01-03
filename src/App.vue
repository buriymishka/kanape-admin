<template>
  <v-app>
    <Alerts />
    <router-view></router-view>
  </v-app>
</template>

<script>
import Alerts from '@/components/Alerts'

export default {
  components: {
    Alerts
  }
}
</script>
