<template>
  <div>
    <v-container>
      <router-link :to="{ name: 'Products' }">
        <v-btn color="primary" class="mb-4">Список товаров</v-btn>
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
        <v-row>
          <v-col cols="12" md="4">
            <v-textarea
              v-model="description.ru"
              label="Описание (Русский)"
              outlined
            ></v-textarea>
          </v-col>
          <v-col cols="12" md="4">
            <v-textarea
              v-model="description.lv"
              label="Описание (Латышский)"
              outlined
            ></v-textarea>
          </v-col>
          <v-col cols="12" md="4">
            <v-textarea
              v-model="description.en"
              label="Описание (Английский)"
              outlined
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="price"
              :rules="priceRules"
              name="asiojduhas"
              type="number"
              hint="Например: 42.56"
              step="0.01"
              label="Цена"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              :items="categoryList"
              v-model="categoryId"
              label="Категория товара"
              item-text="title_ru"
              item-value="id"
              clearable
            ></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-file-input
              placeholder="Загрузите картинку"
              prepend-icon="mdi-camera"
              v-model="image"
            ></v-file-input>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-select
              :items="productStatuses"
              v-model="productStatusId"
              label="Статус товара"
              item-text="text"
              item-value="id"
            ></v-select>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="order"
              name="asiojduhasfvb"
              type="number"
              hint="Порядок на сайте меню (оставьте пустым, чтобы поставить товар в конец)"
              label="Порядок"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-img v-if="currentImage" :src="currentImage" max-height="300" max-width="300" />
        <v-btn
          type="submit"
          color="primary"
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
import * as productAPI from '@/api/product'
import * as categoryAPI from '@/api/category'

export default {
  components: {
    Loader,
  },
  data() {
    return {
      valid: true,
      loader: true,
      title: { ru: "", lv: "", en: "" },
      description: { ru: "", lv: "", en: "" },
      titleRules: [(v) => v.length >= 1 || "Минимум 1 символ"],
      price: null,
      priceRules: [(v) => !!v || "Укажите цену"],
      loading: true,
      btnLoading: false,
      categoryList: [],
      categoryId: null,
      select: null,
      image: null,
      currentImage: null,
      order: "",
      ingredients: { ru: [], lv: [], en: [] },
      productStatuses: [{ id: 'active', text: "Активнен" }, { id: 'inactive', text: "Неактивен" }],
      productStatusId: 'active',
    };
  },
  methods: {
    async formHandler() {
      if (this.$refs.form.validate()) {
        this.btnLoading = true

        Object.keys(this.title).forEach((key) => (this.title[key] = this.title[key].trim()));
        Object.keys(this.description).forEach((key) => (this.description[key] = this.description[key].trim()));

        const fromData = new FormData()
        fromData.append('title_ru', this.title.ru)
        fromData.append('title_lv', this.title.lv)
        fromData.append('title_en', this.title.en)
        fromData.append('description_ru', this.description.ru)
        fromData.append('description_lv', this.description.lv)
        fromData.append('description_en', this.description.en)
        fromData.append('order', this.order || this.order === 0 ? +this.order || new Date().getTime() : new Date().getTime())
        fromData.append('status', this.productStatusId)
        fromData.append('categoryId', this.categoryId || 0)
        fromData.append('price', this.price)
        if (this.image) fromData.append('image', this.image, this.image.name)

        try {
          const res = await productAPI.update(this.$route.params.id, fromData)
          if (res.success) {
            this.$success('Товар успешно обновлен')
            this.$router.push({ name: "Products" });
          } else {
            this.$error()
          }
        } catch (e) {
          this.$error()
        }

        this.btnLoading = false
      }
    },
  },
  async mounted() {
    try {
      const res = await productAPI.loadById(this.$route.params.id)
      if (res.success) {
        this.title.ru = res.data.title_ru
        this.title.lv = res.data.title_lv
        this.title.en = res.data.title_en
        this.description.ru = res.data.description_ru
        this.description.lv = res.data.description_lv
        this.description.en = res.data.description_en
        this.categoryId = res.data.categoryId
        this.productStatusId = res.data.status
        this.price = res.data.price
        this.order = res.data.order ?? null
        this.currentImage = res.data.image
      } else {
        this.$error()
      }
      const resCat = await categoryAPI.load()
      if (resCat.success) {
        this.categoryList = resCat.data
      } else {
        this.$error()
      }
    } catch (e) {
      this.$error(e.frontMessage)
    }
    this.loading = false
  },
};
</script>