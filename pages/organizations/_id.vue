<template>
  <div>
    <!-- HEADER -->
    <content-header>
      <template slot="bottom-left">
        <div class="organization-headline">
          <!-- <img src="/img/default_company.svg" class="organization-image" /> -->
          <bib-icon icon="law-building-solid" :scale="2"></bib-icon>
          <h2 class="font-w-600 font-heading-sm">{{organizationName}}</h2>
        </div>
      </template>
      <template slot="bottom-right">
        <div v-if="false" class="organization-right-icons">
          <div class="icon-circle icon-circle--background mr-05" @click="createDepartmentModal = true">
            <bib-icon icon="container-optimize" variant="secondary" :scale="1.3"></bib-icon>
          </div>
          <div class="icon-circle icon-circle--background mr-05" @click="createTeamModal = true">
            <bib-icon icon="user-group" variant="secondary" :scale="1.3"></bib-icon>
          </div>
          <div class="icon-circle icon-circle--background mr-05" @click="inviteTeamMemberModal = true">
            <bib-icon icon="user-add" variant="secondary" :scale="1.3"></bib-icon>
          </div>
          <div class="icon-circle icon-circle--background mr-1">
            <bib-button size="lg" pop="elipsis">
              <div slot="menu" class="list">
                <span class="list__item" @click="inviteTeamMemberModal = true">{{ $t("common.inviteTeamMembers") }}</span>
                <span class="list__item" @click="createTeamModal = true">{{ $t("common.createNewTeam") }}</span>
                <span class="list__item" @click="$router.push('/subscription_billing?tab=billing')">{{ $t("common.viewBillingHistory") }}</span>
                <div class="separator" />
                <span class="list__item danger">{{ $t("common.deleteOrganization") }}</span>
              </div>
            </bib-button>
          </div>
        </div>
      </template>
    </content-header>

    <!-- CONTENT -->
    <div class="form__container">
      <!-- LEFT FORM -->
      <div v-if="false" class="form__container-content form__container-content--left">
        <div class="admin-panel">
          <div class="justify-between">
            <div class="font-md">{{ $t("common.adminPanel") }}</div>
            <bib-button size="lg" pop="elipsis">
              <div slot="menu" class="list">
                <span class="list__item" @click="inviteTeamMemberModal = true">{{ $t("common.inviteTeamMembers") }}</span>
                <span class="list__item" @click="createTeamModal = true">{{ $t("common.createNewTeam") }}</span>
                <span class="list__item" @click="$router.push('/subscription_billing?tab=billing')">{{ $t("common.viewBillingHistory") }}</span>
                <div class="separator" />
                <span class="list__item danger">{{ $t("common.deleteOrganization") }}</span>
              </div>
            </bib-button>
          </div>

          <!-- AVATAR GROUP -->
          <div class="organization-title-group">
            <img src="/img/default_company.svg" class="organization-image organization-image--big" />
            <div style="width: 95%; overflow: hidden">
              <div class="font-w-700 font-md ellipsis">{{businessData && businessData.CompanyName}}</div>
              <div class="font-md ellipsis">{{businessData && businessData.Website}}</div>
            </div>
          </div>

          <div class="progress-group">
            <div class="font-sm pl-025 mb-025">{{ $t("common.users") }}</div>
            <bib-progress class="mb-1" max="10" indicator="50" :value="50"></bib-progress>
            <bib-button label="Invite users" size="md" variant="light" pill class="w-100" @click="inviteTeamMemberModal = true"></bib-button>
          </div>

          <div class="progress-group">
            <div class="font-sm pl-025 mb-025">{{ $t("common.storage") }}</div>
            <bib-progress class="mb-1" max="15 GB" indicator="8 GB" :value="70"></bib-progress>
            <bib-button label="Get more space" size="md" variant="light" pill class="w-100"></bib-button>
          </div>
        </div>
      </div>

      <!-- CENTER FORM -->
      <div class="form__container-content form__container-content--center">
        <div :class="['form__container-tab-bar', {'dark': !lightThemeChecked}]">
          <span class="tab-bar__item" :class="{ active: selectedTab === 'organization', 'dark': !lightThemeChecked }" @click="selectedTab = 'organization'">{{ $t("common.organization") }}</span>
          <!-- <span class="tab-bar__item" :class="{ active: selectedTab === 'contact' }" @click="selectedTab = 'contact'">{{ $t("common.contact") }}</span>
          <span class="tab-bar__item" :class="{ active: selectedTab === 'teams' }" @click="selectedTab = 'teams'">{{ $t("common.teams") }}</span>
          <span class="tab-bar__item" :class="{ active: selectedTab === 'people' }" @click="selectedTab = 'people'">{{ $t("common.people") }}</span>
          <span class="tab-bar__item" :class="{ active: selectedTab === 'billing' }" @click="selectedTab = 'billing'">{{ $t("common.billing") }}</span> -->
        </div>
        <div :class="['form__container-component-holder', {'dark': !lightThemeChecked}]">
          <!-- ORGANIZATION INFORMATION -->
          <component :lightThemeChecked="lightThemeChecked" v-if="businessData" :is="`organization-details-${selectedTab}`" :businessData="businessData"/>
        </div>
      </div>
    </div>

    <!-- INVITE TEAM MEMBER -->
    <organization-invite-team-member-modal :show="inviteTeamMemberModal" @close="inviteTeamMemberModal = null" />

    <!-- CREATE TEAM -->
    <organization-create-team-modal :show="createTeamModal" @close="createTeamModal = null" />

    <!-- CREATE DEPARTMENT -->
    <organization-create-department-modal :show="createDepartmentModal" @close="createDepartmentModal = null" />
    
  </div>
