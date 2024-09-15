<script setup lang="ts">
definePageMeta({
  auth: false,
  title: 'О нас',
})

import { notify } from '@kyvg/vue3-notification'
const menuStore = useMenuStore()
</script>

<template>
  <div class="container mx-auto my-auto p-6 max-w-4xl space-y-12">
    <div
      class="bg-white p-6 rounded-lg border border-gray-200 flex items-start space-x-6"
    >
      <img
        src="https://media.istockphoto.com/id/1602458519/photo/colorful-powder-explosion-on-white-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=NBmXVaTxcq0Bw-0jXMlA3_A6cbG4r_WbNMGEECWglmk="
        alt="Описание изображения"
        class="w-1/3 h-auto rounded-lg object-cover"
      />
      <div class="flex-1">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">
          Rikrtop - Открытая кухня
        </h1>
        <p class="text-gray-700 text-base mb-6">
          Мы – команда профессионалов, предоставляющая своим клиентам
          возможность насладиться настоящей кухней. Наше внимание сосредоточено
          на каждом аспекте: от выбора ингредиентов до финального приготовления.
          Открытая кухня – это не просто название, это подход, который
          обеспечивает прозрачность и высокое качество на каждом этапе.
        </p>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg border border-gray-200">
      <h2 class="text-3xl font-bold text-gray-900 mb-6 text-center">Команда</h2>
      <p class="text-gray-700 text-base">
        Коллектив с большим опытом. Мы осуществляем контроль на каждом этапе:
        поставка, хранение, приготовление и доставка раков, креветок и других
        морепродуктов клиенту. Главные приоритеты для нас – это высокое качество
        продукции и обслуживания.
      </p>
    </div>

    <div class="bg-white p-6 rounded-lg border border-gray-200">
      <h2 class="text-3xl font-bold text-gray-900 mb-6 text-center">
        Наши приоритеты
      </h2>
      <p class="text-gray-700 text-base">
        Высокое качество продукции и обслуживание на высшем уровне – вот что
        стоит во главе нашего бизнеса. Мы стремимся предлагать нашим клиентам
        только лучшее, заботясь о каждом этапе, от закупки сырья до его
        доставки.
      </p>
    </div>
  </div>
</template>
