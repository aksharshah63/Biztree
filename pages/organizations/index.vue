<template>
  <div>
    <!-- HEADER -->
    <content-header>
      <template slot="top-left">
        <bib-icon icon="home" :scale="1.5" class="ml-075 mr-05" variant="secondary-sub2"></bib-icon>
        <div class="font-sm">/ {{ $t("common.organizations") }}</div>
      </template>
      <template slot="bottom-left">
        <h2 class="align-center font-w-700 ml-3">
          <div class="icon-circle icon-circle--background mr-1">
            <bib-icon icon="arrow-left" variant="secondary" :scale="1.3"></bib-icon>
          </div>
          {{ $t("common.organizations") }}
        </h2>
      </template>
    </content-header>

    <!-- CONTENT -->
    <div v-if="false" class="main-container">
      <!-- MY ORGANIZATIONS -->
      <bib-detail-collapse label="My Organizations" open>
        <template v-slot:content>
          <div class="main-container__content grid-auto-320 grid-gap-4 pl-3 pr-3 pt-2">
            <!-- CREATE ORGANIZATION -->
            <div class="create-organization-card" @click="createOrganizationModal = true">
              {{ $t("common.addOrganization") }}
            </div>
            <organization-card height="240px" background-color="var(--bib-background-dark)" v-for="(team, index) in 2" :key="index" :team="team" @click="$router.push(`/organizations/org_id`)">
              <bib-button size="lg" class="organization-card__dot-menu danger" pop="elipsis">
                <div slot="menu" class="list">
                  <span class="list__item" @click="$router.push(`/organizations/org_id`)">{{ $t("common.manageOrganization") }}</span>
                  <span class="list__item" @click.stop="inviteTeamMemberModal = true">{{ $t("common.inviteTeamMembers") }}</span>
                  <span class="list__item" @click.stop="createTeamModal = true">{{ $t("common.createNewTeam") }}</span>
                  <span class="list__item" @click="$router.push(`/subscription_billing`)">{{ $t("common.viewBillingHistory") }}</span>
                  <div class="separator" />
                  <span class="list__item danger">{{ $t("common.deleteOrganization") }}</span>
                </div>
              </bib-button>

              <div class="organization-users" style="cursor: default" @click.stop>
                <div class="organization-users-imgs">
                  <img src="https://www.placecage.com/640/360" class="mr-05" />

                  <div>
                    <img v-for="(team, index) in 3" :key="index" src="https://placebear.com/300/300" class="offset-in-left" />
                  </div>
                </div>
                {{ $t("common.users") }} 6/10
                <span class="text-primary ml-05" style="cursor: pointer; text-decoration: underline" @click.stop="$router.push('/organizations/org_id?tab=billing')">{{ $t("common.addUsers") }}</span>
              </div>
            </organization-card>
          </div>
        </template>
      </bib-detail-collapse>

      <!-- ORGANIZATIONS I AM PART OF -->
      <bib-detail-collapse label="Organizations I am part of" open class="mt-2 mb-3" style="border-top: 1px solid rgba(120, 120, 120, 0.2)">
        <template v-slot:content>
          <div class="main-container__content grid-auto-320 grid-gap-4 pl-3 pr-3 pt-2">
            <organization-card height="240px" background-color="var(--bib-background-dark)" v-for="(team, index) in 3" :key="index" :team="team" @click="$router.push(`/organizations/org_id`)">
              <bib-button size="lg" class="organization-card__dot-menu danger" pop="elipsis">
                <div slot="menu" class="list">
                  <span class="list__item" @click="$router.push(`/organizations/org_id`)">{{ $t("common.manageViewOrganization") }}</span>
                  <span class="list__item" @click.stop="inviteTeamMemberModal = true">{{ $t("common.inviteTeamMembers") }}</span>
                  <span class="list__item" @click.stop="createTeamModal = true">{{ $t("common.createNewTeam") }}</span>
                  <div class="separator" />
                  <span class="list__item danger">{{ $t("common.leaveOrganization") }}</span>
                </div>
              </bib-button>
            </organization-card>
          </div>
        </template>
      </bib-detail-collapse>
    </div>

    <!-- CREATE ORGANIZATION -->
    <organization-create-organization-modal :show="createOrganizationModal" @close="createOrganizationModal = null" />

    <!-- CREATE TEAM -->
    <organization-create-team-modal :show="createTeamModal" @close="createTeamModal = null" />

    <!-- INVITE TEAM MEMBER -->
    <organization-invite-team-member-modal :show="inviteTeamMemberModal" @close="inviteTeamMemberModal = null" />
  </div>
</template>

<script>
export default {
  layout: "home",
  props: ["global"],
  data() {
    return {
      createOrganizationModal: false,
      inviteTeamMemberModal: false,
      createTeamModal: false,
      lightThemeChecked: this.$cookies.get('isLightTheme'),
    };
  },
  computed: {
    businessId() {
      return this.$store.state.account.data.businessId
    }
  },
  watch: {
    '$store.state.isLightTheme'(newValue) {
      this.lightThemeChecked = newValue;
    }
  },
  created() {
    this.redirectToOrgDetail()
  },
  mounted() {
    this.redirectToOrgDetail()
  },
  methods: {
    redirectToOrgDetail() {
      this.$router.push(`/organizations/${this.businessId}`)
    }
  },
};
</script>
<style lang="scss" scoped>
.create-organization-card {
  @include flex-align;
  @include flex-justify;
  width: 100%;
  height: 240px;
  border: 1px solid $border-color;
  font-weight: bold;
  font-size: 15px;
  color: $primary;
  cursor: pointer;
  border-radius: 8px;

  &:active {
    // transform: scale(0.98);
  }
}

.organization-card__dot-menu {
  position: absolute !important;
  top: 8px;
  right: 8px;

  &:hover {
    border-radius: 100px;
    background: $background-dark;
  }
}

.organization-users {
  position: absolute !important;
  bottom: 16px;
  left: 16px;
  display: flex;
  align-items: center;
  font-size: 15px;

  &-imgs {
    display: flex;
    margin-right: 20px;
    img {
      width: 32px;
      height: 32px;
      border-radius: 100px;
      object-fit: cover;
      border: 2px solid $background;
    }

    .offset-in-left {
      margin-right: -12px;
    }
  }
}
</style>
