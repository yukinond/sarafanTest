<script setup lang="ts">
import { notify } from '@kyvg/vue3-notification'
import { nextTick } from 'vue'

definePageMeta({
  auth: true,
  title: 'Профиль',
})

const warning = ref('')
const isChatBotEnabled = ref(false)
const store = useMainStore()
const twoFaQRModal = ref<any>(null)
const wbApiKeys = ref([''])
const apiKey = ref([''])
const apiKeys = ref<{ mp: string; keys: string[] }[]>([])
const currentMP = ref('wildberries')
const form: any = reactive({
  email: '',
  username: '',
})
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
})
const alert = reactive({
  show: false,
  message: '',
  type: '',
})
const { start, stop } = useTimeoutFn(
  () => {
    alert.show = false
  },
  3000,
  { immediate: false }
)

const initialForm: any = reactive({
  email: '',
  username: '',
})

function updateInitital() {
  initialForm.email = store.client.email
  initialForm.username = store.client.username
}

onMounted(async () => {
  updateInitital()
  form.email = store.client.email
  form.username = store.client.username
  if (store.client.apiKeys !== undefined) {
    apiKeys.value = store.client.apiKeys
  }
})

const headers = useRequestHeaders(['cookie']) as HeadersInit
const disabledSaveButton = computed(() => {
  return (
    form.email == initialForm.email &&
    form.username == initialForm.username &&
    form.middleName == initialForm.middleName
  )
})

const disabledChangePasswordButton = computed(() => {
  if (store.client.hasPassword)
    return passwordForm.oldPassword == '' || passwordForm.newPassword == ''
  else return passwordForm.newPassword == ''
})

async function updatePassword() {
  if (passwordForm.oldPassword == '' && passwordForm.newPassword == '') return

  const { data, error }: any = await useFetch('/api/user/updatePassword', {
    method: 'POST',
    body: passwordForm,
    headers,
    watch: false,
  })

  if ((data.value as any)?.status === 'error') {
    alert.show = true
    alert.message = (data.value as any).error!
    alert.type = 'error'
  } else {
    alert.message = data.value.newPassword
      ? 'Пароль успешно установлен'
      : 'Введите код подтверждения'
    alert.type = 'success'
    alert.show = true
  }

  start()
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  await store.getClient()
}

async function update() {
  if (
    form.email == store.client.email &&
    form.username == store.client.username &&
    form.middleName == store.client.middleName
  )
    return

  const { data, error } = await useFetch('/api/user/update', {
    method: 'POST',
    body: form,
    headers,
    watch: false,
  })

  if (error.value) {
    alert.show = true
    alert.message = error.value?.data?.message
    alert.type = 'error'
  } else {
    alert.message = data.value?.emailUpdated
      ? 'Письмо для подтверждения было отправлено на указанный email. (Проверьте папку Спам)'
      : 'Данные успешно обновлены'
    alert.type = 'success'
    alert.show = true
  }

  start()
  await store.getClient()
  updateInitital()
}

async function deleteToken(uuid: string) {
  //@ts-ignore
  const { data, error }: any = await useFetch('/api/token/deleteToken')
}

async function reloginCycle() {
  const { data, error }: any = await useFetch('/api/token/reLoginCycle', {
    method: 'GET',
  })
  if (data.value) {
    if (data.value.status == 'logined') {
      return 'logined'
    } else {
      return 'ol'
    }
  }
}

const { signOut, status } = useAuth()

async function logout() {
  await deleteToken(store.client.uuid)
  const loginStatus = await reloginCycle()

  if (loginStatus !== 'logined') {
    await signOut({
      callbackUrl: '/auth',
    })
  } else {
    location.reload()
  }

  store.setClient()
}

const orders = ref([])
const filter = ref('created')
const formType = ref('profile')
const loadingOrders = ref(false)

async function getOrders() {
  loadingOrders.value = true
  const { data, error } = await useFetch('/api/order/get', {
    method: 'GET',

    query: {
      userUuid: store.client.uuid,
    },
    watch: false,
  })
  if (data.value) orders.value = data.value.orders

  if (error.value) {
    console.log(error.value)
  }

  loadingOrders.value = false
}

