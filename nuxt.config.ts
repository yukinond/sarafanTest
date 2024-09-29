// https://nuxt.com/docs/api/configuration/nuxt-config

const baseUrl = '/'
const description =
  'Повысьте репутацию и продажи на маркетплейсах с MarketMonstr.'

export default defineNuxtConfig({
  app: {
    baseURL: baseUrl,
    head: {
      viewport: 'width=device-width,initial-scale=1',
      title:
        'Сервис самовыкупов MARKETMONSTR - Максимизируйте продвижение на МП',
      link: [{ rel: 'icon', href: '/favicon.png' }],
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          'http-equiv': 'Content-Security-Policy',
          content: 'upgrade-insecure-requests',
        },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: description },
        {
          name: 'apple-mobile-web-app-status-bar-style',
          content: 'black-translucent',
        },
        { name: 'yandex-verification', content: '8b9387e0d0a4e1a8' },
      ],
    },
  },

  colorMode: {
    preference: 'light',
    dataValue: 'theme',
    classSuffix: '',
  },

  auth: {
    origin: process.env.PUBLIC_SITE_URL || 'https://app.wbmp.pro',
    enableGlobalAppMiddleware: true,
    defaultProvider: 'credentials',
  },

  image: {
    domains: [
      'wb.ru',
      'storage.yandexcloud.net',
      'basket-10.wb.ru',
      'basket-1.wb.ru',
      'basket-2.wb.ru',
      'basket-3.wb.ru',
      'basket-4.wb.ru',
      'basket-5.wb.ru',
      'basket-6.wb.ru',
      'basket-7.wb.ru',
    ],
  },

  yandexMetrika: {
    id: '95774883',
  },
  gtag: {
    id: 'G-3CZQZ6GGTK',
  },

  lazyLoad: {
    // These are the default values
    images: true,
    videos: true,
    audios: true,
    iframes: true,
    native: false,
    directiveOnly: false,

    // To remove class set value to false
    loadingClass: 'isLoading',
    loadedClass: 'isLoaded',
    appendClass: 'lazyLoad',

    observerConfig: {
      // See IntersectionObserver documentation
    },
  },

  nitro: {
    compressPublicAssets: true,
    prerender: {
      crawlLinks: false,
      routes: [],
      ignore: ['/'],
    },
    plugins: ['~/server/index.ts'],
  },

  modules: [
    'nuxt-lazy-load',
    '@nuxtjs/tailwindcss',
    '@nuxt/image-edge',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    'nuxt-icon',
    '@sidebase/nuxt-auth',
    '@vueuse/nuxt',
    'nuxt-security',
    '@nuxtjs/color-mode',
    '@bg-dev/nuxt-s3',
    '@nuxtjs/fontaine',
    '@sfxcode/nuxt-primevue',
    '@nuxtjs/robots',
    '@morev/vue-transitions/nuxt',
    '@sidebase/nuxt-pdf',
    '@artmizu/yandex-metrika-nuxt',
    'nuxt-gtag',
    '@nuxt/fonts',
  ],

  icon: {
    sources: [
      {
        src: '~/assets/icons',
        prefix: 'custom', // Префикс для кастомных иконок
      },
    ],
  },

  css: [
    'primevue/resources/primevue.css',
    'primeicons/primeicons.css',
    '@vuepic/vue-datepicker/dist/main.css',
  ],

  extends: ['nuxt-seo-kit'],

  s3: {
    client: {
      credentials: {
        secretAccessKey: process.env.VK_SECRET_KEY || '',
        accessKeyId: process.env.VK_ACCESS_KEY || '',
      },
      endpoint: 'https://hb.vkcs.cloud/menuImages/',
      region: 'ru-msk',
    },
    publicBucketUrl: `${process.env.PUBLIC_SITE_URL}/images/get/`,
    bucket: 'photodlablyatskogosaita',
    image: {
      compression: {
        maxSizeMB: 10,
        maxWidthOrHeight: 4000,
      },
    },
  },
  hooks: {
    close: () => {
      process.exit()
    },
  },
  build: {
    transpile: ['primevue', '@vuepic/vue-datepicker'],
  },

  primevue: {
    components: {
      include: [
        'DataTable',
        'Column',
        'Chips',
        'MultiSelect',
        'Button',
        'DataView',
      ],
    },
  },

  imports: {
    dirs: ['./stores', './data', './server/lib'],
  },

  runtimeConfig: {
    public: {
      siteName: process.env.NAME,
      BOT_ID: process.env.BOT_ID,
      siteUrl: process.env.PUBLIC_SITE_URL,
      language: 'ru',
      trailingSlash: true,
      BOT_LOGIN: process.env.BOT_LOGIN,
      DOMAIN_API_IMAGES_URL: process.env.DOMAIN_API_IMAGES_URL,
      YANDEX_MAPS_API_KEY: process.env.YANDEX_MAPS_API_KEY,
    },
    VK_ACCESS_KEY: process.env.VK_ACCESS_KEY,
    VK_SECRET_KEY: process.env.VK_SECRET_KEY,
    env: process.env.ENV_WORK,
    indexable: true,
    MONGODB_URI: process.env.MONGODB_URI,
    SECRET: process.env.SECRET,
    smtpHost: process.env.smtpHost,
    smtpPort: process.env.smtpPort,
    smtpUser: process.env.smtpUser,
    smtpPass: process.env.smtpPass,
    privateKey: process.env.privateKey,
    PUBLIC_SITE_URL: process.env.PUBLIC_SITE_URL,
  },

  security: {
    rateLimiter: {
      tokensPerInterval: 200,
      interval: 'hour',
      fireImmediately: false,
    },
    headers: false,
    xssValidator: false,
  },

  devtools: {
    enabled: true,
  },
  experimental: {
    payloadExtraction: false,
    inlineSSRStyles: false,
    renderJsonPayloads: true,
    typedPages: true,
  },
})
