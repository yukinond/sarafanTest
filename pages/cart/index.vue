<script setup lang="ts">
definePageMeta({
  auth: false,
  title: 'Корзина',
})

const menuStore = useMenuStore()
const total = computed(() => {
  return menuStore.cart.reduce((sum: number, item: any) => sum + item.totalPrice * item.count, 0)
})

const hasItems = computed(() => menuStore.cart.length > 0)
const router = useRouter()

function removeProduct(uuid: string) {
  menuStore.removeProduct(uuid)
}

function clearCart() {
  menuStore.clearCart()
}

function checkout() {
  // Логика оформления заказа
  console.log('Оформление заказа...')
}
</script>
<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-8 text-gray-900 flex w-full justify-center">Корзина</h1>

    <div v-if="hasItems" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Список товаров -->
      <div class="col-span-2 space-y-6">
        <div v-for="product in menuStore.cart" :key="product.uuid" class="flex items-center bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition">
          <nuxt-img :src="product.image" class="w-20 h-20 rounded-lg object-cover mr-4" />
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-800">{{ product.name }}</h3>
            <p class="text-sm text-gray-500">{{ product.count }} × {{ product.totalPrice }} руб.</p>
          </div>
          <div class="text-right">
            <button @click="removeProduct(product.uuid)" class="text-red-500 hover:text-red-600 transition">
              <Icon name="material-symbols:close-rounded" size="24" />
            </button>
            <p class="mt-2 text-lg font-semibold text-gray-900">{{ product.totalPrice * product.count }} руб.</p>
          </div>
        </div>
      </div>

      <!-- Итоговая сумма и действия -->
      <div class="col-span-1 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Итого</h2>
        <div class="flex justify-between mb-4">
          <span class="text-gray-600">Общая стоимость:</span>
          <span class="text-xl font-semibold text-gray-900">{{ total }} руб.</span>
        </div>
        <div class="space-y-4">
          <button @click="router.push('/order')" class="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
            Оформить заказ
          </button>
          <button @click="clearCart" class="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
            Очистить корзину
          </button>
        </div>
      </div>
    </div>

    <!-- Пустая корзина -->
    <div v-else class="flex flex-col items-center justify-center h-64 text-gray-500">
      <Icon name="solar:cart-3-outline" size="64" />
      <p class="mt-4 text-lg">Ваша корзина пуста</p>
    </div>
  </div>
</template>

<style scoped></style>