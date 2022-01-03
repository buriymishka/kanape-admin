<template>
  <v-layout align-center fill-height>
    <v-flex>
      <v-card max-width="600" class="mx-auto my-12">
        <v-card-title>Вход в систему</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="formHandler" ref="form" lazy-validation>
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
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              v-model="form.password"
              :rules="rules.password"
              :type="showPassword ? 'text' : 'password'"
              label="Пароль"
              class="input-group--focused"
              @click:append="showPassword = !showPassword"
              :validateOnBlur="!touched.password"
              @blur="touched.password = true"
              required
            ></v-text-field>

            <v-btn type="submit" color="success" :loading="btnLoading" class="mr-4 mt-4">Войти</v-btn>
          </v-form>
          <div class="mt-8 d-flex justify-space-between">
            <router-link :to="{ name: 'Recover' }">
              <v-chip link color="red" text-color="white">Забыли пароль?</v-chip>
            </router-link>
          </div>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { REGEX_EMAIL } from '@/globalVars'
import { setAC } from '@/tokens/index'
import * as userAPI from '@/api/user'

export default {
  data: () => ({
    form: {
      email: '',
      password: ''
    },
    rules: {
      email: [
        v => !!v || 'Введите Email',
        v => REGEX_EMAIL().test(v) || 'Введите валидный Email',
        v => !(v || '').includes(' ') || 'Пробелы недопустимы',
      ],
      password: [
        v => !!v || 'Введите Пароль',
      ],
    },
    touched: {
      email: false,
      password: false
    },
    showPassword: false,
    btnLoading: false,
  }),
  methods: {
    async formHandler() {
      if (this.$refs.form.validate()) {
        this.btnLoading = true;

        try {
          const res = await userAPI.login({
            email: this.form.email,
            password: this.form.password
          })
          if (res.success) {
            setAC(res.data.accessToken)
            delete res.data.accessToken
            this.$success('Вы успешно вошли в систему')
            this.$router.push({ name: 'Orders' })
            this.$store.dispatch('user/setUser', res.data)
          }
        } catch (e) {
          this.$error(e.frontMessage)
        }

        this.btnLoading = false;
      }
    }
  }
}
</script>
