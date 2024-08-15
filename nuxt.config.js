const AUTH_MODULE_URL = process.env.NODE_ENV !== "production"
  ? "http://localhost:2999/login/?redirect="
  : process.env.AUTH_REDIRECT_URL;

const ACCOUNT_APP_URL = process.env.NODE_ENV !== "production"
  ? "http://localhost:2999"
  : process.env.BIB_ACCOUNT_URL;


import i18n from "./config/i18n";

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Nuxt target
  target: "static",

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: "BIB User Account",
    meta: [{ charset: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1" }, { hid: "description", name: "description", content: "" }],
    link: [
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;700&display=swap" },
      { rel: 'icon', type: 'image/png', href: '/img/icon.png' },
    ],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  styleResources: {
    scss: [
      "~/node_modules/@bizinbox/bib-ui-lib/dist/utilities.scss",
      "@/assets/style/global.scss"
    ],
  },

  // Progress Bar
  loading: false,

  //loadingIndicator
  loadingIndicator: {
    color: '#0741A3',
    background: 'white'
  },

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: "@/node_modules/@bizinbox/bib-ui-lib/dist/plugins/GoogleTagManager", mode: "client" },
    { src: "@/node_modules/@bizinbox/bib-ui-lib/dist/plugins/MobileEventsEmitter", mode: "client" },
    { src: "@/plugins/bib-ui-lib", mode: "client" },
    { src: "@/plugins/account", mode: "client" },
    { src: "@/plugins/clickOutside", mode: "client" },
    { src: "@/plugins/tooltip", mode: "client" },
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: [
    { path: "~/components/", pathPrefix: false },
    // { path: "~/../bib-shared/components/", pathPrefix: false },
  ],

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    "@nuxtjs/style-resources",
    "nuxt-i18n",
    "@nuxtjs/moment",
    "@nuxtjs/axios",
    "cookie-universal-nuxt",
  ],

  i18n: {
    vueI18nLoader: true,
    detectBrowserLanguage: {
      cookieKey: process.env.LANG_COOKIE_NAME,
      cookieDomain: ".business-in-a-box.com",
      // cookieDomain: "", // For local development
    },
    locales: [
      {
        code: "en",
        name: "English",
      },
      {
        code: "fr",
        name: "Français",
      },
      {
        code: "it",
        name: "Italiano",
      },
      {
        code: "es",
        name: "Español",
      },
      {
        code: "pt",
        name: "Português",
      },
      {
        code: "de",
        name: "Deutsch",
      },
    ],
    strategy: 'no_prefix',
    vueI18n: i18n,
  },

  // routeguard midleware --------
  router: {
    middleware: "routeguard",
  },

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    "cookie-universal-nuxt",
  ],

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    extend(config, { loaders }) {
      loaders.scss.additionalData = '@use "sass:math";';
    },
  },

  vue: {
    config: {
      silent: false,
      productionTip: false,
      devtools: true,
    },
  },

  server: {
    port: 2999,
  },

  dev: process.env.NODE_ENV !== "production",

  env: {
    authModule: AUTH_MODULE_URL,
    AppAccont: ACCOUNT_APP_URL,
    ACCOUNT_API_ENDPOINT: process.env.ACCOUNT_API_ENDPOINT,
    DEV_CORE_ENDPOINT: process.env.DEV_CORE_ENDPOINT,
    AppTemplate: process.env.BIB_TEMPLATES_APP_URL,
    AppDrive: process.env.BIB_DRIVE_URL,
    AppSign: process.env.BIB_ESIGN_APP_URL,
    AppProject: process.env.BIB_PROJECT_APP_URL,
    AppChat: process.env.BIB_CHAT_APP_URL,
    AppEditor: process.env.WEB_EDITOR_APP_URL,
    AppVideo: process.env.VIDEO_CONF_APP_URL,
    AppSheets: process.env.WEB_SHEET_EDITOR_APP_URL,
    BackEnd_API_URL: process.env.VUE_APP_API_ENDPOINT,
    SSO_COOKIE_NAME: process.env.SSO_COOKIE_NAME,
    BIB_UPGRADE_LICENSE_URL: process.env.BIB_UPGRADE_LICENSE_URL,
    BIB_UPGRADE_LICENSE_URL_TRIAL: process.env.BIB_UPGRADE_LICENSE_URL_TRIAL,
    PAYMENT_APP_URL: process.env.PAYMENT_APP_URL,
    BIB_RENEW_LICENSE_URL: process.env.BIB_RENEW_LICENSE_URL,
    SUPPORT_URL: process.env.SUPPORT_URL,
    USER_AUTH_API_ENDPOINT: process.env.USER_AUTH_API_ENDPOINT,
    USER_API_ENDPOINT: process.env.USER_API_ENDPOINT,
    ORG_API_ENDPOINT: process.env.ORG_API_ENDPOINT,
    LANG_COOKIE_NAME: process.env.LANG_COOKIE_NAME,
    PAYPAL_API_ENDPOINT: process.env.PAYPAL_API_ENDPOINT,
    REFERRAL_ENDPOINT: process.env.REFERRAL_ENDPOINT,
    ACCOUNT_CREATION_REDIRECT: process.env.ACCOUNT_CREATION_REDIRECT,
    BIB_APP_ICONS_URL: process.env.BIB_APP_ICONS_URL,
  }
};
