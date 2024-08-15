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
          <h2 class="font-w-600 font-heading-sm margin-left-40">{{ $t("common.departments") }}</h2>
        </div>
      </template>
      <template slot="bottom-right">
        <div class="mr-1" v-if="isAdmin">
          <bib-button
            size="lg"
            :label="$t('common.createDepartment')"
            variant="primary-24"
            pill
            @click="openModal('department', null)"
          ></bib-button>
        </div>
      </template>
    </content-header>
    <!-- CONTENT -->
    <div class="main-container">
      <div class="main-container__content grid-auto-240 grid-gap-4" v-if="departments.length > 0">
        <template>
          <organization-departments-card
          height="240px"
          background-color="var(--bib-background-dark)"
          v-for="(department, index) in departments"
          :key="index"
          :team="department"
          :isLightTheme="lightThemeChecked"
          @click="$router.push(`/departments/${department?.DeptId}`)"
          :users="getUserCount(department.DeptId)"
          :deptindexteamcount="getTeamCount(department.DeptId)">
            <bib-popup pop="horizontal-dots" :class="['team-card__dot-menu', {'dark': !lightThemeChecked}]" icon-hover-variant="primary-24" v-if="isAdmin">
              <template v-slot:menu>
                <div slot="menu" class="list">
                  <span class="list__item" @click.stop="$router.push(`/departments/${department?.DeptId}`)">{{ $t("common.manageDepartment") }}</span>
                  <span class="list__item" @click.stop="openModal('department', department), (deptname = `${department?.DeptName}`),getTeamfromDept()">{{ $t("common.addTeam") }}</span>
                  <span class="list__item" @click.stop="openModal('deptteammember', department), (deptname = `${department?.DeptName}`),getUserfromDept()">{{ $t("common.inviteTeamMembers") }}</span>
                  <div class="separator" />
                  <span class="list__item danger bg-hover-danger" @click.stop="isOpenConfirmModal=true,(selectedTeam = `${department?.DeptId}`),(deptname = `${department?.DeptName}`)">{{ $t("common.deleteDepartment") }}</span>
                </div>
              </template>
            </bib-popup>
          </organization-departments-card>
        </template>
      </div>
      <div v-else-if="!loading">
        <div class="text-center mt-3 text-secondary">
            {{ $t("common.nodepartmentscreated") }}
          </div>
      </div>
    </div>
    <!-- CREATE TEAM -->
    <organization-create-department-modal v-if="modalType === 'department'" :show="createTeamModal" :team="selectedTeam" :deptname="deptname" :localdeptTeams="localdeptTeams" @close="closeModal" @refresh="getDepartments()"  @add-member="getTotalteammembersindex"  @add-team="getTotalteamindex"/>
    <organization-create-department-modal v-if="modalType === 'deptteammember'" :context="'deptusers'" :localdeptUsers="localdeptUsers" :localdeptTeams="localdeptTeams" :show="createTeamModal" :team="selectedTeam" :deptname="deptname" @close="closeModal" @refresh="getDepartments()"  @add-member="getTotalteammembersindex"  @add-etam="getTotalteamindex"/>
    <organization-create-team-modal v-if="modalType === 'team'" :show="createTeamModal" :team="selectedTeam" @close="closeModal" @refresh="getDepartments()" />
    <confirm-dialog
      v-if="isOpenConfirmModal"
      :text="$t('profile.confirmDeleteDepartmentText')"
      @close="isOpenConfirmModal = null"
      @confirm="deleteDepartment(selectedTeam,deptname)">
    </confirm-dialog>
  </div>
