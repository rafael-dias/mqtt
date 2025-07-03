<template>
    <div class="container py-4">
        <h2 class="mb-4">Tanques Disponíveis</h2>
        <input v-model="busca" type="text" class="form-control mb-3" placeholder="Buscar por número ou produto" />
        <div class="row">
            <div class="col-4" v-for="tanque in tanquesFiltrados" :key="tanque.id">
                <TanqueCard :tanque="tanque" @click="abrirDetalhe" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import TanqueCard from './TanqueCard.vue'

const router = useRouter()
const busca = ref('')

const tanques = ref([
    { id: 1, numero: '01', produto: 'Vinho Tinto' },
    { id: 2, numero: '02', produto: 'Vinho Branco' },
    { id: 3, numero: '03', produto: 'Vinho Tinto' },
    { id: 4, numero: '04', produto: 'Vinho Branco' },
    { id: 5, numero: '05', produto: 'Vinho Tinto' },
    { id: 6, numero: '06', produto: 'Vinho Branco' },
    { id: 7, numero: '07', produto: 'Vinho Tinto' },
    { id: 8, numero: '08', produto: 'Vinho Tinto' },
    { id: 9, numero: '09', produto: 'Vinho Branco' },
    { id: 10, numero: '10', produto: 'Vinho Tinto' },
    { id: 11, numero: '11', produto: 'Vinho Branco' },
    { id: 12, numero: '12', produto: 'Vinho Tinto' },
    { id: 13, numero: '13', produto: 'Vinho Branco' },
    { id: 14, numero: '14', produto: 'Vinho Tinto' },
    { id: 15, numero: '15', produto: 'Vinho Branco' },
    { id: 16, numero: '16', produto: 'Vinho Tinto' },
    { id: 17, numero: '17', produto: 'Vinho Branco' },
    { id: 18, numero: '18', produto: 'Vinho Tinto' },
    { id: 19, numero: '19', produto: 'Vinho Branco' },
    { id: 20, numero: '20', produto: 'Vinho Tinto' },
    { id: 21, numero: '21', produto: 'Vinho Branco' },
    { id: 22, numero: '22', produto: 'Vinho Tinto' },
    // ... mais tanques
])

const tanquesFiltrados = computed(() =>
    tanques.value.filter(t =>
        t.numero.includes(busca.value) || t.produto.toLowerCase().includes(busca.value.toLowerCase())
    )
)

function abrirDetalhe(id) {
    router.push(`/detalhe/${id}`)
}
</script>