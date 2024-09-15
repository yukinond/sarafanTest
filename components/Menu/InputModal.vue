<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = defineProps({
  show: { type: Boolean, required: true },
  founded: { type: Array, required: true },
  loading: { type: Boolean, required: true },
})

const emit = defineEmits(['closeModal', 'search'])
const menuStore = useMenuStore()
const total = computed(() => {
  return menuStore.cart.reduce(
    (sum: number, item: any) => sum + item.price * item.count,
    0
  )
})

const isVisible = ref(props.show)
const searchInput = useDebounceFn(search, 1000)
const searchQuery = ref('')
function search() {
  emit('search', searchQuery.value)
}

function navigate(path: string) {
  console.log(path)
  navigateTo(path)
  emit('closeModal')
}

watch(
  () => props.show,
  (newVal) => {
    isVisible.value = newVal
  }
)
</script>

<template>
  <transition name="modal">
    <div
      v-if="isVisible"
      class="fixed inset-0 z-[9999] flex flex-col gap-5 items-center justify-center bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm"
      @click="$emit('closeModal')"
    >
      <transition name="modal-content">
        <div
          v-if="isVisible"
          class="flex relative bg-transparen border-b-2 border-base w-full max-w-xl p-0.5 items-center overflow-y-auto"
        >
          <input
            @click.stop
            type="text"
            placeholder="Поиск..."
            class="join-item input border-none rounded-lg w-full my-auto bg-transparent focus:outline-none cursor-pointer text-white"
            v-model="searchQuery"
            @input="searchInput()"
          />
          <Icon
            v-if="!loading"
            name="system-uicons:search"
            size="20"
            class="cart-icon absolute right-1 text-base text-white"
          />
          <div
            v-else
            class="loading loading-spinner loading-xs cart-icon absolute right-1 text-base text-white"
          ></div>
        </div>
      </transition>
      
      <transition name="list">
        <div
          v-if="founded.length > 0"
          @click.stop
          class="flex flex-col gap-1 w-full max-w-xl text-center"
        >
          <Button
            v-for="item in founded"
            :key="item?.uuid"
            @click="navigate('/menu/'+item?.menuType+'/'+item?.uuid)"
            class="bg-transparent hover:bg-red-600 text-white py-2 px-4 rounded border border-white transition w-full duration-300"
          >
            {{ item?.name }}
          </Button>
        </div>
      </transition>
    </div>
  </transition>
</template>


<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 1s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-content-enter-active,
.modal-content-leave-active {
  transition: transform 1s ease;
}

.modal-content-enter-from,
.modal-content-leave-to {
  transform: scale(0.9);
  opacity: 0;
}

/* Стили анимации для выпадающего списка */
.list-enter-active,
.list-leave-active {
  transition: max-height 0.5s ease-in-out, opacity 0.5s ease-in-out;
}

.list-enter-from,
.list-leave-to {
  max-height: 0;
  opacity: 0;
}

.list-enter-to,
.list-leave-from {
  max-height: 1000px; /* Достаточно большое значение для отображения списка */
  opacity: 1;
}
</style>

