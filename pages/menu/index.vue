<script setup lang="ts">
definePageMeta({
  auth: false,
})
import { navbarDataList } from '~/data/navbar/navbarData'
import { notify } from '@kyvg/vue3-notification'

const route = useRoute()
const menuStore = useMenuStore()
const store = useMainStore()

const menu = ref([])
const dataLoading = ref(false)
menu.value = menuStore.menu
</script>

<template>
  <div class="flex justify-center items-center mx-auto w-full ">
    <div class="flex justify-between w-full max-w-4xl px-8 gap-3 my-5">
      <div
        v-if="dataLoading && menu.length === 0"
        class="grid grid-cols-1 justify-center mx-auto loading loading-spinner text-primary w-1/12"
      >
        <span class=""></span>
      </div>
      <div
        v-else
        class="cards grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2 w-full "
      >
        <NuxtLink
          v-if="store.client.role == 'admin'"
          :to="`/menu/cooking`"
          class="w-full col-span-1 sm:col-span-2 text-center btn btn-ghost hover:bg-red-600 hover:text-white bg-transparent text-base-content border-red-600 border"
          >Добавить методы варки/жарки</NuxtLink
        >
        <NuxtLink
          v-if="store.client.role == 'admin'"
          :to="`/menu/cooking/edit`"
          class="w-full col-span-1 sm:col-span-2 text-center btn btn-ghost hover:bg-red-600 hover:text-white bg-transparent text-base-content border-red-600 border"
          >Редактировать список варки/жарки</NuxtLink
        >
        <div v-for="navbar of navbarDataList" :key="navbar.path">
          <NuxtLink
            :to="'/menu' + navbar.path"
            class="card bg-base-100 shadow-xl rounded-lg overflow-hidden hover:text-red-600"
          >
            <figure class="relative">
              <nuxt-img
                :src="navbar.image"
                alt="Shoes"
                class="w-full h-48 object-cover"
              />
            </figure>
            <div class="card-body p-4 text-center flex mx-auto">
              <h2 class="card-title text-lg font-semibold">
                {{ navbar.title }} ({{
                  menu.filter(
                    (x) => x.menuType === navbar.path.replace('/', '')
                  ).length
                }})
              </h2>
            </div>
          </NuxtLink>
        </div>
      </div>

      <div
        class="w-full lg:w-3/12 hidden lg:flex flex-col bg-base-100 shadow-lg p-2 rounded-lg"
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

<style scoped>


</style>
