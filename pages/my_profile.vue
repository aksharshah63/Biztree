<template>
  <div>
    <!-- HEADER -->
    <content-header>
      <template slot="bottom-left">
        <div class="organization-headline">
          <h2 class="font-w-600 font-heading-sm">{{$store.state.account.data.userFirstName + ' ' + $store.state.account.data.userLastName}}</h2>
        </div>
      </template>
    </content-header>

    <!-- CONTENT -->
    <div class="form__container" v-if="userData">
      <!-- CENTER FORM -->
      <div class="form__container-content form__container-content--center" >
        <div :class="['form__container-tab-bar', {'dark': !lightThemeChecked}]">
          <span :class="['tab-bar__item', { 'dark': !lightThemeChecked, 'active': selectedTab === 'profile' }]" @click="selectedTab = 'profile'">{{ $t("common.profile") }}</span>
          <!-- <span class="tab-bar__item" :class="{ active: selectedTab === 'contact' }" @click="selectedTab = 'contact'">{{ $t("common.contact") }}</span> -->
        </div>
        <div :class="['form__container-component-holder', {'dark': !lightThemeChecked}]">
          <!-- ORGANIZATION INFORMATION -->
          <keep-alive>
            <component :lightThemeChecked = lightThemeChecked :is="`my-profile-${selectedTab}`" :data="userData"/>
          </keep-alive>
        </div>
      </div>
    </div>

    <!-- INVITE TEAM MEMBER MODAL -->
    <organization-invite-team-member-modal :show="inviteTeamMemberModal" @close="inviteTeamMemberModal = null" />

    <!-- CREATE TEAM MODAL -->
    <organization-create-team-modal :show="createTeamModal" @close="createTeamModal = null" />
  </div>
</template>

<script>
import axios from "axios";
import { getAllCookies } from "~/assets/utils/cookies";

export default {
  layout: "home",
  props: ["global"],

  data() {
    return {
      selectedTab: "profile",
      inviteTeamMemberModal: null,
      createTeamModal: null,
      userData: null,
      lightThemeChecked: this.$cookies.get('isLightTheme'),
    };
  },
  computed: {},
  watch: {
    '$store.state.isLightTheme'(newValue) {
      this.lightThemeChecked = newValue;
    }
  },
  async created() {
    this.$store.dispatch('loading/set', true)
    const request = axios.create({
      baseURL: process.env.BackEnd_API_URL,
      headers: {
        Authorization: `Bearer ${getAllCookies()[process.env.SSO_COOKIE_NAME]}`,
        client_time: new Date().toISOString(),
      }
    });
    const resp = await request.get(`/user/${ this.$store.state.account.data.userId }`)
      .then((res) => {
      return res.data;
      })
      .catch((err) => {
      return { err: err.response && err.response.data || err };
      });
    if (resp.err) {
      this.$store.dispatch('notification/set', [true, resp.err.message, 'danger'])
      setTimeout(async () => {
        await this.$store.dispatch('notification/set', [false, '', ''])
      }, 5000)
    } else {
      let account = resp[0]
      if (account && account.Phone && account.Phone.charAt(0) !== '+') {
        account.Phone = `+1 ${account.Phone}`
      }
      this.userData = account
    }
    this.$store.dispatch('loading/set', false)
  },
  mounted() {
    this.lightThemeChecked = this.$cookies.get('isLightTheme');
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.organization-headline {
  width: 100%;
  @include flex-align;
  margin-left: 40px;

  .organization-image {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 400px;
    margin-right: 16px;
  }
}

.form {
  &__container {
    @include flex-justify;
    margin: 0 14px 2rem 14px;

    &-tab-bar {
      position: relative;
      @include flex-align;
      flex-wrap: wrap;
      background: $background;
      height: 40px;
      min-width: 0;

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
      }

      &::before {
        position: absolute;
        bottom: -40px;
        content: "";
        width: 100%;
        height: 40px;
        // background-image: linear-gradient(to bottom, $background-dark 5%, transparent);
        pointer-events: none;
        z-index: 1;
      }
    }

    &-component-holder {
      overflow-y: auto;
      max-height: inherit;
      padding-bottom: 90px;
      min-height: 50vh;
    }

    &-content {
      overflow: hidden;

      margin-top: 30px;
      width: 100%;
      max-width: 720px;
      height: 100%;
      // max-height: calc(100vh - 230px);
      background: $background-dark;

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
          margin-top: 16px;
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