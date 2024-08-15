<template>
  <div class="home-layout">
    <!-- MOBILE LAYOUT -->
    <div v-if="isMobileView && $store.state.notification.isShow" class="mobile-notification">
      <bib-notification-persistent @dismiss="$store.dispatch('notification/set', [false, '', ''])" :label="$store.state.notification.text" :variant="$store.state.notification.variant"></bib-notification-persistent>
    </div>
    <bib-app-wrapper-mobile
      v-if="isMobileView"
      :isLightTheme="lightThemeChecked"
      :style="`--patch-color: ${lightThemeChecked ? 'white' : '#1d1d20' }`"
      @user-click.stop="$store.dispatch('context/userMenuOn', $event)"
      @logo-click="$router.push(`/`)"
      :avatarImage="$store.state.account.data.photo"
      hide-search-box
      class="default-layout__BibAppWrapperMobile"
    >
      <template #content>
        <!-- CONTENT -->
        <div class="loading-mask-home">
          <NuxtChild global="global test" />
          <div class="loading-wrapper" v-if="isLoading">
            <bib-spinner variant="primary-24"></bib-spinner>
          </div>
        </div>
      </template>

      <template #footer>
        <div
          v-for="(item, index) in bottomMenu"
          :key="index"
          class="cursor-pointer text-center line-height-0"
          @click="footerIconClickHandle(item)"
        >
          <bib-icon
            :icon="item.icon"
            :scale="1.5"
            :variant="$route.fullPath == item.url ? 'black' : 'secondary'"
          />
          <div class="font-xs text-secondary">{{ item.label }}</div>
        </div>

        <div
          class="cursor-pointer text-center line-height-0"
          @click="$store.commit('ui/NAVIGATION_COLLAPSE', false)"
        >
          <bib-icon icon="menu" :scale="1.5" />
          <div class="font-xs text-secondary">{{ $t("common.menu") }}</div>
        </div>
      </template>

      <bib-side-menu
        v-if="!$store.state.ui.navigationCollapsed"
        @close="$store.commit('ui/NAVIGATION_COLLAPSE', true)"
        :containerColor="lightThemeChecked ? 'white' : 'var(--bib-dark)'"
        width="18rem"
      >

        <!-- <bib-app-switcher
          slot="leftbar"
          v-if="!$store.state.ui.navigationCollapsed"
          :menuItems="appItems"
          :isLightTheme="lightThemeChecked"
          @toggle-theme="toggleTheme"
          style="border-right: 1px solid rgb(147 147 147 / 15%);"
        /> -->

        <Navigation
          :collapsed="$store.state.ui.navigationCollapsed"
          :isLightTheme="lightThemeChecked"
          class="default-layout__BibAppWrapperMobile__Navigation"
          @click="$store.commit('ui/NAVIGATION_COLLAPSE', true)"
        />
      </bib-side-menu>
    </bib-app-wrapper-mobile>

    <!-- DESKTOP LAYOUT -->
    <bib-app-wrapper
      v-else
      :isLightTheme="lightThemeChecked"
      :navigationCollapsed="$store.state.ui.navigationCollapsed"
      ref="appWrapperRef"
    >
      <!-- NOTIFICATIONS -->
      <template #notification v-if="$store.state.notification.isShow">
        <bib-notification-persistent @dismiss="$store.dispatch('notification/set', [false, '', ''])" :label="$store.state.notification.text" :variant="$store.state.notification.variant"></bib-notification-persistent>
      </template>

      <!-- TOP BAR -->
      <template #topbar>
        <bib-header
          @input.native="searchAll"
          :placeholderSearchbox="$t('common.search')"
          @logo-click="$router.push('/')"
          @help-click="openHelp"
          @feedback-click="$store.commit('gui/FEEDBACK_MODAL', true)"
          hide-search-box
          hide-action-button
          @side-menu-expand="
            $store.commit(
              'ui/NAVIGATION_COLLAPSE',
              !$store.state.ui.navigationCollapsed
            )
          "
          :isLightTheme="lightThemeChecked"
          :user_auth_api_url="userAuthApiEndpoint"
          :user_api_url="userApiEndpoint"
          @my-account-link="goToMyProfile"
          @team-link="goToPeople"
          @billing-link="goToSubscription"
          @support-link="openHelp"
          @logout="logout"
        >
        </bib-header>
      </template>

      <!-- SWITCHER -->
      <template #switcher>
        <bib-app-switcher
          v-if="!$store.state.ui.navigationCollapsed"
          :menuItems="appItems"
          :isLightTheme="lightThemeChecked"
          @toggle-theme="toggleTheme"
        ></bib-app-switcher>
      </template>

      <!-- NAVIGATION -->
      <Navigation
        slot="navigation"
        :collapsed="$store.state.ui.navigationCollapsed"
        :isLightTheme="lightThemeChecked"
        @click="
          $store.state.ui.windowSize.width < 850 &&
            $store.commit('ui/NAVIGATION_COLLAPSE', true)
        "
      />

      <!-- CONTENT -->
      <template #content>
        <div class="loading-mask-home">
          <NuxtChild global="global test" />
          <div class="loading-wrapper" v-if="isLoading">
            <bib-spinner variant="primary-24"></bib-spinner>
          </div>
        </div>
      </template>
    </bib-app-wrapper>

    <context-language-selector 
      :active="$i18n.locale"
      :isLightTheme="lightThemeChecked"
      v-if="$store.state.language.selectorOn"
      v-click-outside:mousedown="() => $store.commit('language/TOGGLE_SELECTOR')"
      @selected="chooseLang"
      class="default-layout__ContextLanguageSelector"
    />

    <context-user-menu
      v-if="isMobileView && $store.state.context.userMenuOn"
      v-click-outside="() => $store.commit('context/TOGGLE_USER_MENU')"
      class="default-layout__ContextUserMenu"
    />

    <purchase-completed-modal>
    </purchase-completed-modal>

    <button-back v-if="$store.state.gui.backButtonVisible" class="topbar__back" />

    <div v-if="isGlobalLoading" class="loading-mask">
      <div class="loading-wrapper">
        <bib-spinner variant="primary-24"></bib-spinner>
      </div>
    </div>

    <IframePayment
      v-if="$store.state.gui.paymentModal"
      :place="`${$root.context.env.BIB_UPGRADE_LICENSE_URL_TRIAL}/modal/`"
      @cancel="$store.commit('gui/PAYMENT_MODAL')"
      @payment_success="paymentSuccess"
      @finish="$router.push('/people'), $store.commit('gui/PAYMENT_MODAL')"
    />
    <IframePayment
      v-else-if="purchaseCompleteUrl" 
      :place="purchaseCompleteUrl"
      @cancel="purchaseCompleteUrl = null"
    />
    <!-- FEEDBACK MODAL -->
    <FeedbackModal
      v-if="$store.state.gui.feedbackModal"
      :isLightTheme="lightThemeChecked"
      @close="$store.commit('gui/FEEDBACK_MODAL', false)"
      @submit="feedbackSubmit"
    ></FeedbackModal>
  </div>
