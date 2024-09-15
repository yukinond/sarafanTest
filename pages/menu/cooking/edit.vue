<script setup lang="ts">
import { navbarDataList } from '~/data/navbar/navbarData'
import { notify } from '@kyvg/vue3-notification'

definePageMeta({
  auth: true,
  title: 'Добавление нового меню',
})

const route = useRoute()
const router = useRouter()
const form = reactive({
  type: '',
  name: '',
  composition: '',
  image: '',
})

async function handleImageUpload(event: any) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onloadend = () => {
      form.image = reader.result as string
    }
    reader.readAsDataURL(file)
  }
}

const menu = ref([])
const menuStore = useMenuStore()
menu.value = menuStore.menu
async function submitForm() {
  try {
    const { error, data } = await useFetch('/api/cooking/update', {
      method: 'POST',
      body: form,
      query: { uuid: currentCooking.value },
      watch: false,
    })
    if (data.value) {
      notify({
        title: 'Успешно',
        text: 'Данные успешно обновлены',
        type: 'success',
      })
      getCooking()
    }
    if (error.value) {
      notify({
        title: 'Ошибка',
        text: error.value.data.message,
        type: 'error',
      })
    }
  } catch (error) {
    console.error('Ошибка при добавлении данных:', error)
  }
}

const cooking = ref([])
const cookingLoading = ref(false)
const currentCooking = ref('')
async function getCooking() {
  try {
    cookingLoading.value = true
    const { error, data } = await useFetch('/api/cooking/getCooking', {
      method: 'GET',
      watch: false,
    })
    if (data.value) {
      cooking.value = data.value
      cookingLoading.value = false
    }
    if (error.value) {
      notify({
        title: 'Ошибка',
        text: error.value.data.message,
        type: 'error',
      })
      cookingLoading.value = false
    }
  } catch (error) {
    console.error('Ошибка при добавлении данных:', error)
    cookingLoading.value = false
  }
}
getCooking()

watch(
  () => currentCooking.value,
  (newValue) => {
    const found = cooking.value.find((item) => item.uuid === newValue)
    if (found) {
      form.type = found.type
      form.name = found.name
      form.composition = found.composition
      form.image = found.image
    } else {
      form.type = ''
      form.name = ''
      form.composition = ''
      form.image = ''
    }
  }
)

async function deleteCooking() {
  try {
    const { error, data } = await useFetch('/api/cooking/delete', {
      method: 'POST',
      query: {
        uuid: currentCooking.value,
      },
      watch: false,
    })
    if (data.value) {
      notify({
        title: 'Успешно',
        text: 'Данные успешно удалены',
        type: 'success',
      })
      currentCooking.value = ''
      getCooking()
    }
    if (error.value) {
      notify({
        title: 'Ошибка',
        text: error.value.data.message,
        type: 'error',
      })
    }
  } catch (error) {
    console.error('Ошибка при добавлении данных:', error)
  }
}
</script>

<template>
  <div class="flex justify-center items-center mx-auto w-full">
    <div class="flex justify-between w-full max-w-4xl px-8 gap-3">
      <div class="w-full">
        <h2 class="text-2xl font-bold mb-4">Редактирование метода готовки</h2>
        <Button
          @click="deleteCooking"
          :disabled="!currentCooking"
          class="w-full col-span-1 sm:col-span-2 text-center btn btn-ghost hover:bg-red-600 hover:text-white bg-transparent text-base-content border-red-600 border"
          >Удалить текущий метод готовки</Button
        >
        <div v-if="!cookingLoading && cooking.length">
          <label for="type" class="block text-sm font-medium mb-1"
            >Текущий метод</label
          >
          <CustomSelect
            :tabs="
              cooking.map((item) => ({ title: item.type + ' - ' + item.name, value: item.uuid }))
            "
            :dropdownContainer="`w-full`"
            :status-text="currentCooking ? cooking.find((item) => item.uuid === currentCooking).name : 'Не выбран' "
            @change-value="(event) => (currentCooking = event.value)"
          />
        </div>
        <div
          v-else
          class="loading loading-spinner loading-lg text-primary"
        ></div>
        <form @submit.prevent="submitForm" class="space-y-4 mt-1">
          <div>
            <label for="type" class="block text-sm font-medium mb-1"
              >Метод</label
            >
            <CustomSelect
              :tabs="[
                { title: 'Варка', value: 'cooking' },
                { title: 'Жарка', value: 'frying' },
              ]"
              :dropdownContainer="`w-full`"
              :status-text="form.type ? form.type : 'Не выбран' "
              @change-value="(event) => (form.type = event.title)"
            />
          </div>

          <div>
            <label for="name" class="block text-sm font-medium">Название</label>
            <input
              v-model="form.name"
              id="name"
              type="text"
              class="input input-sm mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label for="composition" class="block text-sm font-medium"
              >Введите состав</label
            >
            <textarea
              v-model="form.composition"
              id="composition"
              rows="3"
              class="textarea mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            ></textarea>
          </div>

          <div class="flex flex-col space-y-2">
            <label for="image" class="block text-sm font-medium text-gray-700">
              Выберите новое изображение
            </label>
            <input
              id="image"
              type="file"
              @change="handleImageUpload"
              accept="image/*"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <nuxt-img
              v-if="form.image && form.image.trim() !== ''"
              class="h-48 w-48 object-cover mx-auto"
              :src="form.image"
            />
          </div>

          <div class="flex justify-end">
            <button
              type="submit"
              class="text-center btn btn-ghost hover:bg-red-600 hover:text-white bg-transparent text-base-content border-red-600 border"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
