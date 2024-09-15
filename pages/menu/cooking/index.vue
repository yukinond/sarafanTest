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
  type: 'Жарка',
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
    const { error, data } = await useFetch('/api/cooking/create', {
      method: 'POST',
      body: form,
      watch: false,
    })
    if (data.value) {
      notify({
        title: 'Успешно',
        text: 'Данные успешно добавлены',
        type: 'success',
      })
      form.name = ''
      form.composition = ''
      form.image = ''
      await menuStore.getMenu()
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
        <h2 class="text-2xl font-bold mb-4">Добавление метода готовки</h2>
        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label for="type" class="block text-sm font-medium"
              >Метод</label
            >
            <CustomSelect
              :tabs="[{ title: 'Варка', value: 'cooking' }, { title: 'Жарка', value: 'frying' }]"
              :dropdownContainer="`w-full`"
              :status-text="form.type"
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
              Выберите изображение
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
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
