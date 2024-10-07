<script setup lang="ts">
definePageMeta({
  auth: false,
  title: 'Оформление заказа',
})

import { notify } from '@kyvg/vue3-notification'

const menuStore = useMenuStore()

const order = reactive({
  name: '',
  phone: '',
  email: '',
  address: '',
  pickup: true,
  comment: '',
  readyDate: '',
  readyTime: '',
})

const total = computed(() => {
  return menuStore.cart.reduce((sum, item) => sum + item.price * item.count, 0)
})

const submitOrder = () => {
  try {
    const { data, error } = useFetch('/api/order/create', {
      method: 'POST',
      body: { order, cart: menuStore.cart },
    })
    if (data.value) {
      menuStore.clearCart()
      notify({ text: 'Заказ успешно оформлен', type: 'success' })
      navigateTo('/')
    }
    if (error.value) {
      notify({ text: error.value.data.message, type: 'error' })
    }
  } catch (error) {
    console.error('Ошибка при оформлении заказа:', error)
  }
}

const showDelivery = ref(false)
const startDate = ref(new Date(Date.now() + 1000 * 60 * 5))
function setDeliveryDate(date: string, time: string) {
  order.readyDate = date
  order.readyTime = time
}
</script>

<template>
  <div class="max-w-5xl mx-auto p-6 flex flex-col lg:flex-row gap-6">
    <!-- Левая часть - форма заказа -->
    <form @submit.prevent="submitOrder" class="flex-1 space-y-6">
      <!-- Информация о покупателе -->
      <div class="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h1 class="text-3xl font-bold mb-8 text-gray-900 flex justify-center">
          Оформление заказа
        </h1>

        <h2 class="text-xl font-bold text-gray-900 mb-4">
          Информация о покупателе
        </h2>

        <div class="flex flex-col md:flex-row md:gap-6">
          <div class="flex-1">
            <label for="name" class="block text-gray-700 font-medium"
              >Имя</label
            >
            <input
              type="text"
              id="name"
              v-model="order.name"
              required
              class="input input-md w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Введите ваше имя"
            />
          </div>
          <div class="flex-1">
            <label for="phone" class="block text-gray-700 font-medium"
              >Телефон</label
            >
            <input
              v-model="order.phone"
              type="text"
              class="input input-bordered w-full"
              v-maska
              data-maska="+7 (###) ###-##-##"
              placeholder="+7 (___) ___-__-__"
            />
          </div>
        </div>

        <div>
          <label for="email" class="block text-gray-700 font-medium"
            >Email</label
          >
          <input
            type="email"
            id="email"
            v-model="order.email"
            required
            class="input input-md w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Введите ваш email"
          />
        </div>

        <div>
          <div class="flex gap-3 flex-wrap">
            <span class="block text-gray-700 font-medium"
              >Выберите метод получения:</span
            >
            <Button
              @click="order.pickup = true"
              class="btn btn-sm btn-primary hover:bg-transparent hover:text-base-content"
              :class="{ 'btn-active': !order.pickup }"
              >Самовывоз
            </Button>
            <Button
              @click="order.pickup = false"
              class="btn btn-sm btn-primary hover:bg-transparent hover:text-base-content"
              :class="{ 'btn-active': order.pickup }"
              >Доставка
            </Button>
          </div>
          <div v-if="!order.pickup">
            <label for="address" class="block text-gray-700 font-medium"
              >Адрес</label
            >
            <YandexMap :state="showDelivery" />
            <input
              type="text"
              id="address"
              v-model="order.address"
              required
              class="input input-md w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Улица, дом, квартира"
            />
          </div>
          <div v-else class="my-2">
            Для получения заказа прибудьте по адресу г.Казань ул Меридианная
            10а.
          </div>
        </div>

        <div class="flex">
          <label for="email" class="block text-gray-700 font-medium w-full"
            >Примерная дата получения/забора заказа:</label
          >
          <DatePicker
            :model-value="startDate"
            @save-date="setDeliveryDate"
            :time-delivery="order.readyTime"
          />
        </div>
      </div>

      <!-- Поле для примечаний -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Примечания</h2>
        <textarea
          v-model="order.comment"
          class="textarea textarea-md w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          placeholder="Оставьте примечания к заказу (необязательно)"
        ></textarea>
      </div>

      <!-- Кнопка оформления заказа -->
      <button
        type="submit"
        class="w-full py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        Подтвердить заказ
      </button>
    </form>

    <!-- Правая часть - ваш заказ -->
    <div class="flex flex-col bg-white p-6 rounded-lg shadow-md flex-shrink-0">
      <h2 class="text-xl font-bold text-gray-900 mb-6">Ваш заказ</h2>

      <div class="space-y-4">
        <div
          v-for="product in menuStore.cart"
          :key="product.uuid"
          class="flex justify-between items-center overflow-y-auto"
        >
          <span>
            {{ product.name }} ({{ product.count }} × {{ product.price }} руб.)
          </span>
          <span class="font-semibold">
            {{ product.price * product.count }} руб.
          </span>
        </div>
      </div>

      <div class="flex mt-auto justify-between items-center mt-6 border-t pt-6">
        <span class="text-xl font-bold">Итого:</span>
        <span class="text-xl font-bold">{{ total }} руб.</span>
      </div>
    </div>
  </div>
</template>
