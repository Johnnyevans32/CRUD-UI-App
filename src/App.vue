<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppNavbar from './components/AppNavbar.vue'
</script>

<template>
  <div class="app">
    <AppNavbar />
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style>
:root {
  --text-color: #333;
  --background-color: #f9f9f9;
  --primary-color: #4caf50;
  --secondary-color: #2196f3;
  --danger-color: #f44336;
  --warning-color: #ff9800;
  --border-color: #ddd;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-color);
  background-color: var(--background-color);
  line-height: 1.6;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}

button {
  cursor: pointer;
}
</style>
