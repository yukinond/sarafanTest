<script setup lang="ts">
import { navbarDataList } from '~/data/navbar/navbarData'
import { notify } from '@kyvg/vue3-notification'

definePageMeta({
  auth: true,
  title: 'Добавление нового меню',
})

const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()
const form = reactive({
  menuType: '',
  name: '',
  description: '',
  price: '',
  cooking: [],
  details: [],
  image: '',
})

form.menuType = navbarDataList.find(
  (navbar) => navbar.path === '/' + route.params.path
).title

// async function handleImageUpload(event: any) {
//   const file = event.target.files[0]
//   if (file) {
//     const reader = new FileReader()
//     reader.onloadend = () => {
//       form.image = reader.result as string
//     }
//     reader.readAsDataURL(file)
//   }
// }

const menu = ref([])
const menuStore = useMenuStore()
menu.value = menuStore.menu
const imageLoadingEvent = ref<Event | null>(null)

function handleImageChange(event: Event) {
  imageLoadingEvent.value = event
}
async function submitForm() {
  const cookingsArr = form.cooking
  form.cooking = form.cooking.filter((cooking) => cooking.checked)  
  const isAllCookingsCheckedHavePrice = form.cooking.every((cooking) => cooking.price)
  if(!isAllCookingsCheckedHavePrice) {
    notify({
      title: 'Ошибка',
      text: 'Укажите цену для всех методов готовки',
      type: 'error',
    })
    form.cooking = cookingsArr
    return
  }

  if (imageLoadingEvent.value) {
    const loadingImage = await uploadToS3(imageLoadingEvent.value)
    if(!loadingImage) {
      form.cooking = cookingsArr
      return
    }
  }

  try {
    const { error, data } = await useFetch('/api/menu/create', {
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
      form.description = ''
      form.price = ''
      form.image = ''
      form.cooking = []
      form.details = []
      await menuStore.getMenu()
    }
    if (error.value) {
      notify({
        title: 'Ошибка',
        text: error.value.data.message,
        type: 'error',
      })
    }
    form.cooking = cookingsArr
  } catch (error) {
    console.error('Ошибка при добавлении данных:', error)
    form.cooking = cookingsArr
  }
}

const cooking = ref([]) as any
const cookingLoading = ref(false)
async function getCooking() {
  try {
    cookingLoading.value = true
    const { error, data } = await useFetch('/api/cooking/getCooking', {
      method: 'GET',
      watch: false,
    })
    if (data.value) {
      cooking.value = data.value
      form.cooking = data.value.map((item: any) => ({ ...item, checked: false, price: 0 }))
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

function handleCheckboxChange(cooks: any) {
  // console.log('cooks:', cooks);
  const index = form.cooking.findIndex((item: any) => item._id === cooks._id)

  console.log('Index:', index)
  if (index !== -1) {
    if (typeof form.cooking[index].checked === 'undefined') {
      form.cooking[index].checked = false
    }
    form.cooking[index].checked = !form.cooking[index].checked
  } else {
    form.cooking.push({ ...cooks, checked: true })
  }
  // console.log('form.cooking:', form.cooking[index]);
}

const price = ref(0)
const cookingType = ref({ title: '', value: '' })

const tabsWithNoOption = computed(() => [
  ...cooking.value.map((cookingItem) => ({
    title: `${cookingItem.type} - ${cookingItem.name}`,
    value: cookingItem.uuid,
  })),
])

function addCooking(cookingg: any) {
  if (!cookingg.title || !price.value) {
    notify({
      title: 'Ошибка',
      text: 'Выберите метод готовки и цену',
      type: 'error',
    })
    return
  }

  const index = form.cooking.findIndex(
    (item: any) => item.uuid === cookingg.value
  )

  if (index !== -1) {
    form.cooking.splice(index, 1)
  } else {
    const cookingItem = cooking.value.find(
      (item: any) => item.uuid === cookingg.value
    )
    if (cookingItem) {
      form.cooking.push(cookingItem)
      form.cooking[form.cooking.length - 1].price = price.value
    }
    price.value = 0
  }
}

const details = reactive({ title: '', value: '' })

function addDetails() {
  if (!details.title || !details.value) {
    notify({
      title: 'Ошибка',
      text: 'Заполните все поля',
      type: 'error',
    })
    return
  }
  form.details.push({ ...details })
  details.title = ''
  details.value = ''
}

function addAllCooking() {
  if (!price.value) {
    notify({
      title: 'Ошибка',
      text: 'Укажите цену для всех методов готовки',
      type: 'error',
    })
    return
  }

  const uniqueCookingTypes = new Set(
    cooking.value.map((item: any) => item.uuid)
  )

  uniqueCookingTypes.forEach((uuid: string) => {
    const cookingItem = cooking.value.find((item: any) => item.uuid === uuid)
    if (cookingItem) {
      const index = form.cooking.findIndex((item: any) => item.uuid === uuid)
      if (index === -1) {
        form.cooking.push({ ...cookingItem, price: price.value })
      }
    }
  })

  price.value = 0
}

const { upload, getPublicUrl, remove } = useS3Object()

async function uploadToS3(event: Event) {
  // loadingIndex.value = index
  const fileList = (event.target! as HTMLInputElement).files
  const files = Array.from(fileList!)
  if (!files) return

  if (
    files[0] &&
    files[0].name &&
    files[0].name.toLowerCase().endsWith('.webp')
  ) {
    notify({
      title: 'Что-то пошло не так',
      text: 'Нельзя загружать вебпикчи',
      type: 'error',
      duration: 3000,
    })

    // loadingIndex.value = null
    return false
  }

  const { data, error } = await upload({
    files,
    url: null,
  })
  if (error.value) {
    notify({
      title: 'Что-то пошло не так',
      text: 'Не удалось загрузить фото '+error.value,
      type: 'error',
      duration: 3000,
    })
    return false
  }
  if (data.value) {
    //@ts-ignore
    await useFetch('/api/images/openForPublic', {
      method: 'GET',
      params: {
        path: 'menuImages/' + data.value[0].key,
      },
    })
    
    form.image =  `${config.public.DOMAIN_API_IMAGES_URL}menuImages/${data.value[0].key}`

  }
  return true
}

</script>

<template>
  <div class="flex justify-center items-center mx-auto w-full">
    <div class="flex justify-between w-full max-w-4xl px-8 gap-3">
      <div class="w-full">
        <h2 class="text-2xl font-bold mb-4">Добавление в меню</h2>
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

          <div class="mb-10">
            <!-- <label for="price" class="block text-sm font-medium mb-2"
              >Методы готовки:</label
            >
            <div class="flex flex-col gap-2">
              <CustomSelect
                :tabs="tabsWithNoOption"
                :status-text="cookingType.title"
                @change-value="
                  (event) =>
                    (cookingType = { title: event.title, value: event.value })
                "
              />
              <div class="flex justify-between gap-5">
                <input
                  v-model="price"
                  type="number"
                  class="input input-sm mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
                <button
                  type="button"
                  @click="addCooking(cookingType)"
                  class="text-center btn btn-ghost btn-sm flex my-auto hover:bg-red-600 hover:text-white bg-transparent text-base-content border-red-600 border"
                >
                  Добавить
                </button>
                <button
                  type="button"
                  @click="addAllCooking"
                  class="text-center btn btn-ghost btn-sm flex my-auto hover:bg-green-600 hover:text-white bg-transparent text-base-content border-green-600 border"
                >
                  Добавить все
                </button>
              </div>
            </div> -->
            <div
              v-if="!cookingLoading"
              class="flex justify-between w-full gap-4"
            >
              <!-- Список для "Варка" -->
              <div class="w-1/2 mb-7">
                <h3 class="font-semibold my-2">Варка</h3>
                <div
                  class="flex flex-col gap-2 border border-red-400 p-2 h-full rounded-lg"
                >
                  <div
                    class="form-control flex flex-row w-full justify-between"
                    v-for="cooking in form.cooking.filter(
                      (cooking) => cooking.type === 'Варка'
                    )"
                    :key="cooking.id"
                  >
                    <div class="flex justify-between w-full">
                      <label
                      :for="'checkbox-' + cooking.id"
                      class="cursor-pointer label"
                    >
                      <span class="label-text">{{ cooking.name }}</span>
                    </label>

                    <div class="flex items-center">
                      <input
                        type="number"
                        class="input input-xs input-bordered w-20 mx-2"
                        v-model="cooking.price"
                        placeholder="0"
                      />
                      <span class="ml-1">₽</span>
                    </div>
                    </div>

                    <input
                      type="checkbox"
                      :id="'checkbox-' + cooking.id"
                      class="checkbox checkbox-error ml-2 flex my-auto"
                      :checked="
                        form.cooking.find((item) => item.uuid === cooking.uuid)
                          .checked
                          ? true
                          : false
                      "
                      @change="handleCheckboxChange(cooking)"
                    />
                  </div>
                </div>
              </div>

              <!-- Список для "Жарка" -->
              <div class="w-1/2 mb-7">
                <h3 class="font-semibold my-2">Жарка</h3>
                <div
                  class="flex flex-col gap-2 border border-red-400 p-2 h-full rounded-lg"
                >
                <div
                    class="form-control flex flex-row w-full justify-between"
                    v-for="cooking in form.cooking.filter(
                      (cooking) => cooking.type === 'Жарка'
                    )"
                    :key="cooking.id"
                  >
                    <div class="flex justify-between w-full">
                      <label
                      :for="'checkbox-' + cooking.id"
                      class="cursor-pointer label"
                    >
                      <span class="label-text">{{ cooking.name }}</span>
                    </label>

                    <div class="flex items-center">
                      <input
                        type="number"
                        class="input input-xs input-bordered w-20 mx-2"
                        v-model="cooking.price"
                        placeholder="0"
                      />
                      <span class="ml-1">₽</span>
                    </div>
                    </div>

                    <input
                      type="checkbox"
                      :id="'checkbox-' + cooking.id"
                      :v-model="cooking.price"
                      class="checkbox checkbox-error ml-2 flex my-auto"
                      :checked="
                        form.cooking.find((item) => item.uuid === cooking.uuid)
                          .checked
                          ? true
                          : false
                      "
                      @change="handleCheckboxChange(cooking)"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Блок загрузки -->
            <div
              v-else
              class="loading loading-spinner loading-lg text-primary"
            ></div>
          </div>

          <div class="flex flex-col space-y-2">
            <label for="image" class="block text-sm font-medium text-gray-700">
              Добавьте детали при необходимости
            </label>
            <div class="flex gap-2">
              <input
                placeholder="Добавьте название"
                v-model="details.title"
                class="input input-sm mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
              <textarea
                placeholder="Добавьте детали"
                v-model="details.value"
                class="input input-sm mt-1 block w-full border-gray-300 rounded-md shadow-sm overflow-hidden"
              />
            </div>
            <button
              @click="addDetails"
              type="button"
              class="text-center ml-auto btn-sm w-1/2 btn btn-ghost hover:bg-red-600 hover:text-white bg-transparent text-base-content border-red-600 border"
            >
              Добавить
            </button>
            <div v-if="form.details" class="flex flex-col gap-2">
              <div
                class="flex items-center justify-between w-full bg-gray-100 rounded-md p-2 border border-gray-300"
                v-for="(detail, index) in form.details"
                :key="index"
              >
                <div class="flex items-center gap-2 text-black">
                  <!-- Название и значение отображаем вместе как одну строку -->
                  <p class="font-semibold">{{ detail.title }}:</p>
                  <p class="font-normal">{{ detail.value }}</p>
                </div>
                <button
                  type="button"
                  @click="form.details.splice(index, 1)"
                  class="text-center btn btn-ghost p-0.5 btn-sm flex my-auto hover:bg-red-600 hover:text-white bg-transparent text-base-content border-none"
                >
                  <IconCSS name="material-symbols:close" size="20" />
                </button>
              </div>
            </div>
          </div>

          <div class="flex flex-col space-y-2">
            <label for="image" class="block text-sm font-medium text-gray-700">
              Выберите изображение
            </label>
            <input
              id="image"
              type="file"
              @change="handleImageChange"
              accept="image/*"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <nuxt-img
              v-if="form.image && form.image.trim() !== ''"
              class="h-48 w-48 object-cover mx-auto"
              :src="form.image"
            />
            {{ form.image }}
          </div>

          <div class="flex justify-end">
            <button
              type="submit"
              class="text-center btn btn-ghost hover:bg-red-600 hover:text-white bg-transparent text-base-content border-red-600 border mb-5"
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
