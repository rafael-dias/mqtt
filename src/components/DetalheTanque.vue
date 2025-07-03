<template>
    <div class="container py-4">
        <h2 class="mb-4">Controle do Tanque {{ id }}</h2>

        <div class="row">
            <!-- 🖼️ Lado esquerdo: imagem -->
            <div class="col-md-5 position-relative mb-5">
                <img :src="barrilImg" alt="Imagem do tanque" class="img-fluid rounded shadow-sm" />
                <span class=" position-absolute"
                     style=" color: white; top: 50%; left: 30%; transform: translate(-20%, -300%); width: 60%;">Temperatura Atual</span>
                <input type="text" v-model="temperatura_atual" placeholder="Temperatura atual"
                    class="form-control position-absolute"
                    style="top: 50%; left: 30%; transform: translate(-50%, -90%); width: 30%;" />
            </div>


            <!-- 🎛️ Lado direito: campos -->
            <div class="col-md-7">
                <!-- Grupo: Controle de temperatura -->
                <div class="mb-4 border-bottom pb-3">
                    <h5>Controle de Temperatura</h5>
                    <div class="row">
                        <div class="col-6">

                            <div class="mb-3">
                                <label class="form-label">Set Point (°C)</label>
                                <input type="number" v-model="setPoint" class="form-control" />
                            </div>
                        </div>

                        <div class="col-6">

                            <div class="mb-3">
                                <label class="form-label">Tolerância (±°C)</label>
                                <input type="number" v-model="tolerancia" class="form-control" />
                            </div>
                        </div>

                        <div class="col-12 text-end">
                            <button class="btn btn-vinuta" @click="iniciarControle">
                                Iniciar Controle
                            </button>

                        </div>
                    </div>
                </div>

                <!-- Grupo: Remontador -->
                <div class="mb-4">
                    <h5>Configurações do Remontador</h5>

                    <div class="row">

                        <div class="col-6">

                            <div class="mb-3">
                                <label class="form-label">Tempo ligado (min)</label>
                                <input type="number" v-model="tempoLigado" class="form-control" />
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="mb-3">
                                <label class="form-label">Tempo desligado (min)</label>
                                <input type="number" v-model="tempoDesligado" class="form-control" />
                            </div>

                        </div>
                        <div class="col-6">

                            <div class="mb-3">
                                <label class="form-label">Velocidade Alta (RPM)</label>
                                <input type="number" v-model="velAlta" class="form-control" />
                            </div>
                        </div>

                        <div class="col-6">

                            <div class="mb-3">
                                <label class="form-label">Velocidade Baixa (RPM)</label>
                                <input type="number" v-model="velBaixa" class="form-control" />
                            </div>
                        </div>

                        <div class="col-12 text-end">

                            <button class="btn btn-vinuta m-auto" @click="iniciarBomba">
                                Iniciar Bomba do Remontador
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card mt-4 shadow-sm">
                <div class="card-body">
                    <h5 class="card-title mb-3">Status do Sistema</h5>

                    <div class="row">
                        <div class="col-md-4 d-flex align-items-center gap-2">
                            <div class="rounded-circle" :class="mqttLigado ? 'bg-success' : 'bg-danger'"
                                style="width: 16px; height: 16px;"></div>
                            <span>Conexão MQTT {{ mqttLigado ? 'Ligada' : 'Desligada' }}</span>
                        </div>

                        <div class="col-md-4 d-flex align-items-center gap-2">
                            <div class="rounded-circle" :class="controleTemperaturaLigado ? 'bg-success' : 'bg-danger'"
                                style="width: 16px; height: 16px;"></div>
                            <span>Controle de Temperatura {{ controleTemperaturaLigado ? 'Ligado' : 'Desligado'
                                }}</span>
                        </div>

                        <div class="col-md-4 d-flex align-items-center gap-2">
                            <div class="rounded-circle" :class="bombaLigada ? 'bg-success' : 'bg-danger'"
                                style="width: 16px; height: 16px;"></div>
                            <span>Bomba do Remontador {{ bombaLigada ? 'Ligada' : 'Desligada' }}</span>
                        </div>
                        <div class="col-md-12 mt-3">
                            <span v-show="pacote">Pacote de dados:</span><br>
                            <pre>{{ pacote }}</pre>
                        </div>
                    </div>
                </div>
            </div>

            <hr class="my-4" />

            <div class="card shadow-sm">
                <div class="card-body">
                    <h5 class="card-title">Descrição do Produto</h5>
                    <p><strong>Nome Comercial:</strong> {{ produto.nome }}</p>
                    <p><strong>Categoria:</strong> {{ produto.categoria }}</p>
                    <p><strong>Variedade de Uva:</strong> {{ produto.variedade }}</p>
                    <p><strong>Origem:</strong> {{ produto.origem }}</p>
                    <p><strong>Lote:</strong> {{ produto.lote }}</p>
                    <p><strong>Data de Entrada no Tanque:</strong> {{ produto.dataEntrada }}</p>
                    <p class="text-muted"><em>{{ produto.observacoes }}</em></p>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

