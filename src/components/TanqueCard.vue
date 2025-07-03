<template>
    <div class="card mb-3 shadow-sm" @click="$emit('click', tanque.id)">
      <div class="card-body">
        <h5 class="card-title">Tanque {{ tanque.numero }}</h5>
        <p class="card-text"><strong>Produto:</strong> {{ tanque.produto }}</p>
      </div>
    </div>
</template>

<script setup>
defineProps({
  tanque: {
    type: Object,
    required: true
  }
})
defineEmits(['click'])
</script>
<style>
.card {cursor: pointer;}
</style>