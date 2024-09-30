<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { notify } from '@kyvg/vue3-notification'
import { navbarDataList } from '~/data/navbar/navbarData'
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

definePageMeta({
  auth: false,
  title: 'Меню',
})

const route = useRoute()
const router = useRouter()
const store = useMainStore()
const menuStore = useMenuStore()

const pageName = computed(() => {
  const product = menuStore.menu.find(
    (product) => product.uuid === route.params.uuid
  )
  return product ? product.name : 'Страница не найдена'
})

onMounted(() => {
  useHead({ title: pageName.value })
})

const slug = computed(() => route.params)
const productData = ref(null)
const cooking = ref('')
const loadingData = ref(true)

watch(
  slug,
  () => {
    const product = menuStore.menu.find(
      (product: any) => product.uuid === route.params.uuid
    )
    if (product) {
      getProduct()
    }
    // if (!productData.value) {
    //   notify({ type: 'error', title: 'Ошибка', text: 'Продукт не найден' })
    //   router.push('/404')
    // }
  },
  { immediate: true }
)

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

async function getProduct() {
  loadingData.value = true
  productData.value = await menuStore.getProduct(route.params.uuid)
  loadingData.value = false
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

  product.cookingTypeAdds = cookingTypeAdds.value.filter((add:any) => add.checked)
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

const cookingTypeAdds = ref([
  { title: 'Лимон 60гр', value: 'lemon', price: 30, checked: false },
  { title: 'Яблоко зеленое 60гр', value: 'apple', price: 30, checked: false },
  { title: 'Перец чили 5гр', value: 'pepper', price: 30, checked: false },
  { title: 'Паприка 10гр', value: 'paprika', price: 30, checked: false },
  { title: 'Чеснок 60гр', value: 'chicken', price: 30, checked: false },
]) as any

function handleAddCheckboxChange(add: any) {
  add.checked = !add.checked
}
</script>

<template>
  <div class="flex flex-col items-center mx-auto w-full py-8">
    <div class="w-full max-w-4xl px-6 md:px-8 mb-6">
      <div class="flex items-center space-x-2 text-sm font-medium mb-4">
        <router-link
          to="/menu"
          class="relative text-gray-800 hover:text-gray-600 transition-colors"
        >
          <span class="relative">
            Меню
            <span
              class="absolute bottom-0 left-0 w-full h-0.5 bg-gray-300 transform scale-x-0 origin-left transition-transform"
            ></span>
          </span>
        </router-link>
        <span class="text-gray-600">/</span>
        <router-link
          :to="`/menu/${route.params.path}`"
          class="relative text-gray-800 hover:text-gray-600 transition-colors"
        >
          <span class="relative">
            {{
              navbarDataList.find(
                (navbar) => navbar.path === '/' + route.params.path
              ).title
            }}
            <span
              class="absolute bottom-0 left-0 w-full h-0.5 bg-gray-300 transform scale-x-0 origin-left transition-transform"
            ></span>
          </span>
        </router-link>
        <span class="text-gray-600">/</span>
        <span class="text-gray-900 font-semibold">{{ pageName }}</span>
      </div>
    </div>

    <div
      v-if="loadingData"
      class="loading loading-dots loading-lg text-primary"
    ></div>

    <div v-else class="flex flex-col items-center mx-auto w-full">
      <div
        class="flex flex-col md:flex-row w-full max-w-4xl px-6 md:px-8 gap-6 bg-white rounded-xl shadow-2xl py-6 md:py-8"
      >
        <div
          v-if="productData && productData.image"
          class="w-full md:w-1/2 flex justify-center mb-4 md:mb-0"
        >
          <img
            :src="productData.image"
            alt="Изображение продукта"
            class="w-full h-full object-cover rounded-xl transition-transform transform"
          />
        </div>

        <!-- Информация о продукте -->
        <div class="w-full md:w-1/2 flex flex-col">
          <div
            class="text-center py-4 md:py-6 rounded-xl text-2xl md:text-3xl font-semibold mb-4 bg-gradient-to-r from-red-400 via-pink-500 to-red-600 text-white"
          >
            {{ pageName }}
          </div>

          <div v-if="productData" class="p-4 md:p-6 rounded-xl">
            <div
              v-if="productData.description"
              class="text-center text-lg font-medium text-gray-800 mb-4"
            >
              <p class="mb-2">{{ productData.description }}</p>
              <p v-if="productData.price" class="text-gray-700 font-semibold">
                Цена: {{ productData.price }} руб.
              </p>
              <p
                v-if="productData.isAvailable !== undefined"
                class="text-gray-700"
              >
                Доступность:
                {{ productData.isAvailable ? 'В наличии' : 'Нет в наличии' }}
              </p>
              <div
                v-for="(detail, index) in productData.details"
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
        class="w-full max-w-4xl px-6 md:px-8 py-6 bg-white rounded-xl shadow-2xl mt-6"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-if="productData.cooking.filter((c) => c.type === 'Варка').length"
            class="space-y-6"
          >
            <h3
              class="text-lg font-bold mb-4 text-gray-800 border-b-2 border-gray-300 pb-2"
            >
              Варка
            </h3>
            <div
              class="flex flex-col space-y-6 w-full px-2 max-h-80 overflow-y-auto"
            >
              <div
                v-for="cookingItem in productData.cooking.filter(
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
            v-if="productData.cooking.filter((c) => c.type === 'Жарка').length"
            class="space-y-6"
          >
            <h3
              class="text-lg font-bold mb-4 text-gray-800 border-b-2 border-gray-300 pb-2"
            >
              Жарка
            </h3>
            <div
              class="flex flex-col space-y-6 w-full px-2 max-h-80 overflow-y-auto"
            >
              <div
                v-for="cookingItem in productData.cooking.filter(
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
                  <span class="ml-2">{{ add.title }} - {{ add.price }}₽</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div
          class="w-full border border-red-600 border-x-0 text-gray-800 p-6 text-center mt-6"
        >
          Мы специализируемся на продаже, приготовлении и доставке морепродуктов
          по городу Казань. Мы не готовим заранее, что гарантирует получение
          вами блюда свежим и теплым. Готовим на открытой кухне на ваших глазах!
        </div>

        <button
          @click="addToCart"
          class="flex ml-auto mt-6 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Добавить в корзину
        </button>

        <div class="mt-6 flex justify-end w-full">
          <button
            @click="deleteProduct"
            class="bg-red-600 w-full text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Удалить блюдо
          </button>
        </div>
      </div>
    </div>
  </div>
  <InfoWarningModal
    :show="showInfoWarningModal"
    @cancel="showInfoWarningModal = false"
    @confirm="confirmWarning"
    :question="'Вы уверены, что хотите добавить в корзину без выбранных способов приготовления?'"
  />
</template>

<style scoped>
.form-checkbox {
  @apply appearance-none bg-white border-2 border-gray-300 rounded-md w-5 h-5 relative;
}

.form-checkbox:checked {
  @apply bg-red-600 border-red-600;
}

.form-checkbox:checked:before {
  content: '';
  @apply absolute top-1 left-1 text-white text-sm;
}

.router-link-active span::after {
  transform: scaleX(1);
}

.router-link span::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #000; /* Измените на желаемый цвет */
  transform: scaleX(0);
  transform-origin: bottom right;
  transition: transform 0.3s ease;
}

/* .shadow-2xl {
  @apply shadow-2xl;
}

.transition-transform {
  @apply transition-transform;
} */
</style>
