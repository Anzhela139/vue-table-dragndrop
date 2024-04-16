<script>
import H1Title from './components/H1Title.vue'
import Sidebar from './components/Sidebar.vue'
import Products from './components/Products.vue'
import TabsNav from './components/TabsNav.vue'
export default {
  components: {
    TabsNav,
    H1Title,
    Sidebar,
    Products
  },
  data: () => ({
    columns: [ '#', 'ФИО', 'Адрес', 'Телефон' ],
    rows: [
      { '#': '1',   ФИО: 'Иван',    Адрес: 'Улица Ведеркина, дом 1, кв 1', Телефон: '+7 999 123 123' },
      { '#': '2',   ФИО: 'Женя',    Адрес: 'Улица Ведеркина, дом 2, кв 5', Телефон: '+7 999 554 123' },
      { '#': '3',   ФИО: 'Евгений', Адрес: 'Улица Ведеркина, дом 3, кв 3', Телефон: '+7 999 123 321' },
      { '#': '4',   ФИО: 'Дима',    Адрес: 'Улица Ведеркина, дом 4, кв 8', Телефон: '+7 999 777 123' },
    ]
  }),
}
</script>

<template>
  <H1Title />
  <Sidebar />
  <main class="main-wrapper">
    <div class="container">
      <TabsNav />
      <RouterView />
    </div>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  width: calc(100vw - 229px);
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    position: relative;
    left: 229px;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
