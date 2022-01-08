<template>
  <v-container fill-height>
    <v-flex>
      <Loader v-if="loading" />
      <v-form v-else @submit.prevent="formHandler" ref="form" lazy-validation class="form">
        <h2 class="mb-8">Общая информация</h2>
        <v-text-field v-model="form.phone" name="phone" label="Номер телефона" />
        <v-text-field v-model="form.address" name="address" label="Адрес" />
        <v-btn type="submit" color="success" :loading="btnLoading" class="mt-4">Сохранить</v-btn>
      </v-form>
    </v-flex>
  </v-container>
</template>

<script>
import Loader from '@/components/Loader.vue'
import * as infoAPI from '@/api/info'

export default {
  components: {
    Loader
  },
  data() {
    return {
      form: {
        phone: '',
        address: '',
      },
      rules: {},
      loading: true,
      btnLoading: false,
    };
  },
  methods: {
    async formHandler() {
      if (this.$refs.form.validate()) {
        this.btnLoading = true;
        try {
          const res = await infoAPI.update({
            phone: this.form.phone,
            address: this.form.address,
          })
          if (res.success) {
            this.$success('Сохранено')
          } else {
            this.$error()
          }
        } catch (e) {
          this.$error(e.frontMessage)
        }
        this.btnLoading = false
      }
    }
  },
  async mounted() {
    const res = await infoAPI.load()
    if (res.success) {
      this.form.phone = res.data.phone
      this.form.address = res.data.address
    }
    this.loading = false
  }
}
</script>

<style lang="sass" scoped>
.form
  max-width: 600px
  margin: auto
</style>
