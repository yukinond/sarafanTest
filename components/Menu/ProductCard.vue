<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})
const menuStore = useMenuStore()

</script>

<template>
  <div class="card flex flex-row bg-base-100 shadow-xl rounded-lg overflow-hidden p-5">
    <figure class="relative p-4 w-1/3 h-48">
      <NuxtImg class="object-cover flex justify-start mr-auto" :src="product.image" />
    </figure>
    <div class="card-body p-4 text-left">
      <h2 class="card-title text-lg font-semibold">
        {{ product.name }}
      </h2>
      <div>{{ product.description }}</div>
      <p class="text-sm text-gray-600">
        В наличии: {{ product.isAvailable ? 'Да' : 'Нет' }}
      </p>
      <p class="text-sm text-gray-600">{{ product.description }}</p>
      <div class="card-actions mt-4 justify-between">
        <p class="text-sm font-semibold text-red-600">
          Цена {{ product.price }} руб.
        </p>
        <button @click="menuStore.addToCart(product)" class="btn btn-primary btn-sm">Добавить в корзину</button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
