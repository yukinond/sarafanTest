<script setup lang="ts">
import { useNotification } from '@kyvg/vue3-notification'
import { useHead } from '@vueuse/head'
import { notify } from '@kyvg/vue3-notification'
import { navbarDataList } from '~/data/navbar/navbarData'

const props = defineProps({
  show: { type: Boolean, required: true },
  productData: { type: Array, required: true },
})

const route = useRoute()
const router = useRouter()
const store = useMainStore()

const pageName = computed(() => {
  const product = menuStore.menu.find(
    (product: any) => product.uuid === route.params.uuid
  )
  return product ? product.name : props.productData.name
})

onMounted(() => {
  useHead({ title: pageName.value })
})

const slug = computed(() => route.params)
const cooking = ref('')
const loadingData = ref(false)

async function fetchMenu() {
  await menuStore.getMenu()
}

async function deleteProduct() {
  try {
    const { error, data } = await useFetch('/api/menu/delete', {
      method: 'POST',
      query: { uuid: route.params.uuid },
      watch: false,
    })

    if (data.value) {
      notify({ type: 'success', title: 'Успешно', text: 'Блюдо удалено' })
      await fetchMenu()
      router.push('/menu/' + route.params.path)
    }

    if (error.value) {
      notify({ type: 'error', title: 'Ошибка', text: error.value.data.message })
    }
  } catch (error) {
    console.error('Ошибка при добавлении данных:', error)
  }
}

function toggleCooking(cookingUuid: string, type: string) {
  if (cooking.value === cookingUuid) {
    cooking.value = '' // Сброс значения, если галочка снята
  } else {
    cooking.value = cookingUuid
  }
}

function checked(cookingUuid: string) {
  if (cooking.value == cookingUuid) {
    return true
  }
  return false
}

function addToCart() {
  if (!cooking.value && !modalOpen.value) {
    showInfoWarningModal.value = true
    return
  }
  const product = {
    ...menuStore.menu.find(
      (product: any) => product.uuid === route.params.uuid
    ),
  }

  product.cooking = []

  if (!cooking.value) {
    product.cooking.push({ name: 'Не выбрано', uuid: null })
  } else {
    const selectedCooking = productData.value.cooking.find(
      (cookingItem: any) => cookingItem.uuid === cooking.value
    )

    if (selectedCooking) {
      product.cooking.push(selectedCooking)
    }
  }

  product.cookingTypeAdds = cookingTypeAdds.value.filter(
    (add: any) => add.checked
  )
  menuStore.addToCart(product)
  cooking.value = ''
  cookingTypeAdds.value.forEach((add: any) => (add.checked = false))
}

const showInfoWarningModal = ref(false)
const modalOpen = ref(false)

function confirmWarning() {
  modalOpen.value = true
  addToCart()
  showInfoWarningModal.value = false
  modalOpen.value = false
}

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
const cookingTypeAdds = ref([
  { title: 'Лимон 60гр', value: 'lemon', price: 30, checked: false },
  { title: 'Яблоко зеленое 60гр', value: 'apple', price: 30, checked: false },
  { title: 'Перец чили 5гр', value: 'pepper', price: 30, checked: false },
  { title: 'Паприка 10гр', value: 'paprika', price: 30, checked: false },
  { title: 'Чеснок 60гр', value: 'chicken', price: 30, checked: false },
]) as any
</script>

