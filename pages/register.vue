<script lang="ts" setup>
import { useVuelidate } from '@vuelidate/core'
import { notify } from '@kyvg/vue3-notification'
import {
  email,
  helpers,
  minLength,
  required,
  sameAs,
} from '@vuelidate/validators'

definePageMeta({
  colorMode: 'light',
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/buyouts',
  },
  title: 'Регистрация',
})

const confirmationCodeInput = ref<any>(null)
const isInnConfirmed = ref(false)
const isInnLoading = ref(false)
const isCodeSent = ref(false)
const isNumberConfirmed = ref(false)
const alert = ref(false)
const alertText = ref('')
const route = useRoute()
const alertType = ref('success')
const referral = ref(route.query?.ref || null)
const { width, height } = useWindowSize()
const linkRef = ref(false)
const formData = reactive({
  email: '',
  password: '',
  confirmPassword: '',
})
const passwordInputType = ref('password')
const passwordConfirmInputType = ref('password')

const referralFromLocal: any = ref('')
// async function linkFollow() {
//   const { data, error }: any = await useFetch('/api/user/linkFollow', {
//     method: 'GET',
//     query: {
//       referral: formData.referral,
//     },
//     watch: false,
//   })
// }

onMounted(async () => {
  // if (route.query?.ref && typeof route.query?.ref === 'string') {
  //   if (route.query?.ref != localStorage.getItem('referralCode')) {
  //     setTimeout(() => {
  //       linkFollow()
  //     })
  //   }
  //   localStorage.setItem('referralCode', route.query?.ref)
  // }
  // referralFromLocal.value = localStorage.getItem('referralCode')
  // formData.referral = referralFromLocal.value
})

const result = ref()
const loading = ref(false)
const rules = computed(() => {
  return {
    email: {
      required: helpers.withMessage('Введите email', required),
      email: helpers.withMessage('Введите корректный email', email),
    },
    password: {
      required: helpers.withMessage('Введите пароль', required),
      minLength: helpers.withMessage(
        'Пароль должен быть длиннее 6 символов',
        minLength(6)
      ),
      containsNumber: helpers.withMessage(
        'Пароль должен содержать цифру',
        (value: string) => /[0-9]/.test(value)
      ),
      englishLetters: helpers.withMessage(
        'Пароль должен состоять из английских букв',
        (value: string) => /(?=.*[a-zA-Z])(?=.*[0-9])/.test(value)
      ),
    },
    confirmPassword: {
      required: helpers.withMessage('Подтвердите пароль', required),
      sameAs: helpers.withMessage(
        'Пароли не совпадают',
        sameAs(formData.password)
      ),
    },
  }
})

const v$ = useVuelidate(rules, formData)

async function submitForm() {
  v$.value.$validate()

  if (!v$.value.$errors.length) {
    loading.value = true
    // if (referralFromLocal.value && referralFromLocal.value.length > 0) {
    //   formData.referral = referralFromLocal.value
    // }
    const { data } = await useFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(formData),
    })
    result.value = data
    loading.value = false
    if (data.value!.status === 'error') {
      alert.value = true
      alertType.value = 'error'
      alertText.value = data.value!.error as string
      useTimeoutFn(() => {
        alert.value = false
      }, 3000)
    } else {
      localStorage.removeItem('referralCode')
      alert.value = true
      alertType.value = 'success'
      alertText.value = 'Пользователь зарегистрирован.'
      useTimeoutFn(() => {
        alert.value = false
        navigateTo('/auth?confirmed=false')
      }, 3000)
    }
    loading.value = false
  }
}

// async function checkInn() {
//   if (formData.orgInn.length < 10) {
//     notify({
//       title: 'ИНН должен содержать 10 цифр',
//     })
//     return
//   }

//   isInnLoading.value = true

//   const { data, error }: any = await useFetch('/api/organization/checkInn', {
//     method: 'GET',
//     query: {
//       inn: formData.orgInn,
//       phoneNumber: formData.phoneNumber.replace(/[\(\)\-\s]/g, ''),
//     },
//     watch: false,
//   })

//   if (error.value) {
//     notify({
//       title: 'Что-то пошло не так',
//       text: 'Данные не получены',
//     })
//   }

//   if (data.value) {
//     if (data.value.status === 'error') {
//       notify({
//         title: 'Что-то пошло не так',
//         text: data.value.error,
//       })
//       isInnLoading.value = false
//       return
//     }

//     isInnConfirmed.value = true
//     formData.orgKey = data.value.orgKey
//     formData.orgName = data.value.orgName
//     formData.orgOgrn = data.value.orgOgrn
//     formData.orgInn = data.value.orgInn
//     formData.name = data.value.name
//     formData.lastname = data.value.lastname
//     formData.middleName = data.value.middleName
//   }

//   isInnLoading.value = false
// }

function clearFormData() {
  isInnConfirmed.value = false
  // formData.orgInn = ''
  // formData.orgKey = ''
  // formData.orgName = ''
  // formData.orgOgrn = ''
}

// async function sendConfirmCode() {
//   if (formData.phoneNumber.replace(/[\(\)\-\s]/g, '').length < 11) {
//     notify({
//       title: 'Введите корректный номер',
//     })
//     return
//   }

//   if (timerRunning.value) {
//     notify({
//       title: `Следующая попытка будет доступна через ${timer.value} сек.`,
//     })
//     return
//   }
//   timer.value = 60
//   timerFinished.value = false
//   startTimer()

