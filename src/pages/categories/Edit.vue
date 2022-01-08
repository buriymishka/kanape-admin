<template>
  <div>
    <v-container>
      <router-link :to="{ name: 'Categories' }">
        <v-btn color="primary" class="mb-4">Список категорий</v-btn>
      </router-link>
      <Loader v-if="loading" />
      <v-form
        @submit.prevent="formHandler"
        ref="form"
        v-model="valid"
        lazy-validation
        v-else
      >
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="title.ru"
              :rules="titleRules"
              :name="Math.random()"
              label="Название (Русский)"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="title.lv"
              :rules="titleRules"
              :name="Math.random()"
              label="Название (Латышский)"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="title.en"
              :rules="titleRules"
              :name="Math.random()"
              label="Название (Английский)"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="mt-6">
          <v-col cols="12" md="4">
            <v-file-input
              placeholder="Загрузите картинку (.png, .jpg)"
              prepend-icon="mdi-camera"
              v-model="image"
              accept="image/jpeg, image/png"
            ></v-file-input>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="order"
              name="asiojduhasfvb"
              type="number"
              hint="Порядок на сайте меню (оставьте пустым, чтобы поставить товар в конец)"
              label="Порядок"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              :items="catStatuses"
              v-model="catStatusId"
              label="Статус категории"
              item-text="text"
              item-value="id"
            ></v-select>
          </v-col>
        </v-row>
        <v-img v-if="currentImage" :src="currentImage" max-height="300" max-width="300" />
        <v-btn
          type="submit"
          color="success"
          :loading="btnLoading"
          class="mr-4 mt-4"
          >Сохранить</v-btn
        >
      </v-form>
    </v-container>
  </div>
</template>

<script>
import Loader from '@/components/Loader'
import * as categoryAPI from '@/api/category'

export default {
  components: {
    Loader,
  },
  data() {
    return {
      valid: true,
      loading: true,
      title: {
        ru: "",
        lv: "",
        en: "",
      },
      order: null,
      image: null,
      currentImage: null,
      titleRules: [(v) => v.length >= 1 || "Минимум 1 символ"],
      btnLoading: false,
      catStatuses: [{ id: 'active', text: "Активна" }, { id: 'inactive', text: "Неактивна" }],
      catStatusId: 'active',
    };
  },
  methods: {
    async formHandler() {
      if (this.$refs.form.validate()) {
        this.btnLoading = true;

        Object.keys(this.title).forEach((key) => (this.title[key] = this.title[key].trim()))

        try {
          const fromData = new FormData()
          fromData.append('title_ru', this.title.ru)
          fromData.append('title_lv', this.title.lv)
          fromData.append('title_en', this.title.en)
          fromData.append('order', this.order || this.order === 0 ? +this.order || new Date().getTime() : new Date().getTime())
          fromData.append('status', this.catStatusId)
          if (this.image) fromData.append('image', this.image, this.image.name)

          const res = await categoryAPI.update(this.$route.params.id, fromData)
          if (res.success) {
            this.$success('Категория успешно обновлена')
            this.$router.push({ name: "Categories" });
          } else {
            this.$error()
          }
        } catch (e) {
          this.$error(e.frontMessage)
        }

        this.btnLoading = false;
      }
    },
  },
  async mounted() {
    try {
      const res = await categoryAPI.loadById(this.$route.params.id)
      if (res.success) {
        this.title.ru = res.data.title_ru
        this.title.lv = res.data.title_lv
        this.title.en = res.data.title_en
        this.catStatusId = res.data.status
        this.order = res.data.order ?? null
        this.currentImage = res.data.image
      } else {
        this.$error()
      }
    } catch (e) {
      this.$error(e.frontMessage)
    }
    this.loading = false;
  },
};
</script>