<script setup>
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import SupportIcon from './icons/IconSupport.vue'
</script>

<template>
    <div class="sidebar"></div>
</template>

<style scoped>
.sidebar {
  position: absolute;
  top: 0;
  width: 229px;
  height: 100vh;
  margin: 0 25px 0 0;
  background-image: radial-gradient(circle at 29% 0, #000, #1c2734 103%);
}
</style>