<template>
  <div>
    <!-- HEADER -->
    <content-header>
      <template slot="bottom-left">
        <div class="organization-headline">
          <h2 class="font-w-600 font-heading-sm">{{ $t("common.subscriptionBilling") }}</h2>
        </div>
      </template>
    </content-header>

    <!-- CONTENT -->
    <div class="form__container">
      <!-- CENTER FORM -->
      <div class="form__container-content form__container-content--center">
        <div :class="['form__container-tab-bar', {'dark': !lightThemeChecked}]">
          <span class="tab-bar__item" :class="{ active: selectedTab === 'subscription', mobile_view: isMobileView, 'dark': !lightThemeChecked }" @click="selectedTab = 'subscription'">{{ $t("common.subscription") }}</span>
          <span class="tab-bar__item" :class="{ active: selectedTab === 'payment', mobile_view: isMobileView, 'dark': !lightThemeChecked }" @click="selectedTab = 'payment'">{{ $t("common.paymentMethods") }}</span>
          <span class="tab-bar__item" :class="{ active: selectedTab === 'billing', mobile_view: isMobileView, 'dark': !lightThemeChecked }" @click="selectedTab = 'billing'">{{ $t("common.billingHistory") }}</span>
        </div>
        <div :class="['form__container-component-holder', {'dark': !lightThemeChecked}]">
          <!-- ORGANIZATION INFORMATION -->
          <keep-alive>
            <component :lightThemeChecked = lightThemeChecked :is="`subscription-billing-${selectedTab}`" />
          </keep-alive>
        </div>
      </div>
    </div>

    <!-- INVITE TEAM MEMBER -->
    <organization-invite-team-member-modal :show="inviteTeamMemberModal" @close="inviteTeamMemberModal = null" />

    <!-- CREATE TEAM -->
    <organization-create-team-modal :show="createTeamModal" @close="createTeamModal = null" />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  layout: "home",
  props: ["global"],

  data() {
    return {
      selectedTab: "subscription",
      inviteTeamMemberModal: null,
      createTeamModal: null,
      lightThemeChecked: this.$cookies.get('isLightTheme'),
    };
  },
  computed: {
    ...mapGetters({
      isApp: "isApp",
    }),
    isMobileView() {
      return this.$store.state.ui.windowSize.width < 600
    },
    isAdmin() {
      return this.$store.state.account.data.userRole === 'ADMIN'
    },
  },
  created() {
    (!this.isAdmin || this.isApp) && this.redirectToProfile();

    // Change selected tab to payment for paypal payment redirection
    if(this.$route.query.subscription_id && this.$route.query.ba_token) {
      this.selectedTab = "payment";
    }
  },
  mounted() {
    (!this.isAdmin || this.isApp) && this.redirectToProfile()
    if (this.$route.query?.tab) {
      this.selectedTab = this.$route.query.tab;
    }
    this.lightThemeChecked = this.$cookies.get('isLightTheme');
  },
  watch:{
    selectedTab(e){
      this.$gtm.push({ event: "virtualPageView", customURL: `/${e}`, pageName: e, categoryName: "Subscription & Billing", pageType: "pay" });
    },
    '$store.state.isLightTheme'(newValue) {
      this.lightThemeChecked = newValue;
    }
  },
  methods: {
    redirectToProfile() {
      this.$router.push(`/my_profile`)
    }
  },
};
</script>

<style lang="scss" scoped>
.organization-headline {
  width: 100%;
  @include flex-align;
  margin-left: 40px;
}

.form {
  &__container {
    @include flex-justify;
    margin: 0 14px;

    &-tab-bar {
      position: relative;
      @include flex-align;
      flex-wrap: wrap;
      background: $background;
      height: 40px;
      min-width: 0;

      &.dark::before{
        background-color: var(--bib-text);
      }

      .tab-bar__item {
        @include flex-align;
        @include flex-justify;
        background: $secondary-sub2;
        font-size: 14px;
        min-width: 120px;
        max-width: 200px;
        height: 100%;
        padding: 0 16px;
        margin-right: 8px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        cursor: pointer;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        &:hover {
          background: $gray2;
        }

        &.active {
          background: $background-dark;
          cursor: default;
        }

        &.mobile_view {
          min-width: 50px;
          max-width: 60px;
          text-overflow: ellipsis;
          display: inline-block;
          padding-top: 0.5rem;
          &.active {
            max-width: 180px;
            display: flex;
            padding-top: 0;
          }
        }
      }

      &::before {
        position: absolute;
        bottom: -50px;
        content: "";
        width: 100%;
        height: 50px;
        // background-image: linear-gradient(to bottom, $background-dark 5%, transparent);
        pointer-events: none;
        z-index: 1;
      }
    }

    &-component-holder {
      // overflow-y: auto;
      max-height: inherit;
      padding-bottom: 2rem;
      min-height: 50vh;
    }

    &-content {
      overflow: hidden;

      margin-top: 30px;
      width: 100%;
      max-width: 720px;
      height: 100%;
      max-height: calc(100vh - 230px);
      background: $background-dark;
      border-radius: 6px;

      .admin-panel {
        padding: 16px;

        .organization-title-group {
          @include flex-align;
          margin-top: 30px;
        }

        .progress-group {
          width: 100%;
          border-radius: 8px;
          background: $background;
          // margin-top: 16px;
          padding: 16px;

          ::v-deep.progress__mask {
            background: $background-dark !important;
          }
        }
      }

      &--left {
        max-width: 360px;
        margin-left: 24px;
        margin-right: 34px;
      }

      @media only screen and (max-width: 900px) {
        max-width: 100%;
        max-height: 100%;
        margin-bottom: 30px;
      }
    }

    @media only screen and (max-width: 900px) {
      flex-direction: column;
    }
  }
}
</style>