import mqtt from 'mqtt'

import barrilImg from '../assets/fermentador.png'

const mqttLigado = ref(false)
const controleTemperaturaLigado = ref(false)
const bombaLigada = ref(false)
const temperatura_atual = ref(0)
const pacote = ref(null)

let client

onMounted(() => {
    client = mqtt.connect('wss://test.mosquitto.org:8081')

    client.on('connect', () => {
        mqttLigado.value = true

        // Subscreve aos tópicos relevantes
        client.subscribe('ps/var/controle_temperatura')
        client.subscribe('ps/var/bomba_remontador')
        client.subscribe('ps/var/temperatura_atual')
        client.subscribe('ps/var/pacote')
    })

    client.on('message', (topic, message) => {
        const payload = message.toString().toLowerCase()

        if (topic === 'ps/var/controle_temperatura') {
            controleTemperaturaLigado.value = Number(payload) === 1
        }
        if (topic === 'ps/var/temperatura_atual') {
            temperatura_atual.value = payload
        }

        if (topic === 'ps/var/bomba_remontador') {
            bombaLigada.value = Number(payload) === 1
        }
        if (topic === 'ps/var/pacote') {
            pacote.value = payload
        }
    })
})

onUnmounted(() => {
    client?.end()
})

const id = useRoute().params.id

const setPoint = ref(18)
const tolerancia = ref(2)
const tempoLigado = ref(30)
const tempoDesligado = ref(15)
const velAlta = ref(1200)
const velBaixa = ref(600)

const produto = ref({
    nome: 'Vinho Tinto Reserva',
    categoria: 'Tinto Seco',
    variedade: 'Cabernet Sauvignon',
    origem: 'Serra Gaúcha, RS',
    lote: 'LT1029',
    dataEntrada: '28/06/2025',
    observacoes: 'Fermentação em andamento. Temperatura deve ser mantida entre 18–20°C.'
})

function iniciarControle() {
    client.publish('ps/var/int1', String(setPoint.value));
    client.publish('ps/var/int2', String(tolerancia.value));
    client.publish('ps/var/bool1', String(true));
    client.publish('ps/var/pac1', String(JSON.stringify({ int1: setPoint.value, int2: tolerancia.value, bool1: String(true) })));
}

function iniciarBomba() {
    client.publish('ps/var/int3', String(tempoLigado.value));
    client.publish('ps/var/int4', String(tempoDesligado.value));
    client.publish('ps/var/int5', String(velBaixa.value));
    client.publish('ps/var/int6', String(velAlta.value));
    client.publish('ps/var/bool2', String(true));
    client.publish('ps/var/pac2', String(JSON.stringify(
        {
            int3: tempoLigado.value,
            int4: tempoDesligado.value,
            int5: velBaixa.value,
            int6: velAlta.value,
            bool2: String(true)

        })));
}
</script>