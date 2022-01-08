<template>
  <v-container>
    <router-link :to="{ name: 'OrdersCreate' }">
      <v-btn class="mb-4" color="primary">Создать заказ</v-btn>
    </router-link>
    <Loader v-if="loading" />
    <template v-else>
      <h2 v-if="list.length === 0">Заказов пока что нет</h2>
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
          :items-per-page="100"
          :item-class="itemRowBackground"
          class="ttt"
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
          <template v-slot:item.products="{ item }">
            <div v-for="orderProduct in item.products" :key="orderProduct.id">
              <v-chip class="mb-1 mt-1" v-if="productList[orderProduct.id]">
                {{ productList[orderProduct.id].title_ru }} <div class="ml-2 mr-2 cross" style="font-size: 12px; font-weight: 400">x</div> <div class="count">{{ orderProduct.count }}</div>
              </v-chip>
            </div>
          </template>
          <template v-slot:item.sum="{ item }">
            {{ item.sum | currency }}
          </template>
          <template v-slot:item.createdAt="{ item }">
            <div v-if="item.createdAt">
              {{ item.createdAt | date }}
            </div>
          </template>
          <template v-slot:item.status="{ item }">
            <div class="my">
              <v-select
                :items="orderStatuses"
                :value="item.status"
                @change="onChangeStatus($event, item.id)"
                item-text="text"
                item-value="id"
                :disabled="changeStatusDisableId === item.id"
                style="max-width: 105px;"
              ></v-select>
            </div>
          </template>
          <template v-slot:item.payStatus="{ item }">
            <div v-if="payStatuses.find(el => el.id === item.payStatus)">
              {{ payStatuses.find(el => el.id === item.payStatus).text }}
            </div>
          </template>
          <template v-slot:item.payTypeId="{ item }">
            <div v-if="payTypes.find(el => el.id === item.payTypeId)">
              {{ payTypes.find(el => el.id === item.payTypeId).text }}
            </div>
          </template>
          <template v-slot:item.languageId="{ item }">
            <div v-if="languages.find(el => el.id === item.languageId)">
              {{ languages.find(el => el.id === item.languageId).text }}
            </div>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon class="icon icon-edit mr-4" @click.stop="editHandler(item.id)">
              mdi-playlist-edit
            </v-icon>
            <v-icon class="icon icon-trash" @click.stop="deleteHandler(item.id)">
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
import * as orderAPI from '@/api/order'
import * as productAPI from '@/api/product'

export default {
  components: {
    Loader,
  },
  data() {
    return {
      list: [],
      loading: true,
      tableSearch: "",
      changeStatusDisableId: null,
      tableHeaders: [
        { text: "Имя", value: "name" },
        { text: "Номер телефона", value: "phone" },
        { text: "Сумма", value: "sum" },
        { text: "Товары", value: "products" },
        { text: "Комментарий", value: "comment" },
        { text: "Оплата", value: "payTypeId" },
        { text: "Язык", value: "languageId" },
        { text: "Статус", value: "status" },
        { text: "Дата заказа", value: "createdAt" },
        { text: "Действия", value: "actions", sortable: false },
      ],
      payStatuses: [{ id: "yes", text: "Да" }, { id: "no", text: "Нет" }],
      orderStatuses: [{ id: 'new', text: "Новый" }, { id: 'work', text: "В работе" }, { id: 'done', text: "Готов" }],
      languages: [
        { id: "ru", text: "Русский" },
        { id: "lv", text: "Латышский" },
        { id: "en", text: "Английский" },
      ],
      payTypes: [
        { id: "card", text: "Карта" },
        { id: "cash", text: "Наличные" },
      ],
      productList: {}
    };
  },
  methods: {
    async deleteHandler(id) {
      const res = await this.$confirm(
        "Вы действительно хотите удалить заказ?",
        {
          title: "Вы уверены?",
          buttonTrueText: "Да",
          buttonFalseText: "Нет",
        }
      );
      if (res) {
        try {
          const res = await orderAPI.remove(id)
          if (res.success) {
            this.$success('Заказ успешно удален')
          } else {
            this.$error()
          }
          this.list = this.list.filter((el) => el.id !== id);
        } catch (e) {
          this.$error()
        }
      }
    },
    itemRowBackground: function (item) {
      if(item.status === 'new') return 'order-list-status-new'
      if(item.status === 'work') return 'order-list-status-work'
      if(item.status === 'done') return 'order-list-status-done'
    },
    async onChangeStatus(statusId, id) {
      this.changeStatusDisableId = id
      const res = await orderAPI.changeStatus(id, statusId)
      if (res.success) {
        let order = this.list.find(el => el.id === id)
        if (order) order.status = statusId
        this.$success('Заказ успешно обновлен')
      } else {
        this.$error()
      }
      this.changeStatusDisableId = null
    },
    editHandler(id) {
      this.$router.push({ name: "OrdersEdit", params: { id } });
    },
  },
  async mounted() {
    try {
      const res = await orderAPI.load()
      if (res.success) {
        this.list = res.data
      } else {
        this.$error()
      }
      const resProducts = await productAPI.load()
      if (resProducts.success) {
        this.productList = resProducts.data.reduce((total, current) => ({ ...total, [current.id]: current }), {})
      }
    } catch (e) {
      this.$error()
    }
    this.loading = false  
  },
};
</script>

<style lang="sass">
.my
  .v-select__selection,
  .v-select__selection--comma,
  .v-select.v-text-field input
    color: #ffffff !important
  .v-label, .mdi-menu-down::before
    color: #FFFFFF !important
  .v-input__slot:before
    border-color: #FFFFFF !important
.ttt
  color: #ffffff !important
  .icon
    color: #ffffff !important
  .count
    color: blue
    font-weight: 500
    font-size: 16px
  .cross
    color: #ffffff
  .v-chip
    background-color: #4caf50 !important
    color: #ffffff
    font-weight: 400
    font-size: 15px
.order-list-status
  color: #ffffff !important

  &-new
    background-color: #702329 !important
  &-work
    background-color: #ffffff !important
    color: #000000 !important
    .v-select__selection,
    .v-select__selection--comma,
    .v-select.v-text-field input
      color: #000000 !important
    .v-label, .mdi-menu-down::before
      color: #000000 !important
    .v-input__slot:before
      border-color: #000000 !important
    .icon
      color: #000000 !important
    .v-chip
      background-color: #FAFAFA !important
      color: #000000 !important
    .count
      color: #000000 !important
    .cross
      color: #000000 !important
  &-done
    background-color: #1B5E20 !important
.v-data-footer
  color: #000000 !important
</style>
