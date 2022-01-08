<template>
  <v-container>
    <router-link :to="{ name: 'ProductsCreate' }">
      <v-btn class="mb-4" color="primary">Создать товар</v-btn>
    </router-link>
    <Loader v-if="loading" />
    <template v-else>
      <h2 v-if="list.length === 0">Товаров пока что нет</h2>
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
            <div class="product-img" :style="{'background-image': `url(${item.image})`}"></div>
          </template>
          <template v-slot:item.categoryId="{ item }">
            <div v-if="categoryList[item.categoryId]">
              {{ categoryList[item.categoryId] }}
            </div>
          </template>
          <template v-slot:item.status="{ item }">
            <div v-if="productStatuses.find(el => el.id === item.status)">
              {{ productStatuses.find(el => el.id === item.status).text }}
            </div>
          </template>
          <template v-slot:item.price="{ item }">
            {{ item.price | currency }}
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
import * as productAPI from '@/api/product'
import * as categoryAPI from '@/api/category'
import Loader from '@/components/Loader'

export default {
  components: {
    Loader,
  },
  data() {
    return {
      list: [],
      loading: true,
      tableSearch: "",
      categoryList: {},
      tableHeaders: [
        { text: "Картинка", value: "image", sortable: false },
        { text: "Название", value: "title_ru" },
        { text: "Категория", value: "categoryId" },
        { text: "Цена", value: "price" },
        { text: "Статус", value: "status" },
        { text: "Порядок", value: "order" },
        { text: "Действия", value: "actions", sortable: false },
      ],
      productStatuses: [{ id: 'active', text: "Активен" }, { id: 'inactive', text: "Неактивен" }],
    };
  },
  methods: {
    async deleteHandler(id) {
      const res = await this.$confirm(
        "Вы действительно хотите удалить товар?",
        {
          title: "Вы уверены?",
          buttonTrueText: "Да",
          buttonFalseText: "Нет",
        }
      );
      if (res) {
        try {
          const res = await productAPI.remove(id)
          if (res.success) {
            this.$success('Товар успешно удален')
            this.list = this.list.filter((el) => el.id !== id);
          } else {
            this.$error()
          }
        } catch (e) {
          this.$error()
        }
      }
    },
    editHandler(id) {
      this.$router.push({ name: "ProductsEdit", params: { id } });
    },
  },
  async mounted() {
    try {
      const res = await productAPI.load()
      if (res.success) this.list = res.data
      const resCat = await categoryAPI.load()
      if (resCat.success) this.categoryList = resCat.data.reduce((total, current) => ({ ...total, [current.id]: current.title_ru }), {})
      this.loading = false
    } catch (e) {
      this.$error()
    }
  },
};
</script>


<style lang="sass">
.product-img
  width: 100px
  height: 100px
  background-position: center
  background-size: cover
</style>
