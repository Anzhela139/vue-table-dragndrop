<script>
import H1Title from './components/H1Title.vue'
import Sidebar from './components/Sidebar.vue'
import Products from './components/Products.vue'
export default {
  components: {
    H1Title,
    Sidebar,
    Products
  },
  data() {
    return {
      count: 0
    }
  },

  // Methods are functions that mutate state and trigger updates.
  // They can be bound as event handlers in templates.
  methods: {
    increment() {
      this.count++
    }
  },

  // Lifecycle hooks are called at different stages
  // of a component's lifecycle.
  // This function will be called when the component is mounted.
  mounted() {
    console.log(`The initial count is ${this.count}.`)
  }
}
</script>

<template>
  <H1Title />
  <Sidebar />
  <main class="main-wrapper">
    <div class="container">
      <Products />
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
