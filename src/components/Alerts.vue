<template>
  <div class="alerts">
    <transition-group name="list" tag="div">
      <v-alert
        v-for="alert in alerts"
        :key="alert.id"
        :type="alert.type"
        :dismissible="alert.dismissible"
        @input="onRemove(alert.id)"
        >{{ alert.text }}
      </v-alert>
    </transition-group>
  </div>
</template>

<script>
export default {
  computed: {
    alerts() {
      return this.$store.getters["alerts/list"];
    },
  },
  methods: {
    onRemove(id) {
      this.$store.dispatch("alerts/remove", id);
    },
  },
};
</script>


<style lang="sass" scoped>
.alerts
  position: fixed
  top: 20px
  right: 20px
  z-index: 999

.list-enter-active
  animation: animateIn 0.5s

.list-leave-active
  animation: animateOut 0.5s

@keyframes animateIn
  from
    opacity: 0
    transform: translateX(100%)
  to
    opacity: 1
    transform: translateX(0)
@keyframes animateOut
  from
    opacity: 1
    transform: translateX(0)
  to
    opacity: 0
    transform: translateX(100%)

</style>
