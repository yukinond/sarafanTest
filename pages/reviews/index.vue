<script setup lang="ts">
import { useNotification } from '@kyvg/vue3-notification'
const config = useRuntimeConfig()

definePageMeta({
  auth: false,
  title: 'Мои отзывы',
})

const store = useMainStore()
const orders = ref([]) as any

const filter = ref('completed')
const inputs: any = {
  file1: ref(),
  file2: ref(),
  file3: ref(),
  file4: ref(),
}

async function getOrders() {
  try {
    const { data, error } = await useFetch('/api/order/get', {
      method: 'GET',
      query: { status: filter.value, reviewed: true },
    })
    if (data.value) {
      orders.value = data.value.orders
    }
    if (error.value) {
      console.error('Ошибка при получении заказов:', error.value)
    }
  } catch (error) {
    console.error('Ошибка при получении заказов:', error)
  }
}

async function getReviews() {
  try {
    const { data, error } = await useFetch('/api/review/get', {
      method: 'GET',
      query: { userUuid: store.client.uuid },
    })
    if (data.value) {
      orders.value = data.value.orders
    }
    if (error.value) {
      console.error('Ошибка при получении заказов:', error.value)
    }
  } catch (error) {
    console.error('Ошибка при получении заказов:', error)
  }
  console.log('reviews:', orders.value)
}

getOrders()

watch(filter, () => {
  if (filter.value === 'completed') getOrders()
  else getReviews()
})

const showReviewModal = ref(false)
const selectedOrder = ref(null) as any

const openReviewModal = (order: any) => {
  selectedOrder.value = order
  showReviewModal.value = true
}

const now = useNow()

const form = reactive({
  text: '',
  rating: 5,
  date: now.value,
  photos: [
    {
      url: '',
      public: '',
    },
    {
      url: '',
      public: '',
    },
    {
      url: '',
      public: '',
    },
    {
      url: '',
      public: '',
    },
  ],
})

const loadingIndex = ref(null) as Ref<number | null>
const { notify } = useNotification()
const { upload, getPublicUrl, remove } = useS3Object()

// Функция загрузки изображений при клике на картинку
let uploadEvents: Event[] = []

const handleFileSelect = (event: Event, index: number) => {
  const fileList = (event.target! as HTMLInputElement).files
  if (fileList && fileList[0]) {
    form.photos[index].filename = fileList[0].name
    uploadEvents[index] = event
  }
}

async function uploadToS3(event: Event, index: number) {
  loadingIndex.value = index
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

    loadingIndex.value = null
    return
  }

  const { data, error } = await upload({
    files,
    url: null,
  })
  if (error.value) {
    notify({
      title: 'Что-то пошло не так',
      text: 'Не удалось загрузить фото',
      type: 'error',
      duration: 3000,
    })
  }
  if (data.value) {
    await useFetch('/api/images/openForPublic', {
      method: 'GET',
      params: {
        path: 'menuImages/' + data.value[0].key,
      },
    })

    form.photos[index] = {
      url: `${config.public.DOMAIN_API_IMAGES_URL}menuImages/${data.value[0].key}`,
      public: `${config.public.DOMAIN_API_IMAGES_URL}menuImages/${data.value[0].key}`,
    }
  }

  setTimeout(() => {
    loadingIndex.value = null
  }, 1500)
}

