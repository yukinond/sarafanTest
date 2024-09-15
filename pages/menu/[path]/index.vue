<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useHead } from '@vueuse/head'
import { navbarDataList } from '~/data/navbar/navbarData'
import { notify } from '@kyvg/vue3-notification'

definePageMeta({
  auth: false,
  title: 'Меню',
})

const route = useRoute()
const store = useMainStore()

const pageName = computed(() => {
  const currentRoute = route.params
  const title = navbarDataList.find(
    (navbar) => navbar.path === '/' + currentRoute.path
  )
  return title ? title.title : 'Страница не найдена'
})

onMounted(() => {
  useHead({
    title: pageName.value,
  })
})

const slug = route.params

const menuData = ref([])
const menu = ref([])
const menuStore = useMenuStore()
menu.value = menuStore.menu
const dataLoading = ref(false)

async function fetchMenu() {
  dataLoading.value = true

  await menuStore.getMenu()
  menu.value = menuStore.menu

  dataLoading.value = false
}

async function getData() {
  try {
    dataLoading.value = true
    const { error, data } = await useFetch('/api/menu/getMenu', {
      method: 'GET',
      query: {
        type: route.params.path.replace('/', ''),
      },
      watch: false,
    })

    if (data.value) {
      menuData.value = data.value.data
      dataLoading.value = false
    }
    if (error.value) {
      notify({
        title: 'Ошибка',
        text: error.value.data.message,
        type: 'error',
      })
      dataLoading.value = false
    }
  } catch (error) {
    console.error('Ошибка при получение данных:', error)
    dataLoading.value = false
  }
}
getData()

const pageData = navbarDataList.find((navbar) => navbar.path === slug)

if (!pageData) {
  // Если данных нет, можно перенаправить на страницу 404
  // useRouter().push('/404');
}
</script>

<template>
  <div class="flex justify-center items-center mx-auto w-full">
    <div class="flex justify-between w-full max-w-4xl px-8 gap-3">
      <div
        class="cards grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2 w-full"
      >
        <div
          class="col-span-1 sm:col-span-2 text-center flex items-center justify-center py-10 rounded-lg text-base-100 text-xl bg-cover bg-center"
          :style="{
            backgroundImage: navbarDataList.find(
              (navbar) => navbar.path === '/' + route.params.path
            )?.image
              ? `url(${
                  navbarDataList.find(
                    (navbar) => navbar.path === '/' + route.params.path
                  ).image
                })`
              : 'linear-gradient(to right, #dc2626, #ec4899)',
          }"
        >
          {{
            navbarDataList.find(
              (navbar) => navbar.path === '/' + route.params.path
            ).title || 'Страница не найдена'
          }}
        </div>

        <NuxtLink
          v-if="store.client.username !== 'admin'"
          :to="`/menu/${route.params.path}/add`"
          class="w-full col-span-2 sm:col-span-2 text-center btn btn-ghost hover:bg-red-600 hover:text-white bg-transparent text-base-content border-red-600 border"
          >Добавить блюдо</NuxtLink
        >

        <div
          v-if="menuData && menuData.length && !dataLoading"
          v-for="(buyout, index) of menuData"
          :key="index"
        >
          <div class="card bg-base-100 shadow-xl rounded-lg overflow-hidden">
            <figure
              class="relative w-full h-48 flex items-center justify-center overflow-hidden"
            >
              <NuxtLink
                :to="`/menu/${route.params.path}/${buyout.uuid}`"
                class="w-full h-full bg-cover bg-center absolute inset-0"
                :style="{
                  backgroundImage: `url(${buyout.image})`,
                }"
              >
              </NuxtLink>
              <NuxtLink
                v-if="store.client.username !== 'admin'"
                class="btn btn-sm btn-ghost absolute top-2 right-2 rounded-full p-1 text-primary transition-transform duration-200 ease-in-out transform hover:scale-110"
                :to="`/menu/${route.params.path}/edit?uuid=${buyout.uuid}`"
              >
                <Icon
                  name="mdi:pencil"
                  class="w-6 h-6 text-white bg-primary p-1 rounded-full shadow-lg hover:bg-secondary hover:shadow-xl"
                />
              </NuxtLink>
            </figure>

            <div class="card-body p-4 text-left">
              <NuxtLink
                :to="`/menu/${route.params.path}/${buyout.uuid}`"
                class=""
              >
                <h2 class="card-title text-lg font-semibold">
                  {{ buyout.name }}
                </h2>
              </NuxtLink>
              <p class="text-sm text-gray-600">
                В наличии: {{ buyout.isAvailable ? 'Да' : 'Нет' }}
              </p>
              <p class="text-sm text-gray-600">
                {{ buyout.description }}
              </p>
              <div class="card-actions mt-4 justify-between">
                <p class="text-sm font-semibold text-red-600">
                  {{ buyout.price }} руб.
                </p>
                <button
                  @click="menuStore.addToCart(buyout)"
                  class="btn btn-primary btn-sm"
                >
                  Добавить в корзину
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          v-else
          class="col-span-2 justify-center mx-auto loading loading-spinner text-primary w-1/12"
        >
          <span class=""></span>
        </div>
      </div>
      <div
        class="w-full lg:w-1/5 hidden lg:flex flex-col bg-base-100 shadow-lg p-2 rounded-lg"
      >
        <h2 class="text-center text-xl font-bold mb-6">Наше меню</h2>
        <div class="collapse mb-1" v-for="navbar in navbarDataList">
          <input class="min-h-[1.5rem]" type="checkbox" />
          <div
            class="collapse-title text-left justify-start px-1 text-sm leading-3 whitespace-nowrap btn btn-primary btn-ghost font-normal btn-sm p-0 bg-transparent"
          >
            {{
              navbar.title == 'Авторские деликатесы'
                ? 'Авторское'
                : navbar.title
            }}
            ({{
              menu.filter((x) => x.menuType === navbar.path.replace('/', ''))
                .length
            }})
          </div>
          <div class="collapse-content p-0.5">
            <ol
              v-for="filter in menu.filter(
                (x) => x.menuType === navbar.path.replace('/', '')
              )"
              class="text-xs leading-3 list-decimal list-inside"
            >
              <NuxtLink
                :to="`/menu${navbar.path}/${filter.uuid}`"
                class="flex items-center mb-1"
              >
                <span class="mr-2 text-lg text-red-600">-</span>
                {{ filter.name }}
              </NuxtLink>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
