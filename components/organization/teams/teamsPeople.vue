<template>
  <div class="mt-3">
    <div class="mb-05">
      <div class="font-w-700 ml-2 mb-2">{{ $t("common.people") }}</div>
      <div class="grid-auto-200 grid-gap-2 pl-2 pr-2 deptteamsbox" v-if="(localUsers.length > 0)||(isAdmin)">
        <div class="add-user-card" @click="inviteTeammatesModal = true" v-if="isAdmin">{{ $t("common.addteammember") }}</div>
        <organization-user-card height="240px" v-for="(user, index) in localUsers" :key="index" :user="user">
          <bib-popup size="lg" class="team-card__dot-menu danger" pop="horizontal-dots" icon-hover-variant="primary-24" v-if="isAdmin" :class="{'dark': !lightThemeChecked}">
            <div slot="menu" class="list" :class="{'dark': !lightThemeChecked}">
              <span v-if="user?.TeamUserRole !== 'MANAGER'" class="list__item" @click="(selectedTeammates = `${user?.TeamUserId}`),(selectedusername=`${user.Name}`),assignManager()">{{ $t("common.assignRoleManager") }}</span>
              <span v-if="user?.TeamUserRole === 'MANAGER'" class="list__item danger" @click="isOpenRoleConfirmModal=true,(selectedTeammates = `${user?.TeamUserId}`),(selectedusername=`${user.Name}`),(selected_Team=`${teamname}`)">{{ $t("common.unassignRoleManager") }}</span>
              <span class="list__item danger" @click="isOpenConfirmModal=true,(selectedTeam = `${user?.TeamUserId}`),(selectedusername=`${user.Name}`),(selected_Team=`${teamname}`)">{{ $t("common.removepeople") }}</span>
            </div>
          </bib-popup>
        </organization-user-card>
      </div>
      <div v-else-if="(!isAdmin)&&(!loading)" class="text-center mt-8">
        {{ $t("common.teammembernotavailable") }}
      </div>
    </div>

    <!-- CREATE TEAM -->
     
    <organization-create-team-modal :show="inviteTeammatesModal" :localUsers="localUsers" :team="$route.params.id" :teamName="teamname" @close="inviteTeammatesModal = null" @refresh="getUsers()" />
    <organization-user-details-modal :show="userDetailsModal" :userId="userDetailsModal" @close="userDetailsModal = null" />
    <confirm-dialog
        v-if="isOpenConfirmModal"
        :text="$t('profile.confirmDeleteTeamPeopleText')"
        @close="isOpenConfirmModal = null"
        @confirm="deleteUser(selectedTeam,selectedusername,selected_Team)">
    </confirm-dialog>
    <confirm-dialog
      v-if="isOpenRoleConfirmModal"
      :text="$t('profile.confirmUnassignManagerRole')"
      @close="isOpenRoleConfirmModal = null"
      @confirm="unassignManagerFromTeam(selectedTeam,selectedusername,selected_Team)">
    </confirm-dialog>
  </div>
</template>

