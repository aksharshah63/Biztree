<template>
  <div>
    <!-- HEADER -->
    <content-header>
      <template slot="top-left">
        <bib-icon icon="home" :scale="1.5" class="ml-075 mr-05" variant="secondary-sub2"></bib-icon>
        <div class="font-sm">/ {{ $t("common.organizations") }} / Organization Name</div>
      </template>
      <template slot="bottom-left">
        <div class="align-center">
          <h2 class="font-w-600 font-heading-sm margin-left-40">{{ $t("common.teams") }}</h2>
        </div>
      </template>
      <template slot="bottom-right">
        <div class="mr-1" v-if="isAdmin">
          <bib-button
            size="lg"
            :label="$t('common.createTeam')"
            variant="primary-24"
            pill
            @click="onAddTeam"
          ></bib-button>
        </div>
      </template>
    </content-header>
    <!-- CONTENT -->
    <div class="main-container">
      <div class="main-container__content grid-auto-240 grid-gap-4 list-team" v-if="teams.length > 0">
        <template>
          <organization-team-card
          height="240px"
          background-color="var(--bib-background-dark)"
          v-for="(team, index) in teams"
          :key="index"
          :team="team"
          :isLightTheme="lightThemeChecked"
          @click="$router.push(`/teams/${team?.TeamId}`)"
          :users="getUserCount(team.TeamId)">
            <!-- <bib-popup :class="['team-card__dot-menu', {'dark': !lightThemeChecked}]" pop="horizontal-dots" icon-hover-variant="primary-24" v-if="isAdmin"> -->
              <bib-popup pop="horizontal-dots" :class="['team-card__dot-menu', {'dark': !lightThemeChecked}]" icon-hover-variant="primary-24" v-if="isAdmin">
              <template v-slot:menu>
                <div slot="menu" class="list">
                  <span class="list__item" @click.stop="$router.push(`/teams/${team?.TeamId}`)">{{ $t("common.manageTeam") }}</span>
                  <span class="list__item" @click.stop="(selectedTeam = team?.TeamId), (createTeamModal = true), (teamname = team?.TeamName),getUserfromTeam()">{{ $t("common.inviteTeamMembers") }}</span>
                  <div class="separator" />
                  <span class="list__item danger bg-hover-danger" @click.stop="isOpenConfirmModal=true, (selectedTeam = team?.TeamId), (teamname = team?.TeamName)">{{ $t("common.deleteTeam") }}</span>
                </div>
              </template>
            </bib-popup>
          </organization-team-card>
        </template>
      </div>
      <div v-else-if="!loading">
        <div class="text-center mt-3 text-secondary">
          {{ $t("common.noteamscreated") }}
        </div>
      </div>
    </div>
    <!-- CREATE TEAM -->
    <organization-create-team-modal :show="createTeamModal" :localUsers="localUsers" :teastteamId="selectedTeam" :team="selectedTeam" :teamName="teamname" @close="onCloseCreateTeamModal" @refresh="getTeams()" @add-member="getTotalteammembersindex"/>
    <confirm-dialog
      v-if="isOpenConfirmModal"
      :text="$t('profile.confirmDeleteTeamText')"
      @close="isOpenConfirmModal = null"
      @confirm="deleteTeam(selectedTeam, teamname)">
    </confirm-dialog>
  </div>
</template>

