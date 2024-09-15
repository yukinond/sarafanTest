<script setup lang="ts">
definePageMeta({
  auth: false,
  title: 'Оформление заказа',
})

const menuStore = useMenuStore()

const orders = ref([])

const filter = ref('created') 

async function getOrder() {
  try {
    const { data, error } = await useFetch('/api/order/get', {
      method: 'GET',
      query: { status: filter.value }, 
    })
    if (data.value) {
      orders.value = data.value.orders
    }
    if (error.value) {
      console.error('Ошибка при получении данных:', error.value)
    }
  } catch (error) {
    console.error('Ошибка при получении данных:', error)
  }
}

getOrder()

watch(filter, () => {
  getOrder()
})

const total = computed(() => {
  return menuStore.cart.reduce((sum, item) => sum + item.price * item.count, 0)
})
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-3xl font-extrabold mb-6 text-gray-800">
        {{ filter === 'created' ? 'Новые' : 'Завершённые' }} заказы
      </h1>
      <div class="flex justify-end mb-4">
        <select
          v-model="filter"
          class="p-2 border rounded-lg bg-gray-100 text-gray-700"
        >
          <option value="created">Созданные</option>
          <option value="completed">Завершённые</option>
        </select>
      </div>
    </div>

    <div v-if="orders.length === 0" class="text-center text-gray-500">
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4l3 3m6 3v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2m16-10V4a2 2 0 00-2-2H5a2 2 0 00-2 2v8"
        />
      </svg>
      <p class="mt-2">Нет заказов для отображения</p>
    </div>

    <div v-else class="grid grid-cols-1 gap-6">
      <div
        v-for="order in orders"
        :key="order._id"
        class="bg-white border p-6 rounded-lg shadow-lg transform transition hover:scale-105 hover:shadow-xl"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-semibold text-gray-900">
            Заказ №{{ order.uuid }}
          </h3>
          <span
            :class="
              order.status === 'created'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-green-100 text-green-800'
            "
            class="px-3 py-1 rounded-full text-sm font-medium"
          >
            {{ order.status }}
          </span>
        </div>

        <div class="text-gray-600 space-y-2">
          <p>
            <strong>Пользователь:</strong>
            {{ order.user.username ? order.user.username : 'Не авторизован' }}
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

              <div v-if="product.cooking.length > 0" class="mt-2">
                <p class="font-medium text-gray-900">Методы приготовления:</p>
                <ul class="pl-4 list-disc text-gray-700">
                  <li v-for="cooking in product.cooking" :key="cooking._id">
                    {{ cooking.name }} - {{ cooking.price }} ₽
                  </li>
                </ul>
              </div>

              <div v-if="product.details.length > 0" class="mt-2">
                <p class="font-medium text-gray-900">Детали:</p>
                <ul class="pl-4 list-disc text-gray-700">
                  <li v-for="detail in product.details" :key="detail.title">
                    {{ detail.title }}: {{ detail.value }}
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>

        <div class="mt-4">
          <h4 class="text-lg font-semibold text-gray-900">Примечания</h4>
          <p class="text-gray-700">
            {{ order.comment ? order.comment : 'Нет' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
