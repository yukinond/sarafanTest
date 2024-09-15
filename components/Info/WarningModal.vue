<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = defineProps({
  show: { type: Boolean, required: true },
  question: { type: String, required: true }, 
})

const emit = defineEmits(['closeModal', 'confirm', 'cancel']) // Добавляем события для подтверждения и отмены

const isVisible = ref(props.show)

watch(
  () => props.show,
  (newVal) => {
    isVisible.value = newVal
  }
)

const handleConfirm = () => {
  emit('confirm')
  isVisible.value = false
}

const handleCancel = () => {
  emit('cancel')
  isVisible.value = false
}
</script>

<template>
  <transition name="fade">
    <div
      v-if="isVisible"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm"
      @click="$emit('closeModal')"
    >
      <div
        class="flex flex-col bg-base-100 w-full max-w-md p-4 rounded-lg overflow-y-auto"
        @click.stop
      >
        <!-- Вопрос -->
        <p class="text-lg font-semibold mb-4">{{ question }}</p>

        <!-- Кнопки подтверждения и отмены -->
        <div class="flex justify-end space-x-4">
          <button @click="handleCancel" class="btn btn-primary">Отмена</button>
          <button @click="handleConfirm" class="btn btn-primary">Да</button>
        </div>
      </div>
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
</style>
