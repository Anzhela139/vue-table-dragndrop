<script setup>
import H1Title from './components/H1Title.vue'
import TheWelcome from './components/TheWelcome.vue'
import Sidebar from './components/Sidebar.vue'
</script>

<template>
  <H1Title />
  <Sidebar />
  <main class="main-wrapper">
    <div class="container">

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
