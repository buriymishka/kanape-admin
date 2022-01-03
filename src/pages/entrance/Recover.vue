<template>
  <v-layout align-center fill-height>
    <v-flex>
      <transition name="fade" mode="out-in">
        <v-card key="1" v-if="!isFormSend" max-width="600" class="mx-auto my-12">
          <v-card-title>Восстановление пароля</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="formHandler" ref="form" lazy-validation>
              <v-text-field
                v-model="form.email"
                :rules="rules.email"
                name="email"
                label="Email"
                required
              ></v-text-field>

              <v-btn
                type="submit"
                color="success"
                :loading="btnLoading"
                class="mr-4 mt-4"
                >Продолжить</v-btn
              >
            </v-form>
            <div class="mt-8 d-flex justify-space-between">
              <router-link :to="{ name: 'Login' }">
                <v-chip link color="red" text-color="white">Уже есть аккаунт?</v-chip>
              </router-link>
            </div>
          </v-card-text>
        </v-card>
        <v-card key="2" max-width="600" class="mx-auto my-12" v-else>
          <v-card-title>Восстановление пароля</v-card-title>
          <v-card-text>
            <p>
              Дальнейшая инструкция по восстановлению пароля отправлена на почту: <b>{{ form.email }}</b>
            </p>
            <p>Возможно письмо попало в спам</p>
            <div class="mt-8 d-flex justify-space-between">
              <router-link :to="{ name: 'Login' }">
                <v-chip link color="success" text-color="white">Войти в систему</v-chip>
              </router-link>
            </div>
          </v-card-text>
        </v-card>
      </transition>
    </v-flex>
  </v-layout>
</template>

<script>
import { REGEX_EMAIL } from '@/globalVars'
import * as userAPI from '@/api/user'

export default {
  data: () => ({
    form: {
      email: ''
    },
    rules: {
      email: [
        v => !!v || 'Введите Email',
        v => REGEX_EMAIL().test(v) || 'Введите валидный Email',
        v => !(v || '').includes(' ') || 'Пробелы недопустимы',
      ]
    },
    touched: {
      email: false
    },
    isFormSend: false,
    btnLoading: false,
  }),

  methods: {
    async formHandler() {
      if (this.$refs.form.validate()) {
        this.btnLoading = true

        try {
          const res = await userAPI.recover({ email: this.form.email })
          if (res.success) {
            this.isFormSend = true
          }
        } catch(e) {
          this.$error(e.frontMessage)
        }

        this.btnLoading = false
      }
    },
    onLogin() {
      this.$emit('login')
    }
  }
}
</script>
