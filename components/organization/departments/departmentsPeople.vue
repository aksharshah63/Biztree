
<template>
  <div class="mt-3">
    <!-- TEAM -->
    <div class="mb-05">
      <div class="font-w-700 ml-2 mb-2">{{ $t("common.people") }}</div>
      <div class="grid-auto-200 grid-gap-2 pl-2 pr-2 deptteamsbox" v-if="(localusersAlldata.length > 0)||(isAdmin)">
        <!-- EMPTY -->
        <div class="add-user-card" @click="inviteTeammatesModal = true" v-if="isAdmin">{{ $t("common.addteammember") }}</div>
        <organization-user-card height="240px" v-for="(user, index) in localusersAlldata" :key="index" :user="user">
          <bib-popup size="lg" class="team-card__dot-menu danger" pop="horizontal-dots" icon-hover-variant="primary-24" v-if="isAdmin" :class="{'dark': !lightThemeChecked}">
            <div slot="menu" class="list" :class="{'dark': !lightThemeChecked}">
              <span v-if="user?.Role !== 'MANAGER'" class="list__item" @click="(selectedTeammates = `${user?.UserId}`),(selectedUser=`${user.Name}`),assignManagerDept()">{{ $t("common.assignRoleManager") }}</span>
              <span v-if="user?.Role === 'MANAGER'" class="list__item danger" @click="isOpenRoleConfirmModal=true,(selectedTeammates = `${user?.UserId}`),(selectedUser=`${user.Name}`)">{{ $t("common.unassignRoleManager") }}</span>
              <span class="list__item danger" @click="isOpenConfirmModal=true,(selectedTeammates = `${user?.UserId}`),(selectedUser = `${user?.Name}`)">{{ $t("common.removepeople") }}</span>
            </div>
          </bib-popup>
        </organization-user-card>
      </div>
      <div v-else-if="(!isAdmin)&&(!loading)" class="text-center mt-8">
        {{ $t("common.teammembernotavailable") }}
      </div>
    </div>

    <!-- CREATE TEAM -->
    <organization-create-department-modal :show="inviteTeammatesModal" :localdeptUsers="localusersAlldata" :team="$route.params.id" :context="'users'" :deptname="deptname" @close="inviteTeammatesModal = null" @refresh="getDeptUsers()"/>
    <!--  USER PROFILE -->
    <organization-user-details-modal :show="userDetailsModal" :userId="userDetailsModal" @close="userDetailsModal = null" />
    <confirm-dialog
      v-if="isOpenConfirmModal"
      :text="$t('profile.confirmDeleteDepartmentPeopleText')"
      @close="isOpenConfirmModal = null"
      @confirm="deleteUser(selectedTeammates,selectedUser,deptname)">
    </confirm-dialog>
    <confirm-dialog
      v-if="isOpenRoleConfirmModal"
      :text="$t('profile.confirmUnassignManagerRole')"
      @close="isOpenRoleConfirmModal = null"
      @confirm="unassignManagerFromDept(selectedTeam,selectedusername)">
    </confirm-dialog>
  </div>
</template>

<script>
import { getDepartment, removeUserFromDepartment,assignManagerRoleDept,unassignManagerDept } from "~/model/department";

export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    usersAlldata:{
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
      inviteTeammatesModal: null,
      userDetailsModal: null,
      users: [...this.data],
      localusersAlldata: this.usersAlldata,
      deptId: this.$route.params.id,
      selectedTeam: null,
      isOpenConfirmModal: null,
      createTeamModal: false,
      deptname: null,
      selectedUser: null,
      lightThemeChecked: this.$cookies.get('isLightTheme'),
      localdeptUsers:null,
      selected_Team: null,
      isOpenRoleConfirmModal: null,
      selectedusername:null,
      selectedTeammates: null,
      usermanager:null,
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
      this.users = [...newData]; // Update teams when prop changes
      this.getDeptUsers();
    },
    usersAlldata(newData) {
      this.localusersAlldata = newData; // Update teams when prop changes
    },
    '$store.state.isLightTheme'(newValue) {
      this.lightThemeChecked = newValue;
    }
  },
  created() {
    this.getDeptUsers();
  },
  methods: {
    async getDeptUsers() {
      const hashId = this.$route.params.id;
      const data = await getDepartment({ hashId: hashId });
      if (data.err) {
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
      } else {
        this.localusersAlldata = data.Dept_Users;
        this.deptname = data.DeptName;
        var DeptUserManager = this.localusersAlldata.filter(x=>x.Role==='MANAGER')
        this.usermanager = DeptUserManager[0]?.Name;
        this.loading = false;
      }
    },
    async assignManagerDept(){
      let msg;
      const assignManagerres = await assignManagerRoleDept({UserId: this.selectedTeammates,DeptId: this.$route.params.id,Role: "MANAGER"}); 
      if (assignManagerres.err) {
        if(assignManagerres.err.error === `the MANAGER role is already assigned to the department member`)
        {
          msg = this.$t("APIError.theMANAGERroleisalreadyassignedtotheDepartmentmember", { userName: this.usermanager})
          this.$store.dispatch('notification/set', [true, msg, 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(assignManagerres.err.error === `missing DepartmentId`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.missing DepartmentId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(assignManagerres.err.error === `invalid DepartmentId`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidDepartmentId'), 'danger'])
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
        this.getDeptUsers();
      }
    },
    async unassignManagerFromDept(){
      const test = this.$route.params.id;
      let msg;
      const unassignManagerres = await unassignManagerDept({UserId: this.selectedTeammates,DeptId: test})
      if (unassignManagerres.err) {
        if(unassignManagerres.err.error === `missing DepartmentId`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.missingDepartmentId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(unassignManagerres.err.error === `invalid DepartmentId`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidDepartmentId'), 'danger'])
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
        this.getDeptUsers();
      }
      this.$store.dispatch('loading/set', false)
      this.isOpenRoleConfirmModal = false
    },
    async deleteUser(UserId,uname,deptname) {
      const res = await removeUserFromDepartment({ hashId: this.deptId, UserId: UserId });
      let msg;
      if(res.err)
      {
        if(res.err.error === `missing DepartmentId`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.missingDepartmentId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(res.err.error === `invalid DepartmentId`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidDepartmentId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        if(res.err.error === `missing User Id`)
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
        else if(res.err.error === `the user ${UserId} is already removed from the department ${this.deptId}`)
        {
          msg = this.$t("APIError.theuserisalreadyremovedfromthedepartment", { userName: uname, deptName: deptname })
          this.$store.dispatch('notification/set', [true, msg, 'danger'])
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
        await this.$store.dispatch('notification/set', [true, this.$t('APISuccess.deleteTeammemberSuccessfully'), 'success'])
        this.getDeptUsers();
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
      }
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
  border-radius: 8px;
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

.deptteamsbox{
    grid-template-columns: repeat(1, minmax(200px, 1fr));
    @media (min-width: 991px){
      grid-template-columns: repeat(2, minmax(200px, 1fr));
    }
    @media (min-width: 1024px){
      grid-template-columns: repeat(3, minmax(200px, 1fr));
    }
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
