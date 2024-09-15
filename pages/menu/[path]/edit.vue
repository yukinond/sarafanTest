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
  menuType: '',
  name: '',
  description: '',
  price: '',
  image: '',
})

form.menuType = navbarDataList.find(
  (navbar) => navbar.path === '/' + route.params.path
).title

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

const dataLoading = ref(false)
const menu = ref([])
const menuStore = useMenuStore()
menu.value = menuStore.menu


async function getData() {
  try {
    dataLoading.value = true
    const { error, data } = await useFetch('/api/menu/getMenu', {
      method: 'GET',
      query: {
        uuid: route.query.uuid,
      },
      watch: false,
    })

    if (data.value) {
      form.menuType = navbarDataList.find(
        (navbar) => navbar.path === '/' + data.value.data.menuType
      ).title
      form.name = data.value.data.name
      form.description = data.value.data.description
      form.price = data.value.data.price
      form.image = data.value.data.image
      await menuStore.getMenu()
      dataLoading.value = false
    }
    if (error.value) {
      notify({
        title: 'Ошибка',
        text: error.value.data.message,
        type: 'error',
      })
      dataLoading.value = false
    }
  } catch (error) {
    console.error('Ошибка при получение данных:', error)
    dataLoading.value = false
  }
}
getData()

async function submitForm() {
  try {
    const { error, data } = await useFetch('/api/menu/update', {
      method: 'POST',
      body: form,
      query: {
        uuid: route.query.uuid,
      },
      watch: false,
    })
    if (data.value) {
      notify({
        title: 'Успешно',
        text: 'Данные успешно обновлены',
        type: 'success',
      })
      form.name = ''
      form.description = ''
      form.price = ''
      form.image = ''
      await menuStore.getMenu()
      navigateTo({ path: '/menu/' + route.params.path })
    }
    if (error.value) {
      notify({
        title: 'Ошибка',
        text: error.value.data.message,
        type: 'error',
      })
    }
  } catch (error) {
    console.error('Ошибка при обновлении данных:', error)
  }
}
</script>

<template>
  <div class="flex justify-center items-center mx-auto w-full">
    <div class="flex justify-between w-full max-w-4xl px-8 gap-3">
      <div class="w-full">
        <h2 class="text-2xl font-bold mb-4">Редактирование</h2>
        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label for="menuType" class="block text-sm font-medium"
              >Тип меню</label
            >
            <CustomSelect
              :tabs="
                navbarDataList.map((navbar) => ({
                  title: navbar.title,
                  value: navbar.path,
                }))
              "
              :status-text="form.menuType"
              :dropdownContainer="`w-full`"
              @change-value="(event) => (form.menuType = event.title)"
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
            <label for="description" class="block text-sm font-medium"
              >Описание</label
            >
            <textarea
              v-model="form.description"
              id="description"
              rows="3"
              class="textarea mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            ></textarea>
          </div>

          <div>
            <label for="price" class="block text-sm font-medium">Цена</label>
            <input
              v-model="form.price"
              id="price"
              type="number"
              class="input input-sm mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
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
            <p class="block text-sm font-medium text-gray-700">
              Старое изображение будет удалено:
            </p>
            <nuxt-img
              v-if="form.image && form.image.trim() !== ''"
              class="h-48 w-48 object-cover mx-auto"
              :src="form.image"
            />
          </div>

          <div class="flex justify-end gap-5">
            <NuxtLink
              :to="`/menu/${route.params.path}`"
              class="text-center btn btn-ghost hover:bg-red-600 hover:text-white bg-transparent text-base-content border-red-600 border"
            >
              Отмена
            </NuxtLink>
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
