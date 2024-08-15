<template>
  <div>
    <div class="mt-3">
      <!-- TEAM -->
      <div class="mb-05">
        <div class="font-w-700 ml-2 mb-2">{{ $t("common.teams") }}</div>
        <div class="grid-auto-200 grid-gap-2 pl-2 pr-2 deptteamsbox"  v-if="(localteamsAlldata.length > 0)||(isAdmin)">
          <!-- CREATE REAM -->
          <div class="create-team-card" @click="createTeamModal = true" v-if="isAdmin">{{ $t("common.createANewTeam") }}</div>
          <organization-team-card height="240px" v-for="(team, index) in localteamsAlldata" :key="index" :team="team">
            <bib-popup size="lg" class="team-card__dot-menu danger" pop="horizontal-dots" icon-hover-variant="primary-24" v-if="isAdmin" :class="{'dark': !lightThemeChecked}">
              <div slot="menu" class="list" :class="{'dark': !lightThemeChecked}">
                <span class="list__item danger" @click="isOpenConfirmModal=true,(selectedTeam = `${team?.Id}`)">{{ $t("common.removeteamfromdepartment") }}</span>
              </div>
            </bib-popup>
          </organization-team-card>
        </div>
        <div v-else-if="(!isAdmin)&&(!loading)" class="text-center mt-8">
          {{ $t("common.teamnotavailable") }}
        </div>
      </div>
    </div>
      <!-- CREATE TEAM -->
    <organization-create-department-modal :show="createTeamModal" :team="$route.params.id" :localdeptTeams="localteamsAlldata" :context="'deptteams'" :deptname="deptname" @close="createTeamModal = null" @refresh="getTeams()"/>
    <confirm-dialog
      v-if="isOpenConfirmModal"
      :text="$t('profile.confirmDeleteDepartmentTeamText')"
      @close="isOpenConfirmModal = null"
      @confirm="deleteTeam(selectedTeam,deptname)">
    </confirm-dialog>
  </div>
</template>

<script>
import { getDepartment,teamUnassign } from "~/model/department";
import { removeTeamFromDepartmet } from "~/model/team";
export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    teamsAlldata:{
      type: Array,
      default: () => [],
    },
    deptmanagerRole:{
      type: String,
      default: () => "",
    }
  },
  data() {
    return {
      createTeamModal: false,
      teams: [...this.data],
      localteamsAlldata: this.teamsAlldata,
      deptId: this.$route.params.id, // Store the team ID
      selectedTeam: null,
      isOpenConfirmModal: null,
      lightThemeChecked: this.$cookies.get('isLightTheme'),
      deptname: null,
      localdeptTeams:null,
      loading: true
    };
  },
  computed: {
    isAdmin() {
      return (this.$store.state.account.data.userRole === 'ADMIN')||(this.deptmanagerRole == 'MANAGER')
    },
  },
  watch: {
    data(newData) {
      this.teams = [...newData]; // Update teams when prop changes
    },
    teamsAlldata(newData) {
      this.localteamsAlldata = newData; // Update teams when prop changes
    },
    '$store.state.isLightTheme'(newValue) {
      this.lightThemeChecked = newValue;
    }
  },
  async created() { 
    this.getTeams()
  },
  mounted() { },
  methods: {
    async getTeams()
    {
      const hashId = this.$route.params.id
      var data = await getDepartment({ hashId: hashId });
      if(data.err)
      {
        if(data.err.error === `missing DepartmentId`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.missingDepartmentId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(data.err.error === `invalid DepartmentId`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidDepartmentId'), 'danger'])
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
      }
      else
      {
        this.localteamsAlldata = data.Teams;
        this.deptname = data.DeptName;
        this.loading = false;
      }
    },
    async deleteTeam(teamId,deptname) {
      const res = await removeTeamFromDepartmet({ hashId: teamId, deptId: this.deptId });
      let msg;

      if(res.err)
      {
        if(res.err.error === `missing Team Id`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.missingteamId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(res.err.error === `invalid Team Id`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidTeamId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(res.err.error === `missing Department Id`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.missingDepartmentId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(res.err.error === `invalid Department Id`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidDepartmentId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(res.err.error === `the team ${teamId} is not attached to the department ${this.deptId}`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.theteamisnotattachedtothedepartment'), 'danger'])
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
      }
      else
      {
        msg = this.$t("APISuccess.teamRemoveSuccessfully", { deptName: deptname })
        await this.$store.dispatch('notification/set', [true, msg, 'success'])
        this.getTeams();
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
      }
      this.isOpenConfirmModal = false
    },
  },
};
</script>

<style lang="scss" scoped>
.main-container {
  @include flex-justify;
  width: 100%;
  padding: 32px 12%;
  &__content {
    width: inherit;
  }
}
.add-user-card {
  @include flex-align;
  @include flex-justify;
  width: 100%;
  height: 240px;
  border: 1px solid $border-color;
  font-weight: bold;
  font-size: 15px;
  color: $primary;
  cursor: pointer;
}

.form__container-component-holder{
  .team-card{
    &:hover{
      background-color: #e3e3ea;
    }
  }
  .deptteamsbox{
    grid-template-columns: repeat(1, minmax(200px, 1fr));
    @media (min-width: 991px){
      grid-template-columns: repeat(2, minmax(200px, 1fr));
    }
    @media (min-width: 1024px){
      grid-template-columns: repeat(3, minmax(200px, 1fr));
    }
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

.home-layout{
  &:has(.app-wrapper--collapsed){
    .form__container-component-holder{
      .deptteamsbox{
        grid-template-columns: repeat(1, minmax(200px, 1fr));
        @media (min-width: 600px){
          grid-template-columns: repeat(2, minmax(200px, 1fr));
        }
        @media (min-width: 1024px){
          grid-template-columns: repeat(3, minmax(200px, 1fr));
        }
      }
    }
  }
}

::v-deep {
  .team-card__dot-menu {
    position: absolute !important;
    top: 8px;
    right: 8px;
    &.dark {
      .menu {
        .pop {
          border-color: var(--bib-border-primary); 
          .list{
            background-color: var(--bib-text);
            color: var(--bib-secondary);
            border: 1px solid var(--bib-border-primary);
            .list__item{
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
