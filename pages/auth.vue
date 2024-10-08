<!-- eslint-disable @typescript-eslint/no-use-before-define -->
<script lang="ts" setup>
import { notify } from '@kyvg/vue3-notification';
import { useVuelidate } from '@vuelidate/core'
import { email, helpers, minLength, required } from '@vuelidate/validators'

const store = useMainStore()

onMounted(() => {
  const isPageReloaded = localStorage.getItem('isPageReloaded')

  if (!isPageReloaded) {
    localStorage.setItem('isPageReloaded', 'true')

    window.location.reload()
  }
})

definePageMeta({
  colorMode: 'light',
  auth: {
    unauthenticatedOnly: false,
    navigateAuthenticatedTo: '/buyouts',
  },
  title: 'Вход',
})

const router = useRouter()
const { status, data, signIn, signOut } = useAuth()
const name = useRuntimeConfig().public.NAME
const alert = ref(false)
const alertText = ref('')
const alertType = ref('success')
const loading = ref(false)
const formData = reactive({
  email: '',
  password: '',
})

async function login() {
  v$.value.$validate()
  // if (v$.value.$error)
  //   return

  loading.value = true
  const { error, url } = await signIn('credentials', {
    redirect: false,
    callbackUrl: '/',
    ...formData,
  })
  if (error) {
    alertType.value = 'error'
    if (error === 'Email is not confirmed') {
      alertText.value = 'Подтвердите email для входа'
      alertType.value = 'warning'
    } else if (error == 'Account is banned') {
      alertText.value = 'Аккаунт заблокирован'
      alertType.value = 'warning'
    } else {
      notify({
        text: 'Неверный номер телефона или пароль',
        type: 'warn',
        duration: 3000,
      })
      // alertText.value = 'Неверный номер телефона или пароль'
    }
    alert.value = true
    setTimeout(() => {
      alert.value = false
    }, 3000)
  } else {
    localStorage.removeItem('referralCode')
    store.getClient()
    return navigateTo('/', { external: true })
  }
  loading.value = false
}
onMounted(async () => {
  const params = useRoute().query
  if (params?.emailConfirmed) {
    alertText.value = 'Email успешно подтвержден!'
    setTimeout(() => {
      alert.value = true
    }, 0)
    setTimeout(() => {
      alert.value = false
    }, 3000)
  }
  if (params?.passwordChanged) {
    alertText.value = 'Пароль успешно изменен!'
    setTimeout(() => {
      alert.value = true
    }, 0)
    setTimeout(() => {
      alert.value = false
    }, 3000)
  }
  if (params?.confirmed) {
    alertText.value = 'Письмо для подтверждения было отправлено на указанный email. (Проверьте папку Спам)'
    setTimeout(() => {
      alert.value = true
    }, 0)
    setTimeout(() => {
      alert.value = false
    }, 3000)
  }
})

const passwordShow = ref(false)
const inputType = ref(passwordShow.value ? 'text' : 'password')
const togglePassword = () => {
  passwordShow.value = !passwordShow.value
  inputType.value = passwordShow.value ? 'text' : 'password'
}

const rules = computed(() => {
  return {
    email: {
      required: helpers.withMessage('Введите email или логин', required),
      email: helpers.withMessage('Введите корректный email', email),
    },
    password: {
      required: helpers.withMessage('Введите пароль', required),
      minLength: helpers.withMessage(
        'Пароль должен быть длиннее 6 символов',
        minLength(6)
      ),
    },
  }
})

const v$ = useVuelidate(rules, formData)
</script>

<template>
  <div id="auth" class="flex flex-col items-center justify-center min-h-[calc(60vh)]">
    <!-- <Toast :type="alertType" style="z-index: 1000" :active="alert">
      {{ alertText }}
    </Toast> -->

    <section
      class="flex flex-col justify-center align-center w-full max-w-md lg:max-w-lg rounded-lg p-4 shadow-lg gap-3"
    >
      <h3 class="font-bold text-xl">Войдите в аккаунт</h3>

      <div class="box flex flex-col gap-3">
        <form class="flex flex-col gap-3">
          <div class="flex flex-col gap-1">
            <label>Номер телефона </label>
            <input
              v-model="formData.email"
              placeholder="mail@mail.ru"
              required="true"
              class="input"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label>Пароль </label>
            <div class="flex flex-col gap-0.5">
              <div class="w-full flex">
                <input
                  id="password"
                  v-model="formData.password"
                  :type="inputType"
                  name="password"
                  placeholder="••••••••"
                  required="true"
                  class="input w-full"
                />
                <button type="button" class="hover:text-primary w-1/12" @click="togglePassword">
                  <IconCSS
                    v-if="passwordShow"
                    class="w-20 h-20"
                    size="25"
                    name="mdi:hide-outline"
                  />
                  <IconCSS
                    v-else
                    class="w-20 h-20"
                    size="25"
                    name="mdi:show-outline"
                  />
                </button>
              </div>
              <NuxtLink class="text-primary my-1" href="/resetPassword">
                Забыли пароль?
              </NuxtLink>
            </div>
          </div>

          <div class="flex flex-col gap-0.5">
            <button
              type="submit"
              class="btn btn-primary w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              @click.prevent="login"
            >
              <span v-show="loading" class="loading loading-spinner" />

              Войти
            </button>

            <p class="mt-3 mb-1">
              Ещё не зарегистрированы?
              <NuxtLink href="/register" class="text-primary underline">
                Регистрация
              </NuxtLink>
            </p>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>


<style scoped></style>
