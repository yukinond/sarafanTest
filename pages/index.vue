<script lang="ts" setup>
definePageMeta({
  auth: false,
})

import { navbarDataList } from '~/data/navbar/navbarData'

function toggleDetails(event: Event) {
  const details = event.target as HTMLDetailsElement
  const answer = details.querySelector('.answer') as HTMLElement

  if (details.open) {
    answer.style.maxHeight = answer.scrollHeight + 'px'
    answer.style.transition = 'max-height 0.5s ease, opacity 0.5s ease'
    requestAnimationFrame(() => {
      answer.style.opacity = '1'
      answer.style.maxHeight = '100vh' // Ограничиваем рост до полной высоты экрана
    })
  } else {
    answer.style.transition = 'max-height 0.5s ease, opacity 0.5s ease'
    answer.style.opacity = '0'
    answer.style.maxHeight = '0'
  }
}
const currentSlide = ref(1)

function nextSlide() {
  currentSlide.value = currentSlide.value === 2 ? 1 : currentSlide.value + 1
}

function prevSlide() {
  currentSlide.value = currentSlide.value === 1 ? 2 : currentSlide.value - 1
}
</script>

<template>
  <div class="flex flex-col gap-10 overflow-auto ">
    <!-- Слайдер -->
    <div class="carousel w-full overflow-hidden relative">
      <div
        :class="['carousel-item', { active: currentSlide === 1 }]"
        class="relative w-full transition-all duration-500 ease-in-out"
      >
        <img
          src="https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp"
          class="w-full"
        />
      </div>
      <div
        :class="['carousel-item', { active: currentSlide === 2 }]"
        class="relative w-full transition-all duration-500 ease-in-out"
      >
        <img
          src="https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.webp"
          class="w-full"
        />
      </div>
      <div
        class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between"
      >
        <a @click="prevSlide" class="btn btn-circle">❮</a>
        <a @click="nextSlide" class="btn btn-circle">❯</a>
      </div>
    </div>
    <!-- <div class="flex justify-center items-center mx-auto w-full bg-base-200">
      <div class="flex justify-between w-full md:w-1/2">
        <div class="flex flex-col items-center text-center p-4 gap-4 scale-90">
          <Icon
            class="text-base-300 mt-3"
            name="material-symbols:check-circle-outline"
            size="30"
          />
          <span class="font-semibold text-sm">Lorem ipsum dolor sit amet.</span>
          <span class="text-xs"
            >Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit
            quidem labore, tempore modi magnam quasi.</span
          >
        </div>
        <div class="flex flex-col items-center text-center p-4 gap-4 scale-90">
          <Icon
            class="text-base-300 mt-3"
            name="material-symbols:check-circle-outline"
            size="30"
          />
          <span class="font-semibold text-sm">Lorem ipsum dolor sit amet.</span>
          <span class="text-xs"
            >Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit
            quidem labore, tempore modi magnam quasi.</span
          >
        </div>
        <div class="flex flex-col items-center text-center p-4 gap-4 scale-90">
          <Icon
            class="text-base-300 mt-3"
            name="material-symbols:check-circle-outline"
            size="30"
          />
          <span class="font-semibold text-sm">Lorem ipsum dolor sit amet.</span>
          <span class="text-xs"
            >Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit
            quidem labore, tempore modi magnam quasi.</span
          >
        </div>
      </div>
    </div> -->
    <div class="bg-base-200 p-10">
      <h2 class="text-center text-2xl font-bold mb-6">Красный краб</h2>
      <ul
        class="grid grid-cols-2 md:grid-cols-4 max-w-[70%] mx-auto justify-center flex-wrap"
      >
        <NuxtLink
          v-for="navbar in navbarDataList"
          :to="'/menu' + navbar.path"
          class="cursor-pointer p-2 border-b-2 border-transparent hover:border-primary text-center flex flex-col"
        >
          <nuxt-img
            class="w-32 h-32 rounded-xl object-cover flex mx-auto"
            :src="navbar.image"
            alt="settings"
          />
          <span>{{ navbar.title }}</span>
        </NuxtLink>
      </ul>
    </div>

    <!-- Описание с картинкой во флексе -->
    <div class="flex flex-col md:flex-row items-center bg-base-100 p-10">
      <div class="w-full md:w-1/2">
        <img
          src="https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.webp"
          alt="Описание"
          class="rounded-lg shadow-lg"
        />
      </div>
      <div class="w-full md:w-1/2 mt-6 md:mt-0 md:pl-10">
        <h3 class="text-3xl font-bold">Описание нашего заведения</h3>
        <p class="mt-4 text-lg">
          Мы предлагаем широкий ассортимент блюд, которые готовятся из свежих
          продуктов. Наши шеф-повара вкладывают душу в каждое блюдо, чтобы вы
          могли насладиться незабываемыми вкусами.
        </p>
      </div>
    </div>

    <!-- Отображение блюд двух разных типов в колонке -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-10 p-10 bg-base-200">
      <div class="flex flex-col bg-base-100 p-6 rounded-lg shadow-lg">
        <h4 class="text-2xl font-bold mb-4">Популярные завтраки</h4>
        <ul class="space-y-2">
          <li>Омлет с сыром</li>
          <li>Французские тосты</li>
          <li>Каша с ягодами</li>
          <li>Панкейки с сиропом</li>
        </ul>
      </div>
      <div class="flex flex-col bg-base-100 p-6 rounded-lg shadow-lg">
        <h4 class="text-2xl font-bold mb-4">Популярные ужины</h4>
        <ul class="space-y-2">
          <li>Стейк с картофелем</li>
          <li>Паста с морепродуктами</li>
          <li>Салат "Цезарь"</li>
          <li>Лазанья</li>
        </ul>
      </div>
    </div>

    <!-- Часто задаваемые вопросы -->
    <div class="bg-base-100 p-10">
      <h2 class="text-center text-2xl font-bold mb-6">
        Часто задаваемые вопросы
      </h2>
      <div class="space-y-4">
        <details
          class="bg-base-200 p-4 rounded-lg transition-all duration-300"
          @toggle="toggleDetails($event)"
        >
          <summary
            class="cursor-pointer font-semibold flex justify-between items-center"
          >
            Как сделать заказ?
            <span class="summary-icon">+</span>
          </summary>
          <p
            class="answer max-h-0 opacity-0 overflow-hidden transition-all duration-300 mt-2"
          >
            Вы можете сделать заказ через наш сайт или позвонить по телефону.
          </p>
        </details>
        <details
          class="bg-base-200 p-4 rounded-lg transition-all duration-300"
          @toggle="toggleDetails($event)"
        >
          <summary
            class="cursor-pointer font-semibold flex justify-between items-center"
          >
            Какие способы оплаты вы принимаете?
            <span class="summary-icon">+</span>
          </summary>
          <p
            class="answer max-h-0 opacity-0 overflow-hidden transition-all duration-300 mt-2"
          >
            Мы принимаем наличные, карты и онлайн-платежи.
          </p>
        </details>
        <details
          class="bg-base-200 p-4 rounded-lg transition-all duration-300"
          @toggle="toggleDetails($event)"
        >
          <summary
            class="cursor-pointer font-semibold flex justify-between items-center"
          >
            Можно ли изменить заказ после оформления?
            <span class="summary-icon">+</span>
          </summary>
          <p
            class="answer max-h-0 opacity-0 overflow-hidden transition-all duration-300 mt-2"
          >
            Да, вы можете изменить заказ, связавшись с нами до начала
            приготовления.
          </p>
        </details>
        <details
          class="bg-base-200 p-4 rounded-lg transition-all duration-300"
          @toggle="toggleDetails($event)"
        >
          <summary
            class="cursor-pointer font-semibold flex justify-between items-center"
          >
            Есть ли у вас вегетарианские блюда?
            <span class="summary-icon">+</span>
          </summary>
          <p
            class="answer max-h-0 opacity-0 overflow-hidden transition-all duration-300 mt-2"
          >
            Да, у нас есть широкий выбор вегетарианских блюд.
          </p>
        </details>
      </div>
    </div>
  </div>
</template>

<style scoped>
.carousel-item {
  opacity: 0;
  transform: translateX(100%);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.carousel-item.active {
  opacity: 1;
  transform: translateX(0);
  position: relative;
}

.carousel-item:not(.active) {
  transform: translateX(-100%);
}

details[open] .summary-icon {
  content: '-';
  transform: rotate(45deg);
  transition: transform 0.3s ease;
}

details:not([open]) .summary-icon {
  content: '+';
  transform: rotate(0deg);
  transition: transform 0.3s ease;
}

.answer {
  transition: opacity 0.5s ease, max-height 0.5s ease;
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}



</style>