<script>
import { getTeam, removeTeam,getTeamUser,getTeamuserbelong } from "~/model/team";
export default {
  layout: "home",
  props: ["global"],
  data() {
    return {
      createTeamModal: false,
      selectedTeam: null,
      teamname: null,
      teams: [],
      isOpenConfirmModal: null,
      teamUserCounts: {},
      lightThemeChecked: this.$cookies.get('isLightTheme'),
      loading: true,
      localUsers:[]
    };
  },
  computed: {
    isAdmin() {
      return this.$store.state.account.data.userRole === 'ADMIN'
    },
  },
  created() {
    this.getTeams();
    // this.getUsers();
  },
  watch:{
    users(newData) {
      this.localUsers = newData; // Update teams when prop changes
    },
    '$store.state.isLightTheme'(newValue) {
      this.lightThemeChecked = newValue;
    },
  },
  methods: {
    async getUserfromTeam(){
      const hashId = this.selectedTeam;
      var data = await getTeamUser({ hashId: hashId });
      if (data.err) {
        if(data.err.error === `missing TeamId`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.missingteamId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(data.err.error === `invalid TeamId`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidTeamId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else
        {
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
      } else {
        this.localUsers = data;
      }
    },
    async getTeams() {
      if(this.$store.state.account.data.userRole === 'ADMIN')
      {
        const hashId = this.$store.state.account.data.businessId;
        this.$store.dispatch('loading/set', true);
        const data = await getTeam({ hashId: hashId });
        if (data.err) {
          this.handleError(data.err.error);
        } else {
          this.teams = data.sort((a, b) => {
            if (a.TeamName.trim().toLowerCase() < b.TeamName.trim().toLowerCase()) return -1;
          });
        }
      }
      else if(this.$store.state.account.data.userRole === 'USER')
      {
        this.$store.dispatch('loading/set', true);
        const data = await getTeamuserbelong({ hashId: this.$store.state.account.data.userId });
        if (data.err) {
          this.handleError(data.err.error);
        } else {
          this.teams = data.sort((a, b) => {
            if (a.TeamName.trim().toLowerCase() < b.TeamName.trim().toLowerCase()) return -1;
          });
        }
      }
      this.loading = false;
      this.$store.dispatch('loading/set', false);
    },
    async deleteTeam(hashId, team_name) {
      const res = await removeTeam({ hashId: hashId });
      if (res.err) {
        this.handleDeleteError(res.err.error, team_name);
      } else {
        this.$store.dispatch('notification/set', [true, this.$t('APISuccess.deleteTeamSuccessfully'), 'success']);
        this.getTeams();
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
      }
      this.$store.dispatch('loading/set', false);
      this.isOpenConfirmModal = false;
    },
    onAddTeam() {
      this.selectedTeam = null;
      this.teamname = null;
      this.createTeamModal = true;
    },
    onCloseCreateTeamModal() {
      this.createTeamModal = false;
      this.selectedTeam = null;
      this.teamname = null;
    },
    handleError(error) {
      let msg = '';
      switch (error) {
        case 'missing BusinessId':
          msg = this.$t('APIError.missingBusinessId');
          break;
        case 'invalid BusinessId':
          msg = this.$t('APIError.invalidBusinessId');
          break;
        case 'business not found':
          msg = this.$t('APIError.Businessnotfound');
          break;
        default:
          break;
      }
      if (msg) {
        this.$store.dispatch('notification/set', [true, msg, 'danger']);
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
      }
    },
    handleDeleteError(error, team_name) {
      let msg = '';
      switch (error) {
        case 'missing TeamId':
          msg = this.$t('APIError.missingteamId');
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
          break;
        case 'invalid TeamId':
          msg = this.$t('APIError.invalidTeamId');
          break;
        case `unable to delete team ${hashId}`:
          msg = this.$t("APIError.unabletoDeleteteam", { teamName: team_name });
          break;
        case `team ${hashId} not found`:
          msg = this.$t("APIError.teamNotFound", { teamName: team_name });
          break;
        default:
          break;
      }
      if (msg) {
        this.$store.dispatch('notification/set', [true, msg, 'danger']);
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
      }
    },
    async getTotalteammembersindex(id) {
      const data = await getTeamUser({ hashId: id });
      if (data.err) {
        if (data.err.error === 'missing TeamId') {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.missingteamId'), 'danger']);
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        } else if (data.err.error === 'invalid TeamId') {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidTeamId'), 'danger']);
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        } else {
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', '']);
          }, 5000);
        }
      } else {
        this.$set(this.teamUserCounts, id, data.length);
      }
    },
    getUserCount(teamId) {
      return this.teamUserCounts[teamId];
    },
  },
};
</script>
<style lang="scss" scoped>
.main-container {
  @include flex-justify;
  width: 100%;
  padding: 32px 40px;
  &__content {
    width: inherit;
  }
}
.create-team-card {
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
}

.home-layout {
  &:has(.app-wrapper--collapsed) {
    .main-container__content {
      @media (min-width: 800px) {
        grid-template-columns: repeat(3, 1fr);
      }
      @media (min-width: 1200px) {
        grid-template-columns: repeat(4, 1fr);
      }
      @media (min-width: 1700px) {
        grid-template-columns: repeat(6, 1fr);
      }
    }
  }
}
.main-container__content {
  grid-template-columns: repeat(1, 1fr);
  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 800px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (min-width: 1700px) {
    grid-template-columns: repeat(5, 1fr);
  }
}

::v-deep {
  .team-card__dot-menu {
    position: absolute !important;
    top: 8px;
    right: 8px;
    
    &:hover{
      box-shadow: none;
    }

    &.dark {
      .menu {
        .pop {
          border-color: var(--bib-border-primary); 
          .list{
            background-color: var(--bib-text);
            color: var(--bib-secondary);
            border: 1px solid var(--bib-border-primary);
            .list__item{
              color: var(--bib-text-secondary);
              &:hover{
                background-color: var(--bib-surface-tertiary);
              }
              &.danger{
                color: var(--bib-danger);
                &:hover{
                  color: var(--bib-white);
                  background-color: var(--bib-danger);
                }
              }
            }
          }
        }
      }
    }

    .pop{
      .list{
        background-color: var(--bib-white);
        .list__item{
          color: var(--bib-text);
          &:hover{
            background-color: var(--bib-background-dark);
          }
          &.danger{
            color: var(--bib-danger);
            &:hover{
              color: var(--bib-white);
              background-color: var(--bib-danger);
            }
          }
        }
      }
    }

    .menu{
      .icon{
        svg{
          fill:var(--bib-text-secondary);
        }
      }
    }
  }
}
</style>
