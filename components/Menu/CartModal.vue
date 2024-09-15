<script setup lang="ts">
import { useNotification } from '@kyvg/vue3-notification'
import { ref, watch, computed } from 'vue'

const props = defineProps({
  show: { type: Boolean, required: true },
})

const emit = defineEmits(['closeModal'])
const menuStore = useMenuStore()
const total = computed(() => {
  return menuStore.cart.reduce(
    (sum: number, item: any) => sum + item.totalPrice * item.count,
    0
  )
})

const isVisible = ref(props.show)

watch(
  () => props.show,
  (newVal) => {
    isVisible.value = newVal
  }
)
</script>

<template>
  <transition name="fade">
    <div
      v-if="isVisible"
      class="fixed inset-0 z-[9999] flex items-center justify-end bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm"
      @click="$emit('closeModal')"
    >
      <transition name="slide-in-right">
        <div
          v-if="isVisible"
          class="flex flex-col bg-base-100 w-full max-w-md p-4 h-full overflow-y-auto"
          @click.stop
        >
          <div class="flex justify-between items-center mb-4">
            <h2 class="font-bold text-xl">Корзина</h2>
            <button
              @click="$emit('closeModal')"
              class="text-gray-500 hover:text-gray-700"
            >
              <Icon name="material-symbols:close-rounded" size="24" />
            </button>
          </div>

          <div class="flex-1">
            <div v-if="menuStore.cart.length > 0" class="space-y-4">
              <div
                v-for="product in menuStore.cart"
                :key="product.uuid"
                class="flex items-center bg-base-200 rounded-lg p-4 space-x-4"
              >
                <nuxt-img
                  :src="product.image"
                  class="w-16 h-16 rounded-sm object-cover"
                />
                <div class="flex-1">
                  <div class="font-medium text-lg">{{ product.name }}</div>
                  <div class="text-sm text-gray-500">
                    {{ product.count }} × {{ product.totalPrice }} руб.
                  </div>
                  <div v-if="product.cooking.length" class="text-sm text-gray-600 mt-2">
                    <div v-for="(cookingItem, index) in product.cooking" :key="index">
                      {{ cookingItem.name }} - {{ cookingItem.type }}
                    </div>
                  </div>
                  <div v-else class="text-sm text-gray-600 mt-2">
                    Без выбранных способов приготовления
                  </div>
                </div>
                <div class="flex flex-col items-end space-y-2">
                  <button
                    @click="menuStore.removeProduct(product.uuid)"
                    class="text-red-500 hover:text-red-700"
                  >
                    <Icon name="material-symbols:close-rounded" size="20" />
                  </button>
                  <div class="font-semibold text-lg">
                    {{ product.totalPrice * product.count }} руб.
                  </div>
                </div>
              </div>
            </div>
            <div
              v-else
              class="flex flex-col items-center justify-center h-full text-gray-500"
            >
              <Icon name="solar:cart-3-outline" size="48" />
              <div class="mt-4 text-lg">Ваша корзина пуста</div>
            </div>
          </div>

          <div v-if="menuStore.cart.length > 0" class="mt-6">
            <div class="flex justify-between items-center mb-4">
              <div class="text-lg font-semibold">Итого:</div>
              <div class="text-xl font-bold">{{ total }} руб.</div>
            </div>
            <div class="flex space-x-4">
              <button
                @click="menuStore.clearCart()"
                class="flex-1 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Очистить корзину
              </button>
              <NuxtLink
                to="/order"
                class="flex-1 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 text-center transition"
              >
                Оформить заказ
              </NuxtLink>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-in-right-enter-active,
.slide-in-right-leave-active {
  transition: transform 0.3s ease;
}
.slide-in-right-enter-from {
  transform: translateX(100%);
}
.slide-in-right-enter-to {
  transform: translateX(0);
}
.slide-in-right-leave-from {
  transform: translateX(0);
}
.slide-in-right-leave-to {
  transform: translateX(100%);
}
</style>
