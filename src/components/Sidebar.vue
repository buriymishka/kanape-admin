<template>
  <div>
    <v-list subheader flat>
      <v-list-item-group>
        <router-link class="nav-link" :to="{ name: 'Orders' }">
          <v-list-item>
            <v-list-item-content class="list-item">
              <v-list-item-title>Заказы</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon class="icon">mdi-playlist-edit</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </router-link>
        <router-link class="nav-link" :to="{ name: 'Products' }">
          <v-list-item>
            <v-list-item-content class="list-item">
              <v-list-item-title>Товары</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon class="icon">mdi-food</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </router-link>
        <router-link class="nav-link" :to="{ name: 'Categories' }">
          <v-list-item>
            <v-list-item-content class="list-item">
              <v-list-item-title>Категории</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon class="icon">mdi-shape</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </router-link>
        <router-link class="nav-link" :to="{ name: 'Info' }">
          <v-list-item>
            <v-list-item-content class="list-item">
              <v-list-item-title>Общая информация</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon class="icon">mdi-information</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </router-link>
        <router-link class="nav-link" :to="{ name: 'Profile' }">
          <v-list-item>
            <v-list-item-content class="list-item">
              <v-list-item-title>Профиль</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon class="icon">mdi-account</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </router-link>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<style lang="sass" scoped>
.router-link-exact-active
  background-color: #FAFAFA
  .v-icon
    color: #2196f3 !important
.nav-link
  display: block
  transition: background-color .25s ease

.nav-link:hover
  background-color: #FAFAFA
</style>

<script></script>