</template>
<script>
import { getBusinessDepartments, removeDepartment,getDepartment,getDeptuserbelong } from "~/model/department";
import { getTeam } from "../../model/team";
export default {
  layout: "home",
  props: ["global"],
  data() {
    return {
      departments: [],
      createTeamModal: false,
      selectedTeam: null,
      modalType: null,
      isOpenConfirmModal: null,
      deptname:null,
      teamUserCounts: {},
      teamCounts: {},
      lightThemeChecked: this.$cookies.get('isLightTheme'),
      loading: true,
      localdeptUsers:[],
      localdeptTeams:null
    };
  },
  computed: {
    isAdmin() {
      return this.$store.state.account.data.userRole === 'ADMIN'
    },
  },
  async created() {
    this.getDepartments();
  },
  mounted() {},
  watch:{
    users(newData) {
      this.localdeptUsers = newData; // Update teams when prop changes
    },
    '$store.state.isLightTheme'(newValue) {
      this.lightThemeChecked = newValue;
    }
  },
  
  methods: {
    async getTeamfromDept(){
      var test = this.selectedTeam.DeptId;
      const hashId = test;
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
        this.localdeptTeams = data.Teams;
      }
    },
    async getUserfromDept() {
      var test = this.selectedTeam.DeptId;
      const hashId = test;
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
        this.localdeptUsers = data.Dept_Users;
      }
    },
    async getDepartments() {
      //if(this.$store.state.account.data.userRole === 'ADMIN'){
        const businessId = this.$store.state.account.data.businessId;
        this.$store.dispatch('loading/set', true)
        var data = await getBusinessDepartments({ hashId: businessId }) || [];
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
          this.departments = data.sort((a, b) => {
            if (a.DeptName.trim().toLowerCase() < b.DeptName.trim().toLowerCase()) return -1;
          });
        }
      // }else if(this.$store.state.account.data.userRole === 'USER'){
      //   this.$store.dispatch('loading/set', true);
      //   const data = await getDeptuserbelong({ hashId: this.$store.state.account.data.userId });
      //   if (data.err) {
      //     this.handleError(data.err.error);
      //   } else {
      //     this.departments = data.sort((a, b) => {
      //       if (a.DeptName.trim().toLowerCase() < b.DeptName.trim().toLowerCase()) return -1;
      //     });
      //   }
      // }
      this.loading = false;
      this.$store.dispatch('loading/set', false)
    },
    async deleteDepartment(departmentId,dept_name) {
      const res = await removeDepartment({ hashId: departmentId });
      if (res.err) {
        let msg;
        if(res.err.error === 'missing Department Id')
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.missingDepartmentId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(res.err.error === 'invalid Department Id')
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidDepartmentId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(res.err.error === `department ${departmentId} doesn't exist`)
        {
          msg = this.$t("APIError.departmentdoesntexist", { deptName: dept_name})
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
      } else {
        this.$store.dispatch('notification/set', [true, this.$t('APISuccess.deleteDepartmentSuccessfully'), 'success'])
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
        this.getDepartments();
      }
      this.$store.dispatch('loading/set', false)
      this.isOpenConfirmModal = false
    },
    openModal(type, team) {
      this.modalType = type;
      this.selectedTeam = team;
      this.createTeamModal = true;
    },
    closeModal() {
      this.createTeamModal = false;
      this.modalType = null;
      this.selectedTeam = null;
    },
    async getTotalteammembersindex(id){
      const hashId = id;
      const data = await getDepartment({ hashId });
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
        if (data && data.Dept_Users) {
          this.totalUsers = data.Dept_Users.length;
        } else {
          this.totalUsers = 0;
        }
        this.$set(this.teamUserCounts, id, this.totalUsers);
      }
    },
    getUserCount(teamId) {
      return this.teamUserCounts[teamId];
    },
    async getTotalteamindex(id){
      const hashId = this.$store.state.account.data.businessId;
      const data = await getTeam({ hashId });
      if(data.err)
      {
        if(data.err.error === `missing BusinessId`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.missingBusinessId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(data.err.error === `invalid BusinessId`)
        {
          this.$store.dispatch('notification/set', [true, this.$t('APIError.invalidBusinessId'), 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        }
        else if(data.err.error === `business not found`)
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
      }
      else
      {
        var test;
        const selectedTeams = data.filter(department => department.DeptId === id);
        test = selectedTeams.length;
        this.$set(this.teamCounts, id, test);
      }
    },
    getTeamCount(teamId) {
      return this.teamCounts[teamId];
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

  .home-layout{
    &:has(.app-wrapper--collapsed){
      .main-container__content{
        @media (min-width:800px) {
        grid-template-columns: repeat(3, 1fr);
        }
        @media (min-width:1200px) {
          grid-template-columns: repeat(4, 1fr);
        }
        @media (min-width:1700px) {
          grid-template-columns: repeat(6, 1fr);
        }
      }
    }
  }

  .main-container__content{
    grid-template-columns: repeat(1, 1fr);
    @media (min-width:600px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (min-width:800px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (min-width:1200px) {
      grid-template-columns: repeat(3, 1fr);
    }
    @media (min-width:1700px) {
      grid-template-columns: repeat(5, 1fr);
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