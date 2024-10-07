<script lang="ts" setup>
import { navbarDataList } from '~/data/navbar/navbarData'
import { notify } from '@kyvg/vue3-notification'

const route = useRoute()
const menuStore = useMenuStore()
const store = useMainStore()

const drawerContent: any = ref(null)

const scrollTop = ref(0)
const isNavbarVisible = ref(true)
const isFixedNavbarVisible = ref(false)

// Функция обработки скролла
const handleScroll = () => {
  scrollTop.value = window.scrollY
  isNavbarVisible.value = scrollTop.value < 200
  const navbar = document.querySelector('.fixed-navbar') as HTMLElement
  if (scrollTop.value > 200) {
    navbar.classList.add('show')
    navbar.classList.remove('hide')
  } else {
    navbar.classList.add('hide')
    navbar.classList.remove('show')
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const isInfoModal = ref<boolean>(false)
function toggleInfoModal() {
  isInfoModal.value = !isInfoModal.value
}

const originalWarn = console.warn
console.warn = (msg) => {
  if (!msg.includes('No match found for location with path')) {
    originalWarn(msg)
  }
}

const menu = ref([])
const dataLoading = ref(false)

async function fetchMenu() {
  dataLoading.value = true

  await menuStore.getMenu()
  menu.value = menuStore.menu

  dataLoading.value = false
}
fetchMenu()

const openCart = ref(false)
const inputModal = ref(false)
const searchData = ref([])

async function search(value: string) {
  if (!value || value.trim() === '') {
    searchData.value = []
    return
  }
  try {
    dataLoading.value = true
    const { error, data } = await useFetch('/api/menu/getMenu', {
      method: 'GET',
      query: {
        searchQuery: value,
      },
      watch: false,
    })

    if (data.value) {
      searchData.value = data.value.menu
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

function closeSearch() {
  searchData.value = []
  inputModal.value = false
}

const router = useRouter()

function navigation(path: string) {
  router.push(path)
}

function disableScroll() {
  document.body.style.overflow = 'hidden'
}

function enableScroll() {
  document.body.style.overflow = ''
}
const isDrawerOpen = ref(false)

watch(isDrawerOpen, (newValue) => {
  if (newValue) {
    disableScroll()
  } else {
    enableScroll()
  }
})
</script>

<template>
  <div class="drawer min-h-screen flex flex-col">
    <input
      id="my-drawer-3"
      type="checkbox"
      class="drawer-toggle"
      v-model="isDrawerOpen"
    />
    <div class="drawer-content flex flex-col bg-white flex-grow">
      <!-- Navbar -->
      <div
        :class="[
          'flex justify-center items-center mx-auto w-full bg-white border my-0 mb-5 fixed-navbar',
          isFixedNavbarVisible ? 'show' : 'hide',
        ]"
      >
        <div class="flex justify-between min-w-full px-10">
          <div class="flex items-center lg:hidden">
            <label
              for="my-drawer-3"
              aria-label="open sidebar"
              class="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="inline-block h-6 w-6 stroke-current"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>

          <div class="flex justify-center items-center">
            <NuxtLink to="/" class="my-auto flex">
              <nuxt-img src="/favicon.png" class="w-20 rounded-full" />
            </NuxtLink>
            <div class="flex flex-col my-auto">
              <NuxtLink
                to="/"
                class="text-3xl font-bold text-gray-800 flex mx-auto"
              >
                Rikrtop
              </NuxtLink>
              <button
                type="button"
                @click.stop="navigation('/menu')"
                class="btn rounded-full btn-xs bg-red-600 text-white text-xs font-normal hover:bg-transparent hover:border hover:border-red-600 hover:text-black"
              >
                Заказать онлайн
              </button>
            </div>
          </div>

          <div class="hidden lg:flex items-center flex-nowrap">
            <div class="hidden flex-none items-center lg:flex mr-5">
              <div class="menu menu-horizontal gap-1">
                <!-- Navbar menu content here -->
                <li>
                  <NuxtLink to="/about" class="px-1.5">О компании</NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/contacts" class="px-1.5">Контакты</NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/reviews" class="px-1.5">Отзывы</NuxtLink>
                </li>
                <li><a class="px-1.5">Доставка</a></li>
                <li v-if="store.client.role === 'admin'">
                  <NuxtLink to="/orders">Заказы</NuxtLink>
                </li>
              </div>
            </div>
            <div class="menu menu-horizontal gap-2">
              <!-- Navbar menu content here -->
              <li>
                <NuxtLink
                  to="/profile"
                  class="rounded-none border text-gray-500"
                  ><Icon
                    name="healthicons:ui-user-profile-outline"
                    size="20"
                    class="cart-icon"
                /></NuxtLink>
              </li>
              <li>
                <button
                  @click="inputModal = true"
                  class="rounded-none border text-gray-500"
                >
                  <Icon
                    name="system-uicons:search"
                    size="20"
                    class="cart-icon"
                  />
                </button>
              </li>
              <li>
                <button
                  @click="openCart = true"
                  class="rounded-none border text-gray-500"
                >
                  <Icon
                    name="solar:cart-3-outline"
                    size="20"
                    class="cart-icon"
                  />
                </button>
              </li>
            </div>
          </div>
        </div>
      </div>
      <div
        class="lg:flex justify-center items-center mx-auto w-full -mt-2 mb-5 hidden gap-3"
      >
        <div
          class="dropdown group relative"
          v-for="navbar in navbarDataList"
          @click.stop
        >
          <NuxtLink
            :to="'/menu' + navbar.path"
            class="btn whitespace-nowrap flex flex-nowrap text-sm btn-ghost btn-sm rounded-full border-1 font-semibold bg-red-600 text-white hover:bg-white hover:border-red-600 hover:text-black transition-all duration-300 group-hover:rounded-b-none group-hover:rounded-2xl"
          >
            <span>{{ navbar.title }}</span>
            <Icon name="formkit:up" class="arrowUp" size="15" />
          </NuxtLink>
          <ul
            class="absolute shadow-md z-[1] bg-base-100 rounded-lg w-full flex flex-col gap-y-0.5 max-h-[300px] overflow-y-auto overflow-x-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 group-hover:flex"
          >
            <li
              v-for="filter in menu.filter(
                (x) => x.menuType === navbar.path.replace('/', '')
              )"
              class="transition-all border-none-class duration-200 py-0.5 bg-white"
            >
              <NuxtLink
                :to="'/menu' + navbar.path + '/' + filter.uuid"
                :external="false"
                class="btn overflow-hidden text-xs text-[0.68rem] rounded-none border-none btn-ghost btn-xs h-[2rem] normal-case font-normal w-full leading-none items-center justify-start text-left hover:text-red-600"
              >
                <span>{{ filter.name }}</span>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
      <!-- Основной контент страницы -->
      <div class="flex-grow northern-lights py-5">
        <slot />
      </div>

      <!-- Футер -->
      <div
        class="w-full md:w-2/3 text-black p-5 md:p-10 pb-0 mx-auto border-t mt-5"
      >
        <div
          class="flex flex-col md:flex-row justify-center gap-10 items-center md:items-start"
        >
          <div class="flex flex-col items-center md:items-start mb-5 md:mb-0">
            <div class="font-semibold text-lg text-center md:text-left">
              Контактная информация:
            </div>
            <div class="flex justify-center md:justify-start mt-4">
              <NuxtLink to="/" class="flex items-center">
                <nuxt-img
                  src="/favicon.png"
                  class="w-16 md:w-20 rounded-full mr-3"
                />
                <div class="flex flex-col text-center md:text-left">
                  <NuxtLink
                    to="/"
                    class="text-2xl md:text-3xl font-bold text-gray-800"
                  >
                    Rikrtop
                  </NuxtLink>
                  <button
                    type="button"
                    @click.stop="navigation('/menu')"
                    class="btn rounded-full btn-xs bg-red-600 text-white text-xs font-normal mt-2 hover:bg-transparent hover:border hover:border-red-600 hover:text-black"
                  >
                    Заказать онлайн
                  </button>
                </div>
              </NuxtLink>
            </div>
          </div>
          <!-- Контакты -->
          <div class="flex flex-col space-y-2 text-center md:text-left">
            <div class="flex items-center">
              <Icon name="fluent:phone-32-regular" size="20" class="mr-2" />
              <span class="text-sm md:text-base"
                >+7 (843) 215 99 88; +7 (987) 215 99 88</span
              >
            </div>
            <div class="flex items-center">
              <Icon name="carbon:email" size="20" class="mr-2" />
              <span class="text-sm md:text-base">rikrtop@inbox.ru</span>
            </div>
            <div class="flex items-center">
              <Icon name="ph:map-pin-light" size="20" class="mr-2" />
              <span class="text-sm md:text-base"
                >г. Казань, ул. Меридианная 10а</span
              >
            </div>
            <div class="flex items-center">
              <Icon name="ri:vk-line" size="20" class="mr-2" />
              <span class="text-sm md:text-base">vk/rikrtop.com</span>
            </div>
            <div class="flex items-center">
              <Icon name="mingcute:telegram-line" size="20" class="mr-2" />
              <span class="text-sm md:text-base">tg:rikrtop</span>
            </div>
            <div class="flex items-center">
              <Icon name="bi:instagram" size="20" class="mr-2" />
              <span class="text-sm md:text-base">inst:rikrtop</span>
            </div>
          </div>
        </div>
        <!-- Политика и информация -->
        <div
          class="mt-5 mb-5 md:mb-10 flex flex-col md:flex-row gap-2 md:gap-3 justify-center items-center w-full text-sm md:text-base"
        >
          <a href="#" class="text-coral-300 hover:underline"
            >Политика конфиденциальности</a
          >
          <span class="hidden md:block">|</span>
          <NuxtLink to="/about" class="text-coral-300 hover:underline"
            >О нас</NuxtLink
          >
        </div>
      </div>
    </div>
    <div class="drawer-side z-[99999] h-screen overflow-hidden">
      <label
        for="my-drawer-3"
        aria-label="close sidebar"
        class="drawer-overlay max-h-sreen overflow-y-hidden"
      ></label>
      <ul class="menu bg-base-200 min-h-full w-80 p-4 overflow-hidden">
        <div class="menu menu-horizontal gap-2 flex justify-center mb-5 w-full">
          <!-- Navbar menu content here -->
          <li class="w-1/4">
            <NuxtLink
              to="/profile"
              class="rounded-none border text-gray-500 flex justify-center"
              ><Icon
                name="healthicons:ui-user-profile-outline"
                size="20"
                class="cart-icon"
            /></NuxtLink>
          </li>
          <li class="w-1/4">
            <button
              @click=";[(inputModal = true), (isDrawerOpen = false)]"
              class="rounded-none border text-gray-500 flex justify-center"
            >
              <Icon name="system-uicons:search" size="20" class="cart-icon" />
            </button>
          </li>
          <li class="w-1/4">
            <button
              @click=";[(openCart = true), (isDrawerOpen = false)]"
              class="rounded-none border text-gray-500 flex justify-center"
            >
              <Icon name="solar:cart-3-outline" size="20" class="cart-icon" />
            </button>
          </li>
        </div>
        <li class="my-1 border rounded-xl hover:border-b-red-600">
          <NuxtLink to="/menu">Меню</NuxtLink>
        </li>
        <li class="my-1 border rounded-xl hover:border-b-red-600">
          <NuxtLink to="/about">О компании</NuxtLink>
        </li>
        <li class="my-1 border rounded-xl hover:border-b-red-600">
          <NuxtLink to="/contacts">Контакты</NuxtLink>
        </li>
        <li class="my-1 border rounded-xl hover:border-b-red-600">
          <NuxtLink to="/delivery">Доставка</NuxtLink>
        </li>

        <!-- Sidebar content here -->
        <!-- <li
          v-for="navbar in navbarDataList"
          :key="navbar.path"
          class="my-1 border rounded-xl hover:border-b-red-600"
        >
          <NuxtLink :to="navbar.path">{{ navbar.title }}</NuxtLink>
        </li> -->
      </ul>
    </div>
  </div>
  <MenuCartModal :show="openCart" @close-modal="openCart = false" />
  <MenuInputModal
    :show="inputModal"
    :founded="searchData"
    :loading="dataLoading"
    @close-modal="closeSearch"
    @search="search"
  />
</template>

<style scoped>
.fixed-navbar {
  position: sticky; /* Заменено fixed на sticky */
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: white;
  transition: top 0.3s ease; /* Переход только для top */
}

.fixed-navbar.show {
  top: 0;
}

.fixed-navbar.hide {
  top: -100px;
}

.drawer {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.drawer-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.drawer-content {
  scroll-behavior: smooth;
}

.bounce-enter-active,
.bounce-leave-active {
  transition: opacity 0.3s ease;
}

.bounce-enter-from,
.bounce-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.cart-icon {
  transition: transform 0.3s ease, color 0.3s ease;
}

a:hover .cart-icon {
  transform: scale(1.1) rotate(-10deg);
  color: #ff0000;
}
button:hover .cart-icon {
  transform: scale(1.1) rotate(-10deg);
  color: #ff0000;
}

.dropdown:hover .arrowUp {
  transform: rotate(180deg);
}
.arrowUp {
  transition: transform 0.6s ease;
}
.group:hover .btn {
  background-color: white;
  border-color: #ff0000;
  color: black;
}

.border-none-class:hover {
  border-bottom: 2px solid #ff0000;
}
.group:hover .arrowUp {
  transform: rotate(180deg);
}

.group:hover .btn {
  border-radius: 2xl;
}
.dropdown:hover .arrowUp {
  transform: rotate(180deg);
}

li:hover .btn {
  border-radius: 0;
  background-color: #ffe5e5;
  color: #ff0000;
}

li:hover .btn span {
  color: #ff0000;
}

/* .northern-lights {
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  background: linear-gradient(180deg, #ff0000 0%, #1c1c1c 100%);
  z-index: 0;
}

.northern-lights::before,
.northern-lights::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 200%;
  z-index: -1;
}

.northern-lights::before {
  background: radial-gradient(circle at 50% 50%, rgba(255, 0, 0, 0.6), rgba(0, 0, 0, 0));
  animation: aurora-red 18s infinite linear;
  opacity: 0.8;
}

.northern-lights::after {
  background: radial-gradient(circle at 50% 50%, rgba(21, 0, 255, 0.4), rgba(0, 0, 0, 0));
  animation: aurora 25s infinite linear reverse;
  opacity: 0.7;
}

@keyframes aurora-red {
  0% {
    transform: translateX(50%) translateY(-30%);
  }
  50% {
    transform: translateX(0) translateY(0);
  }
  100% {
    transform: translateX(50%) translateY(-30%);
  }
}

@keyframes aurora {
  0% {
    transform: translateX(0) translateY(0);
  }
  50% {
    transform: translateX(50%) translateY(-20%);
  }
  100% {
    transform: translateX(0) translateY(0);
  }
} */
</style>