<template>
  <transition name="fade">
    <div
      v-if="isVisible"
      class="fixed inset-0 z-[9999] flex items-center justify-end bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm"
      @click="$emit('closeModal')"
    >
      <div
        class="flex flex-col items-center mx-auto w-full py-8"
        @click="$emit('closeModal')"
      >
        <div
          v-if="loadingData"
          class="loading loading-dots loading-lg text-primary"
        ></div>

        <div
          v-else
          class="flex flex-col items-center mx-auto w-full bg-white max-w-3xl rounded-lg"
          @click.stop
        >
          <div
            class="flex flex-col md:flex-row w-full max-w-4xl px-6 md:px-8 gap-6 bg-white rounded-xl shadow-2xl py-3 md:py-4"
          >
            <div
              v-if="props.productData && props.productData.image"
              class="w-full md:w-1/2 flex justify-center mb-4 md:mb-0"
            >
              <img
                :src="props.productData.image"
                alt="Изображение продукта"
                class="w-full h-full max-h-52 object-cover rounded-xl transition-transform transform"
              />
            </div>

            <!-- Информация о продукте -->
            <div class="w-full md:w-1/2 flex flex-col">
              <div
                class="text-center py-4 md:py-6 rounded-xl text-2xl md:text-3xl font-semibold mb-4 bg-gradient-to-r from-red-400 via-pink-500 to-red-600 text-white"
              >
                {{ pageName }}
              </div>

              <div v-if="props.productData" class="p-4 md:p-6 rounded-xl">
                <div
                  v-if="props.productData.description"
                  class="text-center text-lg font-medium text-gray-800 mb-4"
                >
                  <p class="mb-2">{{ props.productData.description }}</p>
                  <p
                    v-if="props.productData.price"
                    class="text-gray-700 font-semibold"
                  >
                    Цена: {{ props.productData.price }} руб.
                  </p>
                  <p
                    v-if="props.productData.isAvailable !== undefined"
                    class="text-gray-700"
                  >
                    Доступность:
                    {{
                      props.productData.isAvailable
                        ? 'В наличии'
                        : 'Нет в наличии'
                    }}
                  </p>
                  <div
                    v-for="(detail, index) in props.productData.details"
                    :key="index"
                    class="text-gray-700"
                  >
                    <span class="font-semibold">{{ detail.title }}:</span>
                    {{ detail.value }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="w-full max-w-4xl px-6 md:px-8 py-6  pt-0 bg-white rounded-xl "
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                v-if="
                  props.productData.cooking.filter((c) => c.type === 'Варка')
                    .length
                "
                class="space-y-6"
              >
                <h3
                  class="text-lg font-bold mb-4 text-gray-800 border-b-2 border-gray-300 pb-2"
                >
                  Варка
                </h3>
                <div
                  class="flex flex-col space-y-6 w-full px-2 max-h-52 overflow-y-auto"
                >
                  <div
                    v-for="cookingItem in props.productData.cooking.filter(
                      (c) => c.type === 'Варка'
                    )"
                    :key="cookingItem.uuid"
                    class="bg-gray-100 p-4 rounded-xl shadow-lg transition-transform transform hover:scale-105"
                  >
                    <label
                      class="flex items-start justify-center flex-col space-x-3"
                    >
                      <div class="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          :value="cookingItem.uuid"
                          :checked="checked(cookingItem.uuid)"
                          @click="
                            (event) =>
                              toggleCooking(cookingItem.uuid, cookingItem.type)
                          "
                          class="form-checkbox ml-2 h-5 w-5 text-red-600"
                        />
                        <div class="ml-2 text-lg font-semibold text-gray-800">
                          {{ cookingItem.name }}
                        </div>
                      </div>
                      <p class="text-gray-600">{{ cookingItem.composition }}</p>
                      <p class="text-gray-800 font-bold">
                        Цена: {{ cookingItem.price }} руб.
                      </p>
                    </label>
                  </div>
                </div>
              </div>

              <div
                v-if="
                  props.productData.cooking.filter((c) => c.type === 'Жарка')
                    .length
                "
                class="space-y-6"
              >
                <h3
                  class="text-lg font-bold mb-4 text-gray-800 border-b-2 border-gray-300 pb-2"
                >
                  Жарка
                </h3>
                <div
                  class="flex flex-col space-y-6 w-full px-2 max-h-52 overflow-y-auto"
                >
                  <div
                    v-for="cookingItem in props.productData.cooking.filter(
                      (c) => c.type === 'Жарка'
                    )"
                    :key="cookingItem.uuid"
                    class="bg-gray-100 p-4 rounded-xl shadow-lg transition-transform transform hover:scale-105"
                  >
                    <label
                      class="flex items-start justify-center flex-col space-x-3"
                    >
                      <div class="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          :value="cookingItem.uuid"
                          :checked="checked(cookingItem.uuid)"
                          @click="
                            (event) =>
                              toggleCooking(cookingItem.uuid, cookingItem.type)
                          "
                          class="form-checkbox ml-2 h-5 w-5 text-red-600"
                        />
                        <div class="ml-2 text-lg font-semibold text-gray-800">
                          {{ cookingItem.name }}
                        </div>
                      </div>
                      <p class="text-gray-600">{{ cookingItem.composition }}</p>
                      <p class="text-gray-800 font-bold">
                        Цена: {{ cookingItem.price }} руб.
                      </p>
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <h3 class="font-semibold my-2">Выбор добавок</h3>
                <div class="flex flex-col gap-2">
                  <div
                    v-for="add in cookingTypeAdds"
                    :key="add.value"
                    class="form-control"
                  >
                    <label class="cursor-pointer flex items-center">
                      <input
                        :checked="add.checked"
                        type="checkbox"
                        :id="add.value"
                        v-model="add.checked"
                        class="checkbox checkbox-primary"
                      />
                      <span class="ml-2"
                        >{{ add.title }} - {{ add.price }}₽</span
                      >
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="w-full border border-red-600 border-x-0 text-gray-800 p-6 text-center mt-6 text-xs"
            >
              Мы специализируемся на продаже, приготовлении и доставке
              морепродуктов по городу Казань. Мы не готовим заранее, что
              гарантирует получение вами блюда свежим и теплым. Готовим на
              открытой кухне на ваших глазах!
            </div>

            <button
              @click="addToCart"
              class="flex ml-auto mt-6 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Добавить в корзину
            </button>
          </div>
        </div>
      </div>
      <InfoWarningModal
        :show="showInfoWarningModal"
        @cancel="showInfoWarningModal = false"
        @confirm="confirmWarning"
        :question="'Вы уверены, что хотите добавить в корзину без выбранных способов приготовления?'"
      />
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