async function clearForm() {
  form.date = new Date()
  form.text = ''
  form.rating = 5

  loadingIndex.value = null
  form.photos = [
    {
      url: '',
      public: '',
    },
    {
      url: '',
      public: '',
    },
    {
      url: '',
      public: '',
    },
    {
      url: '',
      public: '',
    },
    {
      url: '',
      public: '',
    },
  ]
}
const submitReview = async () => {
  for (let i = 0; i < uploadEvents.length; i++) {
    if (uploadEvents[i]) {
      await uploadToS3(uploadEvents[i], i) // Загружаем изображения
    }
  }
  console.log('selectedOrder:', selectedOrder.value)
  try {
    const { data, error } = await useFetch('/api/review/create', {
      method: 'POST',
      body: JSON.stringify({
        form: form,
        uuid: selectedOrder.value.uuid,
        phone: selectedOrder.value.phone,
        name: selectedOrder.value.name,
        products: selectedOrder.value.products,
      }),
      watch: false,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (data.value) {
      notify({ text: 'Отзыв успешно отправлен', type: 'success' })
      clearForm()
      getOrders()
    }
    if (error.value) {
      notify({ text: error.value.data.message, type: 'error' })
    }
  } catch (error) {
    console.error('Ошибка при оформлении отзыва:', error)
  }

  showReviewModal.value = false
}

const removeImage = (index: number) => {
  form.photos[index] = { url: '', public: '' } // Сброс данных изображения
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 v-if="Object.keys(store.client).length > 0"  class="text-3xl font-extrabold mb-6 text-gray-800 w-full text-center">
      Заказы, доступные для отзыва
    </h1>
    <div v-if="Object.keys(store.client).length > 0"  class="mb-6 flex justify-center">
      <button
        :class="{ 'bg-blue-500 text-white': filter === 'completed' }"
        @click="filter = 'completed'"
        class="px-4 py-2 mx-2 border border-gray-300 rounded-lg"
      >
        Доступные
      </button>
      <button
        :class="{ 'bg-blue-500 text-white': filter === 'published' }"
        @click="filter = 'published'"
        class="px-4 py-2 mx-2 border border-gray-300 rounded-lg"
      >
        Опубликованные
      </button>
    </div>

    <div v-if="Object.keys(store.client).length === 0" class="text-center text-gray-500">
      <p class="mt-2">
        Для просмотра и добавления отзывов нужно авторизоваться
      </p>
    </div>

    <div
      v-else-if="!orders.length && orders.length == 0"
      class="text-center text-gray-500"
    >
      <p class="mt-2">Нет завершённых заказов для оставления отзыва</p>
    </div>

    <div class="grid grid-cols-1 gap-6">
      <div
        v-if="filter == 'completed'"
        v-for="order in orders"
        :key="order._id"
        class="bg-white border p-6 rounded-lg shadow-lg"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-semibold text-gray-900">
            Заказ №{{ order.uuid }}
          </h3>
          <span
            class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
          >
            {{ order.status }}
          </span>
        </div>

        <div class="text-gray-600 space-y-2">
          <p>
            <strong>Пользователь:</strong>
            {{ order.user.username || 'Не авторизован' }}
          </p>
          <p><strong>Email:</strong> {{ order.email }}</p>
          <p><strong>Телефон:</strong> {{ order.phone }}</p>
          <p><strong>Адрес:</strong> {{ order.address }}</p>
          <p>
            <strong>Дата создания:</strong>
            {{ new Date(order.createdDate).toLocaleString() }}
          </p>
        </div>

        <div class="mt-4">
          <h4 class="text-lg font-semibold text-gray-900">Продукты</h4>
          <ul class="space-y-4">
            <li
              v-for="product in order.products"
              :key="product._id"
              class="p-4 bg-gray-100 rounded-lg"
            >
              <p class="text-gray-900 font-medium">{{ product.name }}</p>
              <p class="text-gray-700">{{ product.description }}</p>
              <p class="text-gray-700">Количество: {{ product.count }}</p>
              <p class="text-gray-700">Цена: {{ product.price }} ₽</p>
            </li>
          </ul>
        </div>

        <button
          @click="openReviewModal(order)"
          class="mt-6 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Оставить отзыв
        </button>
      </div>
      <div
        v-else
        v-for="order in orders"
        class="bg-white border p-6 rounded-lg shadow-lg"
      >
        <div>
          <div class="mb-4">
            <h3 class="text-xl font-semibold text-gray-900">
              Отзыв на заказ №{{ order.uuid }}
            </h3>
            <p class="text-gray-600"><strong>Имя:</strong> {{ order.name }}</p>
            <p class="text-gray-600">
              <strong>Рейтинг:</strong> {{ order.rating }} / 5
            </p>
            <p class="text-gray-600">
              <strong>Текст отзыва:</strong> {{ order.text }}
            </p>
            <p class="text-gray-600">
              <strong>Дата отзыва:</strong>
              {{ new Date(order.date).toLocaleString() }}
            </p>

            <!-- Отображение изображений -->
            <div v-if="order.images && order.images.length > 0" class="mt-4">
              <h4 class="text-lg font-semibold text-gray-900">
                Фотографии отзыва
              </h4>
              <div class="grid grid-cols-4 gap-4 mt-2">
                <img
                  v-for="image in order.images.filter((i) => i.public)"
                  :key="image.url"
                  :src="image.public"
                  alt="Фото отзыва"
                  class="w-full h-32 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showReviewModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]"
    >
      <div class="bg-white p-5 rounded-lg max-w-xl w-full">
        <h2 class="text-xl font-bold mb-4">Оставить отзыв</h2>
        <div class="flex">
          <div class="font-medium flex my-auto mr-5">Рейтинг:</div>
          <div class="relative w-full py-6 bg-base-100 rounded-lg">
            <div class="rating absolute left-0 top-3 gap-2">
              <input
                type="button"
                name="rating-2"
                class="mask mask-star-2 bg-yellow-400"
                @input="form.rating = 1"
              />
              <input
                type="button"
                name="rating-2"
                class="mask mask-star-2 bg-yellow-400"
                @input="form.rating = 2"
              />
              <input
                type="button"
                name="rating-2"
                class="mask mask-star-2 bg-yellow-400"
                @input="form.rating = 3"
              />
              <input
                type="radio"
                name="rating-2"
                class="mask mask-star-2 bg-yellow-400"
                @input="form.rating = 4"
              />
              <input
                type="radio"
                name="rating-2"
                class="mask mask-star-2 bg-yellow-400"
                checked
                @input="form.rating = 5"
              />
            </div>
          </div>
        </div>
        <textarea
          v-model="form.text"
          class="textarea textarea-md w-full p-4 border border-gray-300 rounded-lg focus:outline-none"
          placeholder="Напишите ваш отзыв"
        ></textarea>

        <div class="flex gap-2">
          <div v-for="(photo, index) of form.photos" :key="index">
            <div
              class="border border-base-300 relative text-primary hover:text-primary-focus cursor-pointer w-32 h-32 hover:bg-base-200 rounded-lg flex-none"
            >
              <!-- Удалить изображение если загружено -->
              <div v-if="photo.url" class="absolute right-0 top-0 z-50">
                <button
                  @click="removeImage(index)"
                  class="btn btn-sm btn-circle btn-ghost"
                >
                  ✕
                </button>
              </div>

              <!-- Если изображение загружено -->
              <div v-if="photo.public">
                <img
                  :src="photo.public"
                  class="h-32 w-32 object-cover rounded-lg"
                />
                <div class="text-sm text-green-500 absolute bottom-2 left-2">
                  Загружено
                </div>
              </div>

              <!-- Если изображение еще не загружено -->
              <label
                v-else
                class="file-select w-full h-full flex flex-col justify-center items-center hover:cursor-pointer"
              >
                <input
                  type="file"
                  @change="handleFileSelect($event, index)"
                  class="hidden"
                />
                <!-- Спиннер загрузки -->
                <div
                  v-if="loadingIndex === index"
                  class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"
                ></div>
                <!-- Отображаем имя файла, если файл выбран, иначе плюс -->
                <span v-else class="w-full truncate text-center">
                  {{ photo.filename ? photo.filename : '+' }}
                </span>
              </label>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-4 mt-4">
          <button
            @click="submitReview"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Отправить
          </button>
          <button
            @click="showReviewModal = false"
            class="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rating {
  display: flex;
  justify-content: space-between;
  max-width: 150px;
}

input[name='rating-2'] {
  width: 30px;
  height: 30px;
}
</style>
