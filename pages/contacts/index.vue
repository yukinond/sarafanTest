<script setup lang="ts">
definePageMeta({
  auth: false,
  title: 'О нас',
})

import { notify } from '@kyvg/vue3-notification'
const menuStore = useMenuStore()
</script>

<template>
  <div class="container mx-auto p-6 max-w-4xl space-y-12">
    

    <div class="bg-white p-6 rounded-lg border border-gray-200">
      <h2 class="text-3xl font-bold text-gray-900 mb-6 text-center">
        Контактные данные
      </h2>
      <div class="space-y-6">
        <div class="flex items-start space-x-4">
          <svg
            class="w-6 h-6 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 11.5a3.5 3.5 0 00-7 0v1.5a3.5 3.5 0 007 0v-1.5zM12 3v1.5M6.65 5.75A7.001 7.001 0 0012 11a7.001 7.001 0 005.35-5.25M12 21V19.5M5 11.5a7.001 7.001 0 017-7 7.001 7.001 0 017 7M5 16.5V19.5M19 16.5v3"
            />
          </svg>
          <div>
            <h2 class="text-xl font-semibold text-gray-800 mb-1">
              Юридический адрес
            </h2>
            <p class="text-gray-700 text-sm">
              452684, Башкортостан Респ, Нефтекамск г, ул. Дорожная д.17А кв.62
            </p>
          </div>
        </div>

        <div class="flex items-start space-x-4">
          <svg
            class="w-6 h-6 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 11V7a4 4 0 00-4-4H9a4 4 0 00-4 4v4m0 0v5a4 4 0 004 4h6a4 4 0 004-4v-5zM9 16v1.5m6-1.5V16"
            />
          </svg>
          <div>
            <h2 class="text-xl font-semibold text-gray-800 mb-1">
              Фактический адрес
            </h2>
            <p class="text-gray-700 text-sm">
              420124, РТ, г. Казань, Ново-Савиновский район, ул. Меридианная,
              10А
            </p>
          </div>
        </div>

        <!-- Контактный телефон -->
        <div class="flex items-start space-x-4">
          <svg
            class="w-6 h-6 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM12 15l3-3m0 0l-3-3m3 3H9"
            />
          </svg>
          <div>
            <h2 class="text-xl font-semibold text-gray-800 mb-1">
              Контактный телефон
            </h2>
            <p class="text-gray-700 text-sm">+7 (843) 215 99 88; +7 (987) 215 99 88 </p>
          </div>
        </div>

        <div class="flex items-start space-x-4">
          <svg
            class="w-6 h-6 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 7l9 6 9-6M4 5h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2z"
            />
          </svg>
          <div>
            <h2 class="text-xl font-semibold text-gray-800 mb-1">
              Адрес электронной почты
            </h2>
            <p class="text-gray-700 text-sm">rikrtop@inbox.ru</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
