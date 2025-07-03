<template>
  <div class="bg-light min-vh-100">
    <nav class="navbar navbar-expand-lg navbar-dark borda">
      <div class="container">
        <a class="navbar-brand" href="/"><h3>Vinuta</h3></a>
      </div>
    </nav>

    <main class="container mt-4">
      <router-view />
    </main>
  </div>
</template>

<script setup>
// Nada necessário aqui, pois tudo é renderizado via router-view
</script>

<style>
body {
  margin: 0;
}

.borda {
  background-color: #491618 !important;
  border-bottom: 3px solid #96663f !important;
}


</style>