</template>

<script>
import BibApps from '~/assets/utils/bib-apps.js'
import FeedbackModal from '../components/organization/common/feedbackModal.vue';
import { request, requestGeneric, handleResponse } from "~/assets/utils/axios";
export default {
  data() {
    return {
      showNotification: false,
      showUserMenu: false,
      notificationText: "",
      lightThemeChecked: this.$cookies.get('isLightTheme') == undefined || !!this.$cookies.get('isLightTheme'),
      userAuthApiEndpoint: process.env.USER_AUTH_API_ENDPOINT,
      userApiEndpoint: process.env.USER_API_ENDPOINT,
      purchaseCompleteUrl: null,
    };
  },
  computed: {
    isMobileView() {
      return this.$store.state.ui.windowSize.width < 600
    },
    isLoading() {
      return !this.$store.state.context.appReady || this.$store.state.loading.isLoading
    },
    isGlobalLoading() {
      return !this.$store.state.context.appReady || this.$store.state.loading.isGlobalLoading
    },
    isAdmin() {
      return this.$store.state.account.data.userRole === 'ADMIN'
    },
    appItems() {
      return BibApps(this.$t('appSwitcher'))
    },
    bottomMenu() {
      return [
        {
          label: this.$t("common.home"),
          url: process.env.AppTemplate,
          icon: "home",
          selected: this.$route.path == "/",
        },
      ].filter(Boolean);
    },
  },
  created() {
    // get app size
    window.addEventListener("resize", this.setWindowSize);
    this.$store.commit("ui/WINDOW_SIZE", {
      width: window.innerWidth,
      height: window.innerHeight,
    });
  },
  mounted() {
    const self = this
    this.$root.$on('close_expiration_notification', function(value) {
      self.dismissExpiration()
    })

    setTimeout(() => {
      this.$mobile.emit("appLoaded")
    }, 2000);

    // listeners for events fired by Electron or mobile apps
    document.addEventListener('requestLogout', ()=>{
      this.$store.dispatch('account/logout')
    });

    document.addEventListener("backButtonShow", () => {
      this.$store.commit("gui/TOGGLE_BACK_BUTTON", true);
    });

    document.addEventListener("backButtonHide", () => {
      this.$store.commit("gui/TOGGLE_BACK_BUTTON", false);
    });

    document.addEventListener("appStoreIapFinished", () => {
      // this.$store.commit('gui/LOADER_GLOBAL', 'Validating purchase...')
    });

    document.addEventListener("appStorePurchaseCompleted", async ({detail}) => {
        const businessId = detail.businessId || this.$store.state.account.data.businessId;
        const currency = detail.currency || localization.currency.code;
        const transactionId = detail.transactionId;
        const transactionTotal = Number(detail.price?.replace(/[^0-9.]/g, ""));
        const sendData = { token: detail.token, price: transactionTotal, currency };

        try {
            await this.$axios.post(`${process.env.ACCOUNT_API_ENDPOINT}/business/${businessId}/validateAppStore`, JSON.stringify(sendData));
            
            this.$gtm.push({ 
                event: "eCommerce",
                transactionEmail: this.$store.state.account.data.userEmail,
                transactionId,
                transactionAffiliation: "",
                transactionTotal,
                transactionTax: "",
                transactionShipping: "",
                transactionCurrency: currency,
                transactionProducts: [
                    {
                        sku: transactionId,
                        item_id: transactionId,
                        name: detail.title,
                        item_name: detail.title,
                        category: "",
                        price: transactionTotal,
                        quantity: 1,
                        currency,
                    },
                ],
            });

            this.purchaseCompleteUrl = `${this.$root.context.env.BIB_UPGRADE_LICENSE_URL_TRIAL}/purchase-response/?orderId=${transactionId}`;
        } catch (e) {
            this.purchaseCompleteUrl = `${this.$root.context.env.BIB_UPGRADE_LICENSE_URL_TRIAL}/purchase-response/?token=${detail.token}`;
            console.error(`🧨 bib-account ${e.response?.data.error || e} 🧨`, detail.token, this.$store.state.account.data.userEmail);
            const querySign = window.location.search ? "&" : "?";
        }
    });
  },
  methods: {
    async paymentSuccess(e){
      await this.$store.dispatch("account/authenticate", true);
      await this.$store.dispatch('business/getSubscriptionInfo');
    },
    dismissExpiration() {
      this.$refs.appWrapperRef.dismissExpiration()
    },
    setWindowSize() {
      clearTimeout(window.timeoutListener);
      window.timeoutListener = setTimeout(() => {
        this.$store.commit("ui/WINDOW_SIZE", {
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, 500);
    },
    chooseLang(code) {
      this.$i18n.locale = code
      this.$root.$emit('choose_lang', code)
      this.$store.dispatch('language/change', { code })

      this.$gtm.push({ eventCategory: "Language", eventLabel: code, eventAction: "switch" });

      if (this.$store.state.ui.windowSize.width < 850) {
        this.$store.commit("ui/NAVIGATION_COLLAPSE", true);
      }
    },
    toggleTheme(value) {
      this.lightThemeChecked = value
      this.$store.commit('setIsLightTheme', value)
    },
    openHelp() {
      window.open(process.env.SUPPORT_URL)
    },
    goToMyProfile() {
      this.showUserMenu = false
      this.$router.push('/my_profile')
    },
    goToPeople() {
      this.showUserMenu = false
      this.$router.push('/people')
    },
    goToOrganizationDetail() {
      this.showUserMenu = false
      this.$router.push(`/organizations/${this.$store.state.account.data.businessId}`)
    },
    goToSubscription() {
      this.showUserMenu = false
      this.$router.push('/subscription_billing')
    },
    async logout() {
      this.$store.dispatch('loading/setGlobal', true)
      await this.$store.dispatch('account/logout')
    },
    footerIconClickHandle(item) {
      if (item.icon === 'home') {
        window.location.href = process.env.AppTemplate
      } else {
        this.$router.push(item.url)
      }
    },
    async feedbackSubmit(data) {
      // File Upload Limit
      if (data.inputFiles.length > 3) {
        this.$store.dispatch('notification/set', [true, this.$t('common.fileCountLimitMessage'), 'danger'])
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
        return;
      }

      const formData = new FormData();
      for (const inputFile of data.inputFiles) {
        formData.append('file', inputFile);
      }

      // File Upload Size Cap
      if (formData.get('file')?.size > 5 * 1024 * 1024) {
        this.$store.dispatch('notification/set', [true, this.$t('common.fileSizeLimitMessage'), 'danger'])
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
        return;
      }

      formData.append('businessId', data.companyName ? `${data.companyName}(${this.$store.state.account.data.businessId})` : this.$store.state.account.data.businessId);
      formData.append('userId', this.$store.state.account.data.userFirstName && this.$store.state.account.data.userLastName ? `${this.$store.state.account.data.userFirstName} ${this.$store.state.account.data.userLastName}(${this.$store.state.account.data.userId})` : this.$store.state.account.data.userId);
      formData.append('fromAddress', this.$store.state.account.data.userEmail);
      formData.append('feedbackContent', data.feedbackDescription ? data.feedbackDescription : '');

      try {      
        const resp = await requestGeneric.post('/customer/feedback', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (resp.error) {
          this.$store.dispatch('notification/set', [true, resp.err, 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        } else {
          this.$store.dispatch('notification/set', [true, this.$t('common.feedbackMessage'), 'success'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
          this.$store.commit('gui/FEEDBACK_MODAL', false);
        } 
      } catch (e) {
        this.$store.dispatch('notification/set', [true, e.response?.data.error, 'danger'])
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
      }
    }
  },
  watch: {
    "$store.state.ui.windowSize"(newVal, oldVal) {
      if (newVal.width != oldVal.width && newVal.width < 1150)
        this.$store.commit("ui/NAVIGATION_COLLAPSE", true);
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.setWindowSize);
  },
};
</script>

<style lang="scss" scoped>
.home-layout {
  @media only screen and (min-width: 600px) {
    overflow: hidden;
  }
}

.default-layout__BibAppWrapperMobile {
  & .mobilenav-close{
    position: absolute;
  }
}

.loading-mask-home {
  position: relative;
  width: 100%;
  height: 100%;
 .loading-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    background: transparentize(#dcdcdf, .3);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
  }
}
hr {
  width: 100%;
  margin: 0;
}

.topbar {
  &__back {
    position: fixed;
    top: 1rem;
    left: 1rem;
  }
}
</style>
