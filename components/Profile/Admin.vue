<script setup lang="ts">
import { notify } from '@kyvg/vue3-notification'

const isAdminView = ref(true)
const users = ref<any[]>([])
const admins = ref<any[]>([])
const selectedUser = ref<any>(null)
async function fetchData() {
  try {
    const { data } = await useFetch('/api/user/getAll', {
      method: 'GET',
      watch: false,
    })
    users.value = data.value?.data.clients || []
    admins.value = data.value?.data.admins || []
  } catch (error) {
    console.error(error)
  }
}
fetchData()

function handleEdit(user: any) {
  selectedUser.value = { ...user }
  selectedUser.value.password = ''
}

async function saveUser() {
  if (selectedUser.value) {
    const { data, error } = await useFetch('/api/user/update', {
      method: 'POST',
      body: selectedUser.value,
    })

    if (error.value) {
      notify({ type: 'error', text: 'Ошибка при сохранении данных.' })
    } else {
      notify({ type: 'success', text: 'Данные успешно сохранены.' })
      fetchData()
      selectedUser.value = null
    }
  }
}
</script>

<template>
  <div class="min-h-screen">
    <div class="flex gap-5 mb-6">
      <button
        @click="isAdminView = true"
        class="btn btn-ghost text-black"
        :class="{ 'btn-active': isAdminView }"
      >
        Админы
      </button>
      <button
        @click="isAdminView = false"
        class="btn btn-ghost text-black"
        :class="{ 'btn-active': !isAdminView }"
      >
        Пользователи
      </button>
    </div>

    <!-- Админы -->
    <div v-if="isAdminView">
      <h1 class="text-2xl font-bold mb-4">Админы</h1>
      <table class="w-full bg-white shadow rounded-lg">
        <thead>
          <tr>
            <th class="p-4">Имя</th>
            <th class="p-4">Email</th>
            <th class="p-4">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="admin in admins" :key="admin.uuid">
            <td class="p-4">{{ admin.username }}</td>
            <td class="p-4">{{ admin.email }}</td>
            <td class="p-4">
              <button @click="handleEdit(admin)" class="btn btn-primary">
                Редактировать
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Пользователи -->
    <div v-else>
      <h1 class="text-2xl font-bold mb-4">Пользователи</h1>
      <table class="w-full bg-white shadow rounded-lg">
        <thead>
          <tr>
            <th class="p-4">Имя</th>
            <th class="p-4">Email</th>
            <th class="p-4">Дата регистрации</th>
            <th class="p-4">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.uuid">
            <td class="p-4">{{ user.username }}</td>
            <td class="p-4">{{ user.email }}</td>
            <td class="p-4">
              {{ new Date(user.registrationDate).toLocaleDateString() }}
            </td>
            <td class="p-4">
              <button @click="handleEdit(user)" class="btn btn-primary">
                Редактировать
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Форма редактирования пользователя -->
    <div v-if="selectedUser" class="mt-8 bg-white p-6 shadow rounded-lg">
      <h2 class="text-xl font-bold mb-4">Редактировать пользователя</h2>
      <div class="mb-4">
        <label for="username" class="block text-gray-700">Имя</label>
        <input
          v-model="selectedUser.username"
          id="username"
          type="text"
          class="input"
        />
      </div>
      <div class="mb-4">
        <label for="email" class="block text-gray-700">Email</label>
        <input
          v-model="selectedUser.email"
          id="email"
          type="email"
          class="input"
        />
      </div>
      <div class="mb-4">
        <label for="role" class="block text-gray-700">Роль</label>
        <div class="flex items-center">
          <input
            type="radio"
            id="isAdmin"
            v-model="selectedUser.role"
            value="admin"
            class="mr-2"
          />
          <label for="isAdmin" class="text-gray-700">Админ</label>
        </div>
        <div class="flex items-center">
          <input
            type="radio"
            id="isUser"
            v-model="selectedUser.role"
            value="user"
            class="mr-2"
          />
          <label for="isUser" class="text-gray-700">Пользователь</label>
        </div>
      </div>

      <div class="mb-4">
        <label for="password" class="block text-gray-700">Пароль</label>
        <input
          v-model="selectedUser.password"
          id="password"
          type="password"
          placeholder="Новый пароль"
          class="input"
        />
      </div>
      <button @click="saveUser" class="btn btn-primary">Сохранить</button>
      <button @click="selectedUser = null" class="btn btn-secondary ml-4">
        Отмена
      </button>
    </div>
  </div>
</template>

<style scoped></style>