<script>
import { getTeamUser, removeUser,getTeam,assignManagerRole,unassignManager } from "~/model/team";
export default {
  props:["users","teammanagerRole"],
  // props: ["lightThemeChecked"],
  data() {
    return {
      inviteTeammatesModal: null,
      userDetailsModal: null,
      localUsers: this.users,
      teamId: this.$route.params.id, // Store the team ID
      createTeamModal: false,
      isOpenConfirmModal: null,
      selectedTeam: null,
      teamname: null,
      selectedusername: null,
      selected_Team:null,
      lightThemeChecked: this.$cookies.get('isLightTheme'),
      selectedTeammates: null,
      isOpenRoleConfirmModal: null,
      usermanager: null,
      userManagerRole:null,
      loading: true
    };
  },
  computed: {
    isAdmin() {
      return (this.$store.state.account.data.userRole === 'ADMIN')||(this.teammanagerRole == 'MANAGER')
    },
  },
  async mounted() {
    await this.getUsers();
    await this.getTeams();
  },
  watch: {
    users(newData) {
      if (newData) {
        this.localUsers = newData;  
      }
       // Update teams when prop changes
    },
    '$store.state.isLightTheme'(newValue) {
      this.lightThemeChecked = newValue;
    }
  },
  methods: {
  async getUsers() {
    //this.$store.dispatch('loading/set', true)
    const hashId = this.teamId;
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
      var TeamUserManager = data.filter(x=>x.TeamUserRole==='MANAGER')
      this.userManagerRole = TeamUserManager[0]?.TeamUserRole;
      this.usermanager = TeamUserManager[0]?.Name;
      //this.$store.dispatch('loading/set', false)
      this.loading = false;
    }
  },
  async getTeams() {
      //this.$store.dispatch('loading/set', true)
      const hashId = this.$store.state.account.data.businessId;
      var data = await getTeam({ hashId: hashId });
      if (data.err) {
        if(data.err.error === 'missing BusinessId')
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.missingBusinessId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(data.err.error === 'invalid BusinessId')
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidBusinessId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(data.err.error === 'business not found')
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.Businessnotfound'), 'danger'])
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
        let result = data.filter(x=>x.TeamId===this.teamId)
        this.teamname = result[0].TeamName;
        //this.$store.dispatch('loading/set', false)
      }
  },
  async assignManager(){
    let msg;
    const assignManagerres = await assignManagerRole({UserId: this.selectedTeammates,TeamId: this.$route.params.id,Role: "MANAGER"}); 
    if (assignManagerres.err) {
      if(assignManagerres.err.error === `the MANAGER role is already assigned to the team member`)
      {
        msg = this.$t("APIError.theMANAGERroleisalreadyassignedtotheteammember", { userName: this.usermanager})
        this.$store.dispatch('notification/set', [true, msg, 'danger'])
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
      }
      else if(assignManagerres.err.error === `missing TeamId`)
      {
        this.$store.dispatch('notification/set', [true, this.$t('APIError.missingteamId'), 'danger'])
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
      }
      else if(assignManagerres.err.error === `invalid Team Id`)
      {
        this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidTeamId'), 'danger'])
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
      }
      else if(assignManagerres.err.error === `missing UserId`)
      {
        this.$store.dispatch('notification/set', [true, this.$t('APIError.missingUserId'), 'danger'])
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
      }
      else if(assignManagerres.err.error === `invalid User Id`)
      {
        this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidUserId'), 'danger'])
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
      }
      else if(assignManagerres.err.error === `missing Role`)
      {
        this.$store.dispatch('notification/set', [true, this.$t('APIError.missingRole'), 'danger'])
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
      }
      else if(assignManagerres.err.error === `user not found`)
      {
        this.$store.dispatch('notification/set', [true, this.$t('APIError.USER_ERR'), 'danger'])
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
      this.$store.dispatch('notification/set', [true, this.$t('APISuccess.AssignManagerSuccessfully'), 'success'])
      setTimeout(async () => {
        await this.$store.dispatch('notification/set', [false, '', ''])
      }, 5000)
      this.getUsers();
    }
  },
  async unassignManagerFromTeam(TeamUserId,uname,tname){
    const test = this.$route.params.id;
    let msg;
    const unassignManagerres = await unassignManager({UserId: this.selectedTeammates,TeamId: test})
    if (unassignManagerres.err) {
      if(unassignManagerres.err.error === `missing TeamId`)
      {
        this.$store.dispatch('notification/set', [true, this.$t('APIError.missingteamId'), 'danger'])
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
      }
      else if(unassignManagerres.err.error === `invalid Team Id`)
      {
        this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidTeamId'), 'danger'])
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
      }
      else if(unassignManagerres.err.error === `missing UserId`)
      {
        this.$store.dispatch('notification/set', [true, this.$t('APIError.missingUserId'), 'danger'])
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
      }
      else if(unassignManagerres.err.error === `invalid User Id`)
      {
        this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidUserId'), 'danger'])
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
      }
      else if(unassignManagerres.err.error === `missing Role`)
      {
        this.$store.dispatch('notification/set', [true, this.$t('APIError.missingRole'), 'danger'])
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
      this.$store.dispatch('notification/set', [true, this.$t('APISuccess.unassignManagerSuccessfully'), 'success'])
      setTimeout(async () => {
        await this.$store.dispatch('notification/set', [false, '', ''])
      }, 5000)
      this.getUsers();
    }
    this.$store.dispatch('loading/set', false)
    this.isOpenRoleConfirmModal = false
  },
  async deleteUser(TeamUserId,uname,tname) {
    let msg;
    const res = await removeUser({ hashId: this.teamId, userId: TeamUserId });
    if (res.err) {
      if(res.err.error === `the user ${TeamUserId} is already removed from the team ${this.teamId}`)
      {
        msg = this.$t("APIError.theuserisalreadyremovedfromtheteam", { userName: uname, teamName: tname })
        this.$store.dispatch('notification/set', [true, msg, 'danger'])
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
      }
      else if(res.err.error === `missing hashId`)
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
      else if(res.err.error === `missing UserId`)
      {
        this.$store.dispatch('notification/set', [true, this.$t('APIError.missingUserId'), 'danger'])
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
      }
      else if(res.err.error === `invalid User Id`)
      {
        this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidUserId'), 'danger'])
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
      await this.getUsers();
      this.$store.dispatch('notification/set', [true, this.$t('APISuccess.deleteTeammemberSuccessfully'), 'success'])
      setTimeout(async () => {
        await this.$store.dispatch('notification/set', [false, '', ''])
      }, 5000)
    }
    this.$store.dispatch('loading/set', false)
    this.isOpenConfirmModal = false
  }
}

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
  border-radius: calc(var(--background-height) / 32);
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
  border-radius: 8px;
  cursor: pointer;
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

.deptteamsbox{
  grid-template-columns: repeat(1, minmax(200px, 1fr));
  @media (min-width: 991px){
    grid-template-columns: repeat(2, minmax(200px, 1fr));
  }
  @media (min-width: 1024px){
    grid-template-columns: repeat(3, minmax(200px, 1fr));
  }
}

// teammates card more option style
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