</template>

<script>
import { getBusiness } from "~/model/business";
export default {
  layout: "home",
  props: ["global"],

  data() {
    return {
      businessId: null,
      businessData: null,
      organizationName: '',
      selectedTab: "organization",
      inviteTeamMemberModal: null,
      createTeamModal: null,
      createDepartmentModal: null,
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
    this.businessId = this.$route.params.id
    this.$store.dispatch('loading/set', true)
    const resp = await getBusiness({ businessId: this.businessId })
    if (resp.err) {
      this.$store.dispatch('notification/set', [true, resp.err.message, 'danger'])
      setTimeout(async () => {
        await this.$store.dispatch('notification/set', [false, '', ''])
      }, 5000)
    } else {
      this.businessData = resp[0]
      this.organizationName = this.businessData && this.businessData.CompanyName
    }
    this.$store.dispatch('loading/set', false)
  },
  mounted() {
    if (this.$route.query?.tab) {
      this.selectedTab = this.$route.query.tab;
    }
    this.$root.$on('change_company_name', (companyName) => {
      this.organizationName = companyName
    })
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
  gap: 0.5rem;
}

.organization-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 16px;

  &--big {
    width: 80px;
    height: 80px;
  }
}

.form {
  &__container {
    // @include flex-align(flex-start);
    @include flex-justify;
    margin: 0 14px;

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
        // background-color: var(--bib-text);
        pointer-events: none;
        z-index: 1;
      }
    }

    &-component-holder {
      overflow-y: auto;
      max-height: inherit;
      padding-bottom: 2rem;
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
        visibility: hidden;
      }

      @media only screen and (max-width: 1360px) {
        &--left {
          max-width: 260px;
        }
      }

      @media only screen and (max-width: 1200px) {
        max-width: 100%;
        max-height: 100%;
        margin-bottom: 30px;

        &--left {
          max-width: 100%;
          margin-left: 0;
          margin-right: 0;
        }
      }
    }

    @media only screen and (max-width: 1200px) {
      flex-direction: column;
    }
  }
}
</style>
