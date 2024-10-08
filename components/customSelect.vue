<script setup lang="ts">
import { notify } from '@kyvg/vue3-notification'

const route = useRoute()

interface tabs {
  title: string
  value: string | number
}
interface links {
  title: string
  value?: string | undefined
  slot?: string | undefined
  query?: string | undefined
}

const props = defineProps({
  rangesConfig: {
    type: Array as PropType<Array<string>>,
    default: () => [],
  },
  tabs: {
    type: Array as PropType<Array<tabs>>,
    default: () => [],
  },
  category: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  links: { type: Array as PropType<links[]>, default: () => [] },
  class: { type: String },
  dropdownContainer: { type: String },
  statusText: { type: String },
  // modelValue: {

  // }
})

const reactiveStatusText = toRef(props, 'statusText')

const customClass = props.class || ''

const emit = defineEmits(['changeText', 'changeValue'])

const dropdownOpened = ref<boolean>(false)

const handleBodyClick = (event: MouseEvent) => {
  const dropdown = document.querySelector('.dropdown')
  if (dropdown && !dropdown.contains(event.target as Node)) {
    dropdownOpened.value = false
  }
}

const statusText = ref<String>(
  props.statusText ? props.statusText : (
  reactiveStatusText.value
    ? reactiveStatusText.value
    : props.category
    ? 'Выберите категорию'
    : props.rangesConfig[0] || props.tabs[0]?.title || props.links[0]?.title
  )
)
watch(
  () => reactiveStatusText.value,
  (newVal) => {
    statusText.value = newVal
  }
)

function updateText(filter: string) {
  statusText.value = filter

  emit('changeText', filter)
}

function updateValue(filter: any) {
  statusText.value = filter.title
  emit('changeValue', filter)
}

onMounted(() => {
  document.body.addEventListener('click', handleBodyClick)
})

onUnmounted(() => {
  document.body.removeEventListener('click', handleBodyClick)
})

defineExpose({
  updateText,
  updateValue,
})
</script>

<template>
  <div
    class="dropdown group relative"
    @click="dropdownOpened = !dropdownOpened"
    @click.stop
    :class="dropdownContainer"
  >
    <div
      class="font-normal text-xs normal-case btn-primary bg-red-300 hover:bg-red-600 hover:text-white dark:bg-primary dark:bg-opacity-20 border-none text-base-content btn btn-sm flex items-center justify-between px-2 flex-nowrap"
      :class="customClass"
    >
      <span :class="{ 'text-base': rangesConfig.length > 0 }">{{
        reactiveStatusText ? reactiveStatusText : statusText
      }}</span>
      <Icon v-if="dropdownOpened" name="formkit:up" size="18" />
      <Icon v-else name="formkit:down" size="18" />
    </div>
    <ul
      v-if="dropdownOpened"
      class="absolute shadow-md z-[1] bg-base-100 rounded-lg mt-2 w-full flex flex-col gap-y-0.5 max-h-[300px] overflow-y-auto overflow-x-hidden"
    >
      <li
        v-if="rangesConfig.length > 0"
        v-for="filter in rangesConfig"
        :key="filter"
      >
        <button
          class="btn btn-ghost btn-sm h-[2rem] normal-case font-normal w-full py-0 text-base whitespace-normal leading-none hover:bg-primary hover:bg-opacity-20 items-center justify-start"
          @click="updateText(filter)"
        >
          {{ filter }}
        </button>
      </li>
      <li v-if="tabs.length > 0" v-for="filter in tabs" :key="filter.title"
      >
        <button
          class="btn btn-ghost btn-xs h-[2rem] text-xs text-left normal-case font-normal w-full leading-none hover:bg-primary hover:bg-opacity-20 items-center justify-start"
          :class="{
            'bg-red-300 dark:bg-primary dark:bg-opacity-20 ':
            filter.title == statusText,
          }"  
          @click="updateValue(filter)"
        >
          {{ filter.title }}
        </button>
      </li>
      <li v-for="filter in links" @click="updateText(filter.title)">
        <NuxtLink
          :to="(filter.slot ? filter.slot : '/' + filter.value) + (filter.query ? filter.query : '')"
          :external="false"
          class="btn btn-ghost btn-xs h-[2rem] text-xs normal-case font-normal w-full leading-none hover:bg-primary hover:bg-opacity-20 items-center justify-start text-left"
          :class="{
            'bg-red-300 dark:bg-primary dark:bg-opacity-20':
            filter.title == statusText,
          }"
        >
          <span>
            {{ filter.title }}
          </span>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>


<style scoped></style>