watch(
  () => formType.value,
  (newValue) => {
    if (newValue === 'orders') getOrders()
  }
)
</script>

<template>
  <div class="flex min-h-screen bg-white justify-center items-center">
    <!-- Content Wrapper -->
    <div
      class="flex w-full max-w-7xl rounded-lg shadow-lg overflow-hidden bg-white"
    >
      <!-- Sidebar Menu -->
      <aside class="w-64 flex flex-col bg-gray-100 p-6 text-gray-800 shadow-md">
        <div class="flex flex-col items-center">
          <!-- User Avatar -->
          <img
            src="https://via.placeholder.com/150"
            alt="User Avatar"
            class="w-20 h-20 rounded-full mb-4 shadow-md"
          />
          <h2 class="text-xl font-semibold mb-6">Меню</h2>
          <ul class="menu space-y-3 w-full">
            <li class="group">
              <button
                @click="formType = 'profile'"
                class="flex items-center p-2 space-x-3 text-lg rounded-lg group-hover:bg-gray-300 transition-all duration-200"
              >
                <Icon
                  name="ion:person-outline"
                  size="24"
                  class="group-hover:scale-110 transform transition-all duration-200"
                />
                <span>Профиль</span>
              </button>
            </li>
            <li class="group">
              <button
                @click="formType = 'orders'"
                class="flex items-center p-2 space-x-3 text-lg rounded-lg group-hover:bg-gray-300 transition-all duration-200"
              >
                <Icon
                  name="ion:bag-handle-outline"
                  size="24"
                  class="group-hover:scale-110 transform transition-all duration-200"
                />
                <span>Заказы</span>
              </button>
            </li>
            <li v-if="store.client.role === 'admin'" class="group">
              <button
                @click="formType = 'admin'"
                class="flex items-center p-2 space-x-3 text-lg rounded-lg group-hover:bg-gray-300 transition-all duration-200"
              >
                <Icon
                  name="ion:settings-outline"
                  size="24"
                  class="group-hover:scale-110 transform transition-all duration-200"
                />
                <span>Админка</span>
              </button>
            </li>
          </ul>
        </div>
        <!-- Logout Button at Bottom -->
        <button
          @click="logout"
          class="btn btn-error btn-outline mt-auto w-full flex items-center justify-center space-x-2 transition-all duration-200 hover:bg-red-600 text-red-600 hover:text-white"
        >
          <Icon name="ion:exit-outline" size="24" />
          <span>Выйти</span>
        </button>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 bg-gray-50 h-screen max-h-[800px] overflow-y-auto">
        <div
          id="form-section"
          v-if="formType === 'profile'"
          class="flex-1 p-8 bg-gray-50"
        >
          <div
            v-if="alert.show"
            :class="`alert alert-${alert.type} mb-6 shadow-md`"
          >
            {{ alert.message }}
          </div>

          <div v-if="warning" class="alert alert-warning shadow-lg mb-6">
            <div class="flex items-center">
              <Icon name="ion:alert-circle-outline" size="24" class="mr-3" />
              <span>{{ warning }}</span>
            </div>
          </div>

          <!-- Profile Information -->
          <section class="mb-12">
            <div class="mb-6">
              <h2 class="text-3xl font-bold text-gray-900 mb-4">
                Контактные данные
              </h2>
              <p class="text-gray-700">
                Заполните свои контактные данные, чтобы получать актуальные
                рекомендации по продвижению.
              </p>
            </div>
            <div
              class="bg-white p-6 rounded-lg shadow-inner border border-gray-200"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="Почта (email)"
                  class="input input-bordered w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                />
                <input
                  v-model="form.username"
                  type="text"
                  placeholder="Никнейм"
                  class="input input-bordered w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                />
              </div>
              <div class="flex justify-end mt-6">
                <button
                  :disabled="disabledSaveButton"
                  @click="update"
                  class="btn btn-primary w-40 transition-all duration-200 hover:bg-blue-600 hover:shadow-lg rounded-lg"
                >
                  Сохранить
                </button>
              </div>
            </div>
          </section>

          <!-- Password Change -->
          <section>
            <div class="mb-6">
              <h2 class="text-3xl font-bold text-gray-900 mb-4">Пароль</h2>
              <p class="text-gray-700">
                Измените свой пароль для безопасности аккаунта.
              </p>
            </div>
            <div
              class="bg-white p-6 rounded-lg shadow-inner border border-gray-200"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  v-if="store.client.hasPassword"
                  v-model="passwordForm.oldPassword"
                  type="password"
                  placeholder="Старый пароль"
                  class="input input-bordered w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                />
                <input
                  v-model="passwordForm.newPassword"
                  type="password"
                  placeholder="Новый пароль"
                  class="input input-bordered w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                />
              </div>
              <div class="flex justify-end mt-6">
                <button
                  :disabled="disabledChangePasswordButton"
                  @click="updatePassword"
                  class="btn btn-primary w-40 transition-all duration-200 hover:bg-blue-600 hover:shadow-lg rounded-lg"
                >
                  Изменить пароль
                </button>
              </div>
            </div>
          </section>
        </div>

        <div
          v-else-if="formType === 'admin'"
          class="flex flex-col gap-5 flex-1 p-8 bg-gray-50"
        >
          <ProfileAdmin />
        </div>

        <div
          id="form-section"
          v-else-if="formType === 'orders'"
          class="flex flex-col gap-5 flex-1 p-8 bg-gray-50"
        >
          <div
            v-if="!loadingOrders"
            v-for="order in orders"
            :key="order._id"
            class="bg-white border p-6 rounded-lg shadow-lg transform transition hover:scale-105 hover:shadow-xl"
          >
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-gray-700">{{ order.name }}</h2>
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
                {{
                  order.user.username ? order.user.username : 'Не авторизован'
                }}
              </p>
              <p><strong>Email:</strong> {{ order.email }}</p>
              <p>
                <strong>Метод получения:</strong>
                {{ order.pickup ? 'Самовывоз' : 'Доставка' }}
              </p>
              <p><strong>Телефон:</strong> {{ order.phone }}</p>
              <p v-if="!order.pickup">
                <strong>Адрес:</strong> {{ order.address }}
              </p>
              <p>
                <strong>Дата создания:</strong>
                {{ new Date(order.createdDate).toLocaleString() }}
              </p>
            </div>

            <div class="mt-4 space-y-4">
              <h3 class="text-lg font-semibold text-gray-700">Продукты:</h3>
              <ul class="space-y-2">
                <li
                  v-for="product in order.products"
                  :key="product._id"
                  class="p-4 bg-gray-100 rounded-lg"
                >
                  <p class="font-medium text-gray-900">{{ product.name }}</p>
                  <p class="text-gray-700">
                    Описание: {{ product.description }}
                  </p>
                  <p class="text-gray-700">Количество: {{ product.count }}</p>
                  <p class="text-gray-700">Цена: {{ product.price }} ₽</p>
                  <p v-if="product.details.length > 0" class="text-gray-700">
                    <strong>Детали:</strong>
                    <span v-for="detail in product.details" :key="detail.title">
                      {{ detail.title }}: {{ detail.value }}
                    </span>
                  </p>
                  <div v-if="product.cooking.length > 0">
                    <strong class="text-gray-700">Методы приготовления:</strong>
                    <ul class="list-disc list-inside">
                      <li
                        v-for="cook in product.cooking"
                        :key="cook.uuid"
                        class="text-gray-700"
                      >
                        {{ cook.name }} ({{ cook.type }}):
                        {{ cook.composition }} - {{ cook.price }} ₽
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div v-else class="w-full flex justify-center h-full items-center">
            <div
              class="loading loading-spinner loading-lg text-primary flex my-auto"
            ></div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
