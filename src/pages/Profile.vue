<template>
  <v-container fill-height>
    <v-flex>
      <v-form @submit.prevent="formHandler" ref="form" lazy-validation class="form">
        <h2 class="mb-8">Настройки профиля</h2>
        <v-text-field
          v-model="form.email"
          :rules="rules.email"
          name="email"
          label="Email"
          :validateOnBlur="!touched.email"
          @blur="touched.email = true"
          required
        ></v-text-field>

        <v-text-field
          :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
          v-model="form.password"
          :rules="rules.password"
          :type="show3 ? 'text' : 'password'"
          label="Новый пароль"
          hint="Минимум 4 символа"
          class="input-group--focused"
          :validateOnBlur="!touched.password"
          @blur="touched.password = true"
          @click:append="show3 = !show3"
        ></v-text-field>

        <v-text-field
          :append-icon="show4 ? 'mdi-eye' : 'mdi-eye-off'"
          v-model="form.rePassword"
          :rules="[comparePasswords]"
          :type="show4 ? 'text' : 'password'"
          label="Повторите новый пароль"
          class="input-group--focused"
          :validateOnBlur="!touched.rePassword"
          @blur="touched.rePassword = true"
          @click:append="show4 = !show4"
        ></v-text-field>

        <div class="mt-4 d-flex justify-space-between">
          <v-btn type="submit" color="success" :loading="btnLoading" class="mr-4">Сохранить</v-btn>
          <v-btn type="button" color="error" @click="onExit">
            Выйти
            <v-icon class="exit-icon" right>mdi-exit-to-app</v-icon>
          </v-btn>
        </div>
      </v-form>
    </v-flex>
  </v-container>
</template>

<script>
import { REGEX_EMAIL } from '@/globalVars'
import * as userAPI from '@/api/user'

export default {
  data() {
    return {
      form: {
        email: '',
        password: '',
        rePassword: '',
      },
      rules: {
        email: [
          v => !!v || 'Введите Email',
          v => REGEX_EMAIL().test(v) || 'Введите валидный Email',
          v => !(v || '').includes(' ') || 'Пробелы недопустимы',
        ],
        password: [
          v => !v || v.length >= 4 || 'Минимум 4 символа',
          v => !v || !(v || '').includes(' ') || 'Пробелы недопустимы',
        ]
      },
      touched: {
        email: false,
        password: false,
        rePassword: false
      },
      show3: false,
      show4: false,
      btnLoading: false,
    };
  },
  computed: {
    comparePasswords() {
      return () => this.form.password === this.form.rePassword || 'Пароли должны совпадать'
    },
  },
  methods: {
    setupForm() {
      this.form.email = this.$store.getters['user/user']?.email || ''
      this.form.password = ''
      this.form.rePassword = ''
    },
    async formHandler() {
      if (this.$refs.form.validate()) {
        this.btnLoading = true;
        try {
          const res = await userAPI.update({
            email: this.form.email,
            newPassword: this.form.password,
          })
          if (res.success) {
            this.$store.dispatch('user/setUser', res.data)
            this.setupForm()
            this.$success('Сохранено')
          }
        } catch (e) {
          this.$error(e.frontMessage)
        }
        this.btnLoading = false
      }
    },
    async onExit() {
      try {
        const res = await userAPI.logout()
        if (res.success) {
          window.location = '/profile'
        }
      } catch (e) {
        this.$error(e.frontMessage)
      }
    }
  },
  async mounted() {
    this.setupForm()
  },
}
</script>

<style lang="sass" scoped>
.form
  max-width: 600px
  margin: auto
.exit-icon
  position: relative
  top: -1px
</style>
