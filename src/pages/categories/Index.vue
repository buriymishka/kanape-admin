<template>
  <v-container>
    <router-link :to="{ name: 'CategoriesCreate' }">
      <v-btn class="mb-4" color="primary">Создать категорию</v-btn>
    </router-link>
    <img src="/uploads/05012022-154639_086-zxcqwe.jpg" alt="">
    <Loader v-if="loading" />
    <template v-else>
      <h2 v-if="list.length === 0">Категорий пока что нет</h2>
      <template v-else>
        <v-text-field
          v-model="tableSearch"
          append-icon="mdi-magnify"
          label="Поиск"
          class="mb-4"
          single-line
          hide-details
        ></v-text-field>
        <v-data-table
          :headers="tableHeaders"
          :items="list"
          :search="tableSearch"
          :items-per-page="-1"
          no-results-text="Совпадающих записей не найдено"
          :header-props="{
            sortByText: 'Сортировать по'
          }"
          :footer-props="{
            'items-per-page-text': 'Записей на странице',
            'items-per-page-all-text': 'Все',
            'items-per-page-options': [-1, 10, 25, 50, 100],
          }"
        >
          <template v-slot:item.image="{ item }">
            <div class="category-img" :style="{'background-image': `url(${item.image})`}"></div>
          </template>
          <template v-slot:item.status="{ item }">
            <div v-if="catStatuses.find(el => el.id === item.status)">
              {{ catStatuses.find(el => el.id === item.status).text }}
            </div>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon class="icon-edit mr-4" @click.stop="editHandler(item.id)">
              mdi-playlist-edit
            </v-icon>
            <v-icon class="icon-trash" @click.stop="deleteHandler(item.id)">
              mdi-trash-can-outline
            </v-icon>
          </template>
        </v-data-table>
      </template>
    </template>
  </v-container>
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
      list: [],
      loading: true,
      tableSearch: "",
      tableHeaders: [
        { text: "Картинка", value: "image", sortable: false },
        { text: "Название (Русский)", value: "title_ru" },
        { text: "Название (Латышский)", value: "title_lv" },
        { text: "Название (Английский)", value: "title_en" },
        { text: "Статус", value: "status" },
        { text: "Порядок", value: "order" },
        { text: "Действия", value: "actions", sortable: false },
      ],
      catStatuses: [{ id: 'active', text: "Активна" }, { id: 'inactive', text: "Неактивна" }],
    };
  },
  methods: {
    async deleteHandler(id) {
      const res = await this.$confirm(
        "Вы действительно хотите удалить категорию? Товары останутся без данной категории. Лучше поставить статус ''Неактивна''",
        {
          title: "Вы уверены?",
          buttonTrueText: "Да",
          buttonFalseText: "Нет",
        }
      );
      if (res) {
        try {
          const res = await categoryAPI.remove(id)
          if (res.success) {
            this.$success('Категория успешно удалена')
            this.list = this.list.filter((el) => el.id !== id);
          } else {
            this.$error()
          }
        } catch (e) {
          this.$error(e.frontMessage)
          console.log(e);
        }
      }
    },
    editHandler(id) {
      this.$router.push({ name: "CategoriesEdit", params: { id } });
    },
  },
  async mounted() {
    try {
      const res = await categoryAPI.load()
      if (res.success) {
        this.list = res.data
      }
      this.loading = false;
    } catch (e) {
      this.$error();
      console.log(e);
    }
  },
};
</script>

<style lang="sass">
.category-img
  width: 100px
  height: 100px
  background-position: center
  background-size: cover
</style>