//   const { data, error }: any = await useFetch(
//     '/api/organization/confirmPhone',
//     {
//       method: 'POST',
//       body: {
//         phoneNumber: formData.phoneNumber.replace(/[\(\)\-\s]/g, ''),
//       },
//       watch: false,
//     }
//   )

//   if (data.value.status == 'ok') {
//     isCodeSent.value = true
//     confirmationCodeInput.value.focus()
//     notify({
//       type: 'success',
//       title: 'Код отправлен',
//     })
//   } else {
//     notify({
//       type: 'error',
//       title: data.value.message,
//     })
//   }
// }

// async function confirmCode() {
//   const { data, error }: any = await useFetch(
//     '/api/organization/confirmPhone',
//     {
//       method: 'GET',
//       params: {
//         phoneNumber: formData.phoneNumber.replace(/[\(\)\-\s]/g, ''),
//         code: formData.verificationCode,
//       },
//       watch: false,
//     }
//   )
//   if (data.value) {
//     notify({
//       type: 'success',
//       title: 'Код подтвержден',
//     })

//     isCodeSent.value = false
//     isNumberConfirmed.value = true
//   } else {
//     notify({
//       type: 'error',
//       title: 'Неверный код',
//     })
//   }
// }

const timer = ref(60)
const timerRunning = ref(false)
const timerVisible = ref(false)
const timerFinished = ref(false)

let interval: any

const startTimer = () => {
  timerRunning.value = true
  timerVisible.value = true
  interval = setInterval(() => {
    if (timer.value > 0) {
      timer.value--
    } else {
      clearInterval(interval)
      timerRunning.value = false
      timerFinished.value = true
      timer.value = 60
    }
  }, 1000)
}

const resend = () => {
  timer.value = 60
  timerFinished.value = false
  startTimer()
}

const togglePassword = () => {
  passwordInputType.value =
    passwordInputType.value === 'password' ? 'text' : 'password'
}
const toggleConfirmPassword = () => {
  passwordConfirmInputType.value =
    passwordConfirmInputType.value === 'password' ? 'text' : 'password'
}
</script>

<template>
  <Toast :type="alertType" style="z-index: 1000" :active="alert">
    {{ alertText }}
  </Toast>
  <div
    id="auth"
    class="flex sm:items-center sm:justify-center overflow-y-auto max-h-screen"
  >
    <section
      class="flex flex-col justify-center align-center w-full max-w-lg rounded-lg p-2 shadow-lg drop-shadow-lg gap-3 mt-20 mx-auto my-20"
    >
      <h3 class="font-bold text-xl mt-5 mx-auto">Создать аккаунт</h3>
      <div class="px-5 pb-2">
        <div class="relative">
          <div>
            <label for="email" class="block mb-2 ml-1 my-1 text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              name="email"
              class="input w-full"
              :class="{
                'input-error': v$.email.$error,
              }"
              @input="v$.email.$touch"
              placeholder="name@company.com"
              required="true"
            />

            <div
              v-for="error of v$.email.$errors"
              :key="error.$uid"
              class="input-errors text-sm text-error mt-1 flex justify-end absolute r-0 w-full"
            >
              <!-- <div class="error-msg">
                {{ error.$message }}
              </div> -->
            </div>
          </div>
          <div>
            <label
              for="password"
              class="block ml-1 mb-2 my-1text-sm font-medium"
              >Пароль
            </label>
            <div class="flex relative">
              <input
                id="password"
                v-model="formData.password"
                :type="passwordInputType"
                name="password"
                placeholder="••••••••"
                class="input w-full"
                :class="{
                  'input-error': v$.password.$error,
                }"
                required="true"
                @change="v$.password.$touch"
              />
              <button
                type="button"
                class="absolute right-0 -top-1 xl:top-1 mt-2 mr-2 hover:text-primary disabled:text-black"
                @click="togglePassword"
              >
                <IconCSS
                  v-if="passwordInputType === 'password'"
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

            <div
              class="input-errors text-sm text-error mt-1 flex justify-end absolute r-0 w-full"
            >
              {{ v$.password?.$errors[0]?.$message }}
            </div>
          </div>
          <div class="pb-0">
            <label
              for="confirm-password"
              class="block ml-1 mb-2 my-1 text-sm font-medium"
              >Повторите пароль
            </label>
            <div class="flex relative">
              <input
                id="confirm-password"
                v-model="formData.confirmPassword"
                :type="passwordConfirmInputType"
                name="confirm-password"
                placeholder="••••••••"
                class="input w-full"
                :class="{
                  'input-error': v$.confirmPassword.$error,
                }"
                required="true"
                @change="v$.confirmPassword.$touch"
              />
              <button
                type="button"
                class="absolute right-0 -top-1 xl:top-1 mt-2 mr-2 hover:text-primary disabled:text-black"
                @click="toggleConfirmPassword"
              >
                <IconCSS
                  v-if="passwordConfirmInputType === 'password'"
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
            <div
              v-if="v$.confirmPassword.$errors"
              class="input-errors text-sm text-error mt-1 flex justify-end absolute r-0 w-full"
            >
              <div class="error-msg">
                {{ v$.confirmPassword?.$errors[0]?.$message }}
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-0.5">
          <button
            :disabled="
              !formData.email || !formData.password || !formData.confirmPassword
            "
            class="btn btn-block btn-primary bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 mt-6"
            @click="submitForm"
          >
            <span v-show="loading" class="loading loading-spinner" />
            Зарегистрироваться
          </button>
          <p class="login mt-2">
            Уже есть аккаунт?
            <NuxtLink href="/auth" class="text-primary">
              <span class="underline">Войти</span>
            </NuxtLink>
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped></style>
