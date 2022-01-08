<template>
  <div>
    <v-container>
      <router-link :to="{ name: 'Orders' }">
        <v-btn color="primary" class="mb-4">Список заказов</v-btn>
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
              v-model="name"
              :name="Math.random()"
              label="Имя заказчика"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="sum"
              :rules="sumRules"
              name="asiojduzxczxcqq"
              type="number"
              hint="Например: 42.56"
              step="0.01"
              label="Сумма заказа"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="phone"
              name="zxcdqw"
              label="Номер телефона"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-select
              :items="orderStatuses"
              v-model="orderStatusId"
              label="Статус заказа"
              item-text="text"
              item-value="id"
            ></v-select>
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              :items="payStatuses"
              v-model="payStatusId"
              label="Оплачен"
              item-text="text"
              item-value="id"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-select
              :items="languages"
              v-model="languageId"
              label="Язык"
              item-text="text"
              item-value="id"
            ></v-select>
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              :items="payTypes"
              v-model="payTypeId"
              label="Оплата с помощью"
              item-text="text"
              item-value="id"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-textarea
              v-model="comment"
              label="Комментарий к заказу"
              outlined
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6" class="d-flex justify-space-between">
            <div class="d-flex flex-wrap">
              <h2 class="mr-4">Товары</h2>
              <v-btn @click="addProduct" color="success"> <v-icon dark> mdi-plus </v-icon></v-btn>
            </div>
            <div>расчетная стоимость: {{ getCost | currency }} (Укажите сумму заказа вручную)</div>
          </v-col>
        </v-row>
        <div :key="rerenderKey">
          <v-row align="center" v-for="orderProduct in orderProducts" :key="orderProduct.id">
            <v-col cols="12" md="3">
              <v-select
                :items="productList"
                @input="onChangeProduct($event, orderProduct.id)"
                :value="orderProduct.id"
                label="Товары"
                item-text="title_ru"
                item-value="id"
                :rules="productRules"
              ></v-select>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                :rules="countRules"
                name="asimecr"
                type="number"
                v-model="orderProduct.count"
                label="Количество"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-btn @click="onRemoveProduct(orderProduct.id)" color="error"><v-icon dark> mdi-trash-can-outline </v-icon></v-btn>
            </v-col>
          </v-row>
        </div>
        <v-btn
          type="submit"
          color="success"
          :loading="btnLoading"
          class="mr-4 mt-12"
          >Сохранить</v-btn
        >
      </v-form>
    </v-container>
  </div>
</template>

<script>
import Loader from '@/components/Loader'
import * as productAPI from '@/api/product'
import * as orderAPI from '@/api/order'

export default {
  components: {
    Loader,
  },
  data() {
    return {
      loading: true,
      valid: true,
      name: "",
      car: "",
      place: "",
      languageId: "",
      phone: "",
      comment: "",
      btnLoading: false,
      orderStatuses: [
        { id: "new", text: "Новый" },
        { id: "work", text: "В работе" },
        { id: "done", text: "Готов" },
      ],
      languages: [
        { id: "ru", text: "Русский" },
        { id: "lv", text: "Латышский" },
        { id: "en", text: "Английский" },
      ],
      orderStatusId: "new",
      payStatuses: [
        { id: "yes", text: "Да" },
        { id: "no", text: "Нет" },
      ],
      payTypes: [
        { id: "card", text: "Карта" },
        { id: "cash", text: "Наличные" },
      ],
      payTypeId: '',
      payStatusId: "no",
      sum: "",
      sumRules: [(v) => !!v || "Укажите сумму заказа"],
      countRules: [(v) => (!!v && v !== '0' && +v > 0) || "Укажите количество товара"],
      productList: [],
      orderProducts: [],
      productRules: [(v) => (!!v && v !== 'add') || "Выберите товар"],
      rerenderKey: 1,
      createdAt: '',
    };
  },
  computed: {
    getTitle() {
      return id => {
        return this.productList.find(el => el.id === id)?.title?.ru
      }
    },
    getCost() {
      let res = 0
      this.orderProducts.forEach(orderProduct => {
        this.productList.forEach(product => {
          if(orderProduct.id === product.id) {
            res += orderProduct.count * product.price
          }
        })
      })
      return res.toFixed(2)
    }
  },
  methods: {
    async formHandler() {
      if (this.$refs.form.validate()) {
        if(+this.sum !== +this.getCost) {
          const res = await this.$confirm(
            "Стоимость заказа и расчетная стоимость не совпадают",
            {
              title: "Суммы не совпадают",
              buttonTrueText: "Продолжить",
              buttonFalseText: "Перепроверить",
            }
          );
          if(!res) return;
        }
        this.btnLoading = true;
        let data = {
          name: this.name,
          languageId: this.languageId,
          payTypeId: this.payTypeId,
          phone: this.phone,
          sum: this.sum || 0,
          comment: this.comment,
          status: this.orderStatusId,
          payStatus: this.payStatusId,
          products: this.orderProducts
        }

        try {
          const res = await orderAPI.update(this.$route.params.id, data)
          if (res.success) {
            this.$success('Заказ успешно обновлен')
            this.$router.push({ name: 'Orders' })
          } else {
            this.$error()
          }
        } catch (e) {
          this.$error()
          console.log(e);
        }

        this.btnLoading = false;
      }
    },
    onChangeProduct(productId, prevId) {
      let product = this.orderProducts.find(el => el.id === prevId)
      if(this.orderProducts.find(el => el.id === productId)) {
        this.$error('Такой товар уже выбран')
        this.rerenderKey = this.rerenderKey + 1
        return;
      }
      if (product) {
        product.id = productId
      }
    },
    addProduct() {
      if(!this.orderProducts.find(el => el.id === 'add')) {
        this.orderProducts.push({ id: 'add', count: 1 })
      }
    },
    onRemoveProduct(productId) {
      this.orderProducts = this.orderProducts.filter(el => el.id !== productId)
    }
  },
  async mounted() {
    try {
      const order = await orderAPI.loadById(this.$route.params.id)
      if (order.success) {
        this.name = order.data.name || ''
        this.languageId = order.data.languageId || ''
        this.payTypeId = order.data.payTypeId || ''
        this.phone = order.data.phone || ''
        this.sum = order.data.sum || 0
        this.comment = order.data.comment || ''
        this.orderStatusId = order.data.status || 'new'
        this.payStatusId = order.data.payStatus || 'no'
        this.createdAt = order.data.createdAt || ''
        this.orderProducts = order.data.products || []
      }

      const resProducts = await productAPI.load()
      if (resProducts.success) this.productList = resProducts.data

      this.loading = false;
    } catch (e) {
      this.$error()
      console.log(e)
    }
  },
};
</script>