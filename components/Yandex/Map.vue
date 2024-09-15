<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { YandexMap, YandexMarker } from 'vue-yandex-maps'
import { notify } from '@kyvg/vue3-notification'

const settings = {
  apiKey: useRuntimeConfig().public.YANDEX_MAPS_API_KEY || '',
  lang: 'ru_RU',
  coordorder: 'latlong',
  debug: false,
  version: '2.1',
}

const coordinates = ref([55.819543, 49.102500]) 
const addressText = ref('Казань, ул. Меридианная, 10А') 
const mapCenter = ref([55.819543, 49.102500]) 
const emit = defineEmits(['callback', 'close'])
const props = defineProps({
  state: {
    type: Boolean,
    required: true,
  }
})

const handleAddress = () => {
  notify({ type: 'success', text: `Вы выбрали: ${addressText.value}` })
}

const onClick = async (e: any) => {
  const coords = e.get('coords')
  coordinates.value = coords
  await getAddressText(coords[0], coords[1])
}

async function getAddressText(lat: number, lng: number) {
  addressText.value = 'Загрузка...'

  try {
    const geocodeResult = await ymaps.geocode([lat, lng], { results: 1 })
    const firstGeoObject = geocodeResult.geoObjects.get(0)
    const address = firstGeoObject.getAddressLine()

    addressText.value = address
    notify({ type: 'success', text: `Адрес: ${address}` })
  } catch (error) {
    console.error('Ошибка получения адреса:', error)
    addressText.value = 'Ошибка получения адреса'
    notify({ type: 'error', text: 'Ошибка получения адреса' })
  }
}

const initialMarkerContent = `
  <div class="card rounded-lg">
    <div class="text-lg font-semibold">Ресторан</div>
    <div class="text-sm">Информация о ресторане...</div>
    <a class="selectPoint mt-4 flex justify-center btn btn-primary hover:bg-primary">Выбрать</a>
  </div>
`

onMounted(async () => {
  coordinates.value = [55.819543, 49.102500]
})

function closeModal() {
  emit('close')
}
</script>

<template>
  <div v-if="show" id="selectPointModal" class="modal modal-open z-[999999]">
    <div class="modal-box w-11/12 max-w-4xl">
      <a class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="closeModal">✕</a>
      <div class="title mb-2">Выберите адрес</div>

      <div class="flex justify-center mb-2">
        <div>Адрес: {{ addressText }}</div>
      </div>
      
      <YandexMap
        :settings="settings"
        :coordinates="coordinates"
        :center="mapCenter"
        zoom="12"
        @click="onClick"
        class="yandex-container"
      >
        <!-- Начальный маркер с контентом -->
        <YandexMarker
          :coordinates="coordinates"
          :options="{
            iconImageSize: [50, 50],
            iconOffset: [0, 0],
            iconShadow: true,
          }"
        >
          <template #component>
            <div v-html="initialMarkerContent"></div>
          </template>
        </YandexMarker>
      </YandexMap>
    </div>
    <div class="modal-backdrop cursor-pointer" @click="closeModal"></div>
  </div>
</template>

<style>
.yandex-container {
  height: 75vh;
  width: 100%;
  border-radius: 20px;
  overflow: hidden;
}
</style>
