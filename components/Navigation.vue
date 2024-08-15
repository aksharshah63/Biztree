<template>
  <div class="navigation" :class="{ navigation__collapsed: collapsed }">
    <div v-show="!collapsed" class="navigation__avatar mt-2 mb-1">
      <img :src="$store.state.account.data.photo || `/img/default_avatar.svg`" />
      <div :class="isLightTheme ? 'text-dark' : 'text-white'">{{ $store.state.account.data.userFirstName + " " + $store.state.account.data.userLastName }}</div>
    </div>

    <bib-app-navigation :items="[{ label: $t('common.myProfile'), icon: 'user-profile-circle-solid', href: '/my_profile', selected: $route.path === '/my_profile' }]" @click="navigate" :isLightTheme="isLightTheme"></bib-app-navigation>

    <!-- separator -->
    <div class="mt-05 mb-05" :class="isLightTheme ? 'bg-secondary-sub3' : 'bg-dark-sub1'" style="height: 1px"></div>

    <bib-app-navigation :items="navItems" @click="navigate" :isLightTheme="isLightTheme"></bib-app-navigation>

    <!-- separator -->
    <div class="mt-05 mb-05" :class="isLightTheme ? 'bg-secondary-sub3' : 'bg-dark-sub1'" style="height: 1px"></div>
    <bib-app-navigation :items="[
      {
        label: $t('common.notifications'),
        icon: 'notification-solid',
        href: '/notifications',
        selected: $route.path === '/notifications',
      },
    ]" @click="navigate"></bib-app-navigation>

    <bib-app-navigation :items="[{ label: $t('common.language'), icon: 'domain' }]" @click.stop="$store.dispatch('language/selectorOn', $event)" :isLightTheme="isLightTheme"> </bib-app-navigation>

    <bib-app-navigation v-if='shouldShowNavigation()' :items='[{ label: $t("common.feedback"), icon: "comment-announcement-solid" }]' @click.native="openFeedbackModal()" :isLightTheme="isLightTheme"></bib-app-navigation>

    <bib-app-navigation :items="[{ label: $t('common.logout'), icon: 'exit-to-app-solid' }]" @click.native="logout()" :isLightTheme="isLightTheme"></bib-app-navigation>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
    isLightTheme: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapGetters({
      isApp: "isApp",
    }),
    navItems() {
      let navItems = [
        { label: this.$t("common.organizationDetails"), icon: "container-optimize-solid", href: `/organizations/${this.$store.state.account.data.businessId}`, selected: this.$route.path.match(/organizations\/[^]/gi) && !this.$route.path.includes("/organizations/delete") },
        { label: this.$t("common.teamMembers"), icon: "user-group-solid", href: "/people", selected: this.$route.path.includes("/people") },
      ];
      if (!this.isApp && this.$store.state.account.data.userRole === "ADMIN") {
        navItems.push({ label: this.$t("common.subscriptionBilling"), icon: "creditcard-solid", href: "/subscription_billing", selected: this.$route.path.includes("/subscription_billing") });

        if (window.location.href.includes("localhost") || window.location.href.includes("http://dev.account.business-in-a-box.com/")) {
          navItems.push({
            label: "Referral Dashboard", icon: "dashboard-tile-solid", href: "/referrals/dashboard",
            selected: this.$route.path.includes("/referrals/dashboard") || this.$route.path.includes("/referrals/referrers") || this.$route.path.includes("/referrals/transactions")
          });
        }
      }
      if (window.location.href.includes("localhost") || window.location.href.includes("http://dev.account.business-in-a-box.com/")) {
        navItems.push({ label: this.$t("common.referrals"), icon: "diamond-solid", href: "/referrals", selected: this.$route.path.includes("/referrals") && !this.$route.path.includes("/referrals/dashboard") && !this.$route.path.includes("/referrals/referrers") && !this.$route.path.includes("/referrals/transactions") });
      }
      if (window.location.href.includes("localhost") || window.location.href.includes("http://dev.account.business-in-a-box.com/")) {
        navItems.push({ label: this.$t("common.departments"), avatar: "/img/department.svg", href: "/departments", selected: this.$route.path.includes("/departments") });
        navItems.push({ label: this.$t("common.teams"), avatar: `/img/team.svg`, href: "/teams", selected: this.$route.path.includes("/teams") });
      }
      return navItems;
    },
  },
  methods: {
    navigate($event, item) {
      this.$router.push(item.href);
      this.$emit("click", item);
    },
    shouldShowNavigation() {
      return (
        window.location.href.includes('localhost') ||
        window.location.href.includes('http://dev.account.business-in-a-box.com/')
      );
    },
    openFeedbackModal() {
      this.$store.commit("gui/FEEDBACK_MODAL", true);
    },
    async logout() {
      this.$store.dispatch("loading/setGlobal", true);
      await this.$store.dispatch("account/logout");
    },
  },
};
</script>

<style lang="scss" scoped>
.navigation {
  width: 15.5rem;
  height: 100%;
  overflow-x: hidden;
  overflow-y: overlay;
  padding: 0.7rem 0;
  // transition: width 0.15s;

  &__avatar {
    // text-background font-md text-center pt-2 pb-2text-background font-md text-center pt-2 pb-2
    text-align: center;
    font-size: 1rem;

    img {
      width: 74px;
      height: 74px;
      object-fit: cover;
      border-radius: 100px;
      margin-bottom: 10px;
    }
  }

 

  &.default-layout__BibAppWrapperMobile__Navigation {
    width: 100%;
  }

  &__collapsed {
    width: 3.55rem;
  }

  &::-webkit-scrollbar {
    width: 6px;

    &-thumb {
      border: none;
      background: rgba(126, 126, 126, 0.438);
      border-radius: 0;
    }
  }

  &__separator {
    display: block;
    margin: 0.5rem;
    width: calc(100% - 1rem);
    height: 1px;
    background: $dark-sub1;

    &.isLightTheme {
      background: $light;
    }
  }
  &.dark{
    &::-webkit-scrollbar {
    width: 6px;

    &-thumb {
      border: none;
      background: var(--bib-border-primary);
      border-radius: 0;
    }
  }
  }
}
</style>